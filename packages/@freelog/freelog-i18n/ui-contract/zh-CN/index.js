export default {
    eventTitles: {
        transactionEvent: '支付',
        signingEvent: '协议签署',
        escrowExceedAmount: '保证金支付',
        escrowConfiscated: '保证金没收',
        escrowRefunded: '保证金赎回'
    },
    contractSigning: {
        resourceType: '资源类型',
        releaseId: '发行ID',
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
        status: [
            '未签约',
            '已签约',
            '不可用',
            '可用',
            '合同终止'
        ],
        addRemark: '添加备注',
        editRemark: '修改备注',
        saveRemark: '保存备注',
        editRemarkSuccessText: '备注修改成功',
        addRemarkSuccessText: '备注添加成功',
        confirm: {
            title: '',
            content_default: '将当前合约设置为默认合约？',
            content_sign: [
                '确认与',
                '签约合约？'
            ],
            resourceName: '资源名称',
            checkboxText: '将此合约设定为默认合约',
            cancelBtnText: '取消',
            sureBtnText: '确定'
        },
        dialog: {
            title: '资源签约'
        },
        errors: [
            '签约失败，稍后再试！！！',
            '设置默认合同失败，稍后再试！！！'
        ],
        toastText: '签约中...'
    },
    license: {
        cancelBtnText: '取 消',
        sureBtnText: '确 定',
        label: '协议',
        checkboxText: '接受协议',
        msgs: [
            '协议格式不正确，请联系合约作者。',
            '执行成功'
        ]
    },
    transaction: {
        cancelBtnText: '取 消',
        sureBtnText: '确 定',
        contractId: '合同ID',
        partyOne: '甲方',
        partyTwo: '乙方',
        contractAccountName: '转入账号',
        unitType: '转账金额',
        accountLabels: [
            '转出账号',
            '保证金转入账户'
        ],
        loadingAccountText: '正在获取账户中...',
        accountPlaceholder: '请选择',
        noAccountTip: '没有账号？去添加一个',
        password: '支付密码',
        passwordPlaceholder: '请输入支付密码',
        orderStatus: [
            '支付进行中',
            '已支付成功',
            '支付失败'
        ],
        payResultMsgs: [
            '支付',
            '保证金支付',
            '保证金没收',
            '保证金赎回',
            '进行中，稍后查询结果',
            '成功',
            '失败',
            '未知的支付状态'
        ]
    }
};