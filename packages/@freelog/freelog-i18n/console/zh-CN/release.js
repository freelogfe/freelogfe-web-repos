export default {
    myReleases: '我的发行',
    management: '发行管理',

    version: '版本号',
    currentVersion: '当前版本',
    scheme: '方案',
    historicVersion: '历史版本',
    tuckUp: 'Tuck up',
    more: 'more...',
    saveBtnText: '保存版本',
    cancelBtnText: '取消',

    noDesc: '暂无资源描述',
    name: '发行名称',
    cover: '发行封面',
    basicUpcast: '基础上抛',
    noBasicUpcast: '暂无基础上抛',
    // scheme: '方案',
    // 'version': '版本号',
    tips: [ '发行名称一旦则创建不可修改', '方案中所选上抛将会成为基础上抛' ],
    messages: [ '长度必须在1–60字符之间', '不能包含空格和以下字符', '版本号格式有误！', '发行名不能为空！', '版本号不能为空！', '发行创建成功！'  ],
    createBtnText: '创建发行',
    cancelCreateBtnText: '取消创建',


    release: '发行',
    releaseID: '发行ID',
    policiesComparison: '策略对比',
    selectionPlaceholder: '请选择签约节点',
    // noDesc: '暂无描述',
    noDescription: '暂无描述',
    warings: [
        '当前发行未上线，无可用策略！',
        '当前发行的上抛发行未上线，不可用！',
        '你还没有创建节点；'
    ],
    // 'messages': [
    messages1: [
        '请先选择签约的节点',
        '未选择授权策略！',
        '签约成功！',
        '授权签约成功；即将跳转至节点发行管理页！'
    ],
    titles: [ '添加节点',  '当前发行', '基础上抛', '资源描述', '签约确认' ],
    iconTexts: [ '上抛', '已签约' ],
    steps: [
        '步骤1：选择签约节点',
        '步骤2：选择授权策略'
    ],
    linkBtns: {
        editRelease: '前去编辑',
        createNode: '前去创建'
    },
    btns: {
        cancel: '取消',
        sign: '签约',
        getAuth: '获取授权'
    },
    signPolicyBox: {
        titles: [ '已签约至', '历史合约' ],
        signState: '作为被授权方，如果您满足且接受授权方的授权策略，则可以选择和授权方签约。授权双方之间存在一个按照未来发生的事件改变资源授权状态的机制，称之为合约。',
        signRuleState1: '合约的复用：授权方和被授权方的合约在同一个授权方（节点或发行）范围内可以复用。',
        signRuleState2: '合约的启用和停用：如果您和授权方的多个授权策略签订了多个合约，则在管理合约时，至少要有一个合约是启用状态。您可以选择启用或者停用其中某一个或某几个合约，在授权链中，系统仅会验证启用合约的授权状态。',
        tips: [
            '存在历史签约，可复用此合约',
            '以下策略可进行新的签约'
        ],
        contractID: '合同ID',
        signDate: '签约时间'
    },
    signConfirm: {
        title1: '选择的节点',
        title2: '策略确认'
    },

    namePlaceholder: '请输入发行名称',
    // 'version': '版本号',
    dialogTitle: '我的资源',
    policy: '授权策略',
    // 'basicUpcast': '基础上抛',
    releaseId: '发行ID',
    releaseIntro: '发行简介',
    aboutRelease: '发行相关',
    aboutVersion: '版本相关',
    authManagement: '授权管理',
    contract: '授权链',
    addBtnText: '新增版本',
    // 'saveBtnText': '保存',
    /****/
    save: '保存',
    editBtnText: '编辑',
    // 'cancelBtnText': '取消',
    addIntroBtnText: '添加简介',
    addPolicyBtnText: '添加策略',
    enabled: '已启用',
    disabled: '已停用',
    online: '已上线',
    notOnline: '未上线',
    // 'tips': [ '无策略的发行不会出现在市场中', '未添加策略', '策略已停用', '未命名策略' ],
    tips1: [ '无策略的发行不会出现在市场中', '未添加策略', '策略已停用', '未命名策略' ],
    // 'messages': [ '封面更新成功！', '策略添加成功！', '发行简介添加成功！', '发行简介更新成功！', '发行名称更新成功！' ]
    messages2: [ '封面更新成功！', '策略添加成功！', '发行简介添加成功！', '发行简介更新成功！', '发行名称更新成功！' ],

    // 'createBtnText': '创建发行',
    // 'dialogTitle': '我的资源',
    goToMarket: '前往发行市场',
    list: {
        name: '发行名称',
        type: '发行类型',
        newVersion: '最新版本',
        allTypes: '全部类型',
        policy: '策略',
        policyCount: [ '等', '个策略...' ],
        noPolicies: 'no policies',
        view: '查看',
        updateDate: '更新时间',
        collectDate: '收藏时间',
        createDate: '创建时间',
        operate: '操作',
        editBtnText: '编辑',
        cancelCollectionBtnText: '取消收藏',
        tips: [ '策略已下架' ],
        messages: [ '没有符合条件的发行', '您还没有创建任何发行。', '您还没有收藏任何发行。您在发行市场收藏的发行之后将会出现在这里。', '取消成功！' ],
        status: [ '全部', '已上线', '未上线' ],
        statusText: '状态'
    },

    upcast: '上抛',
    signContractBtnText: '签约',
    applyBtnText: '应用',
    layAsideBtnText: '搁置',
    offline: '已下线',
    signedContracts: '历史合约',
    contractID: '合同ID',
    signingDate: '签约时间',
    detail: '详情',
    partyA: '授权方',
    partyB: '被授权方',
    policyStatus: [ '已应用', '已搁置' ],
    signStatus: [ '已签约' ],
    contractStatus: [ '执行中', '生效中', '合同终止', '上抛' ],
    /***/
    // 'tips': [ '该发行为基础上抛', '以下策略可进行新的签约', '此发行存在历史签约，可直接使用' ],
    tips2: [ '该发行为基础上抛', '以下策略可进行新的签约', '此发行存在历史签约，可直接使用' ],

    // "historicVersion": "历史版本"
    noValidContract: '未获取到有效的合同信息',
    contractDetails: '合约详情',
    releaseName: '发行名称',
    resourceType: '资源类型',
    createData: '创建日期',
    contractInfo: '合同信息',

    licensingFailed: '授权方案获取失败！',

};
