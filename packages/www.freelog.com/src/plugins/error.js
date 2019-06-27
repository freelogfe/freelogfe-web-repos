

function showErrorMessage(err) {
  if (!err) {
    return
  }

  let msg
  if (typeof err === 'string') {
    msg = err
  } else if (err.response && err.response.errorMsg) {
    msg = err.response.errorMsg
  } else if (err.message) {
    msg = err.message
  } else if (err.msg) {
    msg = err.msg
  } else {
    msg = err.toString()
  }

  if(this.$message) {
    this.$message.error(msg)
  }else {
    console.error(msg)
  }
}

export default (Vue) => {
  Object.defineProperties(Vue.prototype, {
    $error: {
      get() {

        const Error = {
          showErrorMessage: showErrorMessage.bind(Vue.prototype)
        }
        return Error
      }
    }
  })
}

