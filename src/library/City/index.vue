<template>
    <div class="xxx-city" ref="target">
      <div class="select" :class="{ active: visible }" @click="toggleDialog">
        <span class="placeholder" v-if="!fullLocation">{{ placeholder }}</span>
        <span class="value" v-else>{{ fullLocation }}</span>
        <i class="iconfont icon-angle-down"></i>
      </div>
      <div class="option" v-show="visible">
        <div class="loading" v-if="loading"></div>
        <template v-else>
          <span class="ellipsis" v-for="item in selectedResult" :key="item.code" @click="selectedEvent(item)">{{ item.name }}</span>
        </template>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

const getCityData = () => {
  return new Promise((resolve, reject) => {
    if (window.citydata) {
      resolve(window.citydata)
    } else {
      axios({
        url: 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json',
        method: 'get'
      }).then(res => {
        resolve(res.data)
        window.citydata = res.data
      }).catch(err => console.log(err))
    }
  })
}

export default {
  name: 'XxxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const loading = ref(false)

    const allCityData = ref([])
    const openDialog = async () => {
      visible.value = true
      loading.value = true
      allCityData.value = await getCityData()
      setTimeout(() => {
        loading.value = false
      }, 200)
      for (var key in addressInfo) {
        addressInfo[key] = ''
      }
    }

    const closeDialog = () => {
      visible.value = false
    }
    const toggleDialog = () => {
      visible.value ? closeDialog() : openDialog()
    }

    const target = ref(null)
    onClickOutside(target, () => closeDialog())

    const addressInfo = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      areaCode: '',
      areaName: '',
      fullLocation: ''
    })
    const selectedEvent = item => {
      if (item.level === 0) {
        addressInfo.provinceCode = item.code
        addressInfo.provinceName = item.name
      }
      if (item.level === 1) {
        addressInfo.cityCode = item.code
        addressInfo.cityName = item.name
      }
      if (item.level === 2) {
        addressInfo.areaCode = item.code
        addressInfo.areaName = item.name
        addressInfo.fullLocation = `${addressInfo.provinceName} ${addressInfo.cityName} ${addressInfo.areaName}`
        closeDialog()
        emit('update:fullLocation', addressInfo)
      }
    }
    const selectedResult = computed(() => {
      let list = allCityData.value // 默认省一级
      if (addressInfo.provinceCode && addressInfo.provinceName) {
        list = list.find(item => item.code === addressInfo.provinceCode).areaList // 市一级
      }
      if (addressInfo.cityCode && addressInfo.cityName) {
        list = list.find(item => item.code === addressInfo.cityCode).areaList // 区县级
      }
      return list
    })

    return { visible, toggleDialog, target, loading, selectedResult, selectedEvent }
  }
}

// 1、onClickOutside(target,callback)，通过target指定监听某个dom，在该dom外部点击时会触发该方法中的callback回调
// 2、省市区联动的数据并非通过项目的基地址接口服务器而来，而是存储在阿里云中的json文件，因此无需使用项目封装的request工具函数发送请求
// 3、因为省市区联动的数据量比较大，且用户可能会比较频繁的点击选择，因此将其缓存到内存window对象citydata字段中，当有临时缓存时从缓存取，无临时缓存时调用axios请求阿里云的省市区联动数据
// 4、之所以不作持久化缓存（缓存到本地硬盘），而是采用window内存临时缓存，是因为省市区联动的数据量比较大且对当前整个项目而言并非使用频繁的数据没有做持久化缓存的必要
// 5、本地缓存分两种：localStorage与sessionStorage，前者存储于本地硬盘（浏览器关闭还在）、后者存储于浏览器内存（浏览器关闭后会丢失）
// 6、另外还可以使用在window对象中挂载的方式进行临时缓存，它与sessionStorage存储不同的是，window对象挂载的数据刷新后会丢失，而sessionStorage是页面关闭才会丢失
// 7、loading效果只有在第一次时且网络不好时才能看到，为了在每次无论网络是否快慢都能看到，可以先将其用webpack先打包成base64格式配置到vue-cli中，这样子每次选择城市列表时都能加载出loading效果
// 8、选择的省市区分为三级，默认是省一级，code是唯一标识，name是显示文字，selectedEvent触发时会依次传入省市区的内容，该方法最终会拼凑出完整的收货地址
// 9、因为市区都是依赖省级数据而来的，因此必须通过计算属性来进行收货地址的渲染

</script>

<style lang="less" scoped>
.xxx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
