<template>
    <div class="manager-release">
        <div
            style="background-color: #fafbfb; height: 135px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 1220px; display: flex;">
                <img
                    :src="releaseInfo.previewImages || undefined"
                    style="width: 100px; height: 75px; flex-shrink: 0;"
                />
                <div
                    style="height: 75px; width: 100%; flex-shrink: 1; display: flex; flex-direction: column; justify-content: space-between; padding-left: 20px;">
                    <div style="display: flex; align-items: center;">
                        <span
                            style="font-size: 24px; color: #333; padding-right: 15px;">{{releaseInfo.releaseName}}</span>
                        <span
                            style="background-color: #d8d8d8; border-radius: 2px; line-height: 24px; color: #fff; padding: 0 5px; display: inline-block; font-size: 14px;">v{{releaseInfo.version}}</span>
                    </div>
                    <div style="font-size: 14px; color: #999;">
                        <span>类型 {{releaseInfo.resourceType}}</span>
                        <span style="padding: 0 5px;">|</span>
                        <span>签约时间 {{releaseInfo.createDate}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="width: 1220px; margin: 0 auto;">

            <ContentBlock title="节点发行标题">
                <DisplayOrInput
                    v-model="presentableName"
                />
            </ContentBlock>

            <ContentBlock title="标签">
                <FreelogTags
                    actionText="新标签"
                    v-model="userDefinedTags"
                ></FreelogTags>
            </ContentBlock>

            <ContentBlock title="策略">

                <template v-slot:right>
                    <template v-if="isShowEditPolicy">
                        <el-button
                            size="mini"
                            round
                            @click="switchShowEditPolicy(false)"
                        >取消
                        </el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            round
                            style="margin-left: 10px;"
                            @click="saveANewPolicy"
                        >保存
                        </el-button>
                    </template>
                    <el-button
                        v-else
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        round
                        @click="switchShowEditPolicy(true)"
                    >添加策略
                    </el-button>
                </template>

                <template v-if="!isShowEditPolicy">
                    <div
                        v-if="policies.length === 0"
                    >
                        无策略的发行不会在市场中出现
                    </div>
                    <div
                        v-else
                    >
                        <!-- @add-policy="addPolicyHandler" -->
                        <PolicyList
                            :policyList="policies"
                            @update-policies="updatePolicies"
                        ></PolicyList>
                    </div>
                </template>
                <!--                :policy="editTmpPolicy"-->
                <PolicyEditor
                    :policy="newPolicie"
                    :showFooterBtns="false"
                    class="r-e-w-r-p-editor"
                    v-if="isShowEditPolicy"
                ></PolicyEditor>
            </ContentBlock>

            <ContentBlock title="合约相关">
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
                <DisplayEditContracts/>
                <!--                <div-->
                <!--                    v-if="activeTab === 'contract'"-->
                <!--                    style="background-color: #fafbfb; padding: 15px 15px 20px; display: flex;"-->
                <!--                >-->
                <!--                    <div style="width: 380px; flex-shrink: 0;">-->
                <!--                        &lt;!&ndash; 发行列表 &ndash;&gt;-->
                <!--                        <div v-for="(release, index) in resolveReleases">-->
                <!--                            <div v-if="index === 0" style="font-size: 12px; color: #999; padding-bottom: 5px;">当前发行-->
                <!--                            </div>-->
                <!--                            <div v-if="index === 1" style="font-size: 12px; color: #999; padding-bottom: 5px;">上抛发行-->
                <!--                            </div>-->

                <!--                            <a-->
                <!--                                @click="resolveReleaseID = release.releaseId"-->
                <!--                                style="padding: 12px 20px; display: block;"-->
                <!--                                :style="{'background-color': resolveReleaseID === release.releaseId ? '#fff': 'transparent'}"-->
                <!--                            >-->
                <!--                                <div style="color: #333; font-size: 14px; font-weight: 600;">{{release.releaseName}}-->
                <!--                                </div>-->
                <!--                                <div style="height: 10px;"></div>-->
                <!--                                <span-->
                <!--                                    v-for="contract in release.contracts"-->
                <!--                                    style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff; margin-right: 10px;"-->
                <!--                                >-->
                <!--                                {{resolveReleasePolicies.find(i => (i.policyId === contract.policyId)) && resolveReleasePolicies.find(i => (i.policyId === contract.policyId)).policyName}}-->
                <!--                            </span>-->
                <!--                            </a>-->
                <!--                        </div>-->
                <!--                        <div style="height: 25px;"></div>-->

                <!--                        &lt;!&ndash;                        <div style="height: 1px; background-color: #d4d4d4; margin-right: 15px;"></div>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        <a style="padding: 12px 20px; display: block;">&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <div style="color: #333; font-size: 14px; font-weight: 600;">上抛1</div>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <div style="height: 10px;"></div>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <span&ndash;&gt;-->
                <!--                        &lt;!&ndash;                                style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff;">策略1</span>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        </a>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        <div style="height: 1px; background-color: #d4d4d4; margin-right: 15px;"></div>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        <a style="padding: 12px 20px; display: block;">&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <div style="color: #333; font-size: 14px; font-weight: 600;">上抛1</div>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <div style="height: 10px;"></div>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <span&ndash;&gt;-->
                <!--                        &lt;!&ndash;                                style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff;">策略1</span>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        </a>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        <div style="height: 1px; background-color: #d4d4d4; margin-right: 15px;"></div>&ndash;&gt;-->
                <!--                    </div>-->

                <!--                    <div style="flex-shrink: 1; width: 100%; display: flex; flex-direction: column;">-->
                <!--                        <div style="height: 23px; flex-shrink: 0;"></div>-->
                <!--                        <div style="background-color: #fff; height: 100%; flex-shrink: 1; padding: 20px 50px;">-->

                <!--                            &lt;!&ndash; 已签约列表 &ndash;&gt;-->
                <!--                            <div-->
                <!--                                v-for="(item, index) in resolveReleaseContracts"-->
                <!--                                style="background-color: #fafbfb; border: 1px solid #ccc;"-->
                <!--                            >-->
                <!--                                <div style="padding: 0 15px; border-bottom: 1px solid #d8d8d8;">-->
                <!--                                    <div style="height: 14px;"></div>-->
                <!--                                    <div style="display: flex; align-items: center;">-->
                <!--                                        <i-->
                <!--                                            @click="breakSignPolicy(index)"-->
                <!--                                            style="color: #409eff; font-size: 20px;" class="el-icon-success"-->
                <!--                                        ></i>-->
                <!--                                        <span-->
                <!--                                            style="font-size: 16px; color: #333; font-weight: 600; padding-left: 5px; padding-right: 20px;">{{item.contractName}}</span>-->
                <!--                                        <span-->
                <!--                                            style="color: #39c500; padding: 0 9px; line-height: 18px; border: 1px solid #39c500; border-radius: 10px; font-size: 14px;">-->
                <!--                                            <span v-if="item.status === 2">执行中</span>-->
                <!--                                            <span v-if="item.status === 4">激活态</span>-->
                <!--                                        </span>-->
                <!--                                    </div>-->
                <!--                                    <div style="height: 15px"></div>-->
                <!--                                    <div-->
                <!--                                        style="font-size: 12px; color: #999; display: flex; justify-content: space-between;">-->
                <!--                                        <span>授权方：{{item.partyOne}}</span>-->
                <!--                                        <span>被授权方：节点xxx</span>-->
                <!--                                        <span>合约ID：{{item.contractId}}</span>-->
                <!--                                        <span>签约时间：{{item.createDate.split('T')[0]}}</span>-->
                <!--                                    </div>-->
                <!--                                    <div style="height: 14px;"></div>-->
                <!--                                </div>-->
                <!--                                <div style="margin: 0 30px;">-->
                <!--                                    &lt;!&ndash;                                    @update-contract="updateContractAfterEvent"&ndash;&gt;-->
                <!--                                    <div style="height: 20px;"></div>-->
                <!--                                    <ContractDetail-->
                <!--                                        class="contract-policy-content"-->
                <!--                                        :contract.sync="item"-->
                <!--                                        :policyText="item.contractClause.policyText"-->
                <!--                                    ></ContractDetail>-->
                <!--                                    <div style="height: 30px;"></div>-->
                <!--                                </div>-->
                <!--                            </div>-->

                <!--                            <div style="height: 30px;"></div>-->
                <!--                            <div style="font-size: 14px; color: #999;">以下策略可供签约</div>-->
                <!--                            <div style="height: 15px;"></div>-->

                <!--                            &lt;!&ndash; 可签约列表 &ndash;&gt;-->
                <!--                            <div v-for="policie in availablePolicies">-->
                <!--                                <div style="display: flex; align-items: center;">-->
                <!--                                    <i-->
                <!--                                        style="width: 16px; height: 16px; border-radius: 50%; border: 1px solid #666;"-->
                <!--                                        @click="signPolicy(policie)"-->
                <!--                                    ></i>-->
                <!--                                    <span-->
                <!--                                        style="font-size: 16px; color: #333; font-weight: 600; padding-left: 5px; padding-right: 20px;">{{policie.policyName}}</span>-->
                <!--                                </div>-->
                <!--                                <div style="height: 5px;"></div>-->
                <!--                                <div style="border: 1px solid #ccc; border-radius: 4px;">-->
                <!--                                    <pre-->
                <!--                                        style="font-size: 14px; color: #333; padding: 20px;">{{policie.policyText}}</pre>-->
                <!--                                </div>-->
                <!--                            </div>-->
                <!--                        </div>-->
                <!--                    </div>-->
                <!--                </div>-->
                <!--                <div>-->
                <!--                    &lt;!&ndash;  @contracts-change="contractsChangeHandler" &ndash;&gt;-->
                <!--                    <ContractManager-->
                <!--                        :contracts="resolveReleases"-->
                <!--                        v-if="resolveReleases.length"-->
                <!--                    ></ContractManager>-->
                <!--                </div>-->
                <div v-if="activeTab === 'authorize'">
                    <!--                    :depReleasesDetailList="depReleasesDetailList"
                                            :contracts="contracts"-->
                    <ReleaseEditorContract
                        :release="releaseDetail"
                    ></ReleaseEditorContract>
                </div>
            </ContentBlock>
        </div>
        <div style="height: 65px;"></div>
    </div>
</template>

<script>
    import ManagerRelease from './index.js';

    export default ManagerRelease;
</script>

<style lang="less">
    .manager-release {
        .policy-input-item.edit-mode {
            margin-bottom: 0;
        }

    }

</style>
