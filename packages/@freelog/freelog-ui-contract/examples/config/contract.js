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
  '-1': '未创建合同',
  1: '未开始执行',
  2: '执行中',
  3: '系统锁住',
  4: '生效中',
  5: '',
  6: '合同已终止'
}


export const CONTRACT_STATUS_COLORS = {
  '-1': {
    type: 'danger',
    desc: '未创建合同'
  },
  1: {
    type: 'warning',
    desc: '未开始执行'
  },
  2: {
    type: 'warning',
    desc: '执行中'
  },
  3: {
    type: 'info',
    desc: '系统终止'
  },
  4: {
    type: 'success',
    desc: '生效中'
  },
  5: {
    type: 'info',
    desc: ''
  },
  6: {
    type: 'info',
    desc: '合同已终止'
  }
}

