<!--<i18n src="./main.json"></i18n>-->
<template>
  <div id="freelog-node-example"></div>
</template>

<script>
import { loadMicroApp } from 'qiankun'

export default {
  name: 'node-examle',
  data() {
    return {}
  },
  mounted() {
    const entry = window.FreelogApp.Env.type === 'prod' ? '//f-presentations.freelog.com' : '//f-presentations.testfreelog.com'
    // const entry = 'http://local.testfreelog.com:9180/'
    loadMicroApp(
      { 
        entry,
        name: 'freelog-pagebuild-presentation', 
        container: '#freelog-node-example', 
      }
    )
  },  
  destroyed() {},
  methods: {},
}
</script>