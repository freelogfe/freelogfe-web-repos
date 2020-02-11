const host = window.location.host.split('.').slice(1).join('.')

function getPageKey() {
  return `${window.location.href}_scrollTop`
}

function cacheScrollTop() {
  const key = getPageKey()
  const rect = document.body.getBoundingClientRect()
  localStorage.setItem(key, -rect.top)
}


function scrollTopHandler(st, callBuf) {
  const rect = document.body.getBoundingClientRect()
  window.scrollTo(0, st)
  callBuf -= 1
  if (-rect.top < st && callBuf > 0) {
    setTimeout(() => {
      scrollTopHandler(st, callBuf)
    }, 20)
  } else {
    const key = getPageKey()
    localStorage.removeItem(key)
  }
}

function gotoCacheScrollTop() {
  const key = getPageKey()
  const st = parseInt(localStorage.getItem(key), 10)
  if (!Number.isNaN(st)) {
    scrollTopHandler(st, 3333)
  }
}

function gotoLogin(redirect) {
  cacheScrollTop()

  let loginUrl = `//console.${window.FreelogApp.Env.mainDomain}/user/login`
  if (redirect) {
    loginUrl += `?redirect=${encodeURIComponent(redirect)}`
  }

  window.location.href = loginUrl
}


function resolveNodeDomain(domain) {
  return `${domain}.${host}`
}


export {
  gotoLogin,
  gotoCacheScrollTop,
  resolveNodeDomain
}

export default {
  gotoLogin,
  gotoCacheScrollTop
}

