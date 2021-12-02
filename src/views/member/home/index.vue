<template>
  <div class="member-home">
    <!-- 个人概览 -->
    <HomeOverview></HomeOverview>
    <!-- 我的收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem :goods="item" v-for="item in mockGoods" :key="item.id" />
    </HomePanel>
    <!-- 我的足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem :goods="item" v-for="item in mockGoods" :key="item.id" />
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>

<script>
import { ref } from 'vue'
import { memberCollect } from '@/api/member'
import HomeOverview from './components/home_overview'
import HomePanel from './components/home_panel'
import GoodsRelevant from '@/views/goods/components/goods_relevant'
import GoodsItem from '@/views/category/components/goods_item'

export default {
  name: 'MemberHome',
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  setup () {
    const goods = {
      id: '1',
      name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
      picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
      desc: '清汤鲜香 红汤劲爽',
      price: '159.00'
    }

    const mockGoods = ref([])
    memberCollect({ page: 1, pageSize: 4 }).then(res => (mockGoods.value = res.result.items))

    return { goods, mockGoods }
  }
}

// 1、当前组件中goods是写死的数据，不便于后期与后端真实联调渲染
// 2、mockGoods是mockjs模拟的数据，因为在模拟接口时与真实接口API的参数字段以及返回数据结构保持一致，因此可以直接注释掉mock数据即可实现联调

</script>

<style lang="less" scoped>
.member-home {
  :deep(.xxx-carousel) .carousel-btn.prev {
    left: 5px;
  }
  :deep(.xxx-carousel) .carousel-btn.next {
    right: 5px;
  }
}
</style>
