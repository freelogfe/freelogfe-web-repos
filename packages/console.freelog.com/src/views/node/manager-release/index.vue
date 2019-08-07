<template>
    <div class="manager-release">
        <div
            style="background-color: #fafbfb; height: 135px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 1220px; display: flex;">
                <img
                    :src="releaseInfo.previewImages || undefined"
                    style="width: 100px; height: 75px; flex-shrink: 0;"
                    class="resource-default-preview"
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
<!--                <div style="display: flex; font-size: 14px; font-weight: 600;">-->
<!--                    <a-->
<!--                        style="padding-bottom: 8px; width: 100px; text-align: center;"-->
<!--                        :style="{color: activeTab === 'contract' ? '#409eff' : '#333', 'border-bottom':  activeTab === 'contract' ? '2px solid #409eff': 'none'}"-->
<!--                        @click="activeTab = 'contract'"-->
<!--                    >合约</a>-->
<!--                    <a-->
<!--                        style="padding-bottom: 8px; width: 100px; text-align: center;"-->
<!--                        :style="{color: activeTab === 'authorize' ? '#409eff' : '#333', 'border-bottom':  activeTab === 'authorize' ? '2px solid #409eff': 'none'}"-->
<!--                        @click="activeTab = 'authorize'"-->
<!--                    >授权链</a>-->
<!--                </div>-->
                <DisplayEditContracts/>
<!--                <div v-show="activeTab === 'authorize'">-->

<!--                </div>-->
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
