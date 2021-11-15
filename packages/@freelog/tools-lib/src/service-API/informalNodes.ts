import FUtil from '../utils';

// 分页获取测试资源列表
interface TestResourcesParamsType {
  nodeId: number;
  skip?: number;
  limit?: number;
  resourceType?: string;
  onlineStatus?: 0 | 1 | 2;
  tags?: string;
  omitResourceType?: string;
  keywords?: string;
}

export function testResources({nodeId, ...params}: TestResourcesParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/${nodeId}/testResources`,
    params: params,
  });
}

// 创建节点测试规则
interface CreateRulesParamsType {
  nodeId: number;
  testRuleText: string;
}

export function createRules({nodeId, ...params}: CreateRulesParamsType) {
  return FUtil.Request({
    method: 'POST',
    url: `/v2/testNodes/${nodeId}/rules`,
    data: params,
  });
}

// 批量查询测试资源列表
interface BatchTestResourcesParamsType {
  nodeId: number;
  entityType?: 'resource' | 'object';
  entityIds?: string;
  entityNames?: string;
  projection?: string;
}

export function batchTestResources({nodeId, ...params}: BatchTestResourcesParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/${nodeId}/testResources/list`,
    params: params,
  });
}

// 搜索测试资源依赖树
interface DependencyTreeParamsType {
  nodeId: number;
  keywords: string;
  resourceType?: string;
  omitResourceType?: string;
}

export function dependencyTree({nodeId, ...params}: DependencyTreeParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/${nodeId}/testResources/dependencyTree/search`,
    params: params,
  });
}

// 追加节点的测试规则 (在现有测试规则尾部追加新的测试规则)
interface PutRulesParamsType {
  nodeId: number;
  additionalTestRule: string;
}

export function putRules({nodeId, ...params}: PutRulesParamsType) {
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/testNodes/${nodeId}/rules`,
    data: params,
  });
}

// 查看节点当前测试规则
interface TestNodeRulesParamsType {
  nodeId: number;
}

export function testNodeRules({nodeId}: TestNodeRulesParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/${nodeId}/rules`,
    // params: params,
  });
}

// 更新测试资源的授权合约
interface UpdateTestResourceContractsParamsType {
  testResourceId: string;
  resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
}

export function updateTestResourceContracts({testResourceId, ...params}: UpdateTestResourceContractsParamsType) {
  // return FUtil.Axios.put(`/v2/testNodes/testResources/${testResourceId}`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v2/testNodes/testResources/${testResourceId}`,
    data: params,
  });
}

// 获取并过滤资源依赖树
interface DependencyTreeFilterParamsType {
  testResourceId: string;
  dependentEntityId: string;
  dependentEntityVersionRange?: string;
}

export function dependencyTreeFilter({testResourceId, ...params}: DependencyTreeFilterParamsType) {
  // return FUtil.Axios.get(`/v2/testNodes/testResources/${testResourceId}/dependencyTree/filter`, {
  //   params
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/testResources/${testResourceId}/dependencyTree/filter`,
    params: params,
  });
}

// 查看测试资源依赖树
interface TestResourcesDependencyTreeParamsType {
  testResourceId: string;
}

export function testResourcesDependencyTree({testResourceId}: TestResourcesDependencyTreeParamsType) {
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/testResources/${testResourceId}/dependencyTree`,
    // params: params,
  });
}

// 查看测试资源授权树
interface TestResourcesAuthTreeParamsType {
  testResourceId: string;
}

export function testResourcesAuthTree({testResourceId}: TestResourcesAuthTreeParamsType) {
  // return FUtil.Axios.get(`/v2/testNodes/testResources/${testResourceId}`);
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/testResources/${testResourceId}/authTree`,
    // params: params,
  });
}

// 查看测试资源详情
interface TestResourceDetailsParamsType {
  testResourceId: string;
}

export function testResourceDetails({testResourceId}: TestResourceDetailsParamsType) {
  // return FUtil.Axios.get(`/v2/testNodes/testResources/${testResourceId}`);
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/testResources/${testResourceId}`,
    // params: params,
  });
}

// 查询包含指定依赖的测试资源
interface SearchTestResourcesByDependencyParamsType {
  nodeId: number;
  dependentEntityId: string;
  dependentEntityVersionRange?: string;
  resourceType?: string;
  omitResourceType?: string;
}

export function searchTestResourcesByDependency({nodeId, ...params}: SearchTestResourcesByDependencyParamsType) {
  // return FUtil.Axios.get(`/v2/testNodes/${nodeId}/testResources/searchByDependency`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v2/testNodes/${nodeId}/testResources/searchByDependency`,
    params: params,
  });
}

// 重新匹配节点测试规则
interface RulesRematchParamsType {
  nodeId: number;
}

export function rulesRematch({nodeId, ...params}: RulesRematchParamsType) {
  // return FUtil.Axios.post(`/v2/testNodes/${nodeId}/rules/rematch`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v2/testNodes/${nodeId}/rules/rematch`,
    data: params,
  });
}
