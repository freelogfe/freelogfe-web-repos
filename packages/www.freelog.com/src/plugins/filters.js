import AccountTypes from '@/config/account-types'

export default (Vue) => {
  // 单位转换+千分位格式化
  const ACCOUNT_MAP = Object.values(AccountTypes).reduce((AccountMap, accountType) => {
    AccountMap[accountType.abbr] = accountType
    return AccountMap
  }, {})

  Vue.filter('fmtDate', (value, frm) => {
    if (!value) return ''
    const date = new Date(value)
    frm = frm || 'yyyy-MM-dd hh:mm'
    const regs = {
      'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      S: date.getMilliseconds()
    }


    Object.keys(regs).forEach((key) => {
      const reg = new RegExp(`(${key})`)
      if (reg.test(frm)) {
        frm = frm.replace(reg, regs[key].toString().padStart(2, '0'))
      }
    })

    return frm
  })

  Vue.filter('humanizeCurrency', (value, abbr) => {
    if (!value) return '0'
    const account = ACCOUNT_MAP[abbr || 'feth']
    const values = (value / account.unit).toString().split('.', 2)
    // 123456789->12,3456,789
    return values[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + (values[1] === undefined ? '' : `.${values[1]}`)
  })

  Vue.filter('currencyUnit', (value) => {
    value = value || 'feth'
    return value.substr(0, 4)
  })
}
