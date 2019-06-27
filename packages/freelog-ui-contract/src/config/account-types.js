
export const currentTypes = {
  feth: 1,
  fcny: 2,
  fusd: 3,
  feur: 4
}


export default {
  1: {
    name: '飞致币',
    abbr: 'feth',
    value: 1,
    unit: 1e3,
    extBindAddrName: '以太坊', // 绑定的外部地址类型
    enable: true // 是否支持可用
  },
  2: {
    name: '人民币',
    abbr: 'fcny',
    unit: 1e2,
    value: 2
  },
  3: {
    name: '美元',
    abbr: 'fusd',
    unit: 1e2,
    value: 3
  },
  4: {
    name: '欧元',
    abbr: 'feur',
    unit: 1e2,
    value: 4
  }
}
