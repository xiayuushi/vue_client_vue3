<template>
  <div class="xxx-member-aside">
    <div class="user-manage">
      <h4>我的账户</h4>
      <div class="links">
        <router-link to="/member" exact-active-class="active">个人中心</router-link>
        <a href="javascript:;">消息通知</a>
        <a href="javascript:;">个人信息</a>
        <a href="javascript:;">安全设置</a>
        <a href="javascript:;">地址管理</a>
        <a href="javascript:;">我的积分</a>
        <a href="javascript:;">我的足迹</a>
        <a href="javascript:;">邀请有礼</a>
        <a href="javascript:;">幸运抽奖</a>
      </div>
      <h4>交易管理</h4>
      <div class="links">
        <router-link to="/member/order">我的订单</router-link>
        <a href="javascript:;">优惠券</a>
        <a href="javascript:;">礼品卡</a>
        <a href="javascript:;">评价晒单</a>
        <a href="javascript:;">售后服务</a>
        <router-link to="/member/test" exact-active-class="active">测试路由</router-link>
      </div>
      <h4>我的收藏</h4>
      <div class="links">
        <a href="javascript:;">收藏的商品</a>
        <a href="javascript:;">收藏的专题</a>
        <a href="javascript:;">关注的品牌</a>
      </div>
      <h4>帮助中心</h4>
      <div class="links">
        <a href="javascript:;">帮助中心</a>
        <a href="javascript:;">在线客服</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppMemberAside',
  setup () {
    return { }
  }
}

// 1、router-link标签的active-class属性与exact-active-class属性分别用于路由模糊、路由精准匹配
// 2、active-class属性的默认值 router-link-active
// 2、exact-active-class属性的默认值 router-link-exact-active
// 3、router-link-active与router-link-exact-active，作为router-link的属性值时不需要带点前缀，但是在定义router-link解析成的a标签的css类样式时必须带上点前缀
// 4、如果在router-link标签中只设置以上两个属性，不设置属性值，那么可以直接在router-link解析后的a标签的css中定义它们各自对应的默认属性值作为样式名
// 4、例如： a { &.router-link-exact-active { 具体样式 } }

// 5、建议在router-link中使用exact-active-class属性精准匹配
// 6、可以在路由配置实例对象时使用linkExactActiveClass选项来统一配置
// 6、注意：linkExactActiveClass书写位置与routes位于同一级
// 6、例如：const router = new Router({ routes, linkExactActiveClass: '不带点前缀类名'  })
// 6、后续，只需在组件css中定义router-link解析成的a标签对应的类样式即可

// N1、配置全局后不需要在router-link标签中定义exact-active-class属性
// N2、配置全局模糊匹配流程类似，只需在路由配置实例对象时使用linkActiveClass选项配置即可

</script>

<style lang="less" scoped>
.xxx-member-aside {
  width: 220px;
  margin-right: 20px;
  border-radius: 2px;
  .user-manage {
    background-color: #fff;
    h4 {
      font-size: 18px;
      font-weight: 400;
      padding: 20px 52px 5px;
      border-top: 1px solid #f6f6f6;
    }

    .links {
      padding: 0 52px 10px;
    }

    a {
      display: block;
      line-height: 1;
      padding: 15px 0;
      font-size: 14px;
      color: #666;
      position: relative;

      &:hover{
        color: @xtxColor;
      }
      &.active {
        color: @xtxColor;

        &:before {
          display: block;
        }
      }

      &:before {
        content: "";
        display: none;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
        top: 19px;
        left: -16px;
        background-color: @xtxColor;
      }
    }
  }
}
</style>
