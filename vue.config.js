const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: '0.0.0.0',
    // https:true,
    port: 6103,
    client: {
      webSocketURL: 'ws://0.0.0.0:6103/ws'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  transpileDependencies: true
})

module.exports = {
  // publicPath: './',
  lintOnSave: false, // 关闭语法检查
  devServer: {
    proxy: {
      '/': {
        // target: 'http://localhost:3000/', // 本地后端地址
        target: 'http://101.132.181.9:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        ws: false
      }
    }
  }
}
