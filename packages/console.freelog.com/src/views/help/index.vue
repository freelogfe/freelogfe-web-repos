<template>
  <section class="help-section">
   {{$t('helpView.title')}}
  </section>
</template>

<script>
import HelpView from './index'

export default HelpView
</script>

<style lang="less" scoped>
  .help-section {
    width: 50%;
    margin: 30px auto;
  }
</style>
