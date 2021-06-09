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
  return FUtil.Axios.get(`/v2/testNodes/${nodeId}/testResources`, {
    params,
  });
}

// 创建节点测试规则
interface CreateRulesParamsType {
  nodeId: number;
  testRuleText: string;
}

export function createRules({nodeId, testRuleText}: CreateRulesParamsType) {
  return FUtil.Axios.post(`/v2/testNodes/${nodeId}/rules`, {testRuleText});
}

// 搜索测试资源依赖树
interface DependencyTreeParamsType {
  nodeId: number;
  keywords: string;
}

export function dependencyTree({nodeId, keywords}: DependencyTreeParamsType) {
  return FUtil.Axios.get(`/v2/testNodes/${nodeId}/testResources/dependencyTree/search`, {
    params: {
      keywords,
    },
  });
}

// 追加节点的测试规则 (在现有测试规则尾部追加新的测试规则)
interface PutRulesParamsType {
  nodeId: number;
  additionalTestRule: string;
}

export function putRules({nodeId, additionalTestRule}: PutRulesParamsType) {
  return FUtil.Axios.put(`/v2/testNodes/${nodeId}/rules`, {
    additionalTestRule,
  });
}

// 查看节点当前测试规则
interface TestNodeRulesParamsType {
  nodeId: number;
}

export function testNodeRules({nodeId}: TestNodeRulesParamsType) {
  return FUtil.Axios.get(`/v2/testNodes/${nodeId}/rules`, {});
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
  return FUtil.Axios.put(`/v2/testNodes/testResources/${testResourceId}`, params);
}

// 获取并过滤资源依赖树
interface DependencyTreeFilterParamsType {
  testResourceId: string;
  dependentEntityId: string;
  dependentEntityVersionRange?: string;
}

export function dependencyTreeFilter({testResourceId, ...params}: DependencyTreeFilterParamsType) {
  return FUtil.Axios.get(`/v2/testNodes/testResources/${testResourceId}/dependencyTree/filter`, {
    params
  });
}

// 查看测试资源详情
interface TestResourceDetailsParamsType {
  testResourceId: string;
}

export function testResourceDetails({testResourceId}: TestResourceDetailsParamsType) {
  return FUtil.Axios.get(`/v2/testNodes/testResources/${testResourceId}`);
}

// 查询包含指定依赖的测试资源
interface SearchTestResourcesByDependencyParamsType {
  nodeId: number;
  dependentEntityId: string;
  dependentEntityVersionRange?: string;
}

export function searchTestResourcesByDependency({nodeId, ...params}: SearchTestResourcesByDependencyParamsType) {
  return FUtil.Axios.get(`/v2/testNodes/${nodeId}/testResources/searchByDependency`, {
    params,
  });
}

// 重新匹配节点测试规则
interface RulesRematchParamsType {
  nodeId: number;
}

export function rulesRematch({nodeId, ...params}: RulesRematchParamsType) {
  return FUtil.Axios.post(`/v2/testNodes/${nodeId}/rules/rematch`, params);
}
