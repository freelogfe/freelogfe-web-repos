import { ElemnetUI } from '@freelog/freelog-common-lib'

export default (Vue) => {
  const Error = {
    showErrorMessage: (err) => {
      if (!err) {
        return
      }

      console.error(err)
      let msg
      if (typeof err === 'string') {
        msg = err
      } else if (err.response && err.response.errorMsg) {
        msg = err.response.errorMsg
      } else if (err.message) {
        msg = err.message
      } else if (err.msg) {
        msg = err.msg
      } else if (err.data && err.data.msg) {
        msg = err.data.msg
      } else {
        msg = err.toString()
      }
      ElemnetUI.Message.error(msg)
    }
  }
  Object.defineProperties(Vue.prototype, {
    $error: {
      get() {
        return Error
      }
    }
  })
}

