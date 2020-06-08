
import { execScripts } from 'import-html-entry'
import { createSandbox } from 'qiankun/lib/sandbox/index'
import { registerApplication, start, mountRootParcel, RegisterApplicationConfig, LifeCycles, Parcel } from 'single-spa'
import { isFunction } from './utils'

export interface IRegistrableApp {
  name: string
  container: string | HTMLElement
  scripts:  Array<string> 
  app: Promise <any>
  activeWhen: RegisterApplicationConfig['activeWhen']
  customProps?: RegisterApplicationConfig['customProps']
}

export interface ILoadableApp {
  name: string
  container: string | HTMLElement
  scripts:  Array<string> 
}

export interface ILoadableConfiguration {
  sandbox?: { strictStyleIsolation?: boolean } | boolean 
}

export function registerMicroApps(apps: Array<IRegistrableApp>): void {
  for (const app of apps) {
    const { name, activeWhen, container, scripts, customProps = {} } = app
    registerApplication({
      name, 
      activeWhen,
      customProps,
      app: async () => loodApp({ name, scripts, container }, { sandbox: { strictStyleIsolation: true } }),
    })
  }
  start()
}

export function loadMicroApp(app: ILoadableApp, configuration: ILoadableConfiguration): Parcel {
  return mountRootParcel(() => loodApp(app, configuration), {
    domElement: document.createElement('div'),
  })
}

function validateExportLifecycle(scriptExports: any): boolean {
  const { bootstrap, mount, unmount } = scriptExports ?? {}
  return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount)
}

function getLifecyclesFromExports(scriptExports: LifeCycles<any>, appName: string, global: WindowProxy): any {

  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[FreelogApp] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`,
    );
  }

  // fallback to global variable who named with ${appName} while module exports not found
  const globalVariableExports = (global as any)[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  // throw new Error(`[FreelogApp] You need to export lifecycle functions in ${appName} entry`);
}

function getAppWrapper(appName: String, appContent: string, strictStyleIsolation: boolean) {
  const element: HTMLElement = document.createElement('div')
  element.id = `freelog_${appName}_${+new Date()}`
  if (strictStyleIsolation) {
    const supportShadowDOM = !!document.head.attachShadow
    if (supportShadowDOM) {
      const shadow = element.attachShadow({ mode: 'open' })
      shadow.innerHTML = appContent
    } else {
      console.warn('[FreelogApp]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!')
    }
  } else {
    element.innerHTML = appContent
  }
  return element
}

async function loodApp(app: ILoadableApp, configuration: ILoadableConfiguration = {}) {
  const { name: appName, scripts, container } = app
  const { sandbox = true } = configuration
  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation
  const containerElement: HTMLElement | null = typeof container === 'string' ? document.querySelector(container) : container
  if (!(containerElement instanceof HTMLElement)) {
    throw new Error(`[FreelogApp] container with ${container} not existed`)
  }
  const rawContainerContent = containerElement && containerElement.innerHTML || ''
  const appWrapper: HTMLElement| ShadowRoot = getAppWrapper(appName, rawContainerContent, strictStyleIsolation)
  const appRootGetter = () => strictStyleIsolation ? appWrapper.shadowRoot : appWrapper

  let global: Window = window
  let mountSandbox = () => Promise.resolve()
  let unmountSandbox = () => Promise.resolve()
  if (sandbox) {
    const sandboxInstance = createSandbox(appName, appRootGetter, false)
    global = sandboxInstance.proxy
    mountSandbox = sandboxInstance.mount
    unmountSandbox = sandboxInstance.unmount
  }
  const scriptExports: any = await execScripts(scripts[scripts.length - 1], scripts, global, { strictGlobal: true }) 
  const {
    bootstrap = () => Promise.resolve(),
    mount = () => Promise.resolve(),
    unmount = () => Promise.resolve(),
    update = () => Promise.resolve(),
  } = getLifecyclesFromExports(scriptExports, appName, global) || {}

  
  const parcelConfig = {
    bootstrap,
    mount: [ 
      async () => {
        containerElement.innerHTML = ''
        containerElement.append(appWrapper)
      },
      mountSandbox,
      async (props: any) => mount({ appRootElement: appRootGetter(), ...props }),
    ],
    update,
    unmount: [ 
      async (props: any) => unmount({ appRootElement: appRootGetter(), ...props }),
      unmountSandbox,
      async () => {
        containerElement.innerHTML = rawContainerContent
      }
    ],
  }
  return parcelConfig
}