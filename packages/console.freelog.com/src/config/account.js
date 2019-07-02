import i18n from '@/lib/i18n'


export const currentTypes = {
  feth: 1,
  fcny: 2,
  fusd: 3,
  feur: 4
}


export default {
  1: {
    name: i18n.t('config.account.feather'),
    abbr: 'feth',
    value: 1,
    unit: 1e3,
    extBindAddrName: i18n.t('config.account.eth'), // 绑定的外部地址类型
    enable: true // 是否支持可用
  },
  2: {
    name: i18n.t('config.account.rmb'),
    abbr: 'fcny',
    unit: 1e2,
    value: 2
  },
  3: {
    name: i18n.t('config.account.dollar'),
    abbr: 'fusd',
    unit: 1e2,
    value: 3
  },
  4: {
    name: i18n.t('config.account.euro'),
    abbr: 'feur',
    unit: 1e2,
    value: 4
  }
}
