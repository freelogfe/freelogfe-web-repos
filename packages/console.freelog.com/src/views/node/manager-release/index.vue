<template>
    <div class="manager-release">
        <div
            style="background-color: #fafbfb; height: 135px; display: flex; align-items: center; justify-content: center;">
            <div class="manager-release-header">
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
                        <span>{{$t('type')}} {{releaseInfo.resourceType}}</span>
                        <span style="padding: 0 5px;">|</span>
                        <span>{{$t('signingTime')}} {{releaseInfo.createDate}}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="manager-release-body">

            <ContentBlock :title="$t('nodeReleaseTitle')">
                <DisplayOrInput
                    v-model="presentableName"
                />
            </ContentBlock>

            <ContentBlock :title="$t('tags')">
                <FreelogTags
                    :actionText="$t('newTag')"
                    v-model="userDefinedTags"
                ></FreelogTags>
            </ContentBlock>

            <ContentBlock :title="$t('policies')">

                <template v-slot:right>
                    <template v-if="isShowEditPolicy">
                        <el-button
                            size="mini"
                            round
                            @click="switchShowEditPolicy(false)"
                        >{{$t('cancel')}}
                        </el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            round
                            style="margin-left: 10px;"
                            @click="saveANewPolicy"
                        >{{$t('save')}}
                        </el-button>
                    </template>
                    <div v-if="!isShowEditPolicy && policies.length > 0"
                         style="height: 28px; display: flex; align-items: center;">
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
                        :content="$t('noPolicyNotAppear')"
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
                        >{{$t('addPolicy')}}
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

            <ContentBlock :title="$t('authorization')">
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

<style lang="less" scoped>
    @import '../../../styles/variables.less';

    .manager-release-header {
        width: @main-content-width-1190;
        display: flex;
    }

    .manager-release-body {
        width: @main-content-width-1190;
        margin: 0 auto;
    }

    @media screen and (max-width: 1250px) {
        .manager-release-header {
            width: @main-content-width-990;
            display: flex;
        }

        .manager-release-body {
            width: @main-content-width-990;
            margin: 0 auto;
        }
    }

</style>

<style lang="less">
    .manager-release {
        .policy-input-item.edit-mode {
            margin-bottom: 0;
        }

    }
</style>
