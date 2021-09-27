import FUtil from '../utils';

// 发送短信或邮件验证码
interface SendVerificationCodeParamsType {
  loginName: string;
  authCodeType: 'register' | 'resetPassword' | 'activateTransactionAccount' | 'updateTransactionAccountPwd' | 'updateMobileOrEmail';
}

export function sendVerificationCode(params: SendVerificationCodeParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/messages/send`,
    data: params,
  });
}

// 校验短信或邮件验证码
interface VerifyVerificationCodeParamsType {
  authCode: string;
  address: string;
  authCodeType: 'register' | 'resetPassword' | 'activateTransactionAccount' | 'updateTransactionAccountPwd' | 'updateMobileOrEmail';
}

export function verifyVerificationCode(params: VerifyVerificationCodeParamsType): Promise<any> {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/messages/verify`,
    params: params,
  });
}
