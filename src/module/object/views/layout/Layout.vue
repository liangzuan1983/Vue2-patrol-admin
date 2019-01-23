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
</style>
