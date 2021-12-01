<template>
  <div class="container">
    <AppMemberAside />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>

<script>
export default {
  name: 'MemberLayout',
  setup () {
    return { }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>
