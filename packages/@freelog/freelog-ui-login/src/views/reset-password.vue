<template>
  <div class="f-ui-reset-password-page">
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
@import "../styles/mixin.less";
.f-ui-reset-password-page {
  .ui-login-page();
}
</style>

