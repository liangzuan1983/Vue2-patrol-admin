<template>
  <div class="dashboard-container">
    <el-container>
      <el-header>
        <h1>欢迎&nbsp;&nbsp;用户<q>{{ name }}</q>，登录&nbsp;<q>立体巡防系统</q></h1>
      </el-header>
      <el-main></el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'userid',
      'name'
    ])
  },
  created() {}
}
</script>
