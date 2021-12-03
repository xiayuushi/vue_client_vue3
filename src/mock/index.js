import Mock from 'mockjs'
import qs from 'querystring'

Mock.setup({
  timeout: '500-1000'
})

Mock.mock(/\/member\/collect/, 'get', config => {
  const params = qs.parse(config.url.split('?')[1])
  const items = []
  for (let i = 0; i < +params.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(2,4,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取数据成功',
    result: {
      counts: 100,
      page: +params.page,
      pageSize: +params.pageSize,
      items: items
    }
  }
})

// 1、Mock.mock()返回的数据结构必须要与后台真实接口API的数据结构保持一致，因此需要参考后端人员的接口进行mock模拟
// 1、key是与真实接口一致的返回数据字段，而value是使用querystring.parse()从浏览器中解析出的前端传参
// 2、querystring是nodejs的内置模块，它的parse()解析的是queryString方式获取的传参（即get请求从浏览器地址栏'?'拼接的方式传参）
// 3、上面value前的'+'是将字符串隐式转换成数值类型
// 4、mock的模板占位符格式： '@类型(min,max)' 表示生成某个类型的数据，max表示最小数值，max表示最大数值..（具体规则查看mock官网文档）

// 5、拦截请求就是拦截发往服务器的请求
// 使用mock前：请求真实的服务器数据
// 使用mock后：请求mock服务器的虚拟数据

// 6、使用Mock.setup( )来进行配置项配置，可类比axios对象内的配置项
// 6、以配置服务器延时做模拟延迟为例
// Axios配置延迟时长：axios({ timeout: 5000 })
// Mock配置延迟时长：Mock.setup({ timeout: '500-1000' })

// 7、mock()可以通过默认的回调形参config拿到前端传递的参数
// 例如：Mock.mock(rurl?, rtype?, (config) =>{ config可获取前端传递的参数 })
// 另外，回调形参变量名可以自定义，此处为了便于说明使用config为例
// 因此，如果前端是以queryString的方式传参，则可从config.url中解析出传递的参数

// 8、使用nodejs内置的querystring模块解析出前端传递的参数
// 例如：Mock.mock(rurl?, rtype?, (config) =>{ config可获取前端传递的参数 })
// 例如：import qs from 'querystring'
// 承上：Mock.mock(c =>{ const obj = qs.parse( c.url.split('?')[1] ) } )
// 此时，obj就是通过querystring模块parse()解析出的前端queryString传参参数对象
// 注意：webpack打包时会将node模块打包进去，因此可直接使用nodejs内置模块

// st1、项目中封装用于请求的request工具函数，定义好后台未完成的api接口请求
// 例如：src/api/xxx.js
// 接口：export const getInfo = (id)=>{ return request('/test/xxx', 'get', { id }) }

// st2、在组件中导入并调用定义好的未完成的接口api
// 例如：import { getInfo } from '@/api/xxx.js'
// 例如：getInfo( id实参 ).then(res => console.log(res))

// st3、项目中安装mockjs
// 指令：npm install mockjs -S

// st4、在项目中新建src/mock/index.js用于mock实例化

// st5、在src/mock/index.js中导入mockjs
// 例如：import Mock from 'mockjs'

// st6、在src/mock/index.js中调用mock实例化对象的setup( )配置mockjs
// 例如：Mock.setup({ timeout: '500-1000' })

// st7、在src/mock/index.js中调用mock实例化对象的mock( )模拟接口生成虚拟数据
// 格式：Mock.mock(rurl?, rtype?,   ) //参数后的'?'表示可选参数
// 例如：Mock.mock(/\/test\/xxx/, 'post', )

// st8、在项目入口文件src/main.js中导入src/mock/index.js
// 例如：import '@/mock/index.js'
// 后续，只需要注释掉入口文件的这句导入代码，就可以将请求真实的接口
// 前提，模拟的接口与真实的接口url命名是一致的，且返回数据字段名也保持一致

// st9、定义好mock之后，再调用之前的getInfo发请求，就会请求到mock定义的数据
// 后续，如果不需要请求mock的数据，只需要在入口文件中注释掉 import '@/mock'

// N1、以模拟'/test/xxx'接口为例，应该使用正则去匹配
// 例如：Mock.mock(/\/test\/xxx/ )
// 因为，接口之前有基地址，如果直接使用字符串去匹配是匹配不到的，必须用正则
// 另外，路径中的'/'是特殊字符，使用正则时必须使用反斜杠进行转义

// N2、配置好的mock文件必须导入到项目入口中，否则不会生效

// N3、使用mock前必须先定义与后台一致api接口（虽然后台没开发完成）
// 1、先定义后台提供的api及传参参数，虽然api接口没开发完成，但必须要有（建议mock模拟的数据结构及字段名与真实接口保持一致）
// 2、再通过mock去拦截请求
// 总之mock不能脱离实际的Ajax请求独立存在
