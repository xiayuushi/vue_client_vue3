<template>
 <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="sub in item.values">
          <img :class="{ selected: sub.selected, disabled: sub.disabled }" v-if="sub.picture" :src="sub.picture" :title="sub.name" alt="" :key="sub.name" @click="toggleSelected(sub, item)">
          <span :class="{ selected: sub.selected, disabled: sub.disabled }" v-else :key="sub.name" @click="toggleSelected(sub, item)">{{ sub.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import btPowerSet from '@/vender/btPowerSet'

const getPathMap = skus => {
  const pathMap = {}
  skus.forEach(item => {
    if (item.inventory > 0) {
      const valueNameList = item.specs.map(obj => obj.valueName)
      const powerSetList = btPowerSet(valueNameList)
      powerSetList.forEach(arr => {
        const pathMapkey = arr.join('♥')
        pathMap[pathMapkey] ? pathMap[pathMapkey].push(item.id) : pathMap[pathMapkey] = [item.id]
      })
    }
  })
  return pathMap
}

const getSelectedList = specs => {
  const selectedList = []
  specs.forEach(item => {
    const selectedItem = item.values.find(v => v.selected)
    selectedList.push(selectedItem ? selectedItem.name : undefined)
  })
  return selectedList
}

const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, index) => {
    const selectedList = getSelectedList(specs)
    item.values.forEach(v => {
      if (v.name === selectedList[index]) return
      selectedList[index] = v.name
      const pathMapKey = selectedList.filter(s => s).join('♥')
      v.disabled = !pathMap[pathMapKey]
    })
  })
}

const initDefaultSelected = (goods, skuid) => {
  const sku = goods.skus.find(item => item.id === skuid)
  if (sku) {
    goods.specs.forEach((v, i) => {
      const selectedVal = v.values.find(s => s.name === sku.specs[i].valueName)
      selectedVal.selected = true
    })
  }
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    skuid: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    updateDisabledStatus(props.goods.specs, pathMap)

    initDefaultSelected(props.goods, props.skuid)

    const toggleSelected = (sub, item) => {
      if (sub.disabled) return
      if (sub.selected) {
        sub.selected = false
      } else {
        item.values.forEach(v => (v.selected = false))
        sub.selected = true
      }
      updateDisabledStatus(props.goods.specs, pathMap)
      const filterUndefinedSelectedList = getSelectedList(props.goods.specs).filter(v => v)
      if (filterUndefinedSelectedList.length === props.goods.specs.length) {
        const id = pathMap[filterUndefinedSelectedList.join('♥')][0]
        const curSkuData = props.goods.skus.find(item => item.id === id)
        emit('change', {
          skuid: curSkuData.id,
          inventory: curSkuData.inventory,
          price: curSkuData.price,
          oldPrice: curSkuData.oldPrice,
          specsText: curSkuData.specs.reduce((p, c) => (`${p} ${c.name}: ${c.valueName}`), '').trim()
        })
      } else {
        emit('change', {})
      }
    }

    return { toggleSelected }
  }
}
// 1、此处dd标签是flex布局容器的右侧内容，作为存放图片或者文字的容器，因此不用它作为v-for遍历的容器
// 2、v-for与v-if不能同时作用于同一个标签，因此使用template这类不会渲染结构的容器标签作为"隔离"容器
// 2、template标签进行v-for遍历时，不能在该标签上动态绑定key值作为v-for的唯一标识，否则eslint会报错
// 2、因此必须将唯一标识':key'设置给能够实际渲染结构的标签（此处因为template标签的子标签中使用了v-if/v-else，因此两个都必须设置:key）

// 3、在toggleSelected函数中，形参sub是当前点击项规格的值，而形参item是当前点击项所在行的数据
// 3、一个函数实现同时不同规格选项的取反，各个选项之间只能有一个值被选中，因此必须分情况进行取反（给每个按钮选项添加一个选中或者未选中的selected状态）
// 3、如当前点击项规格已选中，则再点击取消选中；如当前点击规格未选中，先将当前规格中可能选中的值先遍历都取消选中，再将当前点击规格的值选中
// 3、如果当前点击项是禁用的，则不能往下执行，须return
// 3、根据选择的完整SKU规格传出SKU信息，传出的SKU信息包括：id、现价、原价、库存、specsText（该拼接字符串会在购物车渲染时用到）
// 3、触发自定义的change事件将数据传递给goods/index.vue中的GoodsSku组件
// 3、规格选择是完整的，则传递完整信息，否则传递空对象给父组件，该对象用于渲染购物车数据使用（规则选择不完整不能加入购物车）

// 4.0、getPathMap函数用于定义路径字典对象，作为后续禁用的依据
// 4.1、获取服务器接口中返回SKU数据，（后台提供的SKU数据并非全部都是有效的，只有数量大于0的才是有效库存）
// 4.2、遍历时筛选出有效的（有库存）SKU数据，即 库存数量 > 0 的
// 4.3、通过powerSet幂集算法的btPowerSet()传入有效的SKU数据的name属性作为路径字典的key，求出每个SKU的name属性的幂集：[],['红色'],['中国'],['红色','中国']
// 4.4、为了方便处理，将幂集数组汇集成一个路径字典（对象），后续通过key去查对应的value，存在，则说明sku是可以选择的，否则该sku应该禁用
// 4.4、'路径字典'，即，将有效SKU的幂集及可能形成的路线组合当成路径，将幂集的值转成路径字典的key，将每一个有效SKU的id作为路径字典的value
// 4.5、因为SKU的幂集也是数组，不能作为对象的key，因此须将数组先join()转成字符串，例如 btPowerSet(valueNames).join('任意分隔符')
// 4.5、另外将路径字典的value设置为数组格式，当key不存在时直接将value设置为一个数组；当key已存在时可以往value数组追加数据
// 4.6、例如：['红色','中国']对应的sku的id是1001 则 转成路径字典pathMap { '红色♥中国': [1001], '红色':[1001], '中国':[1001]}
// 4.6、例如：['红色','美国']对应的sku的id是1002 则 转成路径字典pathMap { '红色♥美国': [1002], '红色':[1001,1002] '美国':[1002] }
// 4.6、因为'红色'在两个组合都存在，因此将两个id以数组元素的形式存入路径字典的value中
// 4.7、将拼接好的路径字典（对象）返回到外界，当调用getPathMap函数并传入服务器返回的SKU数据时，就可以形成路径字典（对象）用于商品的SKU规格筛选

// 5、updateDisabledStatus函数用于检查并更新按钮的禁用状态，（判断按钮是否可以点击）
// 5、调用时机：1、组件初始化时 2、点击按钮时调用（已经选中了一些按钮，然后判断其他按钮能不能点击）
// 5、更新按钮的禁用状态时，遍历每个规格，然后遍历每个按钮，给每个可选值按钮绑定一个禁用状态
// 5、并获取每一个选中的sku的值组成可选值数组（例如：三个规格选项中已选中两个时['红色','中国',undefined]）
// 5、已经选中的按钮则忽略判断禁用状态
// 5、未选中的按钮则将该按钮的值按顺序套入可选值数组中（例如 第一个按钮是'红色'，第二个按钮是'中国'，第三个按钮未选则 ['红色','中国',undefined]）
// 5、过滤掉选中项数组中的undefined，将数组转成字符串，作为路径字典的key然后去路径字典中匹配key，找到了就可以点（否则，disabled为true 不能点）
// 5、可选值数组转成字符串时，分隔符应该与定义路径字典时的分隔符保持一致，才能正确匹配

// 6、getPathMap用于定义路径字典对象pathMap作为后续禁用的依据、
// 6、getSelectedList用于获取每个选项的值并将值组成数组，后续使用这个数组转成字符串作为key与pathMap中的key匹配，匹配失败则禁用
// 6、updateDisabledStatus用于判断是否可以点击、用于更新按钮的禁用状态
// 6、initDefaultSelected用于初始化选中sku商品，当用户选择并加入购物车时会用到

// 7、Array.reduce() 参数1回调，参数2起始值
// 7、例如：Array.reduce((p,c)=>{return p+c}, 累计起始值)
// 7、回调形参p是上一次累计的值，初次是就是累计起始值（如果起始值是空字符串，则需要trim()清除前后空格）
// 7、回调形参c是遍历到某一项的值
// 7、上面使用该方法拼接的specsText格式为："颜色: 蓝色 尺寸: 10cm 产地: 中国"

// 8、服务器返回的数据结构（全部库存） goods.skus=[item,item,item]
// 8、服务器返回的数据结构（全部库存） item={id:'121323',inventory: 99983, price: "128.00", oldPrice: "200.00", specs:[]}
// 8、服务器返回的数据结构（对应skuid的已选中sku） specs=[{name: "颜色", valueName: "蓝色"},{name: "尺寸", valueName: "20cm"},{name: "产地", valueName: "中国"}]
// 8、服务器返回的数据结构（可选的sku列表） goods.specs=[item,item,item]
// 8、服务器返回的数据结构（加上自定义添加的两个状态） item={name:'颜色',values:[{valueName:'红色',selected:true},{valueName:'蓝色',disabled: true}]}
// 8、服务器返回的数据结构 （加上自定义添加的两个状态）item={name:'产地',values:[{valueName:'美国',selected:false},{valueName:'中国',disabled: false}]}

// js算法库 https://github.com/trekhleb/javascript-algorithms
// 幂集算法 https://raw.githubusercontent.com/trekhleb/javascript-algorithms/master/src/algorithms/sets/power-set/bwPowerSet.js

</script>

<style lang="less" scoped>
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
