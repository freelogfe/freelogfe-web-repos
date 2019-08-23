
// 异常码对应的解释和eventName
// import { HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE } from '@/views/pagebuild/event-center/event-name.js'
const [ HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE ] = [ 'HANDLE_INVALID_AUTH', 'GO_TO_LOGIN', 'REPORT_ERROR', 'NOTIFY_NODE' ]
const noLogin = {
  desc: 'User is not logged in',
  tip: 'go to login',
  eventName: GO_TO_LOGIN
}

export default {
  common: {
    searchPlaceholder: 'Search',
    avatarPlaceholder: 'Upload avatar',
    backText: 'back',
    cancelText: 'cancel',
    sureText: 'sure',
    sureBtnText: 'sure',
    cancelBtnText: 'cancel',
  },
  pagebuild: {
    errors: ['There is no corresponding event handler', 'Undefined error'],
    tips: ['Report error'],
    authError: {
      msg: 'Incorrect parameters'
    },
    notifyNode: {
      msg: 'Node resource contract is not in effect, node has been notified'
    },
    exceptionCodes: {
      301: {
        desc: 'Resource contract is not activated',
        tip: 'to notify the node',
        eventName: NOTIFY_NODE
      },
      401: {
        desc: 'The node\'s contract is not activated',
        tip: 'to notify the node',
        eventName: NOTIFY_NODE
      },
      402: {
        desc: 'Policy identity authentication failed in node contract',
        tip: 'view strategy',
        eventName: HANDLE_INVALID_AUTH
      },
      403: {
        desc: 'No valid node contract found',
        tip: 'to notify the node',
        eventName: NOTIFY_NODE
      },
      404: {
        desc: 'Node information not found',
        tip: 'report',
        eventName: REPORT_ERROR
      },
      501: {
        desc: 'User\'s contract is not activated',
        tip: 'to activate the contract',
        eventName: HANDLE_INVALID_AUTH
      },
      502: {
        desc: '资源策略拒绝',
        tip: 'view strategy',
        eventName: HANDLE_INVALID_AUTH
      },
      503: {
        desc: 'Resource contract not created',
        tip: 'to create a contract',
        eventName: HANDLE_INVALID_AUTH
      },
      505: noLogin,
      28: noLogin,
      30: noLogin,
      506: {
        desc: 'Choose the contract that needs to be executed. Generally there are two or more times when the user needs to choose which one to execute.',
        tip: 'go to choose a contract',
        eventName: HANDLE_INVALID_AUTH
      },
      601: {
        desc: 'Identity authentication failed',
        tip: 'go to login',
        eventName: GO_TO_LOGIN
      },
      900: {
        desc: 'Unknown exception',
        tip: 'report',
        eventName: REPORT_ERROR
      }
    }
  },
}
