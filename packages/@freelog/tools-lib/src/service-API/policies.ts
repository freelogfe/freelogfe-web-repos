import FUtil from '../utils';

// 批量获取授权策略列表
interface PoliciesParamsType {
  page?: number;
  pageSize?: number;
  subjectType?: 1 | 2 | 3; // 1:资源 2:展品 3:用户组
  projection?: string;
}

export function policies(params: PoliciesParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/policies`,
    params: params,
  });
}

// 批量获取授权策略列表
interface PoliciesListParamsType {
  policyIds: string;
  subjectType?: number;
  userId?: number;
  projection?: string;
}

export function policiesList(params: PoliciesListParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/policies/list`,
    params: params,
  });
}

// 策略模板
interface PolicyTemplatesParamsType {
}

export function policyTemplates(params: PolicyTemplatesParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/translate/translate-config/list4Client`,
    params: params,
  });
}
