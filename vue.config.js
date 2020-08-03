module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.cjshequ.top:8000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    overlay: {
      warnings: false,
      errors: false
    },
  },
  configureWebpack: {
    externals: {
      echarts: 'echarts'
    }
  },
  lintOnSave: 'error'
}
