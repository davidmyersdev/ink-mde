import { ink, plugin } from 'ink-mde'
import {
  buildBlockWidgetDecoration,
  buildWidget,
  nodeDecorator,
} from '/lib/codemirror-kit'
import { katex } from '/plugins/katex'

ink(document.querySelector('#app')!, {
  doc: '# Start with some text\n\nThis is some $inline math$\n\n$$\nc = \\pm\\sqrt{a^2 + b^2}\n$$\n\n```\nhi\n```\n\n```\nhello\n```',
  katex: true,
  placeholder:
    'This is a really long block of text... This is a really long block of text... This is a really long block of text... This is a really long block of text... This is a really long block of text... This is a really long block of text...',
  plugins: [
    plugin({
      value: async () => {
        return nodeDecorator({
          nodes: ['FencedCode'],
          onMatch: (state, node) => {
            const text = state
              .sliceDoc(node.from, node.to)
              .split('\n')
              .slice(1, -1)
              .join('\n')

            if (text) {
              return buildBlockWidgetDecoration({
                widget: buildWidget({
                  // You can see the results of optimization when there is no id specified. Because CodeMirror has no way of knowing
                  // whether the decoration matches, it usually has to rebuild the DOM on each change. With the optimization setting,
                  // the DOM only has to be rebuilt if the changes overlap with the existing decoration.
                  //
                  // With optimization enabled, the updated timestamp only updates when something inside that block changes.
                  // With optimization disabled, the updated timestamp updates on *any* doc change.
                  //
                  // id: text,
                  toDOM: () => {
                    return (
                      <div>
                        <div>DOM updated at: {Date.now()}</div>
                        <span>{text}</span>
                      </div>
                    ) as HTMLElement
                  },
                }),
              })
            }
          },
          // When set to true, only the nodes that overlap changed ranges will be reprocessed.
          optimize: true,
        })
      },
    }),
    katex(),
  ],
  vim: {
    map: [
      {
        before: 'jj',
        after: '<Esc>',
        mode: 'insert',
      },
    ],
    unmap: [
      {
        before: 'jj',
        mode: 'insert',
      },
    ],
    open: true,
  },
})
