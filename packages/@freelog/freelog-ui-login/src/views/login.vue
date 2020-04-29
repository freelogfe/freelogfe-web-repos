<template>
  <div class="f-ui-login-page">
		<Login></Login>	
	</div>
</template>

<script>
import Login from '../components/login/index.vue'
export default {
	name: 'login-page',
	components: { Login }
}
</script>

<style lang="less" scoped>
</style>

<style lang="less">
@import "../styles/mixin.less";
.f-ui-login-page {
  .ui-login-page();
}
</style>

