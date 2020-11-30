import request from '@/utils/request';

// 收藏资源
export interface CollectResourceParamsType {
  resourceId: string;
}

export function collectResource(params: CollectResourceParamsType) {
  return request.post('/v2/collections/resources', params);
}

// 查看收藏的资源列表
export interface CollectionResourcesParamsType {
  // page?: number;
  // pageSize?: number;
  keywords?: number;
  resourceType?: number;
  resourceStatus?: number;
}

export function collectionResources(params: CollectionResourcesParamsType) {
  return request.get('/v2/collections/resources', {
    params
  });
}

// 删除收藏的资源
export interface DeleteCollectResourceParamsType {
  resourceId: string;
}

export function deleteCollectResource({resourceId}: DeleteCollectResourceParamsType) {
  return request.delete(`/v2/collections/resources/${resourceId}`);
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

// 查询资源总收藏数量
export interface CollectedCountParamsType {
  resourceId: string;
}

export function collectedCount({resourceId}: CollectedCountParamsType) {
  return request.get(`/v2/collections/resources/${resourceId}/count`);
}
