
import '../app/styles/reset.css'
import '../app/styles/global.less'

import Vue from 'vue'
import axios from 'axios'
import initGlobalApi from '../_core/index.ts'
import initWidgets from '../_core/pb-parser.ts'
import fReport from '@freelog/freelog-report'

window.Vue = Vue
window.axios = axios
initWidgets()
window.addEventListener('DOMContentLoaded', async () => {
  const mountApp = (await import('./app.js')).default
  mountApp(Vue, axios)
})

// 页面性能数据采集
fReport.performanceReport({
  reportUrl: 'http://report.testfreelog.com/v1/report/performance'
})
