<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress" >您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：{{ showAddress.receiver }}</span></li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g,'')+ showAddress.address }}</li>
      </ul>
      <a href="javascript:;" v-if="showAddress" @click="editAddAddress(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XxxButton class="btn" @click="openDialog">切换地址</XxxButton>
      <XxxButton class="btn" @click="editAddAddress({})">添加地址</XxxButton>
    </div>
    <!-- 切换地址对话框 -->
    <XxxDialog title="切换地址" v-model:visible="showDialog">
      <div class="text item" :class="{ active: selectedAddress?.id === item.id }" v-for="item in addressList" :key="item.id" @click="selectedAddress = item">
        <ul>
          <li><span>收<i/>货<i/>人：{{ item.receiver }}</span></li>
          <li><span>联系方式：</span>{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1****$2') }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g,'') + item.address }}</li>
        </ul>
      </div>
      <template #footer>
        <XxxButton type="gray" style="margin-right:20px" @click="showDialog=false">取消</XxxButton>
        <XxxButton type="primary" @click="submit">确认</XxxButton>
      </template>
    </XxxDialog>
    <!-- 添加地址对话框 -->
    <AddressAddEdit ref="target" @on-success="successHandler" />
  </div>
</template>

<script>
import { ref } from 'vue'
import AddressAddEdit from './checkout_add_edit_address'

export default {
  name: 'ChecekoutAddress',
  props: {
    addressList: {
      type: Array,
      default: () => []
    }
  },
  components: { AddressAddEdit },
  emits: ['change'],
  setup (props, { emit }) {
    const showAddress = ref(null)
    if (props.addressList.length) {
      const userDefaultAddress = props.addressList.find(item => item.isDefault === 0)
      // eslint-disable-next-line vue/no-setup-props-destructure
      userDefaultAddress ? showAddress.value = userDefaultAddress : showAddress.value = props.addressList[0]
    }

    const showDialog = ref(false)
    emit('change', showAddress.value?.id)

    const selectedAddress = ref(null)

    const submit = () => {
      showDialog.value = false
      showAddress.value = selectedAddress.value
      emit('change', showAddress.value?.id)
    }

    const openDialog = () => {
      selectedAddress.value = null
      showDialog.value = true
    }

    const target = ref(null)
    const editAddAddress = (payload) => {
      target.value.openDialog(payload)
    }

    const successHandler = (form) => {
      const currentEditAddress = props.addressList.find(item => item.id === form.id)
      if (currentEditAddress) {
        for (const key in currentEditAddress) {
          currentEditAddress[key] = form[key]
        }
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        props.addressList.unshift(JSON.parse(JSON.stringify(form.fullLocation)))
      }
    }

    return { showAddress, showDialog, submit, selectedAddress, openDialog, target, editAddAddress, successHandler }
  }
}

// 1、提示 a value from the `props` in root scope of `setup()` will cause the value to lose reactivity..
// 1、只需要添加注释忽略该eslint报错即可
// 2、将props传递过来的复杂数据类型赋值给ref声明的响应式数据时，当ref响应式数据发生变化时，会因为同一引用而修改props传递过来的数据，虽不建议这么做但是可行
// 2、上面String.replace()中的正则部分，左侧为待替换的字符串的正则，右侧为需要替换的内容或者格式（左2右4，中间星号代替）
// 2、其中$1表示第一个括号的正则部分，$2表示第二个括号的正则部分，'$1****$2'表示两个括号中间的正则部分替换为星号
// 3、vue3使用v-model指令报错时：'v-model' directives require no argument.
// 3、st1 在VScode中，打开 “扩展 > ESlint插件 >扩展设置”，然后搜索Eslint，找到 Eslint: Validate 部分
// 3、st2 在setting.json中先删除"eslint.validate": [] 然后编辑设置  "vetur.validation.template": false
// 4、vue3的v-model与vue2中的.sync修饰符是类似的
// 4、vue2中的xxx.sync 可以拆解为 :xxx 与 @update:xxx
// 4、vue3中的v-model:xxx 可以拆解为 :xxx 与 @update:xxx
// 5、vue3中如果组件没有根元素，而是代码片段，则在使用emit()传递方法给外界时，规范起见应该在emits选项中先申明再emit传递出去，例如 emits:['change']
// 6、emit('change', showAddress.value?.id)等同于emit('change', showAddress.value && showAddress.value.id) 点语法之前的'?'表示是否存在，存在则会往下取后续属性
// 7、点语法前的'?'是ES6新语法，表示有则可以往下继续取后续属性的值，否则不取，可以避免取到null时再往下取值导致报错（类似但区别于三元表达式中的'?'）
// 8、submit确认选择地址后，需要渲染显示地址，并将当前选择的地址渲染到显示地址中，并将后续接口需要的参数addressId使用emit()传递给父组件checkout.vue
// 9、props.addressList.unshift(JSON.parse(JSON.stringify(form.fullLocation)))使用深拷贝避免地址引用导致的打开新增收货地址对话框时数据也一并被清除的风险
// 9、props.addressList.unshift(JSON.parse(JSON.stringify(form.fullLocation)))是将新增对话框组件中emit()传递出来的新增地址添加到收货地址列表的最前面
// 10、对props中的复杂数据类型进行改值时，可以通过JS注释忽略eslint报错
// 11、successHandler接收子组件编辑收货地址或者新增收货地址的数据，需要判断分情况处理：
// 11、Q1 如果能够从服务器接口返回的所有收货地址中匹配到从checkout_add_edit_address.vue传递过来的收货地址form.id，则说明之前就有的收货地址，因此是编辑操作
// 11、Q2 无法从现有收货地址列表中匹配到从checkout_add_edit_address.vue传递过来的收货地址form.id，则说明是新增的收货地址，也就是新增操作
// 12、Q1 新增收货地址的逻辑是 将新增的收货地址插入到所有收货地址列表的最前面
// 12、Q2 编辑收货地址的逻辑是 将当前正在编辑的收货地址使用for..in对已有的每一项进行遍历修改赋值
// 13、for...in遍历的好处，只会对对象已有属性进行操作，可以避免无效赋值
// 14、String.replace(/ /g,'')正则的意思是全局匹配空格，将空格替换为空，用于减少字符串中出现的不必要的空格

</script>

<style lang="less" scoped>
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xxx-dialog {
  :deep(.body) {
    max-height: 600px;
    overflow-y: scroll;
  }
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
