import * as Services from '../services'

export default (Vue) => {
  // alias
  const services = {}
  Object.keys(Services).forEach((name) => {
    let sn = name.replace(/service/i, '')
    sn = sn[0].toLowerCase() + sn.substr(1)
    services[sn] = Services[name]
    services[name] = Services[name]
  })

  // mount the services to Vue
  Object.defineProperties(Vue, {
    services: { get: () => services }
  })

  // mount the services to Vue component instance
  Object.defineProperties(Vue.prototype, {
    $services: { get: () => services }
  })
}
