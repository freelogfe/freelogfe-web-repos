<template>
  <div class="app-wrapper" :class="[$i18n.locale]" >
    <transition name="fade">
      <router-view class="wrapper"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less" type="text/less">
  @import "./styles/reset.css";
  @import "./styles/global.less";
  @import "app.less";
</style>
