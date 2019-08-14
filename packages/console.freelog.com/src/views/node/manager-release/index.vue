<template>
    <div class="manager-release">
        <div
            style="background-color: #fafbfb; height: 135px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 990px; display: flex;">
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

        <div style="width: 990px; margin: 0 auto;">

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
                    <div v-if="!isShowEditPolicy && policies.length > 0" style="height: 28px; display: flex; align-items: center;">
                        <a
                            style="width: 26px; height: 20px; align-items: center; justify-content: center; background-color: #409eff; border-radius: 10px; text-align: center;"
                            @click="switchShowEditPolicy(true)"
                        >
                            <i class="el-icon-plus" style="font-weight: bolder; color: #fff; font-size: 12px;"></i>
                        </a>
                    </div>
                    <el-popover
                        v-if="!isShowEditPolicy && policies.length === 0"
                        placement="top"
                        trigger="hover"
                        content="无策略的发行不会出现在市场中"
                    >
                        <div style="height: 28px; display: flex; align-items: center;" slot="reference">
                            <i
                                class="el-icon-warning"
                                style="font-size: 20px; color: #ffc210;"
                            ></i>
                        </div>
                    </el-popover>
                </template>

                <template v-if="!isShowEditPolicy">
                    <div
                        v-if="policies.length === 0"
                    >
                        <el-button
                            @click="switchShowEditPolicy(true)"
                            size="small"
                            type="primary"
                        >添加策略
                        </el-button>
                    </div>
                    <div v-else>
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

            <ContentBlock title="授权管理">
                <DisplayEditContracts/>
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
