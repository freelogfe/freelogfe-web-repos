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
  return FUtil.Request({
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
  return FUtil.Request({
    method: 'GET',
    url: '/v2/users/current',
    // params: params,
  });
}

// 查看用户详情
interface UserDetailsParamsType {
  mobile?: string;
  username?: string;
  email?: string;
  userId?: number;
}

export function userDetails(params: UserDetailsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/users/detail`,
    params: params,
  });
}

// 注册用户
interface LogonParamsType {
  loginName: string;
  password: string;
  username: string;
  authCode: string;
}

export function logon(params: LogonParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: '/v2/users',
    data: params,
  });
}

// 重置密码
interface ResetPasswordParamsType {
  loginName: string;
  password: string;
  authCode: string;
}

export function resetPassword({loginName, ...params}: ResetPasswordParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/users/${loginName}/resetPassword`,
    data: params,
  });
}

// 修改密码
interface UpdatePasswordParamsType {
  oldPassword: string;
  newPassword: string;
}

export function updatePassword(params: UpdatePasswordParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/users/current/updatePassword`,
    data: params,
  });
}

// 上传头像
interface UploadHeadImgParamsType {
  file: File;
}

export function uploadHeadImg(params: UploadHeadImgParamsType) {

  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }

  return FUtil.Request({
    method: 'POST',
    url: `/v2/users/current/uploadHeadImg`,
    data: params,
  });
}
