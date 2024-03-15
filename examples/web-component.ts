import { ink } from 'ink-mde'
import { LitElement, html } from 'lit'

class InkMde extends LitElement {
  firstUpdated() {
    ink(this.renderRoot.querySelector('#editor')!, {
      doc: '# Hello, World!',
    })
  }

  render() {
    return html`<div id="editor"></div>`
  }
}

customElements.define('ink-mde', InkMde)

document.querySelector('#app')!.innerHTML = '<ink-mde></ink-mde>'
