import axios from 'axios'

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 1e4,
  withCredentials: true,
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest'
  }
})

function getBaseURL() {
  return window.location.origin.replace(/https?:\/\/([\w-]+)\.(test)?freelog\.com/, function(...args){
    return args[0].replace(args[1], 'qi')
  })
}

instance.interceptors.request.use(
  config => config,
  err => Promise.reject(err),
)

instance.interceptors.response.use(
  (response) => {
    const { data } = response
    const loginPath = '/login'

    if ([28, 30].indexOf(data.errcode) > -1 && window.location.pathname !== loginPath) {
      // 跳登录
    }
    return response
  },
  (err) => {
    err.response = err.response || {}
    return Promise.reject(err)
  },
)


export default instance

