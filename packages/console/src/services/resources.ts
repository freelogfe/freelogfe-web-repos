import request from '@/utils/request';

interface CreateParamsType {
  name: string;
  resourceType: string;
  policies?: any[];
  coverImages?: string[];
  intro?: string;
  tags?: string[];
}

export function create(params: CreateParamsType) {
  return request.post('/v2/resources', params)
}

interface UpdateParamsType {
  resourceId: string;
  intro?: string;
  tags?: string[];
  coverImages?: string[];
  policyChangeInfo?: {
    addPolicies?: {
      policyName: string;
      policyText: string;
    }[];
    updatePolicies?: {
      policyId: string;
      policyName: string;
      status: 0 | 1;
    }[];
  };
}

export function update(params: UpdateParamsType) {
  return request.put(`/v2/resources/{resourceId}`)
}

interface ListParamsType {
  page?: number;
  pageSize?: number;
  keywords?: string;
  resourceType?: string;
  isSelf?: 0 | 1;
  status?: 0 | 1 | 2;
  isLoadLatestVersionInfo?: 0 | 1;
  projection?: string;
}

export function list(params: ListParamsType) {
  return request.get('/v2/resources', {
    params,
  });
}
