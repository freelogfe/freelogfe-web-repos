import FUtil from '../utils';
// import {AxiosRequestConfig, Canceler} from 'axios';

// 查询通用交易统计信息
export interface TransactionsCommonParamsType {
  ownerId: string | number;
  ownerType?: 1 | 2;
  objectId?: string;
  objectType?: 2 | 3;
  beginDate?: string;
  endDate?: string;
}

export function transactionsCommon(params: TransactionsCommonParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/statistics/transactions/common`,
    params: params,
  });
}
