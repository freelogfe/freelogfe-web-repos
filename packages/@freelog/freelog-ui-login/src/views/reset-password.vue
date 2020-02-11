<template>
  <div class="reset-password-page">
    <reset-password></reset-password>
  </div>
</template>

<script>
import ResetPassword from "../components/reset-password/index.vue";
export default {
  name: "reset-password-page",
  components: { ResetPassword }
};
</script>

<style lang="less">
  @import './index.less';
</style>

