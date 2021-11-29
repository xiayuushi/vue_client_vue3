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
    },
    externals: { qc: 'QC' }
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

    config.devServer.disableHostCheck(true)
  }
}

// 1、pluginOptions.patterns配置需要自动引入的文件，需要使用绝对路径，因此需要node核心模块path拼接路径
// 2、configureWebpack 用于解决 使用@vueuse/core时 报错："Can't import the named ..."的问题
// 3、vue3中将图片打包成base64字符，limit是限制将多大尺寸的图片打包成base64（此处将小于10kb的图片打包成base64）
// 4、config.devServer.disableHostCheck(true) 用于开启IP或域名访问webpack服务器的权限（开启IP域名访问权限，将本地DNS映射为线上URI）
// 5、webpack是vue-cli的底层实现原理，默认情况下vue-cli只能访问localhost地址，是无法直接通过vue-cli服务器访问线上IP域名的
// 6、将QQ登录作为第三方登录必须使用IP域名的形式，因此必须开启webpack服务器的IP域名访问权限
// 6、在此之前须修改host将本地localhost映射为IP域名（webpack服务器配置IP访问生效后，项目启动地址可以访问线上IP域名，但实际上依旧是访问的本地localhost）
// 6、QQ登录作为第三方登录配置完成后，直接访问localhost中映射的线上域名可能会报错SDK错误，此时需要先点击一次QQ登录再返回到线上域名登录页就可以正常登录了
// 7、 configureWebpack: { externals: { qc: 'QC' } }
// 7、1 用于配置webpack忽略非模块化安装的包，让其不会被打包进项目
// 7、2 且import导包时不会报错qc模块找不到，也不会报错全局变量QC找不到
// 7、3 目的就是为了使用非模块化安装且挂载到项目惟一静态页上的全局变量，在组件中使用时不会报错（即非模块化安装的模块名与与之对应的全局变量名，两者在导入时都不会报错）
// 8、使用webpack配置忽略非模块化安装的外部资源，有以下两个作用
// 8、1 在组件中通过import方式导入并使用非模块化安装的包不会报错 "xx模块不存在"
// 8、2 在组件中使用非模块化安装的包生成的全局变量不会报错 "xx变量不存在"
// 9、常见的需要忽略打包的有各类第三方库的cdn或者SDK
// 9、1 例如：cdn方式引入的Echarts 、百度地图SDK 或者QQ登录SDK
// 9、2 总之，只要不是通过npm或yarn进行模块化安装的包，在打包项目资源时应该排除
// 9、3 因为，它们一般都会类似cdn的方式直接挂载到项目惟一静态页，通过全局变量使用
// 10、配置后需要重启项目
