<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}%</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a href="javascript:;"
            :class="{ active: cIndex === index }"
            v-for="(item, index) in commentInfo.tags" :key="index"
            @click="tagClick(index)">
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" :class="{ active: params.sortField === null }" @click="changeSort(null)">默认</a>
      <a href="javascript:;" :class="{ active: params.sortField === 'createTime' }" @click="changeSort('createTime')">最新</a>
      <a href="javascript:;" :class="{ active: params.sortField === 'praiseCount' }" @click="changeSort('praiseCount')">最热</a>
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{ formatNickName(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <!-- 评分 -->
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="sub in item.score" :key="sub+'1'"></i>
            <i class="iconfont icon-wjx02" v-for="sub in (5-item.score)" :key="sub+'2'"></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <!-- 评价内容 -->
          <div class="text">{{ item.content }}</div>
          <!-- 评论内容晒图 -->
          <GoodsCommentImage :pictures="item.pictures" v-if="item.pictures.length" />
          <!-- 时间与点赞数 -->
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref, reactive, watch } from 'vue'
import { goodsEvaluate, goodsEvaluatePage } from '@/api/product'
import GoodsCommentImage from './goods_comment_image'

export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    const commentInfo = ref(null)
    const cIndex = ref(0)
    const goods = inject('goods')

    goodsEvaluate(goods.value.id).then(res => {
      res.result.tags.unshift({ title: '有图', tagCount: res.result.hasPictureCount, type: 'img' })
      res.result.tags.unshift({ title: '全部评价', tagCount: res.result.evaluateCount, type: 'all' })
      commentInfo.value = res.result
    })

    const commentList = ref([])
    const params = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null,
      sortMethod: 'desc'
    })

    const tagClick = index => {
      cIndex.value = index

      if (commentInfo.value.tags[index].type === 'all') {
        params.tag = null
        params.hasPicture = false
      } else if (commentInfo.value.tags[index].type === 'img') {
        params.tag = null
        params.hasPicture = true
      } else {
        params.tag = commentInfo.value.tags[index].title
        params.hasPicture = false
      }
      params.page = 1
    }

    const changeSort = sortCondition => {
      params.sortField = sortCondition
      params.page = 1
    }

    watch(params, async () => {
      const res = await goodsEvaluatePage(goods.value.id, params)
      commentList.value = res.result.items
    }, { immediate: true })

    const formatNickName = nickname => (nickname.substr(0, 1) + '****' + nickname.substr(-1))
    const formatSpecs = specs => (specs.reduce((p, c) => `${p} ${c.name}: ${c.nameValue}`, '').trim())

    return { commentInfo, tagClick, cIndex, params, changeSort, commentList, formatNickName, formatSpecs }
  }
}

// 1、此处获取商品id有两种方法：
// 1、方法1：使用inject获取祖级组件中provide()中传递的商品信息数据goods，通过该数据获取
// 1、方法2：通过动态路由 route.params.id 获取
// 2、评价组件中需要渲染'全部评价'与'有图评价'，但是接口数据中并没有这两个部分的数据因此必须参考接口返回数据自行添加上这两个部分，然后组合数据后再用于页面数据渲染
// 3、可以根据接口文档返回的数据定义响应式数据，
// 3、定义响应式数据时，将hasPicture、tag、sortField都定义为null，而不是接口标注示例中那样定义为false，因为定义为null时，当不传这些属性时字段不会发往后台，因此查询的就是全部评价
// 4、params是封装接口请求时需要传入的对象
// 4、params.sortField的可选值是: praiseCount（按热度排序）、createTime（按最新排序）
// 4、params.sortMethod的可选值是：desc（默认按倒叙排序）、asc（按正序排序）
// 5、排序的a标签中的点击交互应该与接口数据关联到一起，例如点击交互时的赋值：params.sortField=null时表示默认排序、params.sortField='createTime'最新排序、params.sortField='praiseCount'最热排序
// 6、res.result.tags.unshift()中往tags数组插入对象时，对象的type是自定义的标识，用于将为方便渲染而自定义的tag（'全部评论'与'有图评论'）与接口自带的tag区分开来，以便后续逻辑的开展
// 7、tagClick是tag的点击事件，需要将自定义的'全部评价'与'有图评价'同接口返回的其他tag区分开来，同时因为与changeSort调用同一接口，因此接口所需参数也需要随之变化
// 8、changeSort是排序改变时触发的点击事件，传入给接口需要的参数也要随之改变，且应该将页码重置为1
// 9、changeSort与tagClick触发时，都会对接口参数发生改变，因此需要监听参数变化，以便发请求更新数据
// 9、因为changeSort与tagClick触发时都会重新排序，因此可将重置页码为1的操作挪到监听器的逻辑中，但不建议，因为监听的就是该数据还在监听器中改该数据可能会造成watch的重复触发
// 10、评价打星是使用两个i标签遍历做的，遍历时在:key中拼接字符串'1'或'2'是为了再次标识实心空心符号，防止使用同一个sub进行遍历时出现意外错误
// 11、vue3中没有过滤器，但过滤器本质就是函数，因此使用函数来做数据的格式处理
// 12、String.substr(index,length)用于截取字符串，形参index是截取位置，length是截取长度
// 13、Array.reduce((p,c)=>{},起始值)用于累计，p是上一次回调的结果（初次时就是起始值），c是遍历的当前项
// 14、formatNickName用于处理昵称，将用户昵称处理成匿名用户的形式
// 15、formatSpecs用于处理数组，将[{a: 1}, {b: 2}]格式的数组处理成'a:1 b:2'的形式的字符串
</script>

<style lang="less" scoped>
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
 .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
