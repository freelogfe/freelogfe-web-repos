import request from '@/utils/request';

// 查看收藏的资源列表
export interface ResourceListParamsType {
  page?: number;
  pageSize?: number;
  keywords?: number;
  resourceType?: number;
  resourceStatus?: number;
}

export function resourceList(params: ResourceListParamsType) {
  return request.get('/v2/collections/resources', {
    params
  });
}

// 批量查询资源是否收藏
export interface IsCollectedParamsType {
  resourceIds: string;
}

export function isCollected(params: IsCollectedParamsType) {
  return request.get('/v2/collections/resources/isCollected', {
    params
  });
}
