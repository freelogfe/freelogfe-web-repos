export default {
    title: '节点',
    nodeName: '节点名',
    nodeDomain: '节点地址',
    createNode: '创建节点',
    gotoNodeDetail: '进入节点',
    nodeId: '节点ID',
    nodeState: '节点状态',
    createRules: {
        length: '节点域名前缀长度应为4-20字符',
        prefix: '节点域名前缀应由数字字母和"-"组成',
        noEmpty: '节点域名前缀不能为空'
    },
    createPlaceholders: {
        domain: '输入节点地址',
        name: '输入节点名称'
    },
    nodeNameRules: {
        noEmpty: '节点描述不能为空',
        prefix: '目前仅支持中文、英文和数字',
        length: '节点描述长度应为4-20字符，不区分大小写'
    },
    createSuccess: '节点创建成功',
    confirmMessages: {
        question: '节点名称和域名一旦创建后不可更改，确定继续？',
        title: '提示',
        confirm: '确定',
        cancel: '取消'
    },

    detailView: {
        paramError: '缺少参数nodeId',
        copySuccess: '已复制节点地址'
    },

    tabTitles: {
        scheme: '授权方案',
        contract: '合同管理',
        policy: '策略管理'
    },
    pageStyle: '页面样式(pagebuild)',
    switchPageStyle: '切换样式',
    choosePageBuildTip: '请在下面节点资源列表中上线一个资源类型为pagebuild的资源作为页面样式',
    quickFilterText: '快速筛选',
    noPresentableTip: '暂未添加任何节点资源',


    // manager
    copySuccess: '复制成功',
    nodeReleaseList: '节点发行列表',
    nodePageStyle: '主题管理',
    all: '全部',
    pending: '待处理',
    table: {
        publish: '发行',
        presentableName: '发行标题',
        type: '全部类型',
        policies: '策略',
        updateTime: '更新时间',
        state: '全部状态',
        operation: '操作',
    },
    allType: '全部类型',
    allState: '全部状态',
    online: '已上线',
    noOnline: '未上线',
    contractException: '合约异常',
    noPolicy: '暂无策略',
    suchAs: '等',
    policies: '个策略',
    joined: '加入时间',
    exceptionExists: '此合约链上存在异常',
    action: {
        edit: '编辑',
        top: '置顶',
        upgrade: '升级',
        online: '上线',
        downline: '下线',
    },
    cannotOnline: {
        noPolicy: '无法上线：没有可用的授权策略',
        exceptions: '无法上线：授权链异常',
    },

    gotoTest: '进入测试节点管理',
    presentableManagement: '展品管理',
    notAdded: '您还没有添加任何发行到该节点',
    notSetTheme: '您还没有为该节点设置主题，节点无法展示。 您可以添加“theme”类型的发行作为节点的主题',
    toMarket: '前往发行市场',
    addTheme: '添加主题',
    loading: '加载中',

    // manager-release
    type: '类型',
    signingTime: '签约时间',
    nodeReleaseTitle: '节点发行标题',
    tags: '标签',
    newTag: '新标签',
    policies_: '策略',
    cancel: '取消',
    save: '保存',
    noPolicyNotAppear: '无策略的发行不会出现在市场中',
    addPolicy: '添加策略',
    authorization: '授权管理',
    unnamedPolicy: '未命名策略',
    addPolicySuccess: '添加策略成功',
    updatedPolicySuccessfully: '更新策略成功',
    titleUpdateSuccessful: '节点发行标题更新成功',
    tagUpdatedSuccessfully: '用户标签更新成功',
    presentableInfo: '展品信息',
    status: '状态',
    inactive: '未激活',
    active: '激活',
    activated: '已激活',
    presentableName: '展品名称',
    displayVersion: '展示版本',
    authorizationPolicy: '授权策略',

    // test-management
    inNodeManagement: '进入节点管理',
    mappingRulesManagement: '映射规则管理',
    addTestPresentable: '新增测试展品',
    replaceRelyOn: '替换依赖',
    replace: '替换',
    selectReplacingResource: '选择替换资源',
    myRelease: '我的发行',
    myMock: '我的mock',
    releaseMarket: '发行市场',
    versionRange: '版本范围',
    selectedVersion: '选定版本',
    pleaseSelect: '请选择',
    customer: '自定义',
    enterSemverVersionRange: '输入semver版本范围',
    confirm: '确定',
    content: '请输入内容',
    selectReplacedResource: '选择被替换资源',
    allVersions: '全部版本',
    noAddedResources: '您还没有添加任何测试资源',
    rule: '规则',
    source: '来源',
    testPresentable: '测试展品',
    node: '节点',
    testResources: '相关测试资源',
    notYetAuthorization: '尚未获得测试授权',
    detail: '详情',
    delete: '删除',
    // release: '发行',
    downlineSuccess: '下线成功',
    onlineSuccess: '上线成功',
    deletedSuccess: '删除成功',
    setVersionSuccess: '设置版本成功',
    haveNotSetTheme: '您还没有为该节点设置主题，节点无法展示。 您可以添加theme类型的测试资源作为节点的主题。',
    exception: '异常',
    activationSuccess: '激活成功',
    testPresentableInfo: '测试展品信息',
    nodeReleaseName: '节点发行名称',
    aboutNode: '节点相关',
    presentable: '展品',
    aboutRelease: '相关发行',

    ruleType: '规则类型',
    mappingRuleContent: '映射规则内容',
    matchResult: '匹配结果',
    release: '发行',
    // 'presentable': '展品',
    operation: '操作',
    editMappingRules: '编辑映射规则',
    inputPlaceHolder: '请输入规则',
    imortBtnText: '导入',
    batchExportBtnText: '批量导出',
    exportAllBtnText: '全部导出',
    batchDeletionBtnText: '批量删除',
    editBtnText: '编辑',
    enterBtnText: '进入编辑模式',
    exitBtnText: '退出编辑模式',
    saveBtnText: '校验并保存',
    onlineBtnText: '上线',
    offlineBtnText: '下线',
    deleteBtnText: '删除',
    sureBtnText: '确定',
    cancalBtnText: '取消',
    operationsTexts: [
        '新增', '；来源', '，展示版本 ', '设置标签 ', '展品状态 上线', '展品状态 下线', '替换', '激活主题', '变更', '作用域'
    ],
    confirmTexts: [
        '是否导出所选的规则？', '是否导出全部的规则？', '此操作将删除规则', '是否继续？', '提示', '此操作将删除所选中的', '条规则', '上线规则', '下线规则', '成功'
    ],
    messages: [
        '映射规则保存成功！', '映射规则删除成功!'
    ],
    errors: [
        '映射规则编译失败：存在语法错误！', '映射规则内容存在语法错误：', '校验失败，请检查更正后提交:', '校验成功，但规则中存在预执行错误:', '语句', '错误'
    ],
    matchResultsTexts: [
        '替换执行结果', '替换指令', '匹配数量'
    ],

    currentRelease: '当前发行',
    throwingRelease: '上抛发行',
    authorizer: '授权方：',
    authorized: '被授权方：',
    contracted: '已签约',
    availableSigning: '以下策略可供签约',
    agencySuccess: '签约成功',
    success: '操作成功',
    onlyOneContract: '当前授权方案中只有一个合约，不可停用',

    enabled: '已启用',
    details: '详情',

    latestVersion: '最新版本',

    addRuleSuccess: '添加规则成功',

    tabsHeader: {
        authorization: '授权管理',
        authorizationChain: '授权链',
        pending: '待执行',
        active: '生效中',
        termination: '合约终止',
    },

};
