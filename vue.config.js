const Path = require('path')

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        Path.resolve(__dirname, './src/assets/styles/mixins.less'),
        Path.resolve(__dirname, './src/assets/styles/variables.less')
      ]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
  }
}

// 1、pluginOptions.patterns配置需要自动引入的文件，需要使用绝对路径，因此需要node核心模块path拼接路径
// 2、configureWebpack 用于解决 使用@vueuse/core时 报错："Can't import the named ..."的问题
// 3、vue3中将图片打包成base64字符，limit是限制将多大尺寸的图片打包成base64（此处将小于10kb的图片打包成base64）
// 4、配置后需要重启项目
