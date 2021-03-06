export default {
    eventTitles: {
        transactionEvent: 'Payment',
        signingEvent: 'Agreement signing',
        escrowExceedAmount: 'Payment deposit',
        escrowConfiscated: 'Confiscation of deposit',
        escrowRefunded: 'Redemption deposit'
    },
    contractSigning: {
        resourceType: 'Resource type',
        releaseId: 'Release ID',
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
        status: [
            'not signed',
            'signed',
            'inactive',
            'active',
            'termination of contract'
        ],
        addRemark: 'Add remarks',
        editRemark: 'Modify remarks',
        saveRemark: 'Save remarks',
        editRemarkSuccessText: 'Remarks modified successfully',
        addRemarkSuccessText: 'Remarks added successfully',
        confirm: {
            title: '',
            content_default: 'Set the current contract as the default contract？',
            content_sign: [
                'Confirm the contract with',
                '？'
            ],
            resourceName: 'resource name',
            checkboxText: 'Set this contract as the default contract',
            cancelBtnText: 'cancel',
            sureBtnText: 'sure'
        },
        dialog: {
            title: 'Resource signing'
        },
        errors: [
            'Signing failed, try again later！！！',
            'Failed to set default contract, try again later！！！'
        ],
        toastText: 'signing...'
    },
    license: {
        label: 'license',
        checkboxText: 'Accept the agreement',
        msgs: [
            'Protocol format is incorrect，Please contact the contract author。',
            'Execution succeed'
        ]
    },
    transaction: {
        contractId: 'Contract ID',
        partyOne: 'Party one',
        partyTwo: 'Party two',
        contractAccountName: 'Payee account',
        unitType: 'Transfer amount',
        accountLabels: [
            'Transfer Out Acc',
            'Transfer In Acc'
        ],
        loadingAccountText: 'Getting account...',
        accountPlaceholder: 'please choose',
        noAccountTip: 'No account? Go to add one',
        password: 'Payment password',
        passwordPlaceholder: 'Please enter the payment password',
        orderStatus: [
            'Being paid',
            'Paid success',
            'Payment failed'
        ],
        payResultMsgs: [
            'Pay',
            'Margin payment',
            'Margin confiscation',
            'Margin redemption',
            ' is in progress, query results later',
            'success',
            'failed',
            'Unknown payment status'
        ]
    }

};