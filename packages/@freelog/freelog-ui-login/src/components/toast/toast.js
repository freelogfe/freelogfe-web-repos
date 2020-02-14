import FToast from './index.vue'

var ToastConstructor = null
var _Vue = null
const defualts = {
  duration: 3
}
export function initToast(Vue) {
  _Vue = Vue
  ToastConstructor = Vue.extend(FToast)
}

const Toast = function(options) {
  options = options || {};
  if (typeof options === 'string') {
    options = {
      msg: options
    }
  }

  const toastInstance = new ToastConstructor({
    el: document.createElement('div'),
    data: Object.assign({}, defualts, options)
  })

  document.body.appendChild(toastInstance.$el)
  _Vue.nextTick(() => {
    toastInstance.visible = true
  })
}

export default Toast