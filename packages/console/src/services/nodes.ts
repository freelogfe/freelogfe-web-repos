import request from '@/utils/request';

// 查看收藏的资源列表
export interface NodesParamsType {
  page?: number;
  pageSize?: number;
  status?: 0 | 1 | 2; // 0:正常 1:未审核 2:冻结
  projection?: string;
}

export function nodes(params: NodesParamsType) {
  return request.get('/v2/nodes', {
    params
  });
}

