import FUtil from '../utils';

// 发送短信或邮件验证码
interface SendVerificationCodeParamsType {
  loginName: string;
  authCodeType: 'register' | 'resetPassword' | 'activateTransactionAccount' | 'updateTransactionAccountPwd';
}

export function sendVerificationCode(params: SendVerificationCodeParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/messages/send`,
    data: params,
  });
}
