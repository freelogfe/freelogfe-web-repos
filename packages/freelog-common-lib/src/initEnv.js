export default function initEnv(FreelogApp) {
  var qiOrigin = ''
  const mainDomain = getMainDomain()
  const isLocalhost = _isLocalhost()
  const isTestFreelog = _isTestFreelog()
  const isTest = isLocalhost || isTestFreelog

  if(isLocalhost) {
    qiOrigin = window.location.origin
  }else {
    qiOrigin = getQiOrigin(isTest)
  }
  const win = window
  if(!FreelogApp) {
    win.FreelogApp = win.FreelogApp || {}
    FreelogApp = win.FreelogApp
  }
  FreelogApp.Env = FreelogApp.Env || {}
  Object.assign(FreelogApp.Env, {
    type: isTestFreelog ? 'test' : isLocalhost ? 'dev' : 'prod', 
    isTest,
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
    mainDomain,
    qiOrigin,
    nodeType: _isTestNode() ? 'test' : 'formal',
  })
}

// 是否为测试节点
function _isTestNode() {
  return /^t\./.test(window.location.host)
}

// 是否为本地开发环境
function _isLocalhost() {
  const host = window.location.host
  return /^localhost/.test(host) || /^\d+\.\d+\.\d+\.\d+/.test(host)
}

// 是否为测试开发环境
function _isTestFreelog() {
  return /testfreelog\.com/.test(window.location.host)
}

function getQiOrigin(isTest) {
  return isTest ? '//qi.testfreelog.com' : '//qi.freelog.com'
}

function getMainDomain() {
  var arr = window.location.host.split('.')
  arr.shift()
  return arr.join('.')
}

