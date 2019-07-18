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
                    <a style="color: #409eff; padding-bottom: 8px; width: 100px; text-align: center; border-bottom: 2px solid #409eff;">合约</a>
                    <a style="color: #333; padding-bottom: 8px; width: 100px; text-align: center;">授权链</a>
                </div>
                <div style="background-color: #fafbfb; padding: 15px 15px 20px; display: flex;">
                    <div style="width: 380px; flex-shrink: 0;">
                        <div style="font-size: 12px; color: #999; padding-bottom: 5px;">当前发行</div>
                        <a style="padding: 12px 20px; background-color: #fff; display: block;">
                            <div style="color: #333; font-size: 14px; font-weight: 600;">数据库应用</div>
                            <div style="height: 10px;"></div>
                            <span
                                style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff;">策略1</span>
                        </a>
                        <div style="height: 25px;"></div>
                        <div style="font-size: 12px; color: #999; padding-bottom: 5px;">上抛发行</div>

                        <div style="height: 1px; background-color: #d4d4d4; margin-right: 15px;"></div>
                        <a style="padding: 12px 20px; display: block;">
                            <div style="color: #333; font-size: 14px; font-weight: 600;">上抛1</div>
                            <div style="height: 10px;"></div>
                            <span
                                style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff;">策略1</span>
                        </a>
                        <div style="height: 1px; background-color: #d4d4d4; margin-right: 15px;"></div>
                        <a style="padding: 12px 20px; display: block;">
                            <div style="color: #333; font-size: 14px; font-weight: 600;">上抛1</div>
                            <div style="height: 10px;"></div>
                            <span
                                style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff;">策略1</span>
                        </a>
                        <div style="height: 1px; background-color: #d4d4d4; margin-right: 15px;"></div>
                    </div>

                    <div style="flex-shrink: 1; width: 100%; display: flex; flex-direction: column;">
                        <div style="height: 23px; flex-shrink: 0;"></div>
                        <div style="background-color: #fff; height: 100%; flex-shrink: 1; padding: 20px 50px;">

                            <div style="background-color: #fafbfb; border: 1px solid #ccc;">
                                <div style="padding: 0 15px; border-bottom: 1px solid #d8d8d8;">
                                    <div style="height: 14px;"></div>
                                    <div style="display: flex; align-items: center;">
                                        <i style="color: #409eff; font-size: 20px;" class="el-icon-success"></i>
                                        <span
                                            style="font-size: 16px; color: #333; font-weight: 600; padding-left: 5px; padding-right: 20px;">策略1</span>
                                        <span
                                            style="color: #39c500; padding: 0 9px; line-height: 18px; border: 1px solid #39c500; border-radius: 10px; font-size: 14px;">执行中</span>
                                    </div>
                                    <div style="height: 15px"></div>
                                    <div
                                        style="font-size: 12px; color: #999; display: flex; justify-content: space-between;">
                                        <span>授权方：数据库应用</span>
                                        <span>被授权方：节点xxx</span>
                                        <span>合约ID：adhjtyrghgjhxdfthgasdhdflgkftr</span>
                                        <span>签约时间：2019-10-10</span>
                                    </div>
                                    <div style="height: 14px;"></div>
                                </div>
                                <div style="height: 270px;"></div>
                            </div>

                            <div style="height: 30px;"></div>
                            <div style="font-size: 14px; color: #999;">以下策略可供签约</div>
                            <div style="height: 15px;"></div>

                            <div>
                                <div style="display: flex; align-items: center;">
                                    <i style="width: 16px; height: 16px; border-radius: 50%; border: 1px solid #666;"></i>
                                    <span
                                        style="font-size: 16px; color: #333; font-weight: 600; padding-left: 5px; padding-right: 20px;">策略1</span>
                                </div>
                                <div style="height: 5px;"></div>
                                <div style="border: 1px solid #ccc; border-radius: 4px; height: 140px;">

                                </div>
                            </div>
                        </div>
                    </div>
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
