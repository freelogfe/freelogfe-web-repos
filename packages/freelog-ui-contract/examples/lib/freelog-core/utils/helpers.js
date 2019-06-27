// webpack import config https://webpack.js.org/api/module-methods/#import-
//
// 鉴于es module兼容性问题，暂时不适用此加载方案
// function _createScript(url, type) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script')
//     script.type = type
//     script.src = url
//     script.onload = resolve
//     script.onerror = reject
//     script.async = 'async'
//     document.getElementsByTagName('head').item(0).appendChild(script)
//   })
// }
//
//
// export function createScript(url, type) {
//   type = type || 'module'
//   return _createScript(url, type)
//     .then(() => {
//       if (type === 'module') {
//         return import(/* webpackIgnore: true */ url)
//       }
//       return true
//     })
// }


export function createScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    script.async = 'async'
    document.getElementsByTagName('head').item(0).appendChild(script)
  })
}


export function createCssLink(href, type) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.ref = 'stylesheet'
    link.type = type || 'text/css'
    link.href = href
    link.onload = resolve
    link.onerror = reject
    document.getElementsByTagName('head').item(0).appendChild(link)
  })
}

export function injectCodeResource(res, type, filename) {
  filename = filename || +new Date()
  const file = new File([res], `${filename}`, { type })
  const url = window.URL.createObjectURL(file)
  switch (type) {
    case 'text/javascript': {
      return createScript(url)
    }
    case 'text/css': {
      return createCssLink(url)
    }
    default:
      throw new Error('wrong type!')
  }
}
