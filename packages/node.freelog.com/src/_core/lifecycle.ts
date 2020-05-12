
import { FREELOG_APP_MOUNTED } from './events/pb-event-names'

export interface IFAppLifeCycle {
  mounted(): Promise<any>
}

export default function initLifeCycle(FreelogApp: any): IFAppLifeCycle {
  const mountedPromise = new Promise(resolve => {
    FreelogApp.once(FREELOG_APP_MOUNTED, () => {
      resolve()
    })
  })

  return {
    mounted() {
      return mountedPromise
    }
  }
}
