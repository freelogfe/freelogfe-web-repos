import initEnv, { IEnv } from './initEnv'
import initQI, { IFreelogQuery } from './initQI'
import initLoading, { ILoading } from './initLoading'
import EventEmitter from './events/index'
import { HANDLE_INVALID_RESPONSE, HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, SHOW_AUTH_DIALOG, NOTIFY_NODE, SHOW_ERROR_MESSAGE } from './events/pb-event-names'
import { registerMicroApps, loadMicroApp, IRegistrableApp, ILoadableApp, ILoadableConfiguration } from './loader'
import { Parcel } from 'single-spa'
import initWidgets from './pb-parser'
 
export interface IFreelogApp {
  QI: IFreelogQuery
  Env: IEnv;
  $loading: ILoading;
  registerMicroApps(apps: Array<IRegistrableApp>): void
  loadMicroApp(app: ILoadableApp, configuration: ILoadableConfiguration): Parcel
  EventEmitter: typeof EventEmitter,
  on(event: string, fn: () => any): EventEmitter
  off(event?: string, fn?: () => any): EventEmitter
  once(event: string, fn: () => any): EventEmitter
  trigger(event: string): EventEmitter
}

function initGlobalApi(): IFreelogApp {

  const oEventInstance = new EventEmitter(document.querySelector('#app-container'))
  const FreelogApp: IFreelogApp = {
    QI: initQI(),
    Env: initEnv(),
    $loading: initLoading(),
    registerMicroApps,
    loadMicroApp,
    EventEmitter,
    on: EventEmitter.prototype.on.bind(oEventInstance),
    once: EventEmitter.prototype.once.bind(oEventInstance),
    trigger: EventEmitter.prototype.trigger.bind(oEventInstance),
    // off: EventEmitter.prototype.off.bind(oEventInstance),
    off(type: string, fn?: () => any): EventEmitter {
      const pbEventNames: plainObject = { HANDLE_INVALID_RESPONSE, HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, SHOW_AUTH_DIALOG, NOTIFY_NODE, SHOW_ERROR_MESSAGE }
      
      if(arguments.length === 1 && pbEventNames[type]) {
        console.info(`This event(${type}) can't be offed`)
        return oEventInstance
      }
      return oEventInstance.off(type, fn)
    },
  }
  return (window.FreelogApp = FreelogApp)
} 

initGlobalApi()
initWidgets()
