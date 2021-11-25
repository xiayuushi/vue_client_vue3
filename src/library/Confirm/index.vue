<template>
  <div class="xxx-confirm" v-if="visibile">
    <div class="wrapper">
      <div class="header">
        <h3>{{ title }}</h3>
        <a href="JavaScript:;" class="iconfont icon-close-new" @click="cancel"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{ text }}</span>
      </div>
      <div class="footer">
        <XxxButton size="mini" type="gray" @click="cancel">取消</XxxButton>
        <XxxButton size="mini" type="primary" @click="submit">确认</XxxButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'XxxConfirm',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    text: {
      type: String,
      default: ''
    }
  },
  setup () {
    const visibile = ref(false)
    onMounted(() => (visibile.value = true))
    const cancel = () => {
      visibile.value = false
    }
    const submit = () => {
      visibile.value = false
    }
    return { visibile, cancel, submit }
  }
}
</script>

<style lang="less" scoped>
.xxx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0,0,0,.5);
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .header,.footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xxx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
