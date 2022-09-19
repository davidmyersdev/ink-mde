import { createSSRApp } from 'vue'
import InkMde from '/src/InkMde.vue'

export const createApp = () => {
  return createSSRApp(InkMde)
}
