
(function init() {
  window.FreelogApp = window.FreelogApp || {}
  var qiOrigin = ''
  const mainDomain = getMainDomain()
  const isLocalhost = _isLocalhost()

  if(isLocalhost) {
    qiOrigin = `${window.location.protocol}//qi.testfreelog.com`
  }else {
    qiOrigin = window.location.origin.replace(/^https?:\/\/(\w+)\./, function(...args) {
      return args[0].replace(args[1], 'qi')
    })
  }

  window.FreelogApp.Env = {
    isTest: isLocalhost || /test/.test(mainDomain),
    mainDomain,
    qiOrigin
  }
})()


function getMainDomain() {
  var arr = window.location.host.split('.')
  arr.shift()
  return arr.join('.')
}

function _isLocalhost() {
  const host = window.location.host
  return /^localhost/.test(host) || /^127\.0\.0\.1/.test(host)
}
