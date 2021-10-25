import { topCateList } from '@/api/contant'
import { homeCategoryHead } from '@/api/category'

export default {
  namespaced: true,
  state () {
    return {
      list: topCateList.map(v => ({ name: v }))
    }
  },
  mutations: {
    SETLIST (state, headList) {
      state.list = headList
    },
    SHOWSUBCATELIST (state, id) {
      const currentCategory = state.list.find(v => v.id === id)
      currentCategory.open = true
    },
    HIDESUBCATELIST (state, id) {
      const currentCategory = state.list.find(v => v.id === id)
      currentCategory.open = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const { result } = await homeCategoryHead()
      result.map(v => (v.open = false))
      console.log(result)
      commit('SETLIST', result)
    }
  }
}

// 1、分类列表（一级目录）的标题list 与 二级目录topCateList是对应的，每个分类列表（一级目录）下都有9个对应的二级目录
// 2、map遍历并将预先定义好的每一项标体字段分配给数组内每一个对象的name字段
// 3、map遍历得到数组，数组内每一项是对象，这样子形成[{name:'', xxx:'' }]的格式 ，方便后续请求接口拿到数据拼接到对象的其他字段中
// 4、result.map(v => (v.open = false)) 为每个一级分类增加一个布尔值属性，用于控制其下的二级分类显示与隐藏
// 5、注意eslint规范中数组'=>'后面（即return后面）必须使用括号括起来

// 6、SETLIST 获取服务器返回一级目录标题设置给vuex的list
// 6、SHOWSUBCATELIST 显示二级类目列表 HIDESUBCATELIST隐藏二级类目列表
