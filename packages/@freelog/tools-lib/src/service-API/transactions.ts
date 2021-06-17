import FUtil from '../utils';

// 分页查询账户交易流水
interface DetailsParamsType {
  accountId: string;
  skip?: number;
  limit?: number;
}

export function details({accountId, ...params}: DetailsParamsType) {
  // return FUtil.Axios.get(`/v2/transactions/details/${accountId}`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/transactions/details/${accountId}`,
    params: params,
  });
}

// 查看用户个人账户信息
interface IndividualAccountsParamsType {
  userId: number;
}

export function individualAccounts({userId, ...params}: IndividualAccountsParamsType) {
  // return FUtil.Axios.get(`/v2/accounts/individualAccounts/${userId}`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/accounts/individualAccounts/${userId}`,
    params: params,
  });
}

// 激活个人账户
interface ActivateIndividualAccountsParamsType {
  password: string;
}

export function activateIndividualAccounts({...params}: ActivateIndividualAccountsParamsType) {
  // return FUtil.Axios.put(`/v2/accounts/individualAccounts/activate`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/accounts/individualAccounts/activate`,
    data: params,
  });
}

// 修改交易密码
interface ChangePasswordParamsType {
  password: string;
  oldPassword: string;
}

export function changePassword({...params}: ChangePasswordParamsType) {
  // return FUtil.Axios.put(`/v2/accounts/individualAccounts`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/accounts/individualAccounts`,
    data: params,
  });
}
