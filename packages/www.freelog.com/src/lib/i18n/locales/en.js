
// 异常码对应的解释和eventName
// import { HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE } from '@/views/pagebuild/event-center/event-name.js'
const noLogin = {
  desc: 'User is not logged in',
  tip: 'go to login',
  eventName: 'GO_TO_LOGIN'
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
  userAsideNav: {
    title: ['My focus','My resources','My Account','Information & Account']
  },
  navTop: ['exit','My freelog'],
  pagination: {
    emptyText: 'No data',
    start: 'First Page',
    end: 'Last Page',
    prev: 'Previous Page',
    next: 'Next Page',
    bar: '',
    total: 'A total of '
  },
  cropImage: {
    imageReupload: 'reupload',
    save: 'save'
  },
  toolbar: {
    userTabTitle: 'Personal center',
    contractTabTitle: 'Contract management',
  },
  resources: {
    searchType: {
      placeholder: 'please choose',
      label: ['Node','Resource','Resource Type']
    },
    tableColumn: ['Resource|Status|Type','Node','Signing time'],
    detail: {
      title: 'Resource details'
    },
  },
  profile: {
    userAvatar: 'Avatar',
    noUserAvatar: 'User name not set',
    editAvatar: 'edit avatar',
    userName: 'User name',
    userNickname: 'Nickname',
    email: 'Email',
    phoneNumber: 'Phone number',
    noPhoneNumber: 'Phone number not set'
  },
  accounts: {
    currencyAccounts: [
      {},
      { name: 'Feather ',abbr: 'feth',value: 1,unit: 1e3,type: 1,extBindAddrName: 'Ethereum',enable: true },
      { name: 'RMB',abbr: 'fcny',value: 2,unit: 1e2,type: 2,extBindAddrName: 'Bank card' },
      { name: 'USD',abbr: 'fusd',value: 3,unit: 1e2,type: 3,extBindAddrName: 'Bank card' },
      { name: 'EUR',abbr: 'feur',value: 4,unit: 1e2,type: 4,extBindAddrName: 'Bank card' },
    ],
    addrName: ['Ethereum address','Bank account'],
    index: {
      create: 'to create+',
      name: 'Account name',
      id: 'Account ID',
      node: 'Node',
      types: [
        { name: 'RMB',account: 'RMB account',title: 'Bank card management',noAccountWarning: 'You don\'t have a RMB account yet，' },
        { name: 'USD',account: 'USD account',title: 'Bank card management',noAccountWarning: 'You don\'t have a USD account yet，' },
        { name: 'Feather',account: 'Feather account',title: 'Ethereum address management',noAccountWarning: 'You don\'t have a Feather account yet，' },
        { name: 'EUR',account: 'Euro account',title: 'Bank card management',noAccountWarning: 'You don\'t have a Euro account yet，' },
      ],
      actions: ['Recharge','Transfer','Withdraw','Transaction record','Reset password'],
    },
    recharge: {
      title: 'Account recharge',
      to: 'Recharge to',
      record: 'Recharge record',
      payer: 'payer',
      payAddr: 'Payment address',
      payAccountPlaceholder: 'Please select a payment account',
      amount: 'Recharge amount',
      btn: 'Recharge',
      statusLabel: 'Recharge status',
      status: 'Recharging',
      addText: 'Add to',
      addNewText: 'Add new',
      currentText: 'current',
      balanceText: 'Balance',
      tradeStatus: ['Successful','Failed','Initiating','Time out'],
      currencyTypes: ['Ethereum','Bank'],
    },
    list: {
      tableColumn: ['Account name | Address','Current balance','Test coin(100feth)','Operation'],
      manageText: 'management',
      giftedStatus: ['Receive','Received','Successfully received'],
      deleteConfirm: 'Whether to delete the account？',
      deleteSuccess: 'Deleted successfully！'
    },
    records: {
      title: 'Account bill',
      tableColumn: ['Classification','Transaction hour','Name|Other side|Serial number','Amount|Currency','Order notes'],
      commentTitle: 'Comment：',
      commentList: ['Recharge','Transfer','Node consumption']
    },
    transfer: {
      fromAccountId: 'Payer Account ID',
      toAccountId: 'Payee Account ID',
      amount: 'Transfer amount',
      password: 'Password',
      remark: 'Transfer note',
      transferText: 'Transfer',
      placeholder: ['Please enter the payer account ID','Please enter the payee account ID','Please enter the transfer amount','Please enter the payment password'],
      message: {
        success: 'Successful transfer'
      }
    },
    reset: {
      text: 'reset',
      password: 'Payment password',
      oldPassword: 'Old payment password',
      newPassword: 'New payment password',
      checkNewPassword: 'Confirm payment password',
      sureBtnText: 'Confirm reset',
      messages: ['Please enter the payment password','Please enter the payment confirmation password','Composed of 6 digits'],
      errors: ['Please enter your password','Please enter your password again','Please enter 6 digits','Inconsistent password entered twice!'],

    },
    create: {
      accountName: 'Account name',
      accountNameTip: 'Consists of 2-20 characters',
      password: 'Payment password',
      passwordTip: 'Composed of 6 digits',
      checkPassword: 'Confirm password',
      messages: ['Please enter an account name','Consists of 2-20 characters','Please enter the payment password','Composed of 6 digits','Please enter the payment confirmation password'],
      errors: ['Please enter your password','Please enter your password again','Please enter 6 digits','Inconsistent password entered twice!'],
      text: 'create',
      accountText: 'account',
      successMsg: 'Created successfully',
      failMsg: 'Operation failed',
    },
    withdraw: {
      title: 'Withdraw'
    },
    addPayAccount: {
      title: 'Add card number',
      accountName: 'Account name',
      inputText: 'enter',
      accountNamePlaceholder: 'Enter a custom account name',
      errors: ['Please enter your password','Please enter your password again','Inconsistent password entered twice!'],
      messages: ['Please enter an encrypted password','Please enter the confirmation encryption password','At least 6 characters','Account name','Please enter an account address'],
      addPaySeccessMsg: 'Added successfully',
      confirm: {
        tip: 'Tip',
        msg: 'This encrypted password is used to encrypt the Ethereum keystore. Once created, it cannot be changed. The system does not save it. You need to save it yourself!',
        sureBtnText: 'sure',
        cancelBtnText: 'cancel',
        success: 'Ethereum account created successfully',
        error: 'Creation failed'
      },
      createAddrTip: 'Don\'t have an Ethereum address yet?',
      createAddrBtnText: 'Create an Ethereum address',
      addBtnText: 'add',
      submitBtnText: 'submit',
      cancelBtnText: 'cancel',
      dialogTitle: 'Create an Ethereum address',
      dialogHead: 'Please set the Ethereum key encryption password',
      dialogPass: 'Encrypted password',
      dialogCheckPass: 'Confirm encrypted password',
    },
  },
  collections: {
    tableColumn: ['Resource|Type','Resource author','Update time'],
    contractStatus: {
      inactive: 'inactive',
      active: 'active',
      termination: 'termination of contract',
      unknown: 'unknown state'
    }
  },
  signup: {
    loadingText: 'Logining...',
    head: 'Registered user',
    loginName: 'Account',
    loginNamePlaceholder: 'Please enter your mobile number or email address',
    nickname: 'nickname',
    nicknamePlaceholder: 'Please enter a user nickname',
    password: 'Set password',
    passwordPlaceholder: 'Password (6-16 letters, numbers and symbols)',
    checkPassword: 'Confirm password',
    checkPasswordPlaceholder: 'Please enter a confirmation password',
    verifyCode: 'Verification code',
    verifyCodePlaceholder: 'Please enter verification code',
    loginText: 'To login',
    signupingText: 'Registering...',
    signupedText: 'register',
    passwordInputTip: 'Enter your password here',
    checkPasswordInputTip: 'Enter your password again',
    inconsistentPasswordTip: 'inconsistent password',
    passwordLengthRule: 'At least 6 characters in length',
    sendingText: 'sending',
    timerText: 'Resend after {time} seconds',
    checkcodeBtnText: 'Get verification code',
    registerSuccess: 'Registration success',
    errorTitle: 'Error Situation',
    defaultErrorMsg: 'An exception has occurred. Please try again later',
    identifyError: 'Wrong user name or password',
    serverError: 'Server internal exception, please try again later',
    appError: 'Application exception, please try again later'
  },
  resetPassword: {
    title: 'Retrieve password',
    loginName: 'Account',
    loginNamePlaceholder: 'Phone number or email',
    password: 'password',
    backToLogin: 'back to login',
    verifyCodeStatus: ['Verifying...','Verify immediately'],
    resetSuccess:'update successfully',
    verifyCodeInputTip: 'enter check code',
    sendingText: 'sending',
    inputPasswordTip: 'enter your new password',
    timerText: 'Resend after {time} seconds',
    checkcodeBtnText: 'Get verification code',
    verifyCode: 'verification code',
    errorTitle: 'Error Situation',
    defaultErrorMsg: 'An exception has occurred. Please try again later',
    identifyError: 'Wrong user name or password',
    serverError: 'Server internal exception, please try again later',
    appError: 'Application exception, please try again later'
  },
  login: {
    title: 'Login',
    usernamePlaceholder: 'Please enter user name',
    passwordPlaceholder: 'Please enter your password',
    rememberUser: 'remember me',
    resetPW: 'Forgot password?',
    signup: 'Register',
    loginStatus: ['Log in...','Log in'],
    validateErrors: ['The account format is incorrect，Please enter your mobile number or email address','Account cannot be empty'],
    ruleMessages: ['please enter the account','Please enter your password','At least 6 characters in length'],
    errorTitle: 'An error occurred',
    errors: ['An exception has occurred. Please try again later!','wrong user name or password！','Server internal exception, please try again later！','Application exception, please try again later！'],
  },
  contractSigning: {
    resourceType: 'Resource type',
    resourceId: 'Resource ID',
    resourceIntro: 'Resource description',
    recordsText: 'Resource signing history',
    noRecordText: 'No records',
    contractId: 'contract ID',
    signDate: 'Signing time',
    policyName: 'Policy name',
    defaultBtnText: 'set as Default',
    activeBtnText: 'current active contract',
    signBtnText: 'Signing',
    status: ['not signed','signed','inactive','active','termination of contract'],
    addRemark: 'Add remarks',
    editRemark: 'Modify remarks',
    saveRemark: 'Save remarks',
    editRemarkSuccessText: 'Remarks modified successfully',
    addRemarkSuccessText: 'Remarks added successfully',
    confirm: {
      title: '',
      content_default: 'Set the current contract as the default contract？',
      content_sign: ['Confirm the contract with','？'],
      resourceName: 'resource name',
      checkboxText: 'Set this contract as the default contract',
      cancelBtnText: 'cancel',
      sureBtnText: 'sure',
    },
    dialog: {
      title: 'Resource signing'
    },
    errors: ['Signing failed, try again later！！！','Failed to set default contract, try again later！！！'],
    toastText: 'signing...',
    transaction: {
      contractId: 'Contract ID',
      partyOne: 'Party one',
      partyTwo: 'Party two',
      contractAccountName: 'Payee account',
      unitType: 'Transfer amount',
      accountLabels: ['Transfer Out Acc', 'Transfer In Acc'],
      loadingAccountText: 'Getting account...',
      accountPlaceholder: 'please choose',
      noAccountTip: 'No account? Go to add one',
      password: 'Payment password',
      passwordPlaceholder: 'Please enter the payment password',
      orderStatus: ['Being paid','Paid success','Payment failed'],
      payResultMsgs: ['Pay','Margin payment','Margin confiscation','Margin redemption',' is in progress, query results later','success','failed','Unknown payment status'],
    },
    license: {
      label: 'license',
      checkboxText: 'Accept the agreement',
      msgs: ['Protocol format is incorrect，Please contact the contract author。','Execution succeed']
    },
    eventTitles: {
      transactionEvent: 'Payment',
      signingEvent: 'Agreement signing',
      escrowExceedAmount: 'Payment deposit',
      escrowConfiscated: 'Confiscation of deposit' ,
      escrowRefunded: 'Redemption deposit'
    },
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
    // exceptionCodes: {
    //   301: {
    //     desc: 'Resource contract is not activated',
    //     tip: 'to notify the node',
    //     eventName: NOTIFY_NODE
    //   },
    //   401: {
    //     desc: 'The node\'s contract is not activated',
    //     tip: 'to notify the node',
    //     eventName: NOTIFY_NODE
    //   },
    //   402: {
    //     desc: 'Policy identity authentication failed in node contract',
    //     tip: 'view strategy',
    //     eventName: HANDLE_INVALID_AUTH
    //   },
    //   403: {
    //     desc: 'No valid node contract found',
    //     tip: 'to notify the node',
    //     eventName: NOTIFY_NODE
    //   },
    //   404: {
    //     desc: 'Node information not found',
    //     tip: 'report',
    //     eventName: REPORT_ERROR
    //   },
    //   501: {
    //     desc: 'User\'s contract is not activated',
    //     tip: 'to activate the contract',
    //     eventName: HANDLE_INVALID_AUTH
    //   },
    //   502: {
    //     desc: '资源策略拒绝',
    //     tip: 'view strategy',
    //     eventName: HANDLE_INVALID_AUTH
    //   },
    //   503: {
    //     desc: 'Resource contract not created',
    //     tip: 'to create a contract',
    //     eventName: HANDLE_INVALID_AUTH
    //   },
    //   505: noLogin,
    //   28: noLogin,
    //   30: noLogin,
    //   506: {
    //     desc: 'Choose the contract that needs to be executed. Generally there are two or more times when the user needs to choose which one to execute.',
    //     tip: 'go to choose a contract',
    //     eventName: HANDLE_INVALID_AUTH
    //   },
    //   601: {
    //     desc: 'Identity authentication failed',
    //     tip: 'go to login',
    //     eventName: GO_TO_LOGIN
    //   },
    //   900: {
    //     desc: 'Unknown exception',
    //     tip: 'report',
    //     eventName: REPORT_ERROR
    //   }
    // }
  },
}
