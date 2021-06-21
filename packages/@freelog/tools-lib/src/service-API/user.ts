import FUtil from '../utils';

// 用户登录
interface LoginParamsType {
  loginName: string;
  password: string;
  isRemember?: 0 | 1;
  returnUrl?: string;
  jwtType?: string;
}

export function login({...params}: LoginParamsType) {
  // return FUtil.Axios.post(`/v2/passport/login`, params);
  return FUtil.Request({
    method: 'POST',
    url: '/v2/passport/login',
    data: params,
  }, {noRedirect: true});
}

// 用户登出
interface LogoutParamsType {
  returnUrl?: string;
}

export function logout({...params}: LogoutParamsType = {}) {
  // return FUtil.Axios.get(`/passport/logout`, {
  //   params,
  // });
  FUtil.Request({
    method: 'GET',
    url: '/v2/passport/logout',
    params: params,
  }, {noRedirect: true});
}

// 获取当前登录用户信息
// interface CurrentUserInfoParamsType {

// }

export function currentUserInfo() {
  // return FUtil.Axios.get(`/v1/userinfos/current`);
  FUtil.Request({
    method: 'GET',
    url: '/v2/users/current',
    // params: params,
  });
}
