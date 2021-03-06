export default {
    authScheme: {
        checkMessages: ['The authorization scheme has been released and the current operation cannot be performed.', 'The authorization scheme has been discarded and the current operation cannot be performed.'],
        signContractError: '{resources} did not select authorization policy',
        update: 'update',
        generate: 'generate',
        signSuccessMsg: 'The presentable {presentableName} authorization contract {msg} succeeded!',
        notHandleResource: 'Do not process this resource',
        updateContract: 'Update contract',
        createContract: 'Create contract',
        schemeTitle: 'Authorization scheme',
        unsignedResources: 'Pending resources',
        policyTitle: 'Authorization policy',
        hadSigned: 'Historical signed',
        unavailable: 'unavailable',
        selectPolicyMessages: ['The authorization scheme of the parent resource {resourceName} is not selected', 'The authorization scheme {authSchemeName} of the parent resource {resourceName} is not selected'],
        switchSchemeTip: 'Switching the authorization scheme will cause the previously selected policies to be invalid.',
        cancelSelectedSchemeTip: 'Cancelling the current selection will invalidate the selection of some authorization schemes',
        confirmMsg: '{str}, sure to continue?',
        signedDepsTip: 'Signed dependencies (total {length})',
        unsignedDepsTip: 'Dependent resources not processed (total {length})',
        resourceName: 'resource name',
        authSchemeName: 'Authorization scheme',
        policyName: 'Authorization Policy',
        signState: 'Contract status',
        noResolvedTip: 'The current scheme chooses not to process dependent resources, is it confirmed to sign the contract?',
        signConfirmTitle: 'Signing confirmation',
        signConfirmText: 'ok',
        dialogTitles: ['Contract switching', 'Signing confirmation'],
        selectedSchemesTitle: 'Selected authorization scheme',
        selectTip: 'Please select the appropriate authorization scheme and policy...',
        unhandledListTitle: 'Upcast Releases'
    },

    contractDetail: {
        title: 'contract detail',
        releaseName: 'release name',
        releaseType: 'release type',
        activateContract: 'activate contract',
        triggerContract: 'activate',
        authState: 'Authorization status: ',
        defaultPolicyName: 'Authorization Policy',
        activateContractSuccess: 'success'
    },

    contractManager: {
        resourceList: 'resources',
        masterResource: 'master resource',
        subResourceId: 'subresource contract ID: ',
        bubbleResources: 'bubble resources'
    },

    cropImage: {
        reUpload: 're-upload'
    },

    detailInfo: {
        createDate: 'creation date',
        contractId: 'contract ID',
        partyOne: 'party A',
        partyTwo: 'party B'
    },
    lazyListView: {
        noContentTip: 'No query results',
        loadingTip: 'loading'
    },

    pagination: {
        first: 'first',
        previous: 'previous',
        next: 'next',
        last: 'last',
        fromto: '{from}-{to},',
        total: 'Total {total}'
    },

    policyEditor: {
        inputPlaceholder: 'input here',
        licensePlaceholder: 'input the license ID here',
        demoTpl: 'Sample templates',
        myTpl: 'my templates',
        copyDone: 'Copied',
        defaultPolicyNames: {
            free: 'free policy',
            charge: 'charge policy'
        },
        switchTip: 'Determine to {statusText} the policy <{policyName}>?',
        offline: 'offline',
        online: 'online',
        template: 'template',
        policyPlaceholder: 'input your policy here',
        selectPolicyTitle: 'select a policy template'
    },

    policyList: {
        addPolicy: 'add new policy',
        unnamedPolicy: 'Unnamed policy'
    },

    policyTplSelector: {
        name: 'Template name',
        operation: 'select'
    },

    resourceButton: {
        exception: 'Abnormal resource',
        publish: 'publish',
        offline: 'offline',
        freeze: 'freeze',
        publishTip: 'Determine to {tip}?',
        success: 'success',
        fail: 'fail'
    },

    richEditor: {
        uploadTip: 'Click Upload or drag the image here'
    },

    // ResourceComponents
    uploadResource: 'Upload Resource',
    noMoreThan50m: 'Resources maximum of no more than 50m',
    uploadSuccess: 'Success',
    sureDelete: 'Sure delete a resource file ?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    reselect: 'Reselect',
    resourceDuplicated: 'The resource already exists, cannot be duplicated to create',
    unused: 'Unused',
    mockCanOnlyBeUsedWithinMock: 'Mock resources can only be used within the simulation resource pool, to mock the resource issue, need to create successful, the first mock resources to official resources',
    // UploadCover
    crop: 'Crop',
    coverMoreThan: 'Cover no more than 5M',

    "enableBtnText": "enable",
    "disableBtnText": "disable",
    "status": [ "Already topped", "Already disabled", "Already enabled" ]
};
