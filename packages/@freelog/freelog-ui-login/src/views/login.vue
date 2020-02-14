<template>
  <div class="login-page">
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

<style lang="less">
  @import './index.less';
</style>

