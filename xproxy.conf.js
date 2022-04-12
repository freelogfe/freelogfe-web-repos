const path = require('path');
const CWD = process.cwd();

function getPort(urlObject) {
  return urlObject.protocol === 'https:' ? '443' : '880'
}

function map2Local(urlPath, match, urlObject) {
  var reqPath = urlPath
  var port = getPort(urlObject)
  var isPageBuild = /static.(test)?freelog.com/.test(urlObject.host) && (/public\//.test(urlPath))

  if (isPageBuild) {
    reqPath = urlPath.replace(/\.\w+\./, '.')
    let isJs = path.extname(urlPath) === '.js'

    if (isJs) {
      reqPath = reqPath.split('/')
      reqPath = '/' + reqPath[reqPath.length - 1]
    }
  }

  if (/console.(test)?freelog/.test(urlObject.host)) {
    // reqPath = reqPath.replace('/public', '')
    return `http://127.0.0.1:8${port}${reqPath}`
  } else if (/pagebuild\/static/.test(urlPath)) {
    return path.join(CWD, 'www.freelog.com', 'src', urlPath)
  } else if (/local\.testfreelog\.com/.test(urlObject.host)){
    return `http://127.0.0.1:9180${reqPath}`
  } else {
    return `http://127.0.0.1:9${port}${reqPath}`
  }
  return path.join(CWD, reqPath)
}

module.exports = {
  root: CWD,
  urls: [
    {
      rule: /\/v1\/(.+)/,
      // target: '~/workplace/mock/404'
      target: 'http://127.0.0.1:7001$',
      headers: function (ctx) {
        ctx.set('access-control-allow-origin', ctx.req.headers.origin || '*')
        ctx.set('access-control-expose-headers', 'freelog-resource-type,freelog-sub-resource-auth-token,freelog-sub-resourceids,freelog-meta')

      }
    },
    {
      rule: /\/public\//,
      target: map2Local
    },
    {
      rule: /\/static\//,
      target: map2Local
    },
    {
      rule: /\/api(.+)/,
      target: '~/workplace/mock/404'
    },
    {
      rule: /^(.*)$/,
      target: function (urlPath, match, urlObject) {
        var port = getPort(urlObject)
        if (/www.testfreelog.com/.test(urlObject.host)) {
          return `http://127.0.0.1:9${port}${urlPath}`
        }

        if (/local.testfreelog.com/.test(urlObject.host)) {
           if (urlPath === '/__webpack_hmr') {
            return `http://127.0.0.1:9080${urlPath}`
          }
          console.log('urlPath ---', urlPath)
          return `http://127.0.0.1:9180${urlPath}`
        } else if (/local.freelog.com/.test(urlObject.host)) {
          if (urlPath === '/__webpack_hmr') {
            return `http://127.0.0.1:9${port}${urlPath}`
          }
          return `http://127.0.0.1:9${port}${urlPath}`
        } else if (/static.(test)?freelog.com/.test(urlObject.host)) {
          return path.join(CWD, 'www.freelog.com', 'src', urlPath)
        }

        if (/console.(test)?freelog/.test(urlObject.host)) {
          return `http://127.0.0.1:8${port}${urlPath}`
        } else if (/\.demo\.com/.test(urlObject.host)) {
          return `http://127.0.0.1:7001${urlPath}`
        } else if (urlPath.length > 1) {
          return `http://127.0.0.1:9${port}${urlPath}`
        }
        return path.join(CWD, urlPath)
      }
    }
  ]
};
