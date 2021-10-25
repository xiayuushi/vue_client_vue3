const Path = require('path')

module.exports = {
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

// 1、patterns配置需要自动引入的文件，需要使用绝对路径，因此需要node核心模块path拼接路径
// 2、配置后需要重启项目
