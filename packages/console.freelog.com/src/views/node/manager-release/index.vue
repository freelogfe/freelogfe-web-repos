<template>
    <div class="manager-release">

        <div
            style="margin: 0 auto; width: 1190px;"
        >
            <BreadCrumb
                :list="[
                    {text: releaseInfo.resourceType === 'page_build' ? $t('node.nodePageStyle') : $t('node.presentableManagement'), to: `/node/manager/${nodeId}?isPageStyle=${(releaseInfo.resourceType === 'page_build').toString()}`},
                    {text: $t('node.presentableInfo')}
                ]"
            />
        </div>

        <div style="height: 30px;"></div>

        <OverviewHeader
            v-if="!!releaseInfo"
            :theID="releaseInfo.theID"
            :previewSrc="releaseInfo.previewImages || undefined"
            :title="releaseInfo.releaseName"
            :type="'release'"
            :resourceType="releaseInfo.resourceType | pageBuildFilter"
            :version="releaseInfo.version"
            :content="releaseInfo.intro"
        />
        <ModuleBlock>

            <BlockItem :label="$t('node.status')">
                <template v-if="releaseInfo.resourceType === 'page_build'">
                    <div
                        v-show="!isOnline"
                        class="manager-release__state"
                    >
                        <label>{{$t('node.inactive')}}</label>
                        <a
                            @click="onLineAndOffLine"
                        >{{$t('node.active')}}</a>
                    </div>
                    <div
                        v-show="isOnline"
                        class="manager-release__state"
                    >
                        <label>{{$t('node.activated')}}</label>
                        <!--                    <a-->
                        <!--                        @click="onLineAndOffLine"-->
                        <!--                    >下线</a>-->
                    </div>
                </template>
                <template v-else>
                    <div
                        v-show="!isOnline"
                        class="manager-release__state"
                    >
                        <label>{{$t('node.noOnline')}}</label>
                        <a
                            @click="onLineAndOffLine"
                        >{{$t('node.action.online')}}</a>
                    </div>
                    <div
                        v-show="isOnline"
                        class="manager-release__state"
                    >
                        <label>{{$t('node.online')}}</label>
                        <a
                            @click="onLineAndOffLine"
                        >{{$t('node.action.downline')}}</a>
                    </div>
                </template>
            </BlockItem>

            <BlockItem :label="$t('node.presentableName')">
                <ConfirmInput
                    :value="presentableName"
                    @confirmChange="confirmChange"
                />
            </BlockItem>

            <BlockItem
                :label="$t('node.displayVersion')"
                v-if="versions.length !== 0"
            >
                <el-select
                    v-model="versionValue"
                    class="manager-release__version"
                >
                    <el-option
                        v-for="item in versions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </BlockItem>

            <BlockItem :label="$t('node.tags')">
                <div style="height: 5px;"></div>
                <FreelogTags
                    v-model="userDefinedTags"
                />
            </BlockItem>

            <BlockItem :label="$t('node.authorizationPolicy')">
                <template v-if="!isShowEditPolicy">
                    <div
                        v-if="policies.length === 0"
                        class="manager-release__policy"
                    >
                        <el-button
                            @click="switchShowEditPolicy(true)"
                            type="primary"
                            size="small"
                        >{{$t('node.addPolicy')}}
                        </el-button>
                        <el-popover
                            placement="top"
                            trigger="hover"
                            :content="$t('node.noPolicyNotAppear')"
                        >
                            <div
                                slot="reference"
                                class="manager-release__policy__warning"
                            >
                                <i
                                    class="el-icon-warning"
                                />
                            </div>
                        </el-popover>
                    </div>
                    <PolicyList
                        v-if="policies.length > 0"
                        class="manager-release__policy__list"
                        @add-policy="switchShowEditPolicy(true)"
                        :policyList="policies"
                        @update-policies="updatePolicies"
                    />
                    <!--                        </div>-->
                </template>
                <!--                :policy="editTmpPolicy"-->
                <PolicyEditor
                    :policy="newPolicie"
                    :showFooterBtns="true"
                    class="r-e-w-r-p-editor"
                    v-if="isShowEditPolicy"
                    @save="saveANewPolicy"
                    @cancel="switchShowEditPolicy(false)"
                />
            </BlockItem>
        </ModuleBlock>

        <ContentBlock :title="$t('node.authorization')">
            <DisplayEditContracts/>
        </ContentBlock>
        <!--        </div>-->
        <div style="height: 65px;"></div>
    </div>
</template>

<script>
    import ManagerRelease from './index.js';


    export default ManagerRelease;
</script>

<style lang="less" scoped>
    @import '../../../styles/variables.less';
    @import "index";

</style>

<style lang="less">
    .manager-release {
        .policy-input-item.edit-mode {
            margin-bottom: 0;
        }

    }
</style>
