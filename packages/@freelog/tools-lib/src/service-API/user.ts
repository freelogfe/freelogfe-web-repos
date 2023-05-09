import FUtil from '../utils';
import {AxiosRequestConfig} from "axios";

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
  return FUtil.Request({
    method: 'GET',
    url: '/v2/passport/logout',
    params: params,
  }, {noRedirect: true});
}

// 分页查看用户列表
interface UsersParamsType {
  skip?: number;
  limit?: number;
  keywords?: string;
}

export function users(params: UsersParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/users/search`,
    params: params,
  });
}

// 批量获取用户列表
interface BatchUserListParamsType {
  userIds: string;
}

export function batchUserList(params: BatchUserListParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/users/list`,
    params: params,
  });
}

// 获取当前登录用户信息
interface CurrentUserInfoParamsType {

}

export function currentUserInfo({}: CurrentUserInfoParamsType = {}) {
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

export function uploadHeadImg(params: UploadHeadImgParamsType, config?: AxiosRequestConfig) {

  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }

  return FUtil.Request({
    method: 'POST',
    url: `/v2/users/current/uploadHeadImg`,
    data: formData,
    ...config,
  });
}

// 修改用户详细信息
interface UpdateDetailInfoParamsType {
  areaCode?: string;
  occupation?: string;
  birthday?: string;
  sex?: 0 | 1 | 2; // 性别 0:未知 1:男 2:女
  intro?: string;
}

export function updateDetailInfo(params: UpdateDetailInfoParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/users/current/detailInfo`,
    data: params,
  });
}

// 校验当前登录用户的密码
interface VerifyLoginPasswordParamsType {
  password: string;
}

export function verifyLoginPassword(params: VerifyLoginPasswordParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/users/verifyLoginPassword`,
    params: params,
  });
}

// 获取省份列表
interface AreasProvincesParamsType {
}

export function areasProvinces(params: AreasProvincesParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/areas/provinces`,
    params: params,
  });
}

// 绑定或换绑手机号和邮箱
interface UpdateMobileOrEmailParamsType {
  oldAuthCode?: string;
  newAuthCode: string;
  newLoginName: string;
}

export function updateMobileOrEmail(params: UpdateMobileOrEmailParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/users/current/mobileOrEmail`,
    data: params,
  });
}

// 非登录用户绑定与自动注册流程
interface RegisterOrBindParamsType {
  loginName: string;
  password: string;
  identityId: string;
}

export function registerOrBind(params: RegisterOrBindParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/thirdParty/registerOrBind`,
    data: params,
  }, {noRedirect: true});
}

// 登录用户解绑第三方登录
interface ThirdPartyUnbindParamsType {
  thirdPartyType: string;
  password: string;
}

export function thirdPartyUnbind(params: ThirdPartyUnbindParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/thirdParty/unbind`,
    data: params,
  });
}

// 查询登录用户已绑定的第三方信息
interface ThirdPartyListParamsType {
}

export function thirdPartyList(params: ThirdPartyListParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/thirdParty/list`,
    params: params,
  });
}

// 查询用户名称是否绑定了微信号
interface ThirdPartyIsBindParamsType {
  username: string;
  thirdPartyType: string;
}

export function thirdPartyIsBind(params: ThirdPartyIsBindParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/thirdParty/isBind`,
    params: params,
  });
}

// 签到
export function signForCoins() {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/sign`,
  });
}

// 查询签到信息
export function getSignInfo() {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/signInfo`,
  });
}
