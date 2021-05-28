import request from '@/utils/request';

// 分页查询账户交易流水
interface DetailsParamsType {
  accountId: string;
  skip?: number;
  limit?: number;
}

export function details({accountId, ...params}: DetailsParamsType) {
  return request.get(`/v2/transactions/details/${accountId}`, {
    params,
  });
}

// 查看用户个人账户信息
interface IndividualAccountsParamsType {
  userId: number;
}

export function individualAccounts({userId, ...params}: IndividualAccountsParamsType) {
  return request.get(`/v2/accounts/individualAccounts/${userId}`, {
    params,
  });
}

// 激活个人账户
interface ActivateIndividualAccountsParamsType {
  password: string;
}

export function activateIndividualAccounts({...params}: ActivateIndividualAccountsParamsType) {
  return request.put(`/v2/accounts/individualAccounts/activate`, params);
}
