export const TYPES = {
  resource: 1,
  node: 2
}

export const PolicyTemplateTypes = {
  [TYPES.resource]: {
    value: TYPES.resource,
    desc: '资源策略模板'
  },
  [TYPES.node]: {
    value: TYPES.node,
    desc: '用户策略模板'
  }
}


export const PolicyTemplateStatus = {
  0: {
    value: 0,
    desc: '正常'
  },
  1: {
    value: 1,
    desc: '已删除'
  }
}

export function resolveType(type) {
  return PolicyTemplateTypes[type] ? PolicyTemplateTypes[type].desc : '策略模板'
}

export function resolveStatus(status) {
  return PolicyTemplateStatus[status] ? PolicyTemplateStatus[status].desc : '未知'
}
