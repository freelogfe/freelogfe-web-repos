import FUtil from '../utils';

// 列出活动
interface List4ClientParamsType {
  skip?: number;
  limit?: number;
}

export function list4Client(params: List4ClientParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/list4Client`,
    params: params,
  });
}

// 查询活动
interface Find4ClientParamsType {
  _id: string;
}

export function find4Client(params: Find4ClientParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/find4Client`,
    params: params,
  });
}

// 列出广告
interface AdsListParamsType {
  skip?: number;
  limit?: number;
  place: 1 | 2 | 3 | 4; //  投放位置 1：顶部公告栏 2：右侧浮窗 3：概览页 4：发现页

}

export function adsList(params: AdsListParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/ads/list4Client`,
    params: params,
  });
}

// 查询广告
interface AdsDetailsParamsType {
  skip?: number;
  limit?: number;
  place: 1 | 2 | 3 | 4; //  投放位置 1：顶部公告栏 2：右侧浮窗 3：概览页 4：发现页
}

export function adsDetails(params: AdsDetailsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/ads/find4Client`,
    params: params,
  });
}

// 获取基本任务详情
interface GetBaseTaskInfoParamsType {
}

export function getBaseTaskInfo(params: GetBaseTaskInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getBaseTaskInfo`,
    params: params,
  });
}

// 获取资源任务详情
interface GetResourceTaskInfoParamsType {
}

export function getResourceTaskInfo(params: GetResourceTaskInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getResourceTaskInfo`,
    params: params,
  });
}

// 获取节点任务详情
interface GetNodeTaskInfoParamsType {
}

export function getNodeTaskInfo(params: GetNodeTaskInfoParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/activities/facade/getNodeTaskInfo`,
    params: params,
  });
}
