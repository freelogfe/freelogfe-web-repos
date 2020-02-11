import LicenseEvent from './license/license'
import TransactionEvent from './transaction/transaction'

const eventComponentMap = {
  transactionEvent: {
    componentName: TransactionEvent.name,
    title: '支付'
  },
  signingEvent: {
    componentName: LicenseEvent.name,
    title: '协议签署'
  },
  escrowExceedAmount: {
    componentName: TransactionEvent.name,
    title: '保证金支付'
  },
  escrowConfiscated: {
    componentName: TransactionEvent.name,
    title: '保证金没收'
  },
  escrowRefunded: {
    componentName: TransactionEvent.name,
    title: '保证金赎回'
  }
}

export {
  LicenseEvent,
  TransactionEvent,
  eventComponentMap
}