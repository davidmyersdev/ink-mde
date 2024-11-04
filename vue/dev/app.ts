import { createSSRApp, h } from 'vue'
import InkMde from '/src/InkMde.vue'

export const createApp = () => {
  return createSSRApp({
    render: () => h(InkMde, {
      options: {
        files: {
          dragAndDrop: true,
        },
      },
    }),
  })
}
