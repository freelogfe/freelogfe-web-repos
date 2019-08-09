<template>
    <div>

        <TabsHeader v-model="activeTab"></TabsHeader>

        <div
            v-show="activeTab === 'contract'"
            style="background-color: #fafbfb; padding: 10px 10px 20px 0; display: flex;"
        >
            <!-- 左侧导航列表 -->
            <div style="width: 380px; flex-shrink: 0;">
                <!-- 发行列表 -->
                <div v-for="(release, index) in dataSource">
                    <NavTitle v-if="index === 0">当前发行</NavTitle>
                    <NavTitle v-if="index === 1">上抛发行</NavTitle>

                    <NavItem
                        @click="activatedIndex = index"
                        :activated="activatedIndex === index"
                        :title="release.releaseName"
                        :tags="release.children.filter(i => i.contract).map(i => i.policy.policyName)"
                    ></NavItem>
                </div>
                <div style="height: 25px;"></div>
            </div>

            <div style="flex-shrink: 1; width: 100%; display: flex; flex-direction: column;">
                <div
                    v-if="activatedIndex !== -1"
                    style="background-color: #fff; height: 100%; flex-shrink: 1; padding: 20px 50px;"
                >

                    <div
                        style="line-height: 45px; color: #333; font-weight: 600; font-size: 14px; background-color: #fafbfb; padding: 0 15px;">
                        <span style="padding-right: 100px;">授权方：{{dataSource[activatedIndex].releaseName}}</span>
                        <span>被授权方：{{nodeInfo.nodeName}}</span>
                    </div>

                    <ContractsContainer title="已签约">
                        <!-- 已签约列表 -->
                        <SignedContract
                            v-for="(item, index) in dataSource[activatedIndex].children.filter(i => i.contract)"
                            :name="item.contract.contractName"
                            :status="item.contract.status"
                            :contractId="item.contract.contractId"
                            :data="item.contract.createDate.split('T')[0]"
                            :contract="item.contract"
                        ></SignedContract>
                    </ContractsContainer>

                    <ContractsContainer
                        title="以下策略可供签约"
                        v-if="dataSource[activatedIndex].children.filter(i => !i.contract).length > 0"
                    >

                        <!-- 可签约列表 -->
                        <UnsignedContract
                            v-for="item in dataSource[activatedIndex].children.filter(i => !i.contract)"
                            :policyName="item.policy.policyName"
                            :policyText="item.policy.policyText"
                        ></UnsignedContract>
                    </ContractsContainer>
                </div>
            </div>

        </div>
        <ReleaseEditorContract
            v-show="activeTab === 'authorize'"
            :release="{releaseName: this.presentableName}"
            :depReleasesDetailList="depReleasesDetailList"
            :contracts="contracts"
        ></ReleaseEditorContract>
    </div>
</template>

<script>
    // import {ContractDetail} from '@freelog/freelog-ui-contract';
    import ReleaseEditorContract from '@/views/release/contract/index.vue';
    import NavTitle from "./NavTitle";
    import NavItem from "./NavItem";
    import TabsHeader from "./TabsHeader";
    import SignedContract from "./SignedContract";
    import ContractsContainer from "./ContractsContainer";
    import UnsignedContract from "./UnsignedContract";

    export default {
        name: 'DisplayEditContracts',
        components: {
            UnsignedContract,
            ContractsContainer,
            SignedContract,
            TabsHeader,
            NavItem,
            NavTitle,
            // ContractDetail,
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
            this.getAllContracts();
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

            async getAllContracts() {
                const res = await this.$axios.get('/v1/contracts/list', {
                    params: {
                        targetIds: '5d391df0dd147a002b25d57e',
                        partyTwo: '80000034'
                    }
                });
                console.log(res, '!!!!!!!!!!!!!');
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


