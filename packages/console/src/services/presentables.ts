import request from '@/utils/request';

// 创建展品
export interface CreatePresentableParamsType {
  nodeId: number;
  resourceId: string;
  version: string;
  resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
  presentableName: string;
  tags?: string[];
}

export function createPresentable(params: CreatePresentableParamsType) {
  return request.post(`/v2/presentables`, params);
}

// 查看展品详情
export interface PresentableDetailsParamsType1 {
  presentableId: string;
  projection?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
}

export interface PresentableDetailsParamsType2 {
  nodeId: number;
  resourceId?: string;
  resourceName?: string;
  presentableName?: string;
  projection?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
}

export function presentableDetails(params: PresentableDetailsParamsType1 | PresentableDetailsParamsType2) {
  if ((params as PresentableDetailsParamsType2).nodeId) {
    return request.get(`/v2/presentables/detail`, {
      params,
    });
  }
  const {presentableId, ...p} = params as PresentableDetailsParamsType1;
  return request.get(`/v2/presentables/${presentableId}`, {
    params: p,
  });
}

// 查询展品分页列表
export interface PresentablesParamsType {
  nodeId: number;
  page?: number;
  pageSize?: number;
  resourceType?: string;
  omitResourceType?: string;
  onlineStatus?: number;
  tags?: string;
  projection?: string;
  keywords?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
}

export function presentables(params: PresentablesParamsType) {
  return request.get(`/v2/presentables`, {
    params,
  });
}

// 批量查询展品列表
export interface PresentableListParamsType {
  nodeId?: number;
  userId?: number;
  presentableIds?: string;
  resourceIds?: string;
  resourceNames?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
}

export function presentableList(params: PresentableListParamsType) {
  return request.get(`/v2/presentables/list`, {
    params,
  });
}
