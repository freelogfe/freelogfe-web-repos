<template>
    <div>

        <div style="display: flex; font-size: 14px; font-weight: 600;">
            <a
                style="padding-bottom: 8px; width: 100px; text-align: center;"
                :style="{color: activeTab === 'contract' ? '#409eff' : '#333', 'border-bottom':  activeTab === 'contract' ? '2px solid #409eff': 'none'}"
                @click="activeTab = 'contract'"
            >合约</a>
            <a
                style="padding-bottom: 8px; width: 100px; text-align: center;"
                :style="{color: activeTab === 'authorize' ? '#409eff' : '#333', 'border-bottom':  activeTab === 'authorize' ? '2px solid #409eff': 'none'}"
                @click="activeTab = 'authorize'"
            >授权链</a>
        </div>

        <div
            v-show="activeTab === 'contract'"
            style="background-color: #fafbfb; padding: 15px 15px 20px; display: flex;"
        >
            <div style="width: 380px; flex-shrink: 0;">
                <!-- 发行列表 -->
                <div v-for="(release, index) in dataSource">
                    <div
                        v-if="index === 0"
                        style="font-size: 12px; color: #999; padding-bottom: 5px;">当前发行
                    </div>
                    <div
                        v-if="index === 1"
                        style="font-size: 12px; color: #999; padding-bottom: 5px;">上抛发行
                    </div>

                    <a
                        @click="activatedIndex = index"
                        style="padding: 12px 20px; display: block;"
                        :style="{'background-color': activatedIndex === index ? '#fff': 'transparent'}"
                    >
                        <div style="color: #333; font-size: 14px; font-weight: 600;">{{release.releaseName}}
                        </div>
                        <div style="height: 10px;"></div>
                        <span
                            v-for="item in release.children.filter(i => i.contract)"
                            style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff; margin-right: 10px;"
                        >{{item.policy.policyName}}</span>
                    </a>
                </div>
                <div style="height: 25px;"></div>

            </div>

            <div style="flex-shrink: 1; width: 100%; display: flex; flex-direction: column;">
                <div style="height: 23px; flex-shrink: 0;"></div>
                <div
                    v-if="activatedIndex !== -1"
                    style="background-color: #fff; height: 100%; flex-shrink: 1; padding: 20px 50px;"
                >

                    <!-- 已签约列表 -->
                    <div
                        v-for="(item, index) in dataSource[activatedIndex].children.filter(i => i.contract)"
                        style="background-color: #fafbfb; border: 1px solid #ccc;"
                    >
                        <!--                    <div>{{selectedPolicyIDs}}</div>-->
                        <!--                    <div>{{item.contract.policyId}}</div>-->
                        <div style="padding: 0 15px; border-bottom: 1px solid #d8d8d8;">
                            <div style="height: 14px;"></div>
                            <div style="display: flex; align-items: center;">
                                <i
                                    v-show="selectedPolicyIDs.includes(item.contract.policyId)"
                                    @click="breakSignPolicy(item.contract.policyId)"
                                    style="color: #409eff; font-size: 20px;" class="el-icon-success"
                                ></i>
                                <i
                                    v-show="!selectedPolicyIDs.includes(item.policy.policyId)"
                                    style="width: 18px; height: 18px; border-radius: 50%; border: 1px solid #666;"
                                    @click="signPolicy(item.contract.policyId)"
                                ></i>
                                <span
                                    style="font-size: 16px; color: #333; font-weight: 600; padding-left: 5px; padding-right: 20px;">{{item.contract.contractName}}</span>
                                <span
                                    style="color: #39c500; padding: 0 9px; line-height: 18px; border: 1px solid #39c500; border-radius: 10px; font-size: 14px;">
                                            <span v-if="item.contract.status === 2">执行中</span>
                                            <span v-if="item.contract.status === 4">激活态</span>
                                        </span>
                            </div>
                            <div style="height: 15px"></div>
                            <div
                                style="font-size: 12px; color: #999; display: flex; justify-content: space-between;">
                                <span>授权方：{{item.contract.partyOne}}</span>
                                <span>被授权方：{{nodeInfo.nodeDomain}}</span>
                                <span>合约ID：{{item.contract.contractId}}</span>
                                <span>签约时间：{{item.contract.createDate.split('T')[0]}}</span>
                            </div>
                            <div style="height: 14px;"></div>
                        </div>
                        <div style="margin: 0 30px;">
                            <!--                                    @update-contract="updateContractAfterEvent"-->
                            <div style="height: 20px;"></div>
                            <ContractDetail
                                class="contract-policy-content"
                                :contract.sync="item.contract"
                                :policyText="item.contract.contractClause.policyText"
                            ></ContractDetail>
                            <div style="height: 30px;"></div>
                        </div>
                    </div>

                    <div v-show="dataSource[activatedIndex].children.filter(i => !i.contract).length > 0">
                        <div style="height: 30px;"></div>
                        <div style="font-size: 14px; color: #999;">以下策略可供签约</div>
                        <div style="height: 15px;"></div>
                    </div>

                    <!-- 可签约列表 -->
                    <div
                        v-for="item in dataSource[activatedIndex].children.filter(i => !i.contract)"
                    >
                        <div style="display: flex; align-items: center;">
                            <i
                                v-show="!selectedPolicyIDs.includes(item.policy.policyId)"
                                style="width: 18px; height: 18px; border-radius: 50%; border: 1px solid #666;"
                                @click="signPolicy(item.policy.policyId)"
                            ></i>
                            <i
                                v-show="selectedPolicyIDs.includes(item.policy.policyId)"
                                @click="breakSignPolicy(item.policy.policyId)"
                                style="color: #409eff; font-size: 20px;" class="el-icon-success"
                            ></i>
                            <span
                                style="font-size: 16px; color: #333; font-weight: 600; padding-left: 5px; padding-right: 20px;">{{item.policy.policyName}}</span>
                        </div>
                        <div style="height: 5px;"></div>
                        <div style="border: 1px solid #ccc; border-radius: 4px;">
                            <pre style="font-size: 14px; color: #333; padding: 20px;">{{item.policy.policyText}}</pre>
                        </div>
                    </div>
                    <div style="height: 10px;"></div>
                    <div style="text-align: right;">
                        <el-button
                            v-show="isSignDirty"
                            type="primary"
                            size="medium"
                            round
                            @click="updateSignPolicy"
                        >签约
                        </el-button>
                    </div>
                </div>
            </div>


        </div>
        <ReleaseEditorContract
            v-show="activeTab === 'authorize'"
            :release="{releaseName: this.presentableName}"
            :depReleasesDetailList="depReleasesDetailList"
            :contracts="contracts"
        ></ReleaseEditorContract>
        <!--        <br/>-->
        <!--        <div>depReleasesDetailList {{depReleasesDetailList}}</div>-->
        <!--        <br/>-->
        <!--        <div>contracts {{contracts}}</div>-->
    </div>
</template>

<script>
    import {ContractDetail} from '@freelog/freelog-ui-contract';
    import ReleaseEditorContract from '@/views/release/contract/index.vue';

    export default {
        name: 'DisplayEditContracts',
        components: {
            ContractDetail,
            ReleaseEditorContract,
        },
        data() {
            return {
                dataSource: [],
                activatedIndex: -1,

                nodeInfo: null,
                selectedPolicyIDs: [],

                isSignDirty: false,

                activeTab: 'contract',
                presentableName: '',
                depReleasesDetailList: [],
                contracts: [],
            };
        },
        mounted() {
            this.handleData();
        },
        methods: {
            async handleData() {
                const res = await this.$axios.get(`/v1/presentables/${this.$route.params.presentableId}`);
                const data = res.data.data;
                // console.log(data, 'datadatadata');

                if (!this.nodeInfo) {
                    this.handleNodeInfo(data.nodeId);
                }

                // console.log(data, '000000000000000');
                const dataSource = data.resolveReleases.map(i => ({
                    releaseId: i.releaseId,
                    releaseName: i.releaseName,
                    children: i.contracts.map(j => ({
                        contract: {
                            id: j.contractId,
                        },
                        policy: {
                            id: j.policyId,
                        }
                    })),
                }));

                const policies = await getContracts(this.$axios, getContractIDs(dataSource));

                // console.log(policies, 'policiespoliciespolicies');
                // console.log(policies, '999999999');
                for (const item of dataSource) {
                    for (const item2 of item.children) {
                        const id = item2.contract.id;
                        item2.contract = policies.find(i => i.contractId === id);
                    }
                }

                // console.log(dataSource, 'WWWWWWWWWWWWWW');

                const releases = await getReleases(this.$axios, dataSource.map(i => i.releaseId));
                // console.log(releases, 'releasesreleasesreleases');

                // console.log(releases, '3333333333333333');

                // 根据策略，合并合约
                for (const item of dataSource) {
                    // 从对应的发行中获取对应的策略数组
                    const policies = getPoliciesByReleasesAndReleaseID(releases, item.releaseId);
                    const children = policies.map(i => ({
                        policy: i,
                    }));
                    // console.log(children, '6666666666666');
                    for (const i of children) {
                        for (const j of item.children) {
                            // console.log(i, j, '555555555');
                            if (i.policy.policyId === j.policy.id) {
                                // console.log(j, '444444444444');
                                i.contract = j.contract;
                            }
                        }
                    }
                    item.children = children;
                }
                // console.log(dataSource, '1111111111111');

                this.dataSource = dataSource;

                if (this.activatedIndex === -1) {
                    this.activatedIndex = 0;
                }

                // this.selectedPolicyIDs = this.dataSource[this.activatedIndex].children
                //     .filter(i => i.contract)
                //     .map(i => ({
                //         policyId: i.policy.policyId,
                //     }));
                // console.log(this.dataSource, 'CCCCCCCCCC');
                // console.log(this.dataSource[this.activatedIndex], '!@#$%^&*()');

                // console.log(dataSource, 'dataSourcedataSourcedataSource');
                const depReleasesDetailList = [];
                for (const item of dataSource) {
                    const contracts = [];
                    for (const item2 of item.children) {
                        contracts.push(item2.contract)
                    }
                    depReleasesDetailList.push({
                        ...releases.find(i => i.releaseId === item.releaseId),
                        contracts,
                    });
                }
                // console.log(depReleasesDetailList, 'depReleasesDetailListdepReleasesDetailList');
                this.presentableName = data.presentableName;
                this.depReleasesDetailList = depReleasesDetailList;
                this.contracts = policies;
                // this.depReleasesDetailList = this.depReleasesDetailList.map(i => ({
                //     ...i,
                //     contracts: this.contracts,
                // }));
            },
            /**
             * 获取节点信息
             */
            async handleNodeInfo(nodeID) {
                const res = await this.$axios.get(`/v1/nodes/${nodeID}`);
                // console.log(res, 'resres');
                this.nodeInfo = res.data.data;
            },

            /**
             * 对可供签约的策略签约
             */
            async signPolicy(policyId) {
                this.isSignDirty = true;
                this.selectedPolicyIDs.push(policyId);
            },
            /**
             * 解约
             */
            async breakSignPolicy(policyId) {
                this.isSignDirty = true;
                this.selectedPolicyIDs = this.selectedPolicyIDs.filter(j => j !== policyId);
            },
            /**
             * 更新策略
             * @return {Promise<void>}
             */
            async updateSignPolicy() {
                if (this.selectedPolicyIDs.length === 0) {
                    return this.$message.error('最少要选择一个策略');
                }
                this.isSignDirty = false;
                const releaseId = this.dataSource[this.activatedIndex].releaseId;
                const contracts = this.selectedPolicyIDs
                    .map(i => ({
                        policyId: i,
                    }));
                await this.updatePresentable({
                    resolveReleases: [
                        {
                            releaseId,
                            contracts,
                        },
                    ]
                });
                setTimeout(() => {
                    this.handleData()
                }, 10);
            },

            async updatePresentable(params) {
                return await this.$axios.put(`/v1/presentables/${this.$route.params.presentableId}`, params);
            },
        },
        watch: {
            activatedIndex() {
                this.selectedPolicyIDs = this.dataSource[this.activatedIndex].children
                    .filter(i => i.contract)
                    .map(i => i.policy.policyId);
                // .map(i => ({
                //         policyId: i.policy.policyId,
                //     }));
                // console.log(this.selectedPolicyIDs)
            },
        }
    }

    /**
     * 根据合约 IDs 批量查询合约
     */
    async function getContracts(axios, IDs) {
        const res = await axios.get('/v1/contracts/list?', {
            params: {
                contractIds: IDs.join(','),
            }
        });
        return res.data.data;
    }

    /**
     * 根据数据源，获取对应的
     */
    function getContractIDs(dataSource) {
        const contractIDs = [];
        for (const item of dataSource) {
            // console.log(item, 'item');
            for (const item2 of item.children) {
                // console.log(item2, 'item2item2item2');
                contractIDs.push(item2.contract.id);
            }
        }
        return contractIDs;
    }

    /**
     * 根据发行数组和发行ID，获取对应的 发行
     * @param releases
     * @param releaseID
     * @return {Promise<*>}
     */
    function getPoliciesByReleasesAndReleaseID(releases, releaseID) {
        const release = releases.find(i => i.releaseId === releaseID);
        return release ? release.policies : [];
    }

    /**
     * 根据 批量的发行 ID 通过服务端获取批量的发行信息
     * @param axios
     * @param releaseIds
     * @return {Promise<*>}
     */
    async function getReleases(axios, releaseIds) {
        const res = await axios.get('/v1/releases/list', {
            params: {
                releaseIds: releaseIds.join(','),
            }
        });
        return res.data.data;
    }
</script>

<style scoped>

</style>


