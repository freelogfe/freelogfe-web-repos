<template>
  <div class="signup-page">
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
  @import './index.less';
</style>

