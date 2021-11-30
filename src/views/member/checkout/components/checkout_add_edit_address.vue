<template>
  <XxxDialog title="添加收货地址" v-model:visible="showDialog">
    <!-- 表单 -->
    <div class="xxx-form">
      <div class="xxx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input class="input" placeholder="请输入收货人"  v-model="formData.receiver" />
        </div>
      </div>
      <div class="xxx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input class="input" placeholder="请输入手机号" v-model="formData.contact" />
        </div>
      </div>
      <div class="xxx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XxxCity placeholder="请选择所在地区" :fullLocation="formData.fullLocation" @update:fullLocation='setCity' />
        </div>
      </div>
      <div class="xxx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input class="input" placeholder="请输入详细地址" v-model="formData.address" />
        </div>
      </div>
      <div class="xxx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input class="input" placeholder="请输入邮政编码" v-model="formData.postalCode" />
        </div>
      </div>
      <div class="xxx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input class="input" placeholder="请输入地址标签，逗号分隔" v-model="formData.addressTags" />
        </div>
      </div>
    </div>
    <template #footer>
      <XxxButton type="gray" style="margin-right:20px" @click="showDialog=false">取消</XxxButton>
      <XxxButton type="primary" @click="submit">确认</XxxButton>
    </template>
  </XxxDialog>
</template>

<script>
import { ref, reactive } from 'vue'
import { memberAddress } from '@/api/order'
import Message from '@/library/Message/index.js'

export default {
  name: 'AddressAddEdit',
  setup (props, { emit }) {
    const showDialog = ref(false)
    const openDialog = () => {
      showDialog.value = true
      for (const key in formData) {
        if (key !== 'isDefault') {
          formData[key] = null
        }
      }
    }

    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      fullLocation: null
    })

    const setCity = (addressInfo) => {
      formData.provinceCode = addressInfo.provinceCode
      formData.cityCode = addressInfo.cityCode
      formData.countyCode = addressInfo.areaCode
      formData.fullLocation = addressInfo.fullLocation
    }

    const submit = async () => {
      try {
        const { result } = await memberAddress(formData)
        Message({ type: 'success', text: '添加收货地址成功' })
        formData.id = result.id
        emit('on-success', formData)
      } catch (err) {
        Message({ type: 'error', text: err.response?.data?.message || '添加收货地址失败' })
      }
      showDialog.value = false
    }
    return { showDialog, openDialog, formData, setCity, submit }
  }
}

// 1、当前组件即用于添加地址又用于编辑地址，是一个组件实现两种类似的功能
// 2、openDialog这个方法是暴露给父组件使用的，并非通过emit()的方式暴露，而是通过在父组件绑定ref属性来绑定当前组件的实例
// 3、在父组件标签中定义ref属性，然后通过ref属性获取当前组件实例，也就可以拿到当前组件中定义的openDialog方法来打开当前组件（对话框组件）
// 4、接口限定最多只能添加10个收货地址，另外必须将服务器获取的地址id也拼接到formData数据中传递给父组件，因为在渲染到收货显示的地方需要用到
// 5、打开新增收货地址的对话框时应该重置formData的数据（略过formData.isDefault这个数据，它值为1时已经就是初始值）
</script>

<style lang="less" scoped>
.xxx-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xxx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xxx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
