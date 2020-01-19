import i18n from '../../lib/i18n';

export const TYPES = {
  resource: 1,
  node: 2
}

export const PolicyTemplateTypes = {
  [TYPES.resource]: {
    value: TYPES.resource,
    // desc: '资源策略模板'
    desc: i18n.t('policy.resourceTemplate'),
  },
  [TYPES.node]: {
    value: TYPES.node,
    // desc: '用户策略模板'
    desc: i18n.t('policy.userTemplate'),
  }
}


export const PolicyTemplateStatus = {
  0: {
    value: 0,
    // desc: '正常'
    desc: i18n.t('policy.normal')
  },
  1: {
    value: 1,
    // desc: '已删除'
    desc: i18n.t('policy.deleted')
  }
}

export function resolveType(type) {
  return PolicyTemplateTypes[type] ? PolicyTemplateTypes[type].desc
      // : '策略模板'
      : i18n.t('policy.policyTemplate')
}

export function resolveStatus(status) {
  return PolicyTemplateStatus[status] ? PolicyTemplateStatus[status].desc
      // : '未知'
      : i18n.t('policy.unknown')
}
