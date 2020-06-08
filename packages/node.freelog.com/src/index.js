
import './app/styles/reset.css'
import './app/styles/global.less'
import './_core/index'
import fReport from '@freelog/freelog-report'

const FreelogApp = window.FreelogApp
const { Env: { type: envType, mainDomain } } = FreelogApp

FreelogApp.loadMicroApp({
  name: 'pagebuild-auth',
  container: '#app-container',
  scripts: [ `//static.${mainDomain}/pagebuild/pagebuild-auth.js` ],
})

async function loadFreelogAuthApp() {}

if (document.readyState === 'loading') {  // 此时加载尚未完成
  document.addEventListener('DOMContentLoaded', loadFreelogAuthApp)
} else {  // 此时`DOMContentLoaded` 已经被触发
  loadFreelogAuthApp()
}

if (envType !== 'dev') {
  // 页面性能数据采集
  fReport.performanceReport({
    reportUrl: 'http://report.testfreelog.com/v1/report/performance'
  })
} 

export function pagebuildApp() {}


