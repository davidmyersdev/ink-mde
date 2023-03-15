import { Show, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import { Button } from '../button'
import styles from './styles.css?inline'
import { focus, format, insert } from '/src/api'
import { useStore } from '/src/ui/app'
import * as InkValues from '/types/values'

export const Toolbar: Component = () => {
  const [state, setState] = useStore()
  const [uploader, setUploader] = createSignal<HTMLInputElement>()

  const formatAs = (type: InkValues.Markup) => {
    format([state, setState], type)
    focus([state, setState])
  }

  const uploadChangeHandler = (event: Event) => {
    const target = event.target as HTMLInputElement

    if (target?.files) {
      Promise.resolve(state().options.files.handler(target.files)).then((url) => {
        const markup = `![](${url})`

        insert([state, setState], markup)
        focus([state, setState])
      })
    }
  }

  const uploadClickHandler = () => {
    uploader()?.click()
  }

  return (
    <div class='ink-mde-toolbar'>
      <style textContent={styles} />
      <div class='ink-mde-container'>
        <Show when={state().options.toolbar.heading || state().options.toolbar.bold || state().options.toolbar.italic}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.heading}>
              <Button onclick={() => formatAs(InkValues.Markup.Heading)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M6 4V10M6 16V10M6 10H14M14 10V4M14 10V16'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.bold}>
              <Button onclick={() => formatAs(InkValues.Markup.Bold)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-width='1.5' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M6.5 10H10.5C12.1569 10 13.5 11.3431 13.5 13C13.5 14.6569 12.1569 16 10.5 16H6.5V4H9.5C11.1569 4 12.5 5.34315 12.5 7C12.5 8.65686 11.1569 10 9.5 10'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.italic}>
              <Button onclick={() => formatAs(InkValues.Markup.Italic)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M11 4L9 16M13 4H9M7 16H11'/>
                </svg>
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={state().options.toolbar.quote || state().options.toolbar.codeBlock || state().options.toolbar.code}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.quote}>
              <Button onclick={() => formatAs(InkValues.Markup.Quote)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M2.00257 16H17.9955M2.00055 4H18M7 10H18.0659M2 8.5V11.4999C2.4 11.5 2.5 11.5 2.5 11.5V11V10.5M4 8.5V11.4999H4.5V11V10.5'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.codeBlock}>
              <Button onclick={() => formatAs(InkValues.Markup.CodeBlock)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M13 4L7 16'/>
                  <path d='M5 7L2 10L5 13'/>
                  <path d='M15 7L18 10L15 13'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.code}>
              <Button onclick={() => formatAs(InkValues.Markup.Code)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M7 4L8 6'/>
                </svg>
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={state().options.toolbar.list || state().options.toolbar.orderedList || state().options.toolbar.taskList}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.list}>
              <Button onclick={() => formatAs(InkValues.Markup.List)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M7 16H17.8294'/>
                  <path d='M2 16H4'/>
                  <path d='M7 10H17.8294'/>
                  <path d='M2 10H4'/>
                  <path d='M7 4H17.8294'/>
                  <path d='M2 4H4'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.orderedList}>
              <Button onclick={() => formatAs(InkValues.Markup.OrderedList)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M7 16H18'/>
                  <path d='M2 17.0242C2.48314 17.7569 3.94052 17.6154 3.99486 16.7919C4.05315 15.9169 3.1975 16.0044 2.99496 16.0044M2.0023 14.9758C2.48544 14.2431 3.94282 14.3846 3.99716 15.2081C4.05545 16.0831 3.1998 16.0002 2.99726 16.0002'/>
                  <path d='M7 10H18'/>
                  <path d='M2.00501 11.5H4M2.00193 8.97562C2.48449 8.24319 3.9401 8.38467 3.99437 9.20777C4.05259 10.0825 2.04342 10.5788 2 11.4996'/>
                  <path d='M7 4H18'/>
                  <path d='M2 5.5H4M2.99713 5.49952V2.5L2.215 2.93501'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.taskList}>
              <Button onclick={() => formatAs(InkValues.Markup.TaskList)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M7 16H17.8294'/>
                  <path d='M5 15L3 17L2 16'/>
                  <path d='M7 10H17.8294'/>
                  <path d='M5 9L3 11L2 10'/>
                  <path d='M7 4H17.8294'/>
                  <path d='M5 3L3 5L2 4'/>
                </svg>
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={state().options.toolbar.link || state().options.toolbar.image || state().options.toolbar.upload}>
          <div class='ink-mde-toolbar-group'>
            <Show when={state().options.toolbar.link}>
              <Button onclick={() => formatAs(InkValues.Markup.Link)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M9.12127 10.881C10.02 11.78 11.5237 11.7349 12.4771 10.7813L15.2546 8.00302C16.2079 7.04937 16.253 5.54521 15.3542 4.6462C14.4555 3.74719 12.9512 3.79174 11.9979 4.74539L10.3437 6.40007M10.8787 9.11903C9.97997 8.22002 8.47626 8.26509 7.52288 9.21874L4.74545 11.997C3.79208 12.9506 3.74701 14.4548 4.64577 15.3538C5.54452 16.2528 7.04876 16.2083 8.00213 15.2546L9.65633 13.5999'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.image}>
              <Button onclick={() => formatAs(InkValues.Markup.Image)}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <rect x='2' y='4' width='16' height='12' rx='1'/>
                  <path d='M7.42659 7.67597L13.7751 13.8831M2.00208 12.9778L7.42844 7.67175'/>
                  <path d='M11.9119 12.0599L14.484 9.54443L17.9973 12.9785'/>
                  <path d='M10.9989 7.95832C11.551 7.95832 11.9986 7.52072 11.9986 6.98092C11.9986 6.44113 11.551 6.00354 10.9989 6.00354C10.4468 6.00354 9.99921 6.44113 9.99921 6.98092C9.99921 7.52072 10.4468 7.95832 10.9989 7.95832Z'/>
                </svg>
              </Button>
            </Show>
            <Show when={state().options.toolbar.upload}>
              <Button onclick={uploadClickHandler}>
                <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-miterlimit='5' stroke-linecap='round' stroke-linejoin='round'>
                  <path d='M10 13V4M10 4L13 7M10 4L7 7'/>
                  <path d='M2 13V15C2 15.5523 2.44772 16 3 16H17C17.5523 16 18 15.5523 18 15V13'/>
                </svg>
                <input style={{ display: 'none' }} type='file' onChange={uploadChangeHandler} ref={setUploader} />
              </Button>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}
