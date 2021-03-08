import request from '@/utils/request';

// 创建节点
export interface CreateParamsType {
  nodeName: string;
  nodeDomain: string;
}

export function create(params: CreateParamsType) {
  return request.post('/v2/nodes', params);
}

// 查看节点详情
export interface NodeDetailParamsType1 {
  nodeId: number;
}

export interface NodeDetailParamsType2 {
  nodeName?: string;
  nodeDomain?: string;
}

export function details(params: NodeDetailParamsType1 | NodeDetailParamsType2) {
  if ((params as NodeDetailParamsType1).nodeId) {
    return request.get(`/v2/nodes/${(params as NodeDetailParamsType1).nodeId}`);
  }
  return request.get(`/v2/nodes/detail`, {
    params,
  });
}

// 查看节点列表
export interface NodesParamsType {
  skip?: number;
  limit?: number;
  status?: 0 | 1 | 2; // 0:正常 1:未审核 2:冻结
  projection?: string;
}

export function nodes(params: NodesParamsType) {
  return request.get('/v2/nodes', {
    params
  });
}

