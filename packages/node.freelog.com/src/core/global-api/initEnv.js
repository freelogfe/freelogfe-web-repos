import initEnv from '@freelog/freelog-common-lib/src/initEnv'

export default function init(FreelogApp) {
  initEnv(FreelogApp)

  const authInfo = window.__auth_info__
  if (authInfo) {
    Object.assign(FreelogApp.Env, {
      nodeId: authInfo.__auth_node_id__ || '',
      userId: authInfo.__auth_user_id__ || ''
    })
  }
}
