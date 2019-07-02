import i18n from '@/lib/i18n'

export const USER_GROUP_TYPE = 1
export const NODE_GROUP_TYPE = 2

export const GROUP_TYPES = [{
  value: USER_GROUP_TYPE,
  label: i18n.t('config.group.user')
}, {
  value: NODE_GROUP_TYPE,
  label: i18n.t('config.group.node')
}]
