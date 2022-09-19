import { renderToString } from 'vue/server-renderer'
import { createApp } from './app'

export const render = async () => {
  const app = createApp()
  const context = {}

  return await renderToString(app, context)
}
