<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- Keep alive is just keeping the current component state and render output in memory.
        Vue cannot use keep-alive on an iframe because it is a native element - it doesn’t have state. When the route changes the iframe element is simply removed from the DOM -->
      <!-- <keep-alive :include="cachedViews"> -->
        <router-view :key="key"></router-view>
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
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
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  height: 100%;
  position: relative;
  overflow: auto;
}
</style>

