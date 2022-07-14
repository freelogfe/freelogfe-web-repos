import FUtil from '../utils';

// 查看邀请码详情
interface CodeDetails1ParamsType {
  code: string;
}

interface CodeDetails2ParamsType {
}

export function codeDetails1({code}: CodeDetails1ParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/testQualifications/beta/codes/${code}`,
    // data: params,
  });
}

export function codeDetails2({}: CodeDetails2ParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/testQualifications/beta/codes/userActivateCode`,
    // data: params,
  });
}

// 使用邀请码激活内测资格
interface BetaCodesActivateParamsType {
  code: string;
}

export function betaCodesActivate({...params}: BetaCodesActivateParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/testQualifications/beta/codes/activate`,
    data: params,
  });
}

// 分页查看邀请码使用记录
interface UsedRecordsParamsType {
  skip?: number;
  limit?: number;
  code?: string;
  keywords?: string;
}

export function usedRecords({...params}: UsedRecordsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testQualifications/beta/codes/usedRecords`,
    params: params,
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
    url: `/v2/testQualifications/beta/apply`,
    data: params,
  });
}

// 查看内测资格申请详情
interface GetBetaApply1ParamsType {

}

export function getBetaApply1({...params}: GetBetaApply1ParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testQualifications/beta/apply/current`,
    params: params,
  });
}

interface GetBetaApply2ParamsType {
  recordId: string;
}

export function getBetaApply2({recordId, ...params}: GetBetaApply2ParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testQualifications/beta/apply/${recordId}`,
    data: params,
  });
}
