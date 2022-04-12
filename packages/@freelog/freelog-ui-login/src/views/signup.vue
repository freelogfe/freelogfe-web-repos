<template>
  <div class="f-ui-signup-page">
		<sign-up></sign-up>	
	</div>
</template>

<script>
import SignUp from '../components/signup/index.vue'
export default {
	name: 'signup-page',
	components: { SignUp }
}
</script>

<style lang="less">
@import "../styles/mixin.less";
.f-ui-signup-page {
	.ui-login-page();
}
</style>


