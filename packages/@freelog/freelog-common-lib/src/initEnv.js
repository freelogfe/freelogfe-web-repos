export default function initEnv() {
  const type = getEnvType()
  const isTest = type !== 'prod'

  window.FreelogApp = window.FreelogApp || {}
  window.FreelogApp.Env = {
    leaguage: getEnvLanguage(),
    mainDomain: getMainDomain(),
    qiOrigin: getQIoringin(),
    nodeType: getNodeType(),
    type,
    isTest,
    isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent),
  }
}

export function getEnvType() {
  if (location.port !== '') {
    return 'dev'
  }
  const host = window.location.host
  if (/^localhost/.test(host) || /^\d+\.\d+\.\d+\.\d+/.test(host)) {
    // 是否为本地开发环境
    return 'dev'
  } else if (/testfreelog\.com/.test(host)) {
    // 是否为本地开发环境
    return 'test'
  } else {
    return 'prod'
  }
}

export function getEnvLanguage() {
  const cookieLocale = document.cookie.split(';').map(i => i.trim()).find(i => i.startsWith('locale='))
  let localeCookie
  if (cookieLocale){
    localeCookie = cookieLocale.replace('locale=', '')
  }
  var language = localeCookie || window.localStorage.getItem('locale')
  const langArray = [ 'zh-CN', 'en' ]
  if (!langArray.includes(language)) {
    if (/^zh(\-\w+)?/.test(window.navigator.language)) {
      language = langArray[0] 
    } else {
      language = langArray[1]
    }
  } 
  return language
}

export function getMainDomain() {
  return window.location.host.split('.').slice(-2).join('.')
}

export function getQIoringin() {
  return getEnvType() !== 'prod' ? '//qi.testfreelog.com' : '//qi.freelog.com'
}

export function getNodeType() {
  return /^t\./.test(window.location.host) ? 'test' : 'formal'
}