import Vue from 'vue'
import App from './App.vue'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/reset.css'
import './styles/global.less'
import plugins from './plugins'

function initEnv() {
  const win = window
  const isTest = /\.testfreelog\.com$/.test(win.location.host)
  win.FreelogApp = win.FreelogApp || {}
  win.FreelogApp.Env = win.FreelogApp.Env || {}

  window.__auth_info__ = {"__auth_user_id__":10008,"__auth_node_id__":10017,"__auth_node_name__":"简易音乐播放器","__page_build_sub_resource_ids":["f8d391df0d1643b3303c9faec9cd56e87ef49149"],"__page_build_sub_resource_auth_token":"5b5ae19684e4de002b540155"}
  if (win.__auth_info__) {
    Object.assign(win.FreelogApp.Env, {
      nodeId: win.__auth_info__.__auth_node_id__,
      userId: win.__auth_info__.__auth_user_id__
    })
  }
  Object.assign(win.FreelogApp.Env, {
    isTest,
    mainDomain: isTest ? 'testfreelog.com' : 'freelog.com'
  })
}

// Vue.use(ElementUI)
Vue.use(plugins)

Vue.config.productionTip = false

initEnv()
new Vue({
  render: h => h(App)
}).$mount('#app')