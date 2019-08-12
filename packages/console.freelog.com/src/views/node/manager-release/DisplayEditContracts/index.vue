<template>
    <div>

        <TabsHeader v-model="activeTab"></TabsHeader>

        <div
            v-show="activeTab === 'contract'"
            style="background-color: #fafbfb; padding: 10px 10px 20px 0; display: flex;"
        >
            <!-- 左侧导航列表 -->
            <div style="width: 320px; flex-shrink: 0;">
                <!-- 发行列表 -->
                <div v-for="(item, index) in dataSource">
                    <NavTitle v-if="index === 0">当前发行</NavTitle>
                    <NavTitle v-if="index === 1">上抛发行</NavTitle>

                    <!--                    :type=""
                                            :version=""
                                            :date=""-->
                    <NavItem
                        @click="activatedIndex = index"
                        :activated="activatedIndex === index"
                        :title="item.releaseName"
                        :type="item.release.resourceType"
                        :version="item.release.resourceVersions[0].version"
                        :date="item.release.updateDate.split('T')[0]"
                        :tags="item.children.filter(i => i.contract && !i.disabled).map(i => ({policyName: i.policy.policyName, status: i.contract.status}))"
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
                        style="color: #333; font-weight: 600; font-size: 14px; background-color: #fafbfb; padding: 15px; display: flex;"
                    >
                        <div class="text-overflow-ellipsis" style="width: 50%;">
                            授权方：{{dataSource[activatedIndex].releaseName}}
                        </div>
                        <div class="text-overflow-ellipsis" style="width: 50%; padding-left: 10px;">
                            被授权方：{{nodeInfo.nodeName}}
                        </div>
                    </div>

                    <ContractsContainer title="已签约">
                        <!-- 已签约列表 -->
                        <div
                            style="position: relative;"
                            v-for="(item, index) in dataSource[activatedIndex].children.filter(i => i.contract)"
                        >
                            <SignedContract
                                :name="item.contract.contractName"
                                :status="item.contract.status"
                                :contractId="item.contract.contractId"
                                :data="item.contract.createDate.split('T')[0]"
                                :contract="item.contract"
                                :disabled="!!item.disabled"
                                @command="item.disabled ? signPolicy(item.policy.policyId): breakSignPolicy(item.policy.policyId)"
                            ></SignedContract>
                        </div>
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
                            @add="signPolicy(item.policy.policyId)"
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
    export {default} from './index';
</script>

<style scoped>
    .text-overflow-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>


