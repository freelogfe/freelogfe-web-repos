import { axios } from '@/lib'

function Fetch(target, otherActions) {
  this.target = target
  Object.assign(this, otherActions)
}

Fetch.prototype = {
  get(id, options) {
    let url = `/${this.target}`
    if (typeof id === 'object') {
      options = id
    } else if (id !== undefined) {
      url += `/${id}`
    }
    return axios.get(url, options)
  },
  delete(id, options) {
    const url = `/${this.target}/${id}`
    return axios.delete(url, options)
  },
  post(options) {
    const url = `/${this.target}`
    return axios.post(url, options)
  },
  // 更新全部
  put(id, options) {
    const url = `/${this.target}/${id}`
    return axios.put(url, options)
  },
  // 更新部分
  patch(id, options) {
    const url = `/${this.target}/${id}`
    return axios.patch(url, options)
  }
}

export default Fetch


