import FUtil from '../utils';

// 分页查询账户交易流水
interface DetailsParamsType {
  accountId: string;
  skip?: number;
  limit?: number;
}

export function details({accountId, ...params}: DetailsParamsType) {
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
  return FUtil.Request({
    method: 'GET',
    url: `/v2/accounts/individualAccounts/${userId}`,
    params: params,
  });
}

// 查询交易记录详情
interface TransactionDetailsParamsType {
  recordId: string;
}

export function transactionDetails({recordId}: TransactionDetailsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/transactions/records/${recordId}`,
    // params: params,
  });
}

// 激活个人账户
interface ActivateIndividualAccountsParamsType {
  password: string;
  authCode: string;
  messageAddress: string;
}

export function activateIndividualAccounts({...params}: ActivateIndividualAccountsParamsType) {
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
  authCode: string;
  messageAddress: string;
}

export function changePassword({...params}: ChangePasswordParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/accounts/individualAccounts`,
    data: params,
  });
}

// 重置交易密码
interface ResetPasswordParamsType {
  loginPassword: string;
  password: string;
  authCode: string;
  messageAddress: string;
}

export function resetPassword({...params}: ResetPasswordParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/accounts/individualAccounts/resetPassword`,
    data: params,
  });
}

// 验证交易密码
interface VerifyTransactionPasswordParamsType {
  password: string;
}

export function verifyTransactionPassword({...params}: VerifyTransactionPasswordParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/accounts/individualAccounts/verifyTransactionPassword`,
    params: params,
  });
}
