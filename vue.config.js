module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'https://www.baidu.com',
        target: 'http://124.251.4.222/course/public/index.php/index/',
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
