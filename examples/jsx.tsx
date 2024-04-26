import { createElement, createString } from '/lib/jsx'

const hello = 'world'

const el = (
  <div class="ink-mde-toolbar">
    <div class="ink-mde-container">
      <div class="ink-mde-toolbar-group" />
    </div>
    <div>
      {hello}
    </div>
  </div>
)

// eslint-disable-next-line no-console
console.log(createElement(el))
console.log(createString(el))
