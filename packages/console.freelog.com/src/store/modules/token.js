const types = {
  CHECK_TOKEN: 'checkToken'
}

const token = {
  state: {},

  mutations: {},

  actions: {
    [types.CHECK_TOKEN]({ getters }) {
      return new Promise((resolve) => {
        const ignore = (window.location.hostname === 'localhost') && (process.env.NODE_ENV === 'development')
        if (ignore) {
          resolve(false)
        } else if (getters.session.user && getters.session.user.userId) {
          resolve(true)
        } else {
          this.dispatch('getCurrentUser').then((data) => {
            resolve(!!data)
          })
        }
      })
    }
  }
}

export default token
