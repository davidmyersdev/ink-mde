import { html } from 'sinuous'

export const styles = html`
  <style>
    .ink {
      color: var(--ink-internal-color, inherit);
      display: flex;
      flex-direction: var(--ink-internal-flex-direction, column);
      gap: 1rem;
      padding: var(--ink-internal-editor-padding, 0);
    }

    .ink .ink-toolbar {
      background-color: var(--ink-internal-block-background-color);
      border-radius: var(--ink-internal-border-radius);
      bottom: 0.25rem;
      color: inherit;
      display: flex;
      gap: 2rem;
      overflow: auto;
      padding: 0.25rem;
      position: sticky;
      top: 0.25rem;
      z-index: 10;
    }

    .ink .ink-toolbar-group {
      display: flex;
    }

    .ink .ink-toolbar-md {
      justify-self: flex-end;
    }

    .ink .ink-toolbar-button {
      align-items: center;
      background: none;
      border: none;
      border-radius: var(--ink-internal-border-radius);
      color: inherit;
      cursor: pointer;
      display: flex;
      height: 2.25rem;
      justify-content: center;
      padding: 0.4rem;
      width: 2.25rem;
    }

    .ink .ink-toolbar-button:hover {
      background-color: var(--ink-internal-block-background-color-on-hover);
    }

    .ink .ink-toolbar-button > * {
      align-items: center;
      display: flex;
      height: 100%;
    }
  </style>
`
