<template>
  <el-container class="app-container">
    <user-aside-nav v-show="!isError"></user-aside-nav>
    <el-main class="main-app-content" :class="[themeCls]">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import UserAsideNav from '@/components/UserAsideNav/index.vue'

export default {
  data() {
    return {}
  },

  computed: {
    themeCls() {
      return this.$route.meta.theme || 'white'
    },
    isError() {
      return (typeof this.$route.meta.error === 'undefined') ? false : this.$route.meta.error
    }
  },

  mounted() {
  },
  components: {
    UserAsideNav
  },

  methods: {}
}
</script>

<style lang="less" scoped>
  /*@import "index.less";*/
</style>
