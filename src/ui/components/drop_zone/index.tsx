import type { Component } from 'solid-js'
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js'
import { useStore } from '../../app'
import { insert } from '/src/instance'
import styles from './styles.css?inline'

export const DropZone: Component = () => {
  const [depth, setDepth] = createSignal(0)
  const [files, setFiles] = createSignal<File[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const [isVisible, setIsVisible] = createSignal(false)
  const [state, setState] = useStore()

  const closeModal = () => {
    setIsVisible(false)
  }

  const dropOnZone = (event: DragEvent) => {
    if (state().options.files.dragAndDrop) {
      event.preventDefault()
      event.stopPropagation()

      const transfer = event.dataTransfer

      if (transfer?.files) {
        uploadFiles(transfer.files)
      } else {
        setDepth(0)
        setIsVisible(false)
        setFiles([])
      }
    }
  }

  const onDragEnter = (event: DragEvent) => {
    if (state().options.files.dragAndDrop) {
      event.preventDefault()

      setDepth(depth() + 1)
      setIsVisible(true)
    }
  }

  const onDragLeave = (event: DragEvent) => {
    if (state().options.files.dragAndDrop) {
      event.preventDefault()

      setDepth(depth() - 1)

      if (depth() === 0)
        setIsVisible(false)
    }
  }

  const onDragOver = (event: DragEvent) => {
    if (state().options.files.dragAndDrop) {
      event.preventDefault()

      setIsVisible(true)
    }
  }

  const onDrop = (event: DragEvent) => {
    if (state().options.files.dragAndDrop) {
      event.preventDefault()

      setDepth(0)
      setIsVisible(false)
    }
  }

  const onPaste = (event: ClipboardEvent) => {
    if (state().options.files.clipboard) {
      event.preventDefault()

      const transfer = event.clipboardData

      if (transfer?.files && transfer.files.length > 0)
        uploadFiles(transfer.files)
    }
  }

  const uploadFiles = (userFiles: FileList) => {
    Array.from(userFiles).forEach((file) => {
      setFiles([...files(), file])
    })

    setIsLoading(true)
    setIsVisible(true)

    Promise.resolve(state().options.files.handler(userFiles)).then((url?: string) => {
      if (state().options.files.injectMarkup && url) {
        const markup = `![](${url})`

        insert([state, setState], markup)
      }
    }).finally(() => {
      setDepth(0)
      setIsLoading(false)
      setIsVisible(false)
      setFiles([])
    })
  }

  onMount(() => {
    document.addEventListener('dragenter', onDragEnter)
    document.addEventListener('dragleave', onDragLeave)
    document.addEventListener('dragover', onDragOver)
    document.addEventListener('drop', onDrop)
    state().root.addEventListener('paste', onPaste)
  })

  onCleanup(() => {
    document.removeEventListener('dragenter', onDragEnter)
    document.removeEventListener('dragleave', onDragLeave)
    document.removeEventListener('dragover', onDragOver)
    document.removeEventListener('drop', onDrop)
    state().root.removeEventListener('paste', onPaste)
  })

  return (
    <div class="ink-drop-zone" classList={{ visible: isVisible() }}>
      <style textContent={styles} />
      <div class="ink-drop-zone-modal">
        <div class="ink-drop-zone-droppable-area" onDrop={dropOnZone}>
          <div class="ink-drop-zone-file-preview">
            <For each={files().slice(0, 8)}>{file => (
              <img class="ink-drop-zone-file-preview-image" alt={file.name} src={URL.createObjectURL(file)} />
            )}</For>
          </div>
          <Show when={isLoading()} fallback={<span>drop files here</span>}>
            <span>uploading files...</span>
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
}
