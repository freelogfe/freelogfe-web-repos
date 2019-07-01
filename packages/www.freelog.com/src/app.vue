<template>
  <div :class="[$i18n.locale]" >
    <nav-top-bar></nav-top-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavTopBar from '@/components/NavTop/index.vue'
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
      NavTopBar,
      UserAsideNav
    },

    methods: {}
  }
</script>

<style lang="less" type="text/less">
  @import "./styles/global.less";
  @import "app.less";
</style>
