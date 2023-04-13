import FUtil from '../utils';
import {CommonReturn} from "./tools";

interface IResourceInfo {
  baseUpcastResources: {
    resourceId: string;
    resourceName: string;
  }[],
  coverImages: string[],
  createDate: string;
  intro: string;
  latestVersion: string;
  policies: {
    policyId: string;
    policyName: string;
    status: 0 | 1;
  }[];
  resourceId: string;
  resourceName: string;
  resourceType: string[];
  resourceVersions: {
    createDate: string;
    version: string;
    versionId: string;
  }[];
  status: 0 | 1 | 2 | 4; // 0:待发行(初始状态) 1:上架 2:冻结 4:下架(也叫待上架)
  tags: string[];
  updateDate: string;
  userId: number;
  username: string;
}

// 创建资源
export interface CreateParamsType {
  name: string;
  // resourceType: string[]
  resourceTypeCode: string;
  resourceTypeName?: string;
  policies?: any[];
  coverImages?: string[];
  intro?: string;
  tags?: string[];
}

export function create(params: CreateParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/resources`,
    data: params,
  });
}

// 更新资源信息
interface UpdateParamsType {
  resourceId: string;
  status?: 0 | 1;
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
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/resources/${params.resourceId}`,
    data: params,
  });
}

// 查看资源分页列表
interface ListParamsType {
  skip?: number;
  limit?: number;
  keywords?: string;
  resourceType?: string;
  omitResourceType?: string;
  isSelf?: 0 | 1;
  userId?: number;
  status?: 0 | 1 | 2 | 4; // 分别是 0:待发行(初始状态) 1:上架 2:冻结 4:下架(也叫待上架)
  isLoadPolicyInfo?: 0 | 1;
  isLoadLatestVersionInfo?: 0 | 1;
  isLoadFreezeReason?: 0 | 1;
  projection?: string;
  startCreateDate?: string;
  endCreateDate?: string;
  tags?: string;
  sort?: string;
  // startResourceId?: string;
  operationCategoryCode?: string;
}

// interface ListReturnType extends CommonReturn {
//   data: IResourceInfo[];
// }

export function list(params: ListParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources`,
    params: params,
  });
}

// 查看单个资源详情
interface InfoParamsType {
  resourceIdOrName: string;
  isLoadPolicyInfo?: 0 | 1;
  isTranslate?: 0 | 1;
  isLoadLatestVersionInfo?: 0 | 1;
  projection?: string;
  isLoadFreezeReason?: 0 | 1;
}

interface InfoReturnType extends CommonReturn {
  data: IResourceInfo
}

export function info({resourceIdOrName, ...params}: InfoParamsType): Promise<InfoReturnType> {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${encodeURIComponent(resourceIdOrName)}`,
    params: params,
  });
}

// 批量查询资源列表
interface BatchInfoParamsType {
  resourceIds?: string;
  resourceNames?: string;
  isLoadPolicyInfo?: 0 | 1;
  isTranslate?: 0 | 1;
  isLoadLatestVersionInfo?: 0 | 1;
  projection?: string;
  isLoadFreezeReason?: 0 | 1;
}

interface BatchInfoReturnType extends CommonReturn {
  data: IResourceInfo[];
}

export function batchInfo(params: BatchInfoParamsType): Promise<BatchInfoReturnType> {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/list`,
    params: params,
  });
}

// 查看资源的依赖树
interface DependencyTreeParamsType {
  resourceId: string;
  version?: string;
  maxDeep?: string;
  omitFields?: string;
  isContainRootNode?: boolean;
}

export function dependencyTree({resourceId, ...params}: DependencyTreeParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/dependencyTree`,
    params: params,
  });
}

// 查看资源的授权树
interface AuthTreeParamsType {
  resourceId: string;
  version?: string;
}

export function authTree({resourceId, ...params}: AuthTreeParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/authTree`,
    params: params,
  });
}

// 创建资源版本
interface CreateVersionParamsType {
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
    name: string;
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
  // return FUtil.Axios.post(`/v2/resources/${resourceId}/versions`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v2/resources/${resourceId}/versions`,
    data: params,
  });
}

// 查看资源版本信息
interface ResourceVersionInfo1ParamsType {
  resourceId: string;
  version: string;
  projection?: string;
}

interface ResourceVersionInfo2ParamsType {
  versionId: string;
  projection?: string;
}

export function resourceVersionInfo1({resourceId, version, ...params}: ResourceVersionInfo1ParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/versions/${version}`,
    params: params,
  });
}

export function resourceVersionInfo2(params: ResourceVersionInfo2ParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/versions/detail`,
    params: params,
  });
}

// 根据sha1查询版本列表 (查询文件对象所挂载的资源及版本)
interface GetResourceVersionBySha1ParamsType {
  fileSha1: string;
  projection?: string;
}

export function getResourceVersionBySha1({fileSha1, ...params}: GetResourceVersionBySha1ParamsType) {
  // return FUtil.Axios.get(`/v2/resources/files/${fileSha1}/versions`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/files/${fileSha1}/versions`,
    params: params,
  });
}

// 根据sha1查询资源列表 (查询文件对象所挂载的资源)
interface GetResourceBySha1ParamsType {
  fileSha1: string;
  projection?: string;
}

export function getResourceBySha1({fileSha1, ...params}: GetResourceBySha1ParamsType) {
  // return FUtil.Axios.get(`/v2/resources/files/${fileSha1}`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/files/${fileSha1}`,
    params: params,
  });
}

// 更新资源版本信息
interface UpdateResourceVersionInfoParamsType {
  version: string;
  resourceId: string;
  description?: string;
  customPropertyDescriptors?: {
    key: string;
    name: string;
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
  // return FUtil.Axios.put(`/v2/resources/${params.resourceId}/versions/${params.version}`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/resources/${params.resourceId}/versions/${params.version}`,
    data: params,
  });
}

// 保存或者更新资源版本草稿
interface SaveVersionsDraftParamsType {
  resourceId: string;
  draftData: any;
}

export function saveVersionsDraft(params: SaveVersionsDraftParamsType) {
  // return FUtil.Axios.post(`/v2/resources/${params.resourceId}/versions/drafts`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v2/resources/${params.resourceId}/versions/drafts`,
    data: params,
  });
}

// 查看资源版本草稿
interface LookDraftParamsType {
  resourceId: string;
}

export function lookDraft(params: LookDraftParamsType) {
  // return FUtil.Axios.get(`/v2/resources/${params.resourceId}/versions/drafts`);
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${params.resourceId}/versions/drafts`,
    params: params,
  });
}

// 校验文件是否被引入资源
interface ResourceIsUsedByOtherParamsType {
  fileSha1: string;
}

export function resourceIsUsedByOther(params: ResourceIsUsedByOtherParamsType) {
  // return FUtil.Axios.get(`/v2/resources/versions/isCanBeCreate`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/versions/isCanBeCreate`,
    params: params,
  });
}

// 下载资源文件
interface ResourcesDownloadParamsType {
  resourceId: string;
  version: string;
}

export function resourcesDownload(params: ResourcesDownloadParamsType) {
  return window.location.href = FUtil.Format.completeUrlByDomain('qi') + `/v2/resources/${params.resourceId}/versions/${params.version}/download`;
  // return request.get(`/v2/resources/${params.resourceId}/versions/${params.$version}/download`, {
  //   responseType: 'arraybuffer',
  // });
}

// 批量查看合同覆盖的版本集
interface BatchGetCoverageVersionsParamsType {
  resourceId: string;
  contractIds: string;
}

export function batchGetCoverageVersions({resourceId, ...params}: BatchGetCoverageVersionsParamsType) {
  // return FUtil.Axios.get(`/v2/resources/${resourceId}/contracts/coverageVersions`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/contracts/coverageVersions`,
    params: params,
  });
}

// 查询资源所解决的依赖集
interface ResolveResourcesParamsType {
  resourceId: string;
}

interface CreateVersionReturnType extends CommonReturn {
  data: {
    resourceId: string;
    resourceName: string;
    versions: {
      version: string;
      versionId: string;
      contracts: {
        policyId: string;
        contractId: string;
      }[];
    }[];
  }[];
}

export function resolveResources(params: ResolveResourcesParamsType): Promise<CreateVersionReturnType> {
  // return FUtil.Axios.get(`/v2/resources/${params.resourceId}/resolveResources`);
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${params.resourceId}/resolveResources`,
    // params: params,
  });
}

// 批量设置策略应用的版本
interface BatchSetContractsParamsType {
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

export function batchSetContracts({resourceId, ...params}: BatchSetContractsParamsType) {
  // return FUtil.Axios.put(`/v2/resources/${resourceId}/versions/batchSetContracts`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/resources/${resourceId}/versions/batchSetContracts`,
    data: params,
  });
}

// 资源依赖循环性检查
interface CycleDependencyCheckParamsType {
  resourceId: string;
  dependencies: {
    resourceId: string;
    versionRange: string;
  }[];
}

export function cycleDependencyCheck({resourceId, ...params}: CycleDependencyCheckParamsType) {
  // return FUtil.Axios.post(`/v2/resources/${resourceId}/versions/cycleDependencyCheck`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v2/resources/${resourceId}/versions/cycleDependencyCheck`,
    data: params,
  });
}

// 查看资源关系树
interface RelationTreeParamsType {
  resourceId: string;
  version?: string;
  versionRange?: string;
}

export function relationTree({resourceId, ...params}: RelationTreeParamsType) {
  // return FUtil.Axios.get(`/v2/resources/${resourceId}/relationTree`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/${resourceId}/relationTree`,
    params: params,
  });
}

// 查看含授权的资源关系树
interface RelationTreeAuthParamsType {
  resourceId: string;
  version?: string;
  versionRange?: string;
}

export function relationTreeAuth({resourceId, ...params}: RelationTreeAuthParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/auths/resources/${resourceId}/relationTreeAuth`,
    params: params,
  });
}

// 查看资源创建数量
interface ResourcesCountParamsType {
  userIds: string;
  status?: 0 | 1 | 2 | 3; // 0:下架 1:上架 2:冻结(冻结时处于下架状态) 3:冻结(冻结时处于上架状态)
}

export function resourcesCount({...params}: ResourcesCountParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/count`,
    params: params,
  });
}

// 批量查询资源授权结果
interface BatchAuthParamsType {
  resourceIds: string;
  versions?: string;
  versionRanges?: string;
}

export function batchAuth({...params}: BatchAuthParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/auths/resources/batchAuth/results`,
    params: params,
  });
}

// 批量查询资源授权结果
interface ResourcesRecommendParamsType {
  recommendType: 1 | 2; // 1: 推荐主题  2:占位主题
}

export function resourcesRecommend({...params}: ResourcesRecommendParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/recommend`,
    params: params,
  });
}

// 根据资源类型查看推荐的标签
interface AvailableTagsParamsType {
  resourceType: string;
}

export function availableTags({...params}: AvailableTagsParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/tags/availableTags`,
    params: params,
  });
}

// 列出资源类型分组排序
interface ResourceTypesParamsType {
  codeOrName?: string;
  category?: 1 | 2; // 种类 1：基础资源类型 2：自定义资源类型
}

export function resourceTypes({...params}: ResourceTypesParamsType = {}) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/resources/types/listSimpleByGroup`,
    params: params,
  });
}
