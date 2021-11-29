<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- 此处使用vee-validate导出的Form替换原生的form标签（或者是代表form的结构） -->
    <Form class="form" :validation-schema="schema" v-slot="{ errors }" autocomplete="off" ref="target">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- 此处使用vee-validate导出的Field替换原生的input表单元素标签 -->
            <Field :class="{ error: errors.account }" type="text" placeholder="请输入用户名或手机号" v-model="form.account" name="account" />
          </div>
          <!-- 验证出错的提示文案 -->
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field type="password" placeholder="请输入密码" v-model="form.password" name="password" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field type="text" placeholder="请输入手机号" v-model="form.mobile" name="mobile" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field type="text" placeholder="请输入验证码" v-model="form.code" name="code" />
            <span class="code" @click="sendCode">{{ time === 0 ? '发送验证码' : `请${ time }后再试` }}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- 此处使用vee-validate导出的Field替换自定义封装的单选框组件时需要使用as属性 as="自定义组件名称" -->
          <Field as="XxxCheckbox" v-model="form.isAgree" name="isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <!-- QQ登录 -->
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import QC from 'qc'
import Message from '@/library/Message/index.js'
import veeSchema from '@/utils/vee_validate_schema'
import { useStore } from 'vuex'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { accountLogin, getLoginCode, mobileLogin } from '@/api/user'

export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    const target = ref(null)
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const isMsgLogin = ref(false)
    const form = reactive({
      isAgree: false,
      mobile: null,
      code: null,
      password: null,
      account: null
    })

    const schema = {
      isAgree: veeSchema.isAgree,
      account: veeSchema.account,
      mobile: veeSchema.mobile,
      code: veeSchema.code,
      password: veeSchema.password
    }

    watch(isMsgLogin, () => {
      form.isAgree = false
      form.account = null
      form.mobile = null
      form.code = null
      form.password = null
      target.value.resetForm()
    })

    const login = async () => {
      const valid = await target.value.validate()
      if (valid) {
        let res = null
        try {
          if (isMsgLogin.value) {
            const { mobile, code } = form
            res = await mobileLogin({ mobile, code })
          } else {
            const { account, password } = form
            res = await accountLogin({ account, password })
          }
          const { id, avatar, nickname, account, mobile, token } = res.result
          store.commit('user/SETUSER', { id, avatar, nickname, account, mobile, token })
          store.dispatch('cart/mergeCart').then(() => {
            Message({ type: 'success', text: '登录成功' })
            router.push(route.query.redirect || '/')
          })
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '登录失败' })
          }
        }
      }
    }

    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    onUnmounted(() => pause())

    const sendCode = async () => {
      const valid = schema.mobile(form.mobile)
      if (valid === true) {
        try {
          if (time.value === 0) {
            await getLoginCode(form.mobile)
            Message({ type: 'success', text: '验证码发送成功' })
            time.value = 60
            resume()
          }
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '当前用户不存在' })
          }
        }
      } else {
        target.value.setFieldError('mobile', valid)
      }
    }

    onMounted(() => QC.Login({ btnId: 'qqLoginBtn' }))

    return { isMsgLogin, form, schema, target, login, sendCode, time }
  }
}

/*
 1、安装指定版本的vee-validate（更新较快且不同版本用法不同，因此指定版本为4.0.5）  指令：npm i vee-validate@4.0.3 -S
 2、在需要校验表单的组件中导入并注册该插件内置的Form与Field组件
 2、如果插件导入的Form、Field与之前的某个组件重名，则在导入时可使用as重命名Form与Field 例如：import { Form as xxx, Field as yyy } from 'vee-validate'
 3、在需要校验表单的组件中，用Form与Field分别替换之前的form标签（或者表示form的结构）与input表单元素
 4、在项目中新建vee_validate_schema.js文件用于定义校验规则并写校验规则对象（当然也可以直接在当前组件中写校验规则）
 5、导入vee_validate_schema.js文件用于校验Form，只需在Form中添加使用validation-schema属性并绑定导入的校验规则对象

 6、给Form标签使用作用域插槽定义错误对象
 6、例如 Form标签设置 :validation-schema="校验规则对象" v-slot="{ errors }" 后续校验Field组件的"mobile"字段时，可使用 errors.mobile来获取错误提示
 6、作用域插槽 v-slot="{ errors }"是对象解构写法，从整个对象中解构出验证出错时的信息，其中errors是固定字段
 6、通常会在Field标签下方使用某个结构来输出错误提示 例如div标签设置v-if="errors.mobile" 文本节点中使用{{ errors.mobile }}渲染

 7、给Field标签添加v-model属性进行双向数据绑定（不使用v-model，校验规则不会生效）、添加name属性绑定校验字段（类似于element-ui中的rules对象对应某个具体的规则name）
 7、例如 Field标签设置 v-model="form.mobile" name="mobile"
 8、如果是使用Field去替换自定义组件的表单元素，必须使用as属性
 8、例如 原先将checkbox封装成了组件，此时想使用Field替换它，则 Field标签设置 as="自定义组件名" v-model="双向绑定的数据" name="校验的某个字段"

 9、vee-validate做校验，它的使用方式类似于element-ui的表单校验（Field的name属性类似于ElementUI中的rules对象对应的name属性）
 9、Form标签设置 :validation-schema="校验规则对象" v-slot="{error}"
 9、Field标签设置 as="自定义组件" v-model="双向绑定数据" name="校验规则对象中的某个字段名"  其中as属性是依情况可选的

 10、使用vee-validate做表单校验时，
 10.1、必须确保Form标签有validation-schema属性，且不要写错属性，否则失焦时不会触发规则字段验证
 10.2、必须确保Field标签有v-model与name属性，否则编译会报错

 11、vee-validate提供重置表单校验规则的方法 resetForm()
 11、const target=ref(null); Form标签设置ref="target"绑定dom 然后监听表单切换时 可以使用 target.value.resetForm() 重置表单的校验规则
 12、vee-validate提供全局验证的方法 表单dom.validate() 该方法返回一个Promise对象，通过.then()可以获取表单验证的布尔值结果（true则表示全局验证成功）
 12、vee-validate提供局部验证出错时的提示方法 表单dom.setFieldError()，参数1验证字段，参数2错误信息 例如：表单dom.setFieldError('mobile',局部表单验证返回的结果)

 13、useIntervalFn() 第一参数回调，第二参数是间隔数毫秒（默认是1000毫秒1秒钟），第三参数是对象（其中immediate属性值是布尔值，表示是否立即开启计时器）
 13、返回的对象属性pause是暂停函数、resume是开始函数

 N1、如果不使用外部js文件作为校验规则对象，则可以直接在组件内定义校验规则对象 例如：const schema={ mobile(value){ if(!value){ return '手机号不能为空...' } } }
 N2、总之，校验规则对象是用于Form标签的validation-schema属性，内部字段与接口所需参数一致，会用于Field标签的name属性
 N3、原生form标签自带autocomplete属性用于浏览器开启或者关闭自动填充功能，设置值为"off"会关闭自动填充，vee-validate的Form会被解析为form标签因此也能够使用
 N4、template标签是不会渲染实体结构的，因此template标签上无法使用v-show
 N5、如果采用v-show来做切换，则必须调用vee-validate内置的方法来重置表单校验结果
 N5、需要在Form标签中定义ref属性绑定dom，然后调用vee-validate内置的重置方法

 N6、如果不是使用template标签作为表单项form-item（Field的父容器），那就可以使用v-show来进行切换的，v-show不会销毁组件，因此需要做重置表单校验规则
 N7、此处使用template标签作为表单项form-item（Field的父容器），因此采用v-if来做表单切换
 N7、v-if会销毁移除dom，因此只需还原Form绑定的数据（form对象）即可，无需调用vee-validate的重置方法重置校验规则（但添加上重置方法也可以）
 N8、ref属性绑定的是元素则可以取dom，绑定的是组件则可以获取组件实例
 N9、全局表单验证返回的是true或者false，因此直接拿返回值可以做if判断条件，但局部验证返回的是字符串或者true，因此必须使用严格全等true来做if的判断条件
 N10、useIntervalFn()必须配置第三参数 { immediate: false }，否则验证码会从 -1 开始

 N11、vee-validate的Form组件的三个方法
 1、Form组件的dom.setFieldError('某个Field标签的name属性值'，错误提示)   >>>用于输出单条规则验证的错误提示
 2、Form组件的dom.validate().then(res=>res就是表单全局效验的结果)  >>>用于全局表单验证
 3、Form组件的dom.resetForm( ) 用于切换表单时重置所有已验证的表单规则 >>>用于重置表单规则

 N12、vee-validate的Form组件与Field组件的属性
 1、Form组件的 :validation-schema 用于绑定验证规则对象
 2、Form组件的 v-slot="{ errors }" 用于渲染各验证字段出错时的文本
 2、通过 errors点出Field标签中name对应的某个验证字段 例如errors.mobile就是该手机验证出错时的渲染文本
 3、Field组件的 v-model 用于双向数据绑定
 4、Field组件的 name 用于指定验证的字段（必须是Form组件中validation-schema绑定的验证规则中的字段）
 总之，Form组件与Field组件设置好以上几个属性，当失焦时，就会自动触发vee-validate的某个字段的规则验证
 另外，Form组件的dom.setFieldError()是方法逻辑中报错某个验证规则出错，而v-slot针对的是失焦时报某个验证规则存在错误

 N13、使用qq登录作为项目的第三方登录
 st1、需要在QQ互联上进行身份认证，创建应用并审核通过
 st2、需要修改本地host，让vue-cli服务器能够访问线上IP域名（qq登录必须使用qq互联中审核通过的回调地址）
 st3、在项目惟一静态页public/index.html中引入QQ互联SDK并添加两个属性
 st3、例如 script标签设置 src="http://connect.qq.com/qc_jssdk.js" data-appid="审核通过获得的的appid" data-redirecturi="审核通过获得的回调地址"
 st4、webpack忽略非模块化安装的QQ登录SDK，在vue.config.js添加 configureWebpack: { externals: { qc: 'QC' } }
 st5、参考QQ互联SDK的使用方法，放置QQ登录按钮（在组件中使用）
 st5、1 在组件某个结构中准备一个空的span标签，设置id属性为'qqLoginBtn'
 st5、2 在组件在导入 import QC from 'qc'
 st5、3 在onMounted周期在初始化，即 QC.Login({ btnId: 'qqLoginBtn' })
 st5、4 此时就会生成一个QQ登录的span标签，目的就是得到该标签中的跳转地址
 st6、审查元素，查看生成的QQ登录链接的a标签，复制其window.open()跳转地址
 st6、1 注释st5A中onMounted的代码
 st6、2 将生成的span标签注释掉并改成如下
 例如：a标签设置 href="粘贴地址" ，内部img标签设置src="生成的qq登录图片地址"
 注意：st5A的目的就是为了得到那个生成的a标签window.open()第一参数地址
 另外，如果不经过st6这么做，只会在一个浏览器小窗口打开，这并不是我们想要的
 st7、使用st2中localhost中配置的地址+当前项目对应的端口号才能进行QQ登录

 N14、cart/mergeCart这个actions方法能够使用.then()是因为其在vuex封装时已经使用async进行改造，使用async改造后的代码就是一个Promise对象
*/

</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
