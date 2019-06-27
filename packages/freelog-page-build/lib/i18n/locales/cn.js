
// 异常码对应的解释和eventName
// import { HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE } from '@/views/pagebuild/event-center/event-name.js'
const [ HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE ] = [ 'HANDLE_INVALID_AUTH', 'GO_TO_LOGIN', 'REPORT_ERROR', 'NOTIFY_NODE' ]

const noLogin = {
  desc: '未登录用户',
  tip: '去登录',
  eventName: GO_TO_LOGIN
}

export default {
  common: {
    searchPlaceholder: '按回车搜索',
    avatarPlaceholder: '去上传头像',
    backText: '返回',
    cancelText: '取消',
    sureText: '确定',
    sureBtnText: '确 定',
    cancelBtnText: '取 消',
  },
  userAsideNav: {
    title: ['我的关注','我的资源','我的账户','资料与账号']
  },
  navTop: ['退出','我的freelog'],
  pagination: {
    emptyText: '暂无数据',
    start: '首页',
    end: '尾页',
    prev: '上一页',
    next: '下一页',
    bar: '条',
    total: '共'
  },
  cropImage: {
    imageReupload: '重新上传',
    save: '保存'
  },
  toolbar: {
    userTabTitle: '个人中心',
    contractTabTitle: '合同管理',
  },
  resources: {
    searchType: {
      placeholder: '请选择',
      label: ['节点','资源','资源类型']
    },
    tableColumn: ['资源|状态|类型','节点','签约时间'],
    detail: {
      title: '资源详情'
    },
  },
  profile: {
    userAvatar: '用户头像',
    noUserAvatar: '未设置用户姓名',
    editAvatar: '编辑头像',
    userName: '用户姓名',
    userNickname: '用户昵称',
    email: '邮箱',
    phoneNumber: '手机号',
    noPhoneNumber: '未设置手机号'
  },
  accounts: {
    currencyAccounts: [
      {},
      { name: '飞致币',abbr: 'feth',value: 1,unit: 1e3,type: 1,extBindAddrName: '以太坊',enable: true },
      { name: '人民币',abbr: 'fcny',value: 2,unit: 1e2,type: 2,extBindAddrName: '银行卡' },
      { name: '美元',abbr: 'fusd',value: 3,unit: 1e2,type: 3,extBindAddrName: '银行卡' },
      { name: '欧元',abbr: 'feur',value: 4,unit: 1e2,type: 4,extBindAddrName: '银行卡' },
    ],
    addrName: ['以太坊地址','银行账号'],
    index: {
      create: '去创建+',
      name: '账户名',
      id: '账户ID',
      node: '节点',
      types: [
        { name: '人民币',account: '人民币账户',title: '银行卡管理',noAccountWarning: '您还没有人民币账户，' },
        { name: '美元',account: '美元账户',title: '银行卡管理',noAccountWarning: '您还没有美元账户，' },
        { name: '飞致币',account: '飞致币账户',title: '以太坊地址管理',noAccountWarning: '您还没有飞致币账户，' },
        { name: '欧元',account: '欧元账户',title: '银行卡管理',noAccountWarning: '您还没有欧元账户，' },
      ],
      actions: ['充值','转账','提现','交易记录','重置密码'],
    },
    recharge: {
      title: '账户充值',
      to: '充值到',
      record: '充值记录',
      payer: '付款方',
      payAddr: '付款地址',
      payAccountPlaceholder: '请选择付款账号',
      amount: '充值金额',
      btn: '充值',
      statusLabel: '充值状态',
      status: '充值中',
      addText: '添加',
      addNewText: '添加新的',
      currentText: '当前',
      balanceText: '余额',
      tradeStatus: ['充值成功','充值失败','发起中','超时失败'],
      currencyTypes: ['以太坊','银行'],
    },
    list: {
      tableColumn: ['账号名 | 地址','当前余额','测试币(100feth)','操作'],
      manageText: '管理',
      giftedStatus: ['领取','已领取','领取成功'],
      deleteConfirm: '确定删除账户？',
      deleteSuccess: '删除成功'
    },
    records: {
      title: '账户账单',
      tableColumn: ['分类','交易时间','名称|对方|流水号','金额|币种','订单备注'],
      commentTitle: '注释：',
      commentList: ['充值','转账','节点消费']
    },
    transfer: {
      fromAccountId: '付款方账户ID',
      toAccountId: '收款方账户ID',
      amount: '转账金额',
      password: '支付密码',
      remark: '转账备注',
      transferText: '转账',
      placeholder: ['请输入付款方账户ID','请输入收款方账户ID','请输入转账金额','请输入支付密码'],
      message: {
        success: '转账成功'
      }
    },
    reset: {
      text: '重置',
      password: '支付密码',
      oldPassword: '旧支付密码',
      newPassword: '新支付密码',
      checkNewPassword: '确认支付密码',
      sureBtnText: '确定重置',
      messages: ['请输入支付密码','请输入支付确认密码','由6位数字组成'],
      errors: ['请输入密码','请再次输入密码','请输入6位数字','两次输入密码不一致!'],

    },
    create: {
      accountName: '账户名称',
      accountNameTip: '由2-20位字符组成',
      password: '支付密码',
      passwordTip: '由6位数字组成',
      checkPassword: '确认密码',
      messages: ['请输入账户名称','由2-20位字符组成','请输入支付密码','由6位数字组成','请输入支付确认密码'],
      errors: ['请输入密码','请再次输入密码','请输入6位数字','两次输入密码不一致!'],
      text: '创建',
      accountText: '账户',
      successMsg: '创建成功',
      failMsg: '操作失败',
    },
    withdraw: {
      title: '提现'
    },
    addPayAccount: {
      title: '添加卡号',
      accountName: '账号名',
      inputText: '输入',
      accountNamePlaceholder: '输入自定义账号名称',
      errors: ['请输入密码','请再次输入密码','两次输入密码不一致!'],
      messages: ['请输入加密密码','请输入确认加密密码','最少6个字符','账号名','请输入账号地址'],
      addPaySeccessMsg: '添加成功',
      confirm: {
        tip: '提示',
        msg: '此加密密码用于加密以太坊keystore，一旦创建后不可更改，系统不予以保存，需用户自行保存妥善！',
        sureBtnText: '确定',
        cancelBtnText: '取消',
        success: '以太坊账号创建成功',
        error: '创建失败'
      },
      createAddrTip: '还没有以太坊地址?',
      createAddrBtnText: '创建一个以太坊地址',
      addBtnText: '添加',
      submitBtnText: '提交',
      cancelBtnText: '取消',
      dialogTitle: '创建以太坊地址',
      dialogHead: '请设置以太坊密钥加密密码',
      dialogPass: '加密密码',
      dialogCheckPass: '确认加密密码',
    },
  },
  collections: {
    tableColumn: ['资源|类型','资源作者','更新时间'],
    contractStatus: {
      inactive: '不可用',
      active: '可用',
      termination: '合同终止',
      unknown: '未知状态'
    }
  },
  signup: {
    loadingText: '正在登录中...',
    head: '注册用户',
    loginName: '账号',
    loginNamePlaceholder: '请输入手机号或邮箱',
    nickname: '用户昵称',
    nicknamePlaceholder: '请输入用户昵称',
    password: '设置密码',
    passwordPlaceholder: '密码(6-16位字母、数字和符号)',
    checkPassword: '确认密码',
    checkPasswordPlaceholder: '请输入确认密码',
    verifyCode: '验证码',
    verifyCodePlaceholder: '请输入验证码',
    loginText: '去登录',
    signupingText: '注册中...',
    signupedText: '注册',
    passwordInputTip: '请输入密码',
    checkPasswordInputTip: '请再次输入密码',
    inconsistentPasswordTip: '两次输入密码不一致',
    passwordLengthRule: '长度至少6个字符',
    sendingText: '发送中...',
    timerText: '{time}秒后重发',
    checkcodeBtnText: '获取验证码',
    registerSuccess: '注册成功',
    errorTitle: '发生错误',
    defaultErrorMsg: '出现异常，请稍后再试',
    identifyError: '用户名或密码错误',
    serverError: '服务器内部异常，请稍后再试',
    appError: '应用异常，请稍后再试'
  },
  resetPassword: {
    title: '找回密码',
    loginName: '账号',
    loginNamePlaceholder: '请输入手机号或邮箱',
    password: '新密码',
    backToLogin: '返回登录',
    verifyCodeStatus: ['验证中...','立即验证'],
    resetSuccess:'修改成功',
    verifyCodeInputTip: '请输入验证码',
    sendingText: '发送中...',
    inputPasswordTip: '请输入新密码',
    timerText: '{time}秒后重发',
    checkcodeBtnText: '获取验证码',
    verifyCode: '验证码',
    errorTitle: '发生错误',
    defaultErrorMsg: '出现异常，请稍后再试',
    identifyError: '用户名或密码错误',
    serverError: '服务器内部异常，请稍后再试',
    appError: '应用异常，请稍后再试'
  },
  login: {
    title: '用户登录',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    rememberUser: '记住我',
    resetPW: '忘记密码',
    signup: '注册新用户',
    loginStatus: ['登录中...','登录'],
    validateErrors: ['账号格式有误，输入正确的手机号或邮箱','账号不能为空'],
    ruleMessages: ['请输入账号','请输入密码','长度至少6个字符'],
    errorTitle: '发生错误',
    errors: ['出现异常，请稍后再试！','用户名或密码错误！','服务器内部异常，请稍后再试！','应用异常，请稍后再试！'],
  },
  contractSigning: {
    resourceType: '资源类型',
    resourceId: '资源ID',
    resourceIntro: '资源描述',
    recordsText: '资源签约历史',
    noRecordText: '暂无记录',
    contractId: '合约ID',
    signDate: '策略名称',
    policyName: '签约时间',
    defaultBtnText: '设为默认',
    activeBtnText: '当前活跃合约',
    signBtnText: '签约',
    status: ['未签约','已签约','不可用','可用','合同终止'],
    addRemark: '添加备注',
    editRemark: '修改备注',
    saveRemark: '保存备注',
    editRemarkSuccessText: '备注修改成功',
    addRemarkSuccessText: '备注添加成功',
    confirm: {
      title: '',
      content_default: '将当前合约设置为默认合约？',
      content_sign: ['确认与','签约合约？'],
      resourceName: '资源名称',
      checkboxText: '将此合约设定为默认合约',
      cancelBtnText: '取消',
      sureBtnText: '确定',
    },
    dialog: {
      title: '资源签约'
    },
    errors: ['签约失败，稍后再试！！！','设置默认合同失败，稍后再试！！！'],
    toastText: '签约中...',
    transaction: {
      contractId: '合同ID',
      partyOne: '甲方',
      partyTwo: '乙方',
      contractAccountName: '转入账号',
      unitType: '转账金额',
      accountLabels: ['转出账号', '保证金转入账户'],
      loadingAccountText: '正在获取账户中...',
      accountPlaceholder: '请选择',
      noAccountTip: '没有账号？去添加一个',
      password: '支付密码',
      passwordPlaceholder: '请输入支付密码',
      orderStatus: ['支付进行中','已支付成功','支付失败'],
      payResultMsgs: ['支付','保证金支付','保证金没收','保证金赎回','进行中，稍后查询结果','成功','失败','未知的支付状态'],
    },
    license: {
      label: '协议',
      checkboxText: '接受协议',
      msgs: ['协议格式不正确，请联系合约作者。','执行成功']
    },
    eventTitles: {
      transactionEvent: '支付',
      signingEvent: '协议签署',
      escrowExceedAmount: '保证金支付',
      escrowConfiscated: '保证金没收',
      escrowRefunded: '保证金赎回'
    },
  },
  pagebuild: {
    errors: ['不存在对应的事件处理函数', '未定义错误'],
    tips: ['上报错误'],
    authError: {
      msg: '参数有误'
    },
    notifyNode: {
      msg: '节点资源合同未生效，已通知节点'
    },
    exceptionCodes: {
      301: {
        desc: '资源合同未激活',
        tip: '去通知节点',
        eventName: NOTIFY_NODE
      },
      401: {
        desc: '节点的合同未激活',
        tip: '去通知节点',
        eventName: NOTIFY_NODE
      },
      402: {
        desc: '节点合同中的策略身份认证失败',
        tip: '查看策略',
        eventName: HANDLE_INVALID_AUTH
      },
      403: {
        desc: '未找到有效的节点合同',
        tip: '去通知节点',
        eventName: NOTIFY_NODE
      },
      404: {
        desc: '未找到节点信息',
        tip: '我要上报',
        eventName: REPORT_ERROR
      },
      501: {
        desc: '用户的合同未激活',
        tip: '去激活合同',
        eventName: HANDLE_INVALID_AUTH
      },
      502: {
        desc: '资源策略拒绝',
        tip: '查看策略',
        eventName: HANDLE_INVALID_AUTH
      },
      503: {
        desc: '未创建资源合同',
        tip: '去创建合同',
        eventName: HANDLE_INVALID_AUTH
      },
      505: noLogin,
      28: noLogin,
      30: noLogin,
      506: {
        desc: '选择需要执行的合同.一般有两个或两个以上的时候需要用户选择具体执行哪个',
        tip: '去选择合同',
        eventName: HANDLE_INVALID_AUTH
      },
      601: {
        desc: '身份认证失败',
        tip: '去登录',
        eventName: GO_TO_LOGIN
      },
      900: {
        desc: '未知异常',
        tip: '我要上报',
        eventName: REPORT_ERROR
      }
    }
  },
}
