interface GetUrlOfBindingWechatParams {
  returnUrl: string;
  state: string;
}

export function getUrlOfBindingWechat({ returnUrl, state }: GetUrlOfBindingWechatParams) {
  const isProdEnv = self.location.origin.includes('.freelog.com');
  const redirect_uri = encodeURIComponent(`https://api.freelog.com${isProdEnv ? '' : '/test'}/v2/thirdParty/weChat/bindHandle?returnUrl=${returnUrl}`);
  return `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
}
