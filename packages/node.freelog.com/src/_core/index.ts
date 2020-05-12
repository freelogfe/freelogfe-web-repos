
import '../app/styles/reset.css'
import '../app/styles/global.less'

import initEnv, { IEnv } from './initEnv'
import initQI, { IFreelogQuery } from './initQI'
import initLoading, { ILoading } from './initLoading'
import initWidgets from './pb-parser'
import initLifeCycle, { IFAppLifeCycle } from './lifecycle'
import EventCenter from './events/index'
import { HANDLE_INVALID_RESPONSE, HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, SHOW_AUTH_DIALOG, NOTIFY_NODE, SHOW_ERROR_MESSAGE } from './events/pb-event-names'

interface FreelogApp {
  QI: IFreelogQuery
  Env: IEnv;
  $loading: ILoading;
  mounted?(): Promise<any>
  on(event: string, fn: () => any): EventCenter
  off(event?: string, fn?: () => any): EventCenter
  once(event: string, fn: () => any): EventCenter
  trigger(event: string): EventCenter
}

initGlobalApi()
initWidgets()

function initGlobalApi(): void {
  const eventInstance = new EventCenter()
  const FreelogApp: FreelogApp = {
    QI: initQI(),
    Env: initEnv(),
    $loading: initLoading(),
    on: EventCenter.prototype.on.bind(eventInstance),
    once: EventCenter.prototype.once.bind(eventInstance),
    trigger: EventCenter.prototype.emit.bind(eventInstance),
    off(event: string, fn?: () => any): EventCenter {
      const pbEventNames: plainObject = { HANDLE_INVALID_RESPONSE, HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, SHOW_AUTH_DIALOG, NOTIFY_NODE, SHOW_ERROR_MESSAGE }
      if(arguments.length === 0) {
        for(let name in eventInstance._events) {
          if(!pbEventNames[name]) {
            Reflect.deleteProperty(eventInstance._events, name)
          }
        }
        return eventInstance
      }
      if(arguments.length === 1 && pbEventNames[event]) {
        console.info(`This event({event}) can't be offed`)
        return eventInstance
      }
      return eventInstance.off(event, fn)
    },
  }
  const { mounted } = initLifeCycle(FreelogApp) as IFAppLifeCycle
  FreelogApp.mounted = mounted
  window.FreelogApp = FreelogApp
} 

