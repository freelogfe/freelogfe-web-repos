import FUtil from '../utils';

// 创建展品
export interface CreatePresentableParamsType {
  nodeId: number;
  resourceId: string;
  version: string;
  resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
  presentableName: string;
  tags?: string[];
  policies?: {
    policyName: string;
    policyText: string;
    status?: 0 | 1;
  }[];
}

export function createPresentable(params: CreatePresentableParamsType) {
  // return FUtil.Axios.post(`/v2/presentables`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v2/presentables`,
    data: params,
  });
}

// 更新展品
interface UpdatePresentableParamsType {
  presentableId: string;
  presentableTitle?: string;
  presentableIntro?: string;
  tags?: string[];
  coverImages?: string[];
  addPolicies?: {
    policyName: string;
    policyText: string;
    status?: 0 | 1;
  }[];
  updatePolicies?: {
    policyId: string;
    status: 0 | 1;
  }[];
  resolveResources?: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
}

export function updatePresentable({presentableId, ...params}: UpdatePresentableParamsType) {
  // return FUtil.Axios.put(`/v2/presentables/${presentableId}`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/presentables/${presentableId}`,
    data: params,
  });
}

// 上下线presentable
interface PresentablesOnlineParamsType {
  presentableId: string;
  onlineStatus: 0 | 1;
  updatePolicies?: {
    policyId: string;
    status: 0 | 1;
  }
}

export function presentablesOnlineStatus({presentableId, ...params}: PresentablesOnlineParamsType) {
  // return FUtil.Axios.put(`/v2/presentables/${presentableId}/onlineStatus`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/presentables/${presentableId}/onlineStatus`,
    data: params,
  });
}

// 查看展品详情
interface PresentableDetailsParamsType1 {
  presentableId: string;
  projection?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  isTranslate?: 0 | 1;
  isLoadCustomPropertyDescriptors?: 0 | 1;
  isLoadResourceDetailInfo?: 0 | 1;
  isLoadResourceVersionInfo?: 0 | 1;
}

interface PresentableDetailsParamsType2 {
  nodeId: number;
  resourceId?: string;
  resourceName?: string;
  presentableName?: string;
  projection?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  isLoadCustomPropertyDescriptors?: 0 | 1;
}

export function presentableDetails(params: PresentableDetailsParamsType1 | PresentableDetailsParamsType2) {
  if ((params as PresentableDetailsParamsType2).nodeId) {
    // return FUtil.Axios.get(`/v2/presentables/detail`, {
    //   params,
    // });
    return FUtil.Request({
      method: 'GET',
      url: `/v2/presentables/detail`,
      params: params,
    });
  }
  const {presentableId, ...p} = params as PresentableDetailsParamsType1;
  // return FUtil.Axios.get(`/v2/presentables/${presentableId}`, {
  //   params: p,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables/${presentableId}`,
    params: p,
  });
}

// 查询展品分页列表
interface PresentablesParamsType {
  nodeId: number;
  skip?: number;
  limit?: number;
  resourceType?: string;
  resourceTypeCode?: string;
  omitResourceType?: string;
  onlineStatus?: number;
  tags?: string;
  projection?: string;
  keywords?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
}

export function presentables(params: PresentablesParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables`,
    params: params,
  });
}

// 批量查询展品列表
interface PresentableListParamsType {
  nodeId?: number;
  userId?: number;
  presentableIds?: string;
  resourceIds?: string;
  resourceNames?: string;
  isLoadVersionProperty?: 0 | 1;
  isLoadPolicyInfo?: 0 | 1;
  isTranslate?: 0 | 1;
  projection?: string;
  resolveResourceIds?: string;
}

export function presentableList(params: PresentableListParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables/list`,
    params: params,
  });
}

// 查看展品依赖树
interface DependencyTreeParamsType {
  presentableId: string;
  maxDeep?: number;
  nid?: string;
  isContainRootNode?: boolean;
  version?: string;
}

export function dependencyTree({presentableId, ...params}: DependencyTreeParamsType) {
  // return FUtil.Axios.get(`/v2/presentables/${presentableId}/dependencyTree`, {params});
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables/${presentableId}/dependencyTree`,
    params: params,
  });
}

// 查看展品关系树
interface RelationTreeParamsType {
  presentableId: string;
  version?: string;
}

export function relationTree({presentableId, ...params}: RelationTreeParamsType) {
  // return FUtil.Axios.get(`/v2/presentables/${presentableId}/relationTree`, {params});
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables/${presentableId}/relationTree`,
    params: params,
  });
}

// 查看展品授权树
interface AuthTreeParamsType {
  presentableId: string;
  maxDeep?: number;
  nid?: string;
  isContainRootNode?: boolean;
  version?: string;
}

export function authTree({presentableId, ...params}: AuthTreeParamsType) {
  // return FUtil.Axios.get(`/v2/presentables/${presentableId}/authTree`, {params});
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables/${presentableId}/authTree`,
    params: params,
  });
}

// 切换展品版本
interface PresentablesVersionParamsType {
  presentableId: string;
  version: string;
}

export function presentablesVersion({presentableId, ...params}: PresentablesVersionParamsType) {
  // return FUtil.Axios.put(`/v2/presentables/${presentableId}/version`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/presentables/${presentableId}/version`,
    data: params,
  });
}

// 设置展品自定义属性
interface UpdateRewritePropertyParamsType {
  presentableId: string;
  rewriteProperty: {
    key: string;
    value: string;
    remark: string;
  }[];
}

export function updateRewriteProperty({presentableId, ...params}: UpdateRewritePropertyParamsType) {
  // return FUtil.Axios.put(`/v2/presentables/${presentableId}/rewriteProperty`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/presentables/${presentableId}/rewriteProperty`,
    data: params,
  });
}

// 批量获取展品授权结果
interface BatchAuthParamsType {
  nodeId: number;
  authType: 1 | 2 | 3; // 1:节点侧授权 2:资源侧授权 3:节点+资源侧授权
  presentableIds: string;
}

export function batchAuth({nodeId, ...params}: BatchAuthParamsType) {
  // return FUtil.Axios.get(`/v2/auths/presentables/nodes/${nodeId}/batchAuth/result`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/auths/presentables/nodes/${nodeId}/batchAuth/result`,
    params: params,
  });
}

// 查看合约应用的展品列表
interface ContractAppliedPresentableParamsType {
  nodeId: number;
  contractIds: string;
}

export function contractAppliedPresentable({nodeId, ...params}: ContractAppliedPresentableParamsType) {
  // return FUtil.Axios.get(`/v2/presentables/${nodeId}/contractAppliedPresentable`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/presentables/${nodeId}/contractAppliedPresentable`,
    params: params,
  });
}
