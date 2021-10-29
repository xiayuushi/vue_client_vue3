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
  }
}

// 1、pluginOptions.patterns配置需要自动引入的文件，需要使用绝对路径，因此需要node核心模块path拼接路径
// 2、configureWebpack 用于解决 使用@vueuse/core时 报错："Can't import the named ..."的问题
// 3、配置后需要重启项目
