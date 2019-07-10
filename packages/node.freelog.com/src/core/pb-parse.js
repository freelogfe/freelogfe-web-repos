import { throwError } from './exceptions/throwError'
import { throwException } from './exceptions/throwException'
import { EXCEPTION_LOADWIDGET, EXCEPTION_PB_AUTH } from './exceptions/names'

export default function initWidgets(FreelogApp) {
  FreelogApp.$loading.show()
  const authInfo = window.__auth_info__
  const authErrorData = authInfo && authInfo.__auth_error_info__
  if(!authErrorData) {
    loadWidgets(FreelogApp)
      .then(FreelogApp.$loading.hide)
      .catch(e => {
        throwError(e.toString(), EXCEPTION_LOADWIDGET)
        FreelogApp.$loading.hide()
      })
  }else {
    // 显示PB异常页及授权按钮，待授权问题解决后刷新页面
    throwException('PB授权未通过', EXCEPTION_PB_AUTH)
  }
}

function loadWidgets(FreelogApp) {
  const promises = []
  const vis = {}
  const pbId = getPageBuildId()

  if(window.__auth_info__ && pbId) {
    const { __page_build_sub_releases = [] } = window.__auth_info__

    __page_build_sub_releases
      .filter(({ releaseId }) => !!releaseId)
      .forEach(subRelease => {
        const { releaseId, version } = subRelease
        if (!vis[releaseId]) {
          vis[releaseId] = true
          const p = FreelogApp.QI.requireSubResource({
            presentableId: pbId,
            subReleaseId: releaseId,
            version
          })
          promises.push(p)
        }
      })
  }
  return Promise.all(promises)
}

function getPageBuildId() {
  var $doms = Array.from(document.querySelectorAll('#js-page-container .js-wc-widget'))
  if($doms.length) {
    return $doms[0].getAttribute('data-page-build-id')
  }
  return null
}



