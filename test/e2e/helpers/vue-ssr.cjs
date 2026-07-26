const { createSSRApp, h } = require('vue')
const { renderToString } = require('vue/server-renderer')
const { default: InkMde } = require('../../../vue/dist/index.cjs')

exports.renderVueToString = async (modelValue) => {
  return await renderToString(createSSRApp({
    render() {
      return h(InkMde, { modelValue })
    },
  }))
}

if (require.main === module) {
  exports.renderVueToString(process.argv[2]).then((markup) => {
    process.stdout.write(markup)
  })
}
