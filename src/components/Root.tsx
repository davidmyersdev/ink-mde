import { onMount } from '/lib/jsx-lite'
import * as van from '/lib/vanjs'
import { Details } from '/src/components/Details'
import { DropZone } from '/src/components/DropZone'
import { Editor } from '/src/components/Editor'
import { Show } from '/src/components/Show'
import { Toolbar } from '/src/components/Toolbar'
import { Vars } from '/src/components/Vars'
import { getHydrationMarkerProps } from '/src/constants'
import type { InkInternal } from '/types'

export const Root = ({ state, target }: { state: InkInternal.StoreState, target?: HTMLElement }) => {
  const showDropZone = van.derive(() => state.options.val.files.clipboard || state.options.val.files.dragAndDrop)
  const showReadability = van.derive(() => state.options.val.readability)
  const showToolbar = van.derive(() => state.options.val.interface.toolbar)

  const root = (
    <div class='ink ink-mde' {...getHydrationMarkerProps()}>
      <Vars state={state} />
      <style>
        {
          `
            .ink-mde {
              border: 2px solid var(--ink-internal-block-background-color);
              border-radius: var(--ink-internal-border-radius);
              color: var(--ink-internal-color, inherit);
              display: flex;
              flex-direction: var(--ink-internal-flex-direction, column);
              font-family: var(--ink-internal-font-family);
            }

            .ink-mde .cm-cursor {
              border-left-color: var(--ink-internal-color, inherit);
              margin-left: 0;
            }

            .ink-mde .cm-tooltip {
              background-color: var(--ink-internal-block-background-color);
              border-radius: var(--ink-internal-border-radius);
              font-family: inherit;
              padding: 0.25rem;
            }

            .ink-mde .cm-tooltip.cm-tooltip-autocomplete ul {
              font-family: inherit;
            }

            .ink-mde .cm-tooltip.cm-tooltip-autocomplete ul li.ink-tooltip-option {
              border-radius: var(--ink-internal-border-radius);
              padding: 0.25rem;
            }

            .ink-mde .cm-tooltip.cm-tooltip-autocomplete ul li.ink-tooltip-option[aria-selected] {
              background-color: rgba(150, 150, 150, 0.25);
            }

            .ink-mde .cm-completionLabel {
              font-family: inherit;
            }

            .ink-mde, .ink-mde * {
              box-sizing: border-box;
            }

            .ink-mde,
            .ink-mde .ink-mde-editor {
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              flex-shrink: 1;
              min-height: 0;
            }

            .ink-mde .ink-mde-editor {
              overflow: auto;
              padding: 0.5rem;
            }

            .ink-mde .ink-mde-toolbar,
            .ink-mde .ink-mde-details {
              display: flex;
              flex-grow: 0;
              flex-shrink: 0;
            }

            .ink-mde .ink-mde-details {
              background-color: var(--ink-internal-block-background-color);
              display: flex;
              padding: 0.5rem;
            }

            .ink-mde .ink-mde-details-content {
              color: inherit;
              display: flex;
              filter: brightness(0.75);
              flex-wrap: wrap;
              font-size: 0.75em;
              justify-content: flex-end;
            }

            .ink-mde .ink-mde-attribution {
              display: flex;
              justify-content: flex-end;
            }

            .ink-mde .ink-mde-attribution-link {
              color: currentColor;
              font-weight: 600;
              text-decoration: none;
            }

            .ink-mde .ink-mde-container {
              margin-left: auto;
              margin-right: auto;
              width: 100%;
            }

            .ink-mde .ink-mde-search-panel {
              background-color: var(--ink-internal-block-background-color);
              border-radius: 0.25rem;
              padding: 0.25rem;
              position: absolute;
              right: 0.25rem;
              top: 0.25rem;
              width: clamp(10rem, 30%, 100%);
            }

            .ink-mde .ink-mde-search-panel:focus-within {
              outline-color: cornflowerblue;
              outline-style: solid;
            }

            .ink-mde .ink-mde-search-input {
              background-color: transparent;
              border: none;
              border-radius: 0.25rem;
              color: inherit;
              font-size: inherit;
              outline: none;
              width: 100%;
            }

            .ink-mde .cm-editor {
              display: flex;
              flex-direction: column;
              position: relative;
            }

            .ink-mde .cm-panels {
              background-color: unset;
              border: unset;
              z-index: 10;
            }

            .ink-mde .cm-searchMatch {
              background-color: #6495ed50;
            }

            .ink-mde .cm-searchMatch-selected {
              background-color: #6495edcc;
            }

            .ink-mde .cm-scroller {
              align-items: flex-start;
              display: flex;
              font-family: var(--ink-internal-font-family);
              font-size: var(--ink-internal-editor-font-size);
              line-height: var(--ink-internal-editor-line-height);
              overflow-x: auto;
              position: relative;
            }

            .ink-mde .cm-content {
              display: block;
              flex-grow: 2;
              flex-shrink: 0;
              margin: 0;
              outline: none;
              padding: 0;
              white-space: nowrap;
            }

            .ink-mde .cm-lineWrapping {
              display: flex;
              flex-direction: column;
              flex-shrink: 1;
              overflow-wrap: unset;
              word-break: break-word;
              white-space: pre-wrap;
              width: 100%;
              overflow-x: hidden;
            }

            /* Things that should always break on any char */
            .ink-mde .cm-line .cm-code,
            .ink-mde .cm-line .cm-blockquote {
              word-break: break-all;
            }

            .ink-mde .cm-line {
              font-family: var(--ink-internal-font-family);
              padding: 0;
            }

            .ink-mde .cm-line span {
              display: inline;
            }

            .ink-mde .cm-line.cm-blockquote {
              background-color: var(--ink-internal-block-background-color);
              border-left: 0.25rem solid currentColor;
              padding: 0 var(--ink-internal-block-padding);
            }

            .ink-mde .cm-line.cm-blockquote.cm-blockquote-open {
              border-top-left-radius: var(--ink-internal-border-radius);
              border-top-right-radius: var(--ink-internal-border-radius);
              padding-top: var(--ink-internal-block-padding);
            }

            .ink-mde .cm-line.cm-blockquote.cm-blockquote-close {
              border-bottom-left-radius: var(--ink-internal-border-radius);
              border-bottom-right-radius: var(--ink-internal-border-radius);
              padding-bottom: var(--ink-internal-block-padding);
            }

            .ink-mde .cm-line.cm-codeblock {
              background-color: var(--ink-internal-block-background-color);
              font-family: var(--ink-internal-code-font-family);
              padding: 0 var(--ink-internal-block-padding);
            }

            .ink-mde .cm-line.cm-codeblock.cm-codeblock-open {
              border-radius: var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0 0;
              padding-top: var(--ink-internal-block-padding);
            }

            .ink-mde .cm-line.cm-codeblock.cm-codeblock-close {
              border-radius: 0 0 var(--ink-internal-border-radius) var(--ink-internal-border-radius);
              padding-bottom: var(--ink-internal-block-padding);
            }

            .ink-mde .cm-line .cm-code {
              background-color: var(--ink-internal-block-background-color);
              font-family: var(--ink-internal-code-font-family);
              padding: var(--ink-internal-inline-padding) 0;
            }

            .ink-mde .cm-line .cm-code.cm-code-open {
              border-radius: var(--ink-internal-border-radius) 0 0 var(--ink-internal-border-radius);
              padding-left: var(--ink-internal-inline-padding);
            }

            .ink-mde .cm-line .cm-code.cm-code-close {
              border-radius: 0 var(--ink-internal-border-radius) var(--ink-internal-border-radius) 0;
              padding-right: var(--ink-internal-inline-padding);
            }

            .ink-mde .cm-image-backdrop {
              background-color: var(--ink-internal-block-background-color);
            }

            .ink-mde .ink-mde-block-widget-container {
              padding: 0.5rem 0;
            }

            .ink-mde .ink-mde-block-widget {
              background-color: var(--ink-internal-block-background-color);
              border-radius: var(--ink-internal-border-radius);
              padding: var(--ink-internal-block-padding);
            }
          `
        }
      </style>
      <Show when={showDropZone}>
        {() =>
          <DropZone state={state} />
        }
      </Show>
      <Show when={showToolbar}>
        {() =>
          <Toolbar state={state} />
        }
      </Show>
      <div class='ink-mde-editor'>
        <Editor state={state} target={target} />
      </div>
      <Show when={showReadability}>
        {() =>
          <Details state={state} />
        }
      </Show>
    </div>
  )

  onMount(() => {
    // state.root.val = root
  })

  return root
}
