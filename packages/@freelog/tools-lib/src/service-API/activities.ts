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
