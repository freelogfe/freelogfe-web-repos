export const CONTRACT_STATUS = {
  uncreated: -1,
  initial: 1,
  running: 2,
  activated: 3,
  userTerminated: 4,
  sysTerminated: 5,
  terminated: 6,
  invalid: 0
}


export const CONTRACT_STATUS_TIPS = {
  0: '资源未生效',
  '-1': '未创建合同',
  1: '未开始执行',
  2: '执行中',
  3: '生效中',
  4: '用户终止',
  5: '系统终止',
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
    type: 'success',
    desc: '生效中'
  },
  4: {
    type: 'info',
    desc: '用户终止'
  },
  5: {
    type: 'info',
    desc: '系统终止'
  },
  6: {
    type: 'info',
    desc: '合同已终止'
  }
}

