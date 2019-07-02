<template>
  <footer v-if="isShowFooter" class="app-footer">
    <ul class="freelog-info">
      <li><a href="/about">{{ $t('aboutView.about') }} freelog</a></li>
      <li><a href="/help">{{ $t('helpView.title') }}</a></li>
      <li><a href="http://www.miibeian.gov.cn" target="_blank">粤ICP备17085716号-1</a></li>
      <li><b>Copyright© {{year}} {{ $t('company.name')}} freelog.com{{$t('company.copyright')}}</b></li>
    </ul>
  </footer>
</template>

<script>
import Footer from './index'

export default Footer
</script>

<style scoped lang="less">
  .app-footer {
    margin-top: 80px;
    margin-bottom: 50px;
    text-align: center;
    padding: 10px 0;
  }

  a {
    color: black;
  }

  .freelog-info {
    li {
      display: inline-block;
      margin: 0 20px;
    }
  }
</style>
