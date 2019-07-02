/**
 * 各种杂七杂八的接口
 */

import { axios } from '@/lib'

const apis = {
  login(options) {
    return axios.post('/v1/passport/login', options)
  },
  logout(options) {
    return axios.get('/v1/passport/logout', options)
  },
  resetPassword(options) {
    return axios.post('/v1/userinfos/resetPassword', options)
  },
  register(options) {
    return axios.post('/v1/userinfos/register', options)
  }
}
export default apis
