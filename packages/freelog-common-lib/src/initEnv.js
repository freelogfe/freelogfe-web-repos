export default function initEnv(FreelogApp) {
  var qiOrigin = ''
  const mainDomain = getMainDomain()
  const isLocalhost = _isLocalhost()
  const isTestFreelog = _isTestFreelog(mainDomain)

  if(isLocalhost) {
    qiOrigin = `${window.location.protocol}//qi.testfreelog.com`
  }else {
    qiOrigin = getQiOrigin()
  }
  const win = window
  if(!FreelogApp) {
    win.FreelogApp = win.FreelogApp || {}
    FreelogApp = win.FreelogApp
  }
  FreelogApp.Env = FreelogApp.Env || {}
  Object.assign(FreelogApp.Env, {
    isTest: isTestFreelog || isLocalhost,
    mainDomain,
    qiOrigin
  })
}

function _isLocalhost() {
  const host = window.location.host
  return /^localhost/.test(host) || /^127\.0\.0\.1/.test(host)
}

function _isTestFreelog(mainDomain) {
  return /test/.test(mainDomain)
}

function getQiOrigin() {
  return window.location.origin.replace(/^https?:\/\/([\w-]+)\./, function(...args) {
    return args[0].replace(args[1], 'qi')
  })
}

function getMainDomain() {
  var arr = window.location.host.split('.')
  arr.shift()
  return arr.join('.')
}
