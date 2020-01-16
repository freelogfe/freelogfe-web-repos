import common from './common';
import components from './components';
import routes from './routes';

import mock from './mock';
import node from './node';
import layout from './layout';
import resource from './resource';
import release from './release';

export default {

    header: {
        langSwitchQuestion: 'Change language to {lang}?'
    },
    contract: {
        state: '签约状态',
        signedText: '已签约',
        unsignedText: '未签约',
    },

    scheme: {
        schemeName: '授权方案名称',
        schemeNameInputPlaceholder: '请输入授权方案名称',
        schemeStatus: '授权方案状态'
    },

    policy: {
        authTarget: 'authorized target',
        checked: 'verification pass',
        tplName: 'policy template name',
        policyType: 'policy template type',
        tplDesc: 'policy template content',
        inputTip: 'input your policy here',
        checkBtnText: 'verify policy',
        state: 'status',
        createDate: 'creation date',
        types: {
            resource: 'resource policy template',
            user: 'user policy template'
        },

        statesMap: ['normal', 'deleted']
    },

    // release: {
    //     myReleases: 'My releases',
    //     management: 'Release management',
    // },
    presentable: {
        nodeIndex: 'node home page',
        id: 'presentable ID',
        name: 'presentable name',
        label: 'presentable label',
        addLabel: 'new label',

        listTitle: 'Presentables',
        addPresentable: 'add presentable',

        signedText: 'signed',
        unsignedText: 'not signed',
        paramError: 'lack of presentable parameters',
        tabNames: {
            info: 'presentable basic info',
            schemes: 'authorization scheme management',
            contracts: 'contract management',
            policies: 'policy management'
        },
        uncreatedContractTip: 'No contract created',
        gotoCreateContractTip: 'To create a contract',
        contractStateError: 'incomplete contract or no available policy',
        unAuthError: 'not authorized',
        updateFailTip: 'update failed',
        confirmOffline: 'Determine to offline {presentableName}? After the offline, the node will not be able to access normally.',
        confirmOnline: 'Make sure to online {presentableName}? It will automatically replace the current page style after going online.',
        onlineState: 'online status',
        offlineState: 'offline status',
        allState: 'all status',
        onlineText: 'online',
        offlineText: 'offline',
        deletePresentableText: 'confirm to delete {presentableName}?',
        deleteSuccessTip: 'successfully deleted'
    },

    company: {
        name: 'freelog',
        copyright: 'all rights reserved'
    },

    sidebar: {
        open: 'Expand',
        close: 'Fold',
    },

    metaInput: {
        metaJSONError: 'JSON format is incorrect',
        inputTip: 'JSON data describing resource meta information'
    },

    listResourceItem: {
        lastUpdateText: 'Last updated: ',
        updateInfo: 'Update basic information',
        detail: 'detail',
        schemes: 'Management authorization schemes',
        state: 'status: '
    },

    listReleaseItem: {
        manageDetail: 'Management Detail',
        detail: 'detail',
    },

    search: {
        resourcePlaceholder: 'Enter the resource name',
        myRelease: 'My releases',
        noMyReleases: 'no releases',
        noFavorReleases: 'no favorite releases',
        addBtn: 'add',
        placeholder: 'Enter the release name',
        historicVersion: 'Historic version',
        searchTitle: 'search release',
        favorTitle: 'favorite releases'
    },

    axios: {
        unAuthError: 'unauthorized!',
        forbidden: 'Forbidden - no access',
        internalError: 'The server is abnormal inside, please try again later!'
    },


    config: {
        account: {
            feather: 'feather',
            eth: 'Ethereum',
            rmb: 'RMB',
            dollar: 'dollar',
            euro: 'euro'
        },
        contract: {
            statesTip: ['No contract created', 'Not started', 'Executing', 'System locked', 'In effect', '', 'Contract terminated'],
        },
        group: {
            user: 'user group',
            node: 'node group'
        },
        node: {
            status: ['normal', 'unreviewed', 'froze']
        },

        presentable: {
            states: ['Test status', 'Not started', 'Executing', 'In effect', 'User terminated', 'system terminated',]
        },
        resource: {
            states: ['Unknown state', 'Unpublished', 'Published', 'froze',]
        },
        scheme: {
            states: ['Not Enabled', 'Enabled', 'Deprecated',]
        }
    },

    resourceDetailView: {
        tabs: ['Resource Introduction', 'Authorization Scheme', 'Resource Description', 'Meta Information'],
        favorText: 'Add to favorites',
        favorSuccessText: 'successfully added',
        deleteFavorSuccessText: 'successfully deleted',
        deleteFavorText: 'delete from favorites',
        noMetaTip: 'no meta information yet',
        noDescTip: 'no resource description yet',
        addPresentableSuccessText: 'Successfully added to the presentable list',
        addPresentableText: 'add to be presentable',
        offlineTip: 'offline',
        lastUpdateText: 'Recently updated',
        addResourceToNode: 'add to node：',
        noNodesTip: 'node is not created，',
        createNodeTip: 'to create a node',
        moreTip: 'see more'
    },

    resourceEditView: {
        updateSuccess: 'updated successfully',
        uploadFileText: 'drag files here or click Upload',
        uploadFileRule: 'file size does not exceed 50MB, only one file can be uploaded',
        updateText: 'update',
        hideResourceInfo: 'fold',
        panelsTabName: ['Authorization scheme information', 'Authorized resources management', 'Contract management', 'Policy management'],
        noContractTip: 'no contract',
        createContractTip: 'No dependent authorization relationship created',
        createContractText: 'to create',
        depsListTitle: 'dependent resource list',
        noDepsTip: 'No dependent resources to process',
        requiredDepsTip: 'There are still resources not selected authorization policy',
        createSuccess: 'created successfully',
        enableText: 'enable',
        disableText: 'disable',
        addNewScheme: 'Add a new authorization scheme',
        addScheme: 'Add an authorization scheme',
        inputPlaceholder: 'the authorization scheme name...',
        createSchemeTip: 'Cannot be deleted after the scheme is successfully added',
        disableSchemeTip: 'There are no other authorization schemes in the current resource. Deactivating this scheme will cause the resources to be unavailable. Is the operation confirmed?',
        disableSchemeTitle: 'prompt',
        defaultSchemeName: 'unnamed authorization scheme',

        resourceTypeRule: 'The naming format is incorrect and needs to meet {rule}',
        widgetNameRule: 'For example, freelog-namespace-widgetname, namespace and widgetname at least 3 characters',
        versionRule: 'The version number must conform to the semver specification, such as 0.0.1',

        inputNameTip: 'enter a resource name',
        selectTypeTip: 'select a resource type',

        noSupportTip: 'unsupported file type',
        authFailTip: 'Permission not verified',
        noSupportImageTip: 'unsupported image type',

        uploadingTip: 'The resource file is being uploaded, and then click to create after uploading.',
        noFileTip: 'Resource file not uploaded yet',
        metaError: 'The meta format is incorrect: ',
        donotRepeatUpload: 'Cannot add dependent resources repeatedly',


        resourceTitle: 'resource title',
        changeTypeTip: 'uploaded resource file cannot modify resource type',
        changeTypeTip2: ', if you need to modify, please re-upload resources',
        selectType: 'Please select a resource type',
        uploadPopTip: 'to upload resource file by after selecting a resource type',
        resourceFile: 'resource file',
        uploadResourceRule: 'Drag or click to upload, up to 50M',
        reUploadText: 're-upload',
        widgetName: 'widget name',
        widgetVersion: 'widget version',
        uploadPoster: 'upload cover',
        depResources: 'Dependent resources',
        disableModifiedTip: 'Published resources cannot modify dependencies',
        addDepResource: 'Add dependent resources',
        introTitle: 'Resources Introduction',
        metaTitle: 'meta information',
        inputDescTip: 'Please enter a resource description',
        inputMetaTip: 'resource meta information',
        addResource: 'add resource'
    },

    settingView: {
        avatar: 'avatar',
        username: 'user name',
        usernameTip: 'user name not set',
        nickname: 'nickname',
        nicknameTip: 'nickname not set',
        email: 'email',
        emailTip: 'email not set',
        mobilePhone: 'cellphone number',
        mobilePhoneTip: 'cellphone number not set'
    },

    resourceListView: {
        myListTitle: 'My Resources',
        favorListTitle: 'My Favorites',
        noResources: 'no homemade resource',
        noFavorResources: 'no favorite resource'
    },

    aboutView: {
        about: 'About'
    },
    helpView: {
        title: 'Help Center'
    },

    common,
    components,
    routes,

    mock,
    node,
    layout,
    resource,
    release,

}
