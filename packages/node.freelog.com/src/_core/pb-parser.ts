import { createScript, createCssLink } from './helpers'
import { resolveSubDependDataUrl } from './api/resolveUrl'
import { showLoading, hideLoading } from './initLoading'
import { ISubDependency } from './api'

interface IAuthInfo {
  __auth_user_id__: number
  __auth_node_id__: number
  __auth_node_name__?: string
  __page_build_id?: string
  __page_build_entity_id?: string
  __page_build_sub_releases?: Array<ISubDependency>
  __auth_error_info__?: plainObject
}

export const AllWidgetsLoaded = 'allWidgetsLoaded'
export default async function initWidgets(): Promise<void> {
  const authInfo = window.__auth_info__ as IAuthInfo
  const authErrorData = authInfo && authInfo.__auth_error_info__
  try {
    if (!authErrorData) {
      showLoading()
      await loadWidgets()
      hideLoading()
      window.FreelogApp.trigger(AllWidgetsLoaded)
    }
  } catch(e) {
    hideLoading()
    console.error(e.toString())
  } 
}

async function loadWidgets(): Promise<any> {
  return new Promise(resolve => {
      const resources: plainObject [] = []
    if (window.__auth_info__) {
      const vis: { [propName: string]: boolean } = {}
      const { 
        __page_build_sub_releases, 
        __page_build_id, 
        __page_build_entity_id, 
      } = window.__auth_info__ as IAuthInfo
      
      for (const subRelease of __page_build_sub_releases) {
        const { resourceType, id: subReleaseId } = subRelease
        if (!vis[subReleaseId]) {
          vis[subReleaseId] = true
          const url = resolveSubDependDataUrl(__page_build_id, subReleaseId, __page_build_entity_id)
          switch (resourceType) {
            case 'widget':
            case 'js': {
              resources.push({ type: 'js', url })
              break
            }
            case 'css': {
              resources.push({ type: 'css', url })
              break
            }
            default: {}
          }
        }
      }
    }

    sortResources(resources)
    const promises: Promise<any> [] = resources.map(item => {
      switch(item.type) {
        case 'css': return createCssLink(item.url)
        case 'js': return createScript(item.url)
        default: return Promise.resolve()
      }
    })
    let count = promises.length
    if (count === 0){ 
      resolve()
    } else {
      for (const p of promises) {
        p.finally(() => {
          count--
          if (count === 0) {
            resolve()
          }
        })
      }
    }
  })
}

function sortResources(resources: plainObject []): void {
  resources.sort(r => r.type === 'css' ? -1 : 1)
}


