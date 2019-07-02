import { axiosInstance, storage, cookieStore } from '@freelog/freelog-common-lib'

const types = {
  LOAD_CURRENT_USER: 'loadCurrentUserInfo',
  GET_CURRENT_USER_INFO: 'getCurrentUserInfo',
  CHANGE_SESSION: 'changeSession',
  USER_LOGIN: 'userLogin',
  CHECK_USER_SESSION: 'checkUserSession',
  DELETE_USER_SESSION: 'deleteUserSession',
  LOGOUT: 'userLogout',
  CHANGE_AVATAR: 'changeAvatar'
}


function resolveAvatarUrl(userId) {
  return `https://image.freelog.com/headImage/${userId}?x-oss-process=style/head-image`
}

const user = {
  state: {
    session: null // storage.get('user_session')
  },

  mutations: {
    [types.CHANGE_SESSION](state, data) {
      data.avatarUrl = resolveAvatarUrl(data.userId)
      state.session = data
      storage.set('user_session', state.session)
    },
    [types.CHANGE_AVATAR](state, data) {
      if (typeof data === 'undefined') {
        state.session.avatarUrl = `${resolveAvatarUrl(state.session.userId)}&_c=${+new Date()}`
      } else {
        state.session.avatarUrl = data
      }
    },
    [types.LOGOUT](state) {
      state.session = null
      storage.remove('user_session')
    }
  },

  actions: {
    [types.LOAD_CURRENT_USER]({ commit }, userId) {
      let promise
      if (userId) {
        promise = axiosInstance.get(`/v1/userinfos/${userId}`)
      } else {
        promise = axiosInstance.get('/v1/userinfos/current')
      }
      return promise.then((res) => {
        if (res.data.errcode === 0) {
          commit(types.CHANGE_SESSION, res.data.data)
        }
        return res.data.data
      })
    },
    [types.GET_CURRENT_USER_INFO]({ getters }) {
      return new Promise((resolve) => {
        if (getters.session) {
          resolve(getters.session)
        } else {
          this.dispatch(types.LOAD_CURRENT_USER).then((userInfo) => {
            resolve(userInfo)
          })
        }
      })
    },
    [types.CHANGE_SESSION]({ commit }, data) {
      commit(types.CHANGE_SESSION, data)
    },
    [types.CHANGE_AVATAR]({ commit }, data) {
      commit(types.CHANGE_AVATAR, data)
    },
    [types.DELETE_USER_SESSION]({ commit }) {
      commit(types.CHANGE_SESSION, null)
    },
    [types.LOGOUT]({ commit }) {
      commit(types.LOGOUT)
    },
    [types.CHECK_USER_SESSION]({ getters }) {
      const authInfo = cookieStore.get('authInfo')
      return new Promise((resolve) => {
        if (!authInfo) {
          resolve(false)
        } else {
          const jwt = authInfo.split('.')
          let userInfo = atob(jwt[1])
          try {
            userInfo = JSON.parse(userInfo)
          } catch (err) {
            console.error(err)
            userInfo = {}
          }

          // 没有登录态的，新登录的 或者已有登录态且跟当前登录态一致的，表示登录中
          resolve((!getters.session && userInfo.userId) || (getters.session && getters.session.userId === userInfo.userId))
        }
      })
    },
    [types.USER_LOGIN]({ commit }, data) {
      return axiosInstance.post('/v1/passport/login', data).then((res) => {
        if (res.data.ret === 0 && res.data.errcode === 0) {
          commit(types.CHANGE_SESSION, res.data.data)
          return res.data.data
        }
        return Promise.reject(res.data.msg)
      })
    }
  }
}

export default user
export const mutationTypes = types
