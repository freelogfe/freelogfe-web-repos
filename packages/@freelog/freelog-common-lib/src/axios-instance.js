export default function createAxiosInstance(axios) {
  function getBaseURL() {
    return window.location.origin.replace(/https?:\/\/([\w-]+)\.(test)?freelog\.com/, function(...args){
      return args[0].replace(args[1], 'qi')
    })
  }

  return axios.create({
    baseURL: getBaseURL(),
    timeout: 15e3,
    withCredentials: true,
    headers: {
      // 'X-Requested-With': 'XMLHttpRequest'
    }
  })
}
