import request from '@/utils/request';

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

