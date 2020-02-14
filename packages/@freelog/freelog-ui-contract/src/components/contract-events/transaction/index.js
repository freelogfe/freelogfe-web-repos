import ACCOUNT_CONFIG from '../../../config/account-types'
import en from '@freelog/freelog-i18n/ui-contract/en';
import zhCN from '@freelog/freelog-i18n/ui-contract/zh-CN';

export default {
  name: 'transaction-event',
  i18n: {
    messages: {
      en,
      'zh-CN': zhCN,
    }
  },
  props: {
    contractDetail: {type: Object},
    params: {type: Object},
  },
  data() {
    return {
      accountHref: '//' + window.location.host.replace(/^[^\.]+\./, 'www.') + '/user/accounts',
      accountOptions: [],
      accountId: '',
      password: '',
      tipMsg: '',
      order: {},
      showError: false,
      isLoadingAccount: false,
    }
  },
  computed: {
    formLabelWidth() {
      return this.$i18n.locale === 'zh-CN' ? '90px' : '140px'
    },
    contractId() {
      return this.contractDetail.contractId
    },
    eventId() {
      return this.params.eventId
    },
    payType() {
      return this.params.payType || 'transaction'
    },
    unitType() {
      return this.params.currencyUnit
    },
    amount() {
      switch (this.unitType) {
        case 'feather': {
          return this.params.amount || 0
        }
        default:
          return 0
      }
    },
    targAount() {
      return parseInt(+this.amount * 1000)
    },
    isNeedPassword() {
      return this.payType === 'transaction' || this.payType === 'escrowExceed'
    },
    accountLabel() {
      switch (this.payType) {
        case 'transaction': {
        }
        case 'escrowExceed': {
          return this.$i18n.t('transaction.accountLabels[0]')
        }
        case 'escrowConfiscated': {
        }
        case 'escrowConfiscated': {
          return this.$i18n.t('transaction.accountLabels[1]')
        }
      }
    },
    isCanSubmit() {
      if (this.isNeedPassword) {
        return this.accountId !== '' && this.password !== ''
      } else {
        return this.accountId !== ''
      }
    },
  },
  methods: {
    getPayCounts() {
      this.isLoadingAccount = true
      var currencyType
      var currencyUnit = this.params && this.params.currencyUnit
      switch (currencyUnit) {
        case 'feather':
          currencyType = 1;
          break
        default:
          currencyType = 1;
      }

      this.$axios.get('v1/pay/accounts', {
        params: {
          currencyType: currencyType
        }
      })
        .then(resp => resp.data)
        .then((res) => {
          this.accountOptions = res.data
          this.isLoadingAccount = false
        })
    },
    selectVisibleChange(visible) {
      if (visible && this.accountOptions.length === 0) {
        this.getPayCounts()
      }
    },
    // 支付结果处理
    payResultHandler(result) {
      var statusMsg = ''
      switch (this.params.payType) {
        // 交易
        case 'transaction':
          statusMsg = this.$i18n.t('transaction.payResultMsgs[0]');
          break;
        // 保证金支付
        case 'escrowExceed':
          statusMsg = this.$i18n.t('transaction.payResultMsgs[1]');
          break;
        // 保证金没收
        case 'escrowConfiscated':
          statusMsg = this.$i18n.t('transaction.payResultMsgs[2]');
          break;
        // 保证金赎回
        case 'escrowConfiscated':
          statusMsg = this.$i18n.t('transaction.payResultMsgs[3]');
          break;
      }

      switch (result.status) {
        case 1:
          this.$message.success(statusMsg + this.$i18n.t('transaction.payResultMsgs[4]'))
          break
        case 2:
          this.$message.success(statusMsg + this.$i18n.t('transaction.payResultMsgs[5]'))
          break
        case 3:
          this.$message.success(statusMsg + this.$i18n.t('transaction.payResultMsgs[6]'))
          break
        default:
          this.$message.info(this.$i18n.t('transaction.payResultMsgs[7]'))
      }
    },
    // 支付完成（即支付成功） 处理
    doneHandler(data) {
      if (this.order) {
        data = {
          shouldUpdate: true
        }
      }
      this.$emit('close', data)
    },
    checkOrderStatus(order) {
      if (!order) return

      this.order = order
      let msg
      switch (order.status) {
        case 1:
          msg = this.$i18n.t('transaction.orderStatus[0]')
          break
        case 2:
          msg = this.$i18n.t('transaction.orderStatus[1]')
          break
        case 3:
          msg = this.$i18n.t('transaction.orderStatus[2]')
          break
      }

      this.tipMsg = msg
    },
    // 点击确认
    sure() {
      var promise = null
      var {contractId, eventId, accountId, targAount, password} = this
      switch (this.payType) {
        // 交易
        case 'transaction': {
        }
        // 保证金支付
        case 'escrowExceed': {
          promise = this.$axios.post('/v1/contracts/events/payment', {
            contractId,
            eventId,
            fromAccountId: accountId,
            amount: targAount,
            password: password
          })
          break
        }
        // 没收保证金
        case 'escrowConfiscated': {
          this.$axios.post('/v1/contracts/events/escrowConfiscated', {
            contractId,
            eventId,
            toAccountId: accountId,
          })
          break
        }
        // 赎回保证金
        case 'escrowConfiscated': {
          this.$axios.post('/v1/contracts/events/escrowRefunded', {
            contractId,
            eventId,
            toAccountId: accountId,
          })
          break
        }
      }

      if (promise !== null) {
        promise
          .then(resp => resp.data)
          .then((res) => {
            if (res.errcode === 0) {
              this.payResultHandler(res.data)
              this.doneHandler({shouldUpdate: true, data: res.data})
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(e => this.$message.error(e))
      }

    },
    mounted() {
      this.getPayCounts()
      // this.queryOrder().then(this.checkOrderStatus.bind(this))
    },
  }
}
