import i18n from '@/lib/i18n'

export const CONTRACT_STATUS = {
  uncreated: -1,
  initial: 1,
  running: 2,
  activated: 3,
  userTerminated: 4,
  sysTerminated: 5,
  terminated: 6
}


export const CONTRACT_STATUS_TIPS = {
  '-1': i18n.t('config.contract.statesTip[0]'),
  1: i18n.t('config.contract.statesTip[1]'),
  2: i18n.t('config.contract.statesTip[2]'),
  3: i18n.t('config.contract.statesTip[3]'),
  4: i18n.t('config.contract.statesTip[4]'),
  5: '',
  6: i18n.t('config.contract.statesTip[6]')
}


export const CONTRACT_STATUS_COLORS = {
  '-1': {
    type: 'danger',
    desc: CONTRACT_STATUS_TIPS['-1']
  },
  1: {
    type: 'warning',
    desc: CONTRACT_STATUS_TIPS['1']
  },
  2: {
    type: 'warning',
    desc: CONTRACT_STATUS_TIPS['2']
  },
  3: {
    type: 'info',
    desc: CONTRACT_STATUS_TIPS['3']
  },
  4: {
    type: 'success',
    desc: CONTRACT_STATUS_TIPS['4']
  },
  5: {
    type: 'info',
    desc: ''
  },
  6: {
    type: 'info',
    desc: CONTRACT_STATUS_TIPS['6']
  }
}

