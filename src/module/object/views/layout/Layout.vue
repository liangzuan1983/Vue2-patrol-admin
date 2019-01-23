<template>
  <div class="app-wrapper">
    <div class="main-container">
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { AppMain } from './components'

export default {
  name: 'layout',
  components: {
    AppMain
  },
  computed: {},
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@mixin clearfix {
&:after {
  content: "";
  display: table;
  clear: both;
}
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar{
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
