import request from '@/utils/request';

// 查询合同分页列表
export interface ContractsParamsType {
  page?: number;
  pageSize?: number;
  identityType: 1 | 2;
  licensorId?: string;
  licenseeId?: string;
  subjectIds?: string;
  subjectType?: number;
  isDefault?: number;
  keywords?: string;
  status?: 2 | 4 | 6;
  order?: string;
  licenseeIdentityType?: number;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
}

export function contracts(params: ContractsParamsType) {
  return request.get('/v2/contracts', {
    params,
  });
}

// 批量查询合同列表
export interface BatchContractsParamsType {
  contractIds?: string;
  subjectIds?: string;
  identityType?: 1 | 2;
  subjectType?: 1 | 2 | 3;
  licenseeIdentityType?: 1 | 2 | 3;
  licensorId?: string;
  licenseeId?: string | number;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
}

export function batchContracts(params: BatchContractsParamsType) {
  return request.get('/v2/contracts/list', {
    params,
  });
}
