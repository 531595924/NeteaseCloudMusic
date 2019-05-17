module.exports = {
  publicPath: '',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,

  css: {
    loaderOptions: {
      sass: {
        data: '\n          @import "@/assets/styles/_variable.scss";\n        '
      }
    }
  },

  lintOnSave: undefined
}