// import "element-ui/lib/theme-chalk/dialog.css"
// import "element-ui/lib/theme-chalk/message.css"
// import "element-ui/lib/theme-chalk/tooltip.css"
// import "element-ui/lib/theme-chalk/form.css"
// import "element-ui/lib/theme-chalk/form-item.css"
// import "element-ui/lib/theme-chalk/checkbox.css"
// import "element-ui/lib/theme-chalk/select.css"
// import "element-ui/lib/theme-chalk/option.css"
// import "element-ui/lib/theme-chalk/input.css"
// import "element-ui/lib/theme-chalk/button.css"
//
// import Dialog from 'element-ui/lib/dialog'
// import Message from 'element-ui/lib/message'
// import Tooltip from 'element-ui/lib/tooltip'
// import Form from 'element-ui/lib/form'
// import FormItem from 'element-ui/lib/form-item'
// import Checkbox from 'element-ui/lib/checkbox'
// import Select from 'element-ui/lib/select'
// import Option from 'element-ui/lib/option'
// import Input from 'element-ui/lib/input'
// import Button from 'element-ui/lib/button'
//
// export default {
//   install: function(Vue) {
//     Vue.use(Dialog)
//     Vue.use(FormItem)
//     Vue.use(Checkbox)
//     Vue.use(Form)
//     Vue.use(Select)
//     Vue.use(Option)
//     Vue.use(Input)
//     Vue.use(Button)
//     Vue.use(Tooltip)
//
//     Vue.prototype.$message = Message
//   }
// }

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export default {
  install: function(Vue) {
    const isCN = window.FreelogApp.Env.leaguage === 'zh-CN'
    Vue.use(ElementUI, { locale: isCN ? zhLocale : enLocale })
  }
}

