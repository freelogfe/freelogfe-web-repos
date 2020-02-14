/**
 * Storage
 * > - https://github.com/marcuswestin/store.js
 * > - https://github.com/marcuswestin/store.js#make-your-own-build
 */

import store from 'store'
import engine from 'store/src/store-engine'
import cookieStorage from 'store/storages/cookieStorage'
import defaultPlugins from 'store/plugins/defaults'
import expire from 'store/plugins/expire'

const storages = [
  cookieStorage
]
const plugins = [
  defaultPlugins,
  expire
]

export const cookieStore = engine.createStore(storages, plugins)

export default store
