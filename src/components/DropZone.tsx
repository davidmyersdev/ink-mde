import * as van from '/lib/vanjs'
import { onMount, onUnmount } from '/lib/jsx-lite'
import { insert } from '/src/api'
import type { InkInternal } from '/types'
import { Show } from './Show'

export const DropZone = ({ state }: { state: InkInternal.StoreState }) => {
  const depth = van.state(0)
  const files = van.state<File[]>([])
  const isLoading = van.state(false)
  const isVisible = van.state(false)

  const closeModal = () => {
    isVisible.val = false
  }

  const dropOnZone = (event: DragEvent) => {
    if (state.options.val.files.dragAndDrop) {
      event.preventDefault()
      event.stopPropagation()

      const transfer = event.dataTransfer

      if (transfer?.files) {
        uploadFiles(transfer.files)
      } else {
        depth.val = 0
        isVisible.val = false
        files.val = []
      }
    }
  }

  const onDragEnter = (event: DragEvent) => {
    if (state.options.val.files.dragAndDrop) {
      event.preventDefault()

      depth.val = depth.val + 1
      isVisible.val = true
    }
  }

  const onDragLeave = (event: DragEvent) => {
    if (state.options.val.files.dragAndDrop) {
      event.preventDefault()

      depth.val = depth.val - 1

      if (depth.val === 0)
        isVisible.val = false
    }
  }

  const onDragOver = (event: DragEvent) => {
    if (state.options.val.files.dragAndDrop) {
      event.preventDefault()

      isVisible.val = true
    }
  }

  const onDrop = (event: DragEvent) => {
    if (state.options.val.files.dragAndDrop) {
      event.preventDefault()

      depth.val = 0
      isVisible.val = false
    }
  }

  const onPaste = (event: ClipboardEvent) => {
    if (state.options.val.files.clipboard) {
      event.preventDefault()

      const transfer = event.clipboardData

      if (transfer?.files && transfer.files.length > 0)
        uploadFiles(transfer.files)
    }
  }

  const uploadFiles = (userFiles: FileList) => {
    Array.from(userFiles).forEach((file) => {
      files.val = [...files.val, file]
    })

    isLoading.val = true
    isVisible.val = true

    Promise.resolve(state.options.val.files.handler(userFiles)).then((url) => {
      if (state.options.val.files.injectMarkup && url) {
        const markup = `![](${url})`

        insert(state, markup)
      }
    }).finally(() => {
      depth.val = 0
      isLoading.val = false
      isVisible.val = false
      files.val = []
    })
  }

  onMount(() => {
    document.addEventListener('dragenter', onDragEnter)
    document.addEventListener('dragleave', onDragLeave)
    document.addEventListener('dragover', onDragOver)
    document.addEventListener('drop', onDrop)
    state.root.val.addEventListener('paste', onPaste)
  })

  // onCleanup(() => {
  //   document.removeEventListener('dragenter', onDragEnter)
  //   document.removeEventListener('dragleave', onDragLeave)
  //   document.removeEventListener('dragover', onDragOver)
  //   document.removeEventListener('drop', onDrop)
  //   state.root.val.removeEventListener('paste', onPaste)
  // })

  const el = (
    <div class={() => isVisible.val ? 'visible ink-drop-zone' : 'ink-drop-zone'}>
      <style>
        {
          `
          .ink-drop-zone {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            color: var(--ink-internal-color);
            display: flex;
            inset: 0;
            justify-content: center;
            position: var(--ink-internal-modal-position);
            z-index: 100;
          }

          .ink-drop-zone:not(.visible) {
            display: none;
          }

          .ink-drop-zone-modal {
            background-color: var(--ink-internal-block-background-color);
            border-radius: var(--ink-internal-border-radius);
            box-sizing: border-box;
            height: 100%;
            max-height: 20rem;
            max-width: 40rem;
            padding: 1rem;
            position: relative;
            width: 100%;
          }

          .ink-drop-zone-hide {
            cursor: pointer;
            height: 1.75rem;
            position: absolute;
            right: 0.25rem;
            top: 0.25rem;
            width: 1.75rem;
          }

          .ink-drop-zone-hide svg {
            background-color: var(--ink-internal-block-background-color);
          }

          .ink-drop-zone-droppable-area {
            align-items: center;
            border: 0.2rem dashed var(--ink-internal-color);
            border-radius: 0.125rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-size: 1.25em;
            gap: 1rem;
            height: 100%;
            justify-content: center;
            padding: 1rem;
            text-align: center;
          }

          .ink-drop-zone-file-preview {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            max-width: 25.5rem;
          }

          .ink-drop-zone-file-preview-image {
            border: 0.125rem solid #222;
            border-radius: 0.125rem;
            box-sizing: border-box;
            height: 6rem;
            object-fit: cover;
            padding: 0.5rem;
            width: 6rem;
          }
          `
        }
      </style>
      <div class="ink-drop-zone-modal">
        <div class="ink-drop-zone-droppable-area" onDrop={dropOnZone}>
          {
            () => (
              // vanjs functions must return a single element
              <div class="ink-drop-zone-file-preview">
                {
                  files.val.map((file) => (
                    <img class="ink-drop-zone-file-preview-image" alt={file.name} src={URL.createObjectURL(file)} />
                  ))
                }
              </div>
            )
          }
          <Show when={isLoading} fallback={<span>drop files here</span>}>
            {() =>
              <span>uploading files...</span>
            }
          </Show>
        </div>
        <div class="ink-drop-zone-hide" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  )

  onUnmount(el, () => {
    // eslint-disable-next-line no-console
    console.log('unmounting')
  })

  return el
}
