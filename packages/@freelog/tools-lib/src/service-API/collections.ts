import FUtil from '../utils';

// 收藏资源
interface CollectResourceParamsType {
  resourceId: string;
}

export function collectResource(params: CollectResourceParamsType) {
  // return FUtil.Axios.post('/v2/collections/resources', params);
  return FUtil.Request({
    method: 'POST',
    url: `/v2/collections/resources`,
    data: params,
  });
}

// 查看收藏的资源列表
interface CollectionResourcesParamsType {
  skip?: number;
  limit?: number;
  keywords?: string;
  resourceType?: string;
  resourceTypeCode?: string;
  omitResourceType?: string;
  resourceStatus?: 0 | 1 | 2 | 4;
}

export function collectionResources(params: CollectionResourcesParamsType) {
  // return FUtil.Axios.get('/v2/collections/resources', {
  //   params
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/collections/resources`,
    params: params,
  });

}

// 删除收藏的资源
interface DeleteCollectResourceParamsType {
  resourceId: string;
}

export function deleteCollectResource({resourceId}: DeleteCollectResourceParamsType) {
  // return FUtil.Axios.delete(`/v2/collections/resources/${resourceId}`);
  return FUtil.Request({
    method: 'DELETE',
    url: `/v2/collections/resources/${resourceId}`,
    // params: params,
  });
}

// 批量查询资源是否收藏
interface IsCollectedParamsType {
  resourceIds: string;
}

export function isCollected(params: IsCollectedParamsType) {
  // return FUtil.Axios.get('/v2/collections/resources/isCollected', {
  //   params
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/collections/resources/isCollected`,
    params: params,
  });
}

// 查询资源总收藏数量
interface CollectedCountParamsType {
  resourceId: string;
}

export function collectedCount({resourceId}: CollectedCountParamsType) {
  // return FUtil.Axios.get(`/v2/collections/resources/${resourceId}/count`);
  return FUtil.Request({
    method: 'GET',
    url: `/v2/collections/resources/${resourceId}/count`,
    // params: params,
  });
}
