import request from '@/utils/request';

// 分页获取测试资源列表
export interface TestResourcesParamsType {
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
  return request.get(`/v2/testNodes/${nodeId}/testResources`, {
    params,
  });
}

// 查看节点当前测试规则
export interface TestNodeRulesParamsType {
  nodeId: number;
}

export function testNodeRules({nodeId}: TestNodeRulesParamsType) {
  return request.get(`/v2/testNodes/${nodeId}/rules`, {});
}

// 查看测试资源详情
export interface TestResourceDetailsParamsType {
  testResourceId: string;
}

export function testResourceDetails({testResourceId}: TestResourceDetailsParamsType) {
  return request.get(`/v2/testNodes/testResources/${testResourceId}`);
}

// 重新匹配节点测试规则
export interface RulesRematchParamsType {
  nodeId: number;
}

export function rulesRematch({nodeId, ...params}: TestResourcesParamsType) {
  return request.post(`/v2/testNodes/${nodeId}/rules/rematch`, params);
}
