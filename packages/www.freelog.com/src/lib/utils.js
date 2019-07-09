import { isSafeUrl } from './security'

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

function resolveNodeDomain(domain) {
  return `${domain}.${host}`
}


export {
  gotoCacheScrollTop,
  resolveNodeDomain
}

export default {
  gotoCacheScrollTop
}

