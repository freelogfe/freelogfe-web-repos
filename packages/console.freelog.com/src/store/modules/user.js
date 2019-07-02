import {axios} from '@/lib/index'
import {cookieStore, sessionStore} from '@/lib'
import {UserService, OtherService} from '../../services'

const types = {
  GET_CURRENT_USER: 'getCurrentUser',
  CHANGE_SESSION: 'changeSession',
  DELETE_SESSION: 'deleteSession',
  USER_LOGIN: 'userLogin',
  USER_LOGOUT: 'userLogout',
  CHECK_USER_SESSION: 'checkUserSession',
  CHANGE_AVATAR: 'changeAvatar',
  GET_CURRENT_USER_INFO: 'getCurrentUserInfo'
}


function resolveAvatarUrl(userId) {
  return `https://image.freelog.com/headImage/${userId}?x-oss-process=style/head-image`
}

function getUserInfoFromCookie() {
  var authInfo = cookieStore.get('authInfo') || ''
  var userInfo = {}
  if (authInfo) {
    try {
      const jwt = authInfo.split('.')
      userInfo = atob(jwt[1])
      userInfo = JSON.parse(userInfo)

      Object.keys(userInfo).forEach(key=>{
        if (['userName', 'nickname'].includes(key)) {
          userInfo[key] = decodeURIComponent(userInfo[key])
        }
      })
    } catch (err) {
      console.error(err)
      userInfo = {}
    }
  }
  return userInfo
}

const user = {
  state: {
    session: {user: getUserInfoFromCookie(), token: null},
  },

  mutations: {
    [types.CHANGE_SESSION](state, data) {
      Object.assign(state.session, data)
      sessionStore.set('user_session', state.session)
    },
    [types.DELETE_SESSION](state) {
      state.session = {user: {}, token: null}
      sessionStore.remove('user_session')
    },
    [types.CHANGE_AVATAR](state, avatarUrl) {
      state.session.user.avatarUrl = avatarUrl
      sessionStore.remove('user_session')
    }
  },

  actions: {
    [types.CHANGE_AVATAR]({commit, getters}, data) {
      var avatarUrl
      if (typeof data === 'undefined') {
        avatarUrl = `${resolveAvatarUrl(getters.session.user.userId)}&_c=${+new Date()}`
      } else {
        avatarUrl = data
      }
      commit(types.CHANGE_AVATAR, avatarUrl)
    },
    [types.GET_CURRENT_USER]({commit}, userId) {
      let promise
      if (userId) {
        promise = UserService.get(userId)
      } else {
        promise = axios.get('/v1/userinfos/current')
      }

      return promise.then((res) => {
        if (res.data.errcode === 0) {
          commit(types.CHANGE_SESSION, {user: res.data.data})
        }
        return res.data.data
      })
    },
    [types.GET_CURRENT_USER_INFO]({getters}) {
      return new Promise(resolve=>{
        const userInfo = getters.session.user
        if (userInfo && userInfo.userId) {
           resolve(userInfo)
        } else {
          resolve(null)
        }
      })
    },
    [types.CHANGE_SESSION]({commit}, data) {
      commit(types.CHANGE_SESSION, data)
    },
    [types.CHECK_USER_SESSION]({getters}) {
      const session = getters.session
      let userId = cookieStore.get('uid') || ''
      return new Promise((resolve) => {
        var logined
        if (userId) {
          logined = !!(session && session.user && session.user.userId === userId)
        } else {
          logined = !!(session && session.user && session.user.userId)
        }

        resolve(logined)
      })
    },
    [types.USER_LOGIN]({commit}, data) {
      return OtherService.login(data).then((res) => {
        if (res.data.ret === 0 && res.data.errcode === 0) {
          const token = res.headers.authorization
          commit(types.CHANGE_SESSION, {user: res.data.data, token})
          return res.data.data
        }
        return Promise.reject(res.data.msg)
      })
    },
    [types.USER_LOGOUT]({commit}) {
      return OtherService.logout().then((res) => {
        if (res.data.ret === 0 && res.data.errcode === 0) {
          commit(types.DELETE_SESSION)
        } else {
          throw new Error(res.data.msg)
        }
      })
    }
  }
}

export default user
export const mutationTypes = types
