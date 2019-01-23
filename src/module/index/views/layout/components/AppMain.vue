<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  watch: {
    '$route'(to, from) {
      // console.log('to:', to)
      // console.log('from', from)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$--background-color-base: #f5f7fa !default;
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
  background-color: $--background-color-base;
}
</style>

