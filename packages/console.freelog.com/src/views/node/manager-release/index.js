import ContentBlock from './ContentBlock.vue';
import DisplayOrInput from './DisplayOrInput.vue';
import DisplayEditContracts from './DisplayEditContracts/index.vue';
import FreelogTags from '@/components/Tags/index.vue';
import PolicyEditor from '@/components/PolicyEditor/index.vue';
import PolicyList from '@/components/PolicyList/list/index.vue';
import ContractManager from '@/components/ContractManager/index.vue';
import ReleaseEditorContract from '@/views/release/contract/index.vue'

export default {
    name: 'manager-release',
    components: {
        ContentBlock,
        DisplayOrInput,
        FreelogTags,
        PolicyEditor,
        PolicyList,
        ContractManager,
        DisplayEditContracts,
        ReleaseEditorContract,
    },
    data() {
        return {

            // 是否是初始状态
            initState: true,
            // 发行相关信息
            releaseInfo: {
                previewImages: '',
                releaseName: '',
                resourceType: '',
                version: '',
                createDate: '',
            },
            // 名称
            presentableName: null,
            // 用户定义标签
            userDefinedTags: null,

            // 策略是否是编辑状态
            isShowEditPolicy: false,
            // 策略列表
            policies: [],
            // 新建的策略
            newPolicie: {policyName: '未命名策略', policyText: ''},

            // 当前底部激活的是哪个 tabs
            activeTab: 'contract',

            // 发行以及其上抛的解决方式
            resolveReleases: [
                // {
                // releaseId: "5d391df0dd147a002b25d57e",
                // releaseName: "12345123451234/发行G",
                // policies: [
                // {
                //     id: '',
                //     name: '',
                // }
                // ]
                // }
            ],
            // 当前激活的发行 ID
            resolveReleaseID: '',
            // 当前激活的发行的已签约的合约列表
            resolveReleaseContracts: [],

            // 所有发行的策略
            resolveReleasePolicies: [],
            // 当前 presonble 依赖的所有发行，为了获取未签约的发行
            releases: [],

            // 发行详情，作为授权链的数据源
            releaseDetail: null,
        };
    },
    mounted() {
        this.handleInitInfo();
        // this.getContractsList();
        // this.freshBottomPolicy();
        // console.log(this.$route.query.addPolicy, '!@#$!@#$@#$');
        if (this.$route.query.addPolicy === 'true') {
            this.switchShowEditPolicy(true);
        }
    },
    methods: {
        /**
         * 根据 presentableId 初始化信息
         * @return {Promise<void>}
         */
        async handleInitInfo() {
            // console.log(this.$route.params.presentableId, 'paramsparamsparamsparams');
            const res = await this.$axios.get(`/v1/presentables/${this.$route.params.presentableId}`);
            const result = res.data.data;
            setTimeout(() => this.initState = false);

            const time = new Date(result.createDate);
            // console.log(time, 'tTWERFTTTTTTT');
            // console.log(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), '@AFDSASDF@#RASEZCX');
            this.releaseInfo = {
                previewImages: result.releaseInfo.previewImages[0] ? result.releaseInfo.previewImages[0] : undefined,
                releaseName: result.releaseInfo.releaseName,
                resourceType: result.releaseInfo.resourceType,
                version: result.releaseInfo.version,
                createDate: [
                    [time.getFullYear(), (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1), (time.getDate() < 10 ? '0' : '') + time.getDate()].join('-'),
                    [(time.getHours() < 10 ? '0' : '') + time.getHours(), (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()].join(':')
                ].join(' '),
            };
            this.presentableName = result.presentableName;
            this.userDefinedTags = result.userDefinedTags;
            this.policies = result.policies;
            // console.log(result.resolveReleases, 'PPPPPPPPPPPPPPPPPPPPP');
            this.resolveReleases = result.resolveReleases;
            this.resolveReleaseID = result.resolveReleases[0].releaseId;

            // setTimeout(() => {
            //     this.handleResolveReleases();
            // });

            // releaseDetail
            const res2 = await this.$axios.get(`/v1/releases/${result.releaseInfo.releaseId}`);
            // console.log(res2, 'res2res2res2res2res2');
            this.releaseDetail = res2.data.data;
        },
        /**
         * 更新 presentable 数据
         */
        async updatePresentable(params) {
            return await this.$axios.put(`/v1/presentables/${this.$route.params.presentableId}`, params);
        },
        /**
         * 显示添加策略的编辑框
         */
        switchShowEditPolicy(bool) {
            this.isShowEditPolicy = bool;
            this.newPolicie = {policyName: '未命名策略', policyText: ''};
        },
        /**
         * 保存一个新策略
         */
        async saveANewPolicy() {
            // console.log(this.btoa, 'newPolicienewPolicie');
            const res = await this.updatePresentable({
                policyInfo: {
                    addPolicies: [
                        {
                            policyName: this.newPolicie.policyName,
                            policyText: window.btoa(this.newPolicie.policyText),
                        },
                    ],
                },
            });
            // console.log(res.data.data, 'handleInitInfo');
            // this.handleInitInfo(res.data.data);
            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isShowEditPolicy = false;
            this.policies = res.data.data.policies;
            this.$message.success('添加策略成功');
        },

        /**
         * 添加一个新策略
         */
        // addPolicyHandler() {
        //
        // },
        /**
         * 更新一个策略的状态
         * @param policie
         */
        async updatePolicies(policie) {
            // console.log(policie, 'policiespoliciespoliciespolicies');
            const res = await this.updatePresentable({
                policyInfo: {
                    updatePolicies: [
                        {
                            policyId: policie.policyId,
                            policyName: policie.policyName,
                            status: policie.status,
                        },
                    ],
                },
            });
            // console.log(res.data.data, 'handleInitInfo');
            // this.handleInitInfo(res.data.data);
            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isShowEditPolicy = false;
            this.policies = res.data.data.policies;
            this.$message.success('更新策略成功');
        },

        /**
         *
         * @return {Promise<void>}
         */
        // async getContractsList() {
        //     // console.log(this.resolveReleases, 'this.resolveReleasesthis.resolveReleases1111111');
        //     if (this.resolveReleases.length === 0) {
        //         return;
        //     }
        //     // console.log(this.resolveReleases, '6666666666');
        //     // console.log(this.resolveReleaseID, '2222222');
        //     const contractIds = this.resolveReleases.find(i => i.releaseId === this.resolveReleaseID).contracts.map(i => i.contractId).join(',');
        //     // console.log(contractIds, '222222222222222');
        //     const res = await this.$axios.get('/v1/contracts/list', {
        //         params: {
        //             contractIds
        //         },
        //     });
        //     // console.log(res, 'resresresresWWWWWWWWWW');
        //     this.resolveReleaseContracts = res.data.data;
        //     // console.log(this.resolveReleaseContracts, 'this.resolveReleaseContract');
        // },
        /**
         * 组织处理 resolveRelease
         * @return {Promise<void>}
         */
        // async handleResolveReleases() {
        //     const releaseIds = this.resolveReleases.map(i => i.releaseId);
        //     const res = await this.$axios.get('/v1/releases/list', {
        //         params: {
        //             releaseIds: releaseIds.join(','),
        //         },
        //     });
        //     // console.log(res, 'resres');
        //     this.releases = res.data.data;
        //     this.resolveReleasePolicies = getPolicies(res.data.data);
        // },

        /**
         * 对可供签约的策略签约
         */
        // async signPolicy(policie) {
        //     // console.log(this.resolveReleaseContracts, 'policiepolicie');
        //     // console.log(policie, 'policiepolicie');
        //     await this.updatePresentable({
        //         resolveReleases: [
        //             {
        //                 releaseId: this.resolveReleaseID,
        //                 contracts: [
        //                     ...this.resolveReleaseContracts.map(i => ({
        //                         policyId: i.policyId,
        //                     })),
        //                     {
        //                         policyId: policie.policyId,
        //                     }
        //                 ],
        //             },
        //         ]
        //     });
        //     // console.log('getContractsListgetContractsListgetContractsList');
        //     // setTimeout(() => {
        //     //     this.handleInitInfo();
        //     //     this.getContractsList();
        //     // }, 1000);
        //     // this.freshBottomPolicy();
        // },
        /**
         * 解约
         */
        // async breakSignPolicy(index) {
        //     await this.updatePresentable({
        //         resolveReleases: [
        //             {
        //                 releaseId: this.resolveReleaseID,
        //                 contracts: [
        //                     ...this.resolveReleaseContracts
        //                         .filter((i, j) => j !== index)
        //                         .map(i => ({
        //                             policyId: i.policyId,
        //                         })),
        //                 ],
        //             },
        //         ]
        //     });
        //     // console.log('breakSignPolicybreakSignPolicybreakSignPolicybreakSignPolicy');
        //     // this.handleInitInfo();
        //     // this.getContractsList();
        //     // this.freshBottomPolicy();
        // },
        /**
         * 刷新底部策略
         * @return {Promise<void>}
         */
        // async freshBottomPolicy() {
        //     setTimeout(async () => {
        //         const res = await this.$axios.get(`/v1/presentables/${this.$route.params.presentableId}`);
        //         // console.log(res, '0000000000000000000000000');
        //     }, 100);
        //
        // }
    },
    watch: {
        presentableName(val, oldVal) {
            if (this.initState) {
                return;
            }
            // 更新 presentableName
            // console.log(this.presentableName, val, oldVal, 'presentableNamepresentableNamepresentableName');
            this.updatePresentable({
                presentableName: val,
            });
            this.$message.success('节点发行标题更新成功');
        },
        userDefinedTags(val) {
            if (this.initState) {
                return;
            }
            // console.log(this.userDefinedTags, 'userDefinedTagsuserDefinedTagsuserDefinedTags');
            this.updatePresentable({
                userDefinedTags: val,
            });
            this.$message.success('用户标签更新成功');
        },
        // resolveReleaseID() {
        //     this.getContractsList();
        // },
        // policies() {
        //     if (this.initState) {
        //         return;
        //     }
        //     console.log(this.policies, 'releasePoliciereleasePoliciereleasePoliciereleasePolicie');
        // }
    },
    computed: {
        availablePolicies() {
            // console.log(this.resolveReleases, '12342341234213');
            const resolveReleases = this.resolveReleases.find(i => i.releaseId === this.resolveReleaseID);
            if (!resolveReleases) {
                return [];
            }
            // console.log(resolveReleases, 'resolveReleasesresolveReleases');
            const currentReleasePolicyIds = resolveReleases.contracts.map(i => i.policyId);
            // console.log(currentReleasePolicyIds, '111111111');
            const findRelease = this.releases.find(i => i.releaseId === this.resolveReleaseID);
            // console.log(findRelease, '222222222222');
            if (!findRelease) {
                return [];
            }
            return findRelease.policies.filter(i => !currentReleasePolicyIds.includes(i.policyId));
        },
    },
}

function getPolicies(releases) {
    const policies = [];
    for (const i of releases) {
        for (const j of i.policies) {
            policies.push(j);
        }
    }
    return policies;
}
