const path = require('path');
const CWD = process.cwd();

const [ CONSOLE_PORT, WWW_PORT, NODE_PORT, WIDGET_PORT, DEFAULT_PORT ] = [ "8880", "9880", "9888", "9180", "9880" ]

function getPort(urlObject) {
    return urlObject.protocol === 'https:' ? '443' : '880'
}

function getPortByPath(staticPath) {
    if(/console/.test(staticPath)) {
        return CONSOLE_PORT
    }else if(/www/.test(staticPath)){
        return WWW_PORT
    }else if(/pagebuild/.test(staticPath)) {
        return NODE_PORT
    }else {
        return DEFAULT_PORT
    }
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
                ctx.set('access-control-expose-headers', 'freelog-resource-type,freelog-sub-resource-auth-token,freelog-sub-releases,freelog-meta')
            }
        },
        {
            rule: /\/api(.+)/,
            target: '~/workplace/mock/404'
        },
        {
            rule: /^(.*)$/,
            target: function (urlPath, match, urlObject) {
                const mArr = urlObject.host.match(/([\w-]+)\.(test)?freelog\.com/)
                if(mArr !== null) {
                    let targetUrl = ''
                    let isJs = path.extname(urlPath) === '.js'
                    let isCss = path.extname(urlPath) === '.css'
                    switch (mArr[1]) {
                        case 'www': {
                            targetUrl = `http://127.0.0.1:${WWW_PORT}${urlPath}`
                            break
                        }
                        case 'console': {
                            targetUrl = `http://127.0.0.1:${CONSOLE_PORT}${urlPath}`
                            break
                        }
                        case 'static': {
                            const port = getPortByPath(urlPath)
                            if(isJs) {
                                if(/freelog-common/.test(urlPath)) {
                                    targetUrl = `http://127.0.0.1:${NODE_PORT}/freelog-common.js`
                                }else {
                                    urlPath = `/${path.basename(urlPath).replace(/\.\w+\./, '.')}`
                                    targetUrl = `http://127.0.0.1:${port}${urlPath}`
                                }
                            }
                            if(isCss) {
                                urlPath = urlPath.replace(/(\/?console)|(\/?www)|(\/?pagebuild)/, '')
                                targetUrl = `http://127.0.0.1:${port}${urlPath}`
                            }
                            break
                        }
                        case 'local': {
                            targetUrl = `http://127.0.0.1:${WIDGET_PORT}${urlPath}`
                            break
                        }
                        default: {
                            targetUrl = `http://127.0.0.1:${DEFAULT_PORT}${urlPath}`
                        }
                    }
                    return targetUrl
                }
                return path.join(CWD, urlPath)
            },
            headers: function (ctx) {
                ctx.set('access-control-allow-origin', ctx.req.headers.origin || '*')
            }
        }
    ]
};