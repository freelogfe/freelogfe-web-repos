import FUtil from '../utils';

// 查看合同详情
interface ContractDetailsParamsType {
  contractId: string;
  isLoadPolicyInfo?: 0 | 1;
  projection?: string;
  isTranslate?: 0 | 1;
}

export function contractDetails({contractId, ...params}: ContractDetailsParamsType) {
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
  subjectType?: 1 | 2 | 3;
  isDefault?: number;
  keywords?: string;
  status?: 0 | 1 | 2; // 合同状态 0:生效中 1:已终止 2:异常的
  authStatus?: 1 | 2 | 128; // 合同授权状态 1:正式授权 2:测试授权 128:未获得授权,多个通过'与'运算
  order?: 'asc' | 'desc'; // asc:正序 desc:倒序
  licenseeIdentityType?: number;
  isLoadPolicyInfo?: 0 | 1;
  isTranslate?: 0 | 1;
  startDate?: string;
  endDate?: string;
  projection?: string;
}

export function contracts(params: ContractsParamsType) {
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
  isTranslate?: 0 | 1;
}

export function batchContracts(params: BatchContractsParamsType) {
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
