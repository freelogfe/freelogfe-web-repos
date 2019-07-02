import i18n from '@/lib/i18n'

export const NODE_STATUS = [{
  text: i18n.t('config.node.status[0]'),
  type: 'success'
}, {
  text: i18n.t('config.node.status[1]'),
  type: 'warning'
}, {
  text: i18n.t('config.node.status[2]'),
  type: 'danger'
}]

export default NODE_STATUS
