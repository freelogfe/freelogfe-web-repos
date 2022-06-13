import FUtil from '../utils';

// 使用邀请码激活内测资格
interface BetaCodesActivateParamsType {
  codes: string;
}

export function betaCodesActivate({...params}: BetaCodesActivateParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: '/v2/testQualifications/beta/codes/activate',
    data: params,
  });
}

// 用户申请内测资格
interface BetaApplyParamsType {
  // province: string;
  // city: string;
  areaCode: string;
  occupation: string;
  description: string;
}

export function betaApply({...params}: BetaApplyParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: '/v2/testQualifications/beta/apply',
    data: params,
  });
}
