import FUtil from '../utils';

interface ContractDetailsParamsType {
  contractId: string;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
}

export function contractDetails({contractId, ...params}: ContractDetailsParamsType) {
  // return FUtil.Axios.get(`/v2/contracts/${contractId}`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/contracts/${contractId}`,
    params: params,
  });
}

// 查询合同分页列表
interface ContractsParamsType {
  skip?: number;
  limit?: number;
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
  // return FUtil.Axios.get('/v2/contracts', {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/contracts`,
    params: params,
  });
}

// 批量查询合同列表
interface BatchContractsParamsType {
  contractIds?: string;
  subjectIds?: string;
  subjectType?: 1 | 2 | 3;
  licenseeIdentityType?: 1 | 2 | 3;
  licensorId?: string;
  licenseeId?: string | number;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
}

export function batchContracts(params: BatchContractsParamsType) {
  // return FUtil.Axios.get('/v2/contracts/list', {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/contracts/list`,
    params: params,
  });
}

// 查看合同流转记录分页列表
interface TransitionRecordsParamsType {
  skip?: number;
  limit?: number;
  contractId: string;
}

export function transitionRecords({contractId, ...params}: TransitionRecordsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/contracts/${contractId}/transitionRecords`,
    params: params,
  });
}
