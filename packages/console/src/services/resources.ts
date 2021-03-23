import request, {apiHost} from '@/utils/request';

// 创建资源
export interface CreateParamsType {
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

// 更新资源信息
export interface UpdateParamsType {
  resourceId: string;
  intro?: string;
  tags?: string[];
  coverImages?: string[];
  addPolicies?: {
    policyName: string;
    policyText: string;
    status?: 0 | 1; // 1:上线 0:下线
  }[];
  updatePolicies?: {
    policyId: string;
    status: 0 | 1; // 0:下线策略 1:上线策略
  }[];
}

export function update(params: UpdateParamsType) {
  return request.put(`/v2/resources/${params.resourceId}`, params);
}

// 查看资源分页列表
export interface ListParamsType {
  skip?: number;
  limit?: number;
  keywords?: string;
  resourceType?: string;
  omitResourceType?: string;
  isSelf?: 0 | 1;
  status?: 0 | 1 | 2;
  startResourceId?: string;
  isLoadPolicyInfo?: 0 | 1;
  isLoadLatestVersionInfo?: 0 | 1;
  projection?: string;
}

export function list(params: ListParamsType) {
  return request.get('/v2/resources', {
    params,
  });
}

// 查看单个资源详情
export interface InfoParamsType {
  resourceIdOrName: string;
  isLoadPolicyInfo?: 0 | 1;
  isLoadLatestVersionInfo?: 0 | 1;
  projection?: string;
}

export function info({resourceIdOrName, ...params}: InfoParamsType) {
  return request.get(`/v2/resources/${encodeURIComponent(resourceIdOrName)}`, {
    params: params,
  });
}

// 批量查询资源列表
export interface BatchInfoParamsType {
  resourceIds?: string;
  resourceNames?: string;
  isLoadPolicyInfo?: 0 | 1;
  isLoadLatestVersionInfo?: 0 | 1;
  projection?: string;
}

export function batchInfo(params: BatchInfoParamsType) {
  return request.get(`/v2/resources/list`, {
    params: params,
  });
}

// 查看资源的依赖树
export interface DependencyTreeParamsType {
  resourceId: string;
  version?: string;
  maxDeep?: string;
  omitFields?: string;
  isContainRootNode?: boolean;
}

export function dependencyTree({resourceId, ...params}: DependencyTreeParamsType) {
  return request.get(`/v2/resources/${resourceId}/dependencyTree`, {
    params: params,
  });
}

// 创建资源版本
export interface CreateVersionParamsType {
  resourceId: string;
  version: string;
  fileSha1: string;
  filename: string;
  description?: string;
  dependencies?: {
    resourceId: string;
    versionRange: string;
  }[];
  customPropertyDescriptors?: {
    key: string;
    defaultValue: string;
    type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
    candidateItems?: string[];
    remark?: string;
  }[];
  baseUpcastResources?: {
    resourceId: string;
  }[];
  resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
}

export function createVersion({resourceId, ...params}: CreateVersionParamsType) {
  return request.post(`/v2/resources/${resourceId}/versions`, params);
}

// 查看资源版本信息
export interface ResourceVersionInfoParamsType1 {
  resourceId: string;
  version: string;
  projection?: string;
}

export interface ResourceVersionInfoParamsType2 {
  versionId: string;
  projection?: string;
}

export function resourceVersionInfo(params: ResourceVersionInfoParamsType1 | ResourceVersionInfoParamsType2) {
  // console.log('####!AAA');
  if ((params as ResourceVersionInfoParamsType1).version) {
    return request.get(`/v2/resources/${(params as ResourceVersionInfoParamsType1).resourceId}/versions/${(params as ResourceVersionInfoParamsType1).version}`, {
      params: {
        projection: params.projection,
      }
    });
  }

  return request.get(`/v2/resources/versions/detail`, {
    params,
  });
}

// 根据sha1查询版本列表 (查询文件对象所挂载的资源及版本)
export interface GetResourceVersionBySha1ParamsType {
  fileSha1: string;
  projection?: string;
}

export function getResourceVersionBySha1({fileSha1, ...params}: GetResourceVersionBySha1ParamsType) {
  return request.get(`/v2/resources/files/${fileSha1}/versions`, {
    params,
  });
}

// 根据sha1查询资源列表 (查询文件对象所挂载的资源)
export interface GetResourceBySha1ParamsType {
  fileSha1: string;
  projection?: string;
}

export function getResourceBySha1({fileSha1, ...params}: GetResourceBySha1ParamsType) {
  return request.get(`/v2/resources/files/${fileSha1}`, {
    params,
  });
}

// 更新资源版本信息
export interface UpdateResourceVersionInfoParamsType {
  version: string;
  resourceId: string;
  description?: string;
  customPropertyDescriptors?: {
    key: string;
    defaultValue: string;
    type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
    candidateItems?: string[];
    remark?: string;
  }[];
  resolveResources?: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
}

export function updateResourceVersionInfo(params: UpdateResourceVersionInfoParamsType) {
  return request.put(`/v2/resources/${params.resourceId}/versions/${params.version}`, params);
}

// 保存或者更新资源版本草稿
export interface SaveVersionsDraftParamsType {
  resourceId: string;
  draftData: any;
}

export function saveVersionsDraft(params: SaveVersionsDraftParamsType) {
  return request.post(`/v2/resources/${params.resourceId}/versions/drafts`, params);
}

// 查看资源版本草稿
export interface LookDraftParamsType {
  resourceId: string;
}

export function lookDraft(params: LookDraftParamsType) {
  return request.get(`/v2/resources/${params.resourceId}/versions/drafts`);
}

// 校验文件是否被引入资源
export interface ResourceIsUsedByOtherParamsType {
  fileSha1: string;
}

export function resourceIsUsedByOther(params: ResourceIsUsedByOtherParamsType) {
  return request.get(`/v2/resources/versions/isCanBeCreate`, {
    params,
  });
}

// 下载资源文件
export interface ResourcesDownloadParamsType {
  resourceId: string;
  version: string;
}

export function resourcesDownload(params: ResourcesDownloadParamsType) {
  return window.location.href = apiHost + `/v2/resources/${params.resourceId}/versions/${params.version}/download`;
  // return request.get(`/v2/resources/${params.resourceId}/versions/${params.version}/download`, {
  //   responseType: 'arraybuffer',
  // });
}

// 批量查看合同覆盖的版本集
export interface BatchGetCoverageVersionsParamsType {
  resourceId: string;
  contractIds: string;
}

export function batchGetCoverageVersions({resourceId, ...params}: BatchGetCoverageVersionsParamsType) {
  return request.get(`/v2/resources/${resourceId}/contracts/coverageVersions`, {
    params,
  });
}

// 查询资源所解决的依赖集
export interface ResolveResourcesParamsType {
  resourceId: string;
}

export function resolveResources(params: LookDraftParamsType) {
  return request.get(`/v2/resources/${params.resourceId}/resolveResources`);
}

// 批量设置策略应用的版本
export interface BatchSetContractsParamsType {
  resourceId: string;
  subjects: {
    subjectId: string;
    versions: {
      version: string;
      policyId: string;
      operation: 0 | 1;
    }[];
  }[];
}

export function batchSetContracts({resourceId, subjects}: BatchSetContractsParamsType) {
  return request.put(`/v2/resources/${resourceId}/versions/batchSetContracts`, {subjects});
}

// 资源依赖循环性检查
export interface CycleDependencyCheckParamsType {
  resourceId: string;
  dependencies: {
    resourceId: string;
    versionRange: string;
  }[];
}

export function cycleDependencyCheck({resourceId, ...pramas}: CycleDependencyCheckParamsType) {
  return request.post(`/v2/resources/${resourceId}/versions/cycleDependencyCheck`, pramas);
}
