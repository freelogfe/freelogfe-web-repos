import { initGlobalAPI } from './global-api/index.js'
import initWidgets from './pb-parse'

import '../styles/pagebuild.less'
import '../styles/loading.less'

const FreelogApp = window.FreelogApp = window.FreelogApp || {}
initGlobalAPI(FreelogApp)
initWidgets(FreelogApp)
// Object.seal(FreelogApp)



