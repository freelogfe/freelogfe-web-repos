<template>
    <div class="resource-editor">

        <BlockBody
            v-if="isUpdateResource"
            :tilte="$t('resource.historyRelease')"
        >
            <div class="resource-editor__history">
                <div
                    v-if="releasedList.length === 0"
                    class="resource-editor__history--none"
                >{{$t('resource.noReleaseHistory')}}...
                </div>
                <ReleasedItem
                    v-for="item in releasedList"
                    :name="item.name"
                    :version="item.version"
                    :date="item.date"
                />
            </div>
        </BlockBody>

        <BlockBody :tilte="$t('resource.resourceUpload')">

            <SmallTitle v-if="!isUpdateResource">{{$t('resource.resourceType')}}</SmallTitle>

            <div
                v-if="!isUpdateResource"
                class="resource-editor__type"
            >
                <el-select
                    class="resource-editor__type__select"
                    v-model="resourceType"
                    @change="onChangeResourceType"
                    :placeholder="$t('resource.resourceType')"
                    allow-create
                    filterable
                    :disabled="!!this.uploadFileInfo.name"
                >
                    <el-option
                        v-for="item in resourceTypes"
                        :key="item"
                        :label="item | pageBuildFilter"
                        :value="item">
                    </el-option>

                </el-select>

                <div
                    :style="{color: resourceTypeTip? 'red': '#afafaf'}"
                    class="animated resource-editor__type__tip"
                    :class="{shake: resourceTypeTip}"
                >
                    <small>•</small>
                    {{$t('resource.beforeUpload')}}
                </div>
            </div>

            <SmallTitle v-if="!isUpdateResource">{{$t('resource.resourceFile')}}</SmallTitle>

            <!--            <div-->
            <!--                v-if="isUpdateResource && !!fileSystemInfo"-->
            <!--                style="line-height: 46px; display: flex; align-items: center; justify-content: space-between; margin: 0 34px; background-color: #FAFBFB; font-size: 14px; color: #333; padding: 0 20px;"-->
            <!--            >-->
            <!--                <div>{{resourceName}}</div>-->
            <!--                <div>-->
            <!--                    <span style="padding-right: 40px;">{{fileSystemInfo.fileSize | fileSizeFilter}}</span>-->
            <!--                    <a :href="`${qiOrigin}/v1/resources/${fileSystemInfo.sha1}/download`"><i class="el-icon-download"/></a>-->
            <!--                </div>-->
            <!--            </div>-->

            <div
                v-if="!isUpdateResource"
                class="resource-editor__upload"
            >
                <UploadFile
                    :noRepeat="true"
                    :fileType="resourceType"
                    :fileInfo="uploadFileInfo"
                    :onFileInfoChange="onFileInfoChange"
                    @error="onUploadNoType"
                />
            </div>

            <SmallTitle>{{$t('resource.resourceName')}}</SmallTitle>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div
                    class="resource-editor__name"
                >
                    <!--                :disabled="isUpdateResource"-->
                    <el-input
                        :minlength="1"
                        :maxlength="60"
                        v-model="resourceName"
                        :placeholder="$t('resource.enterResourceName')"
                        class="resource-editor__name__input"
                    >
<!--                        <div slot="suffix" style="height: 100%;">-->
                        <span
                            slot="suffix"
                            style="line-height: 38px; padding-right: 6px;"
                            class="resource-editor__name__length"
                        >{{resourceName.length}}/60</span>
<!--                        </div>-->
                    </el-input>


                </div>

                <div v-if="!!fileSystemInfo"
                     style="padding-right: 35px; color: #333; font-size: 14px; font-weight: 600;">
                    <a
                        :href="`${qiOrigin}/v1/resources/${fileSystemInfo.sha1}/download`"
                        style="color: #333;"
                    >
                        <i class="freelog fl-icon-export"/>
                        <span style="padding-left: 2px;">{{$t('resource.list.downloadBtnText')}}</span>
                    </a>
                    <span style="padding-left: 40px;">{{fileSystemInfo.fileSize | fileSizeFilter}}</span>
                </div>
            </div>

            <div style="height: 20px;"></div>
        </BlockBody>

        <BlockBody :tilte="$t('resource.dependency')">
            <template
                v-slot:title2
                v-if="releasedList.length > 0"
            >
                <div
                    class="resource-editor__dependency--lock"
                >
                    <i class="el-icon-info"/> {{$t('resource.cannotChangedDep')}}
                </div>
            </template>
            <!--            :isLock="releasedList.length > 0"-->
            <DependentReleaseList
                :dataSource="depList"
                :isLock="releasedList.length > 0"
                @onChange="onChangeDeps"
            />
        </BlockBody>

        <BlockBody :tilte="$t('resource.description')">
            <RichEditor
                class="resource-editor__description"
                width="100%"
                :placeholder="$t('resource.enterDescription')"
                v-model="description"
            >
            </RichEditor>
        </BlockBody>

        <div v-if="!visibleMetaInput">
            <div style="height: 35px;"></div>
            <el-button
                round
                class="resource-editor__meta__button"
                size="medium"
                @click="showMetaInput"
            ><i class="el-icon-plus"/> {{$t('resource.addMeta')}}
            </el-button>
        </div>

        <BlockBody
            v-if="visibleMetaInput"
            :tilte="$t('resource.metaInfo')">
            <div class="resource-editor__meta__input">
                <div class="resource-editor__meta__input__box">
                    <MetaInfoInput
                        @validate="checkMetaValid"
                        v-model="metaInfo"
                    />
                </div>
            </div>
        </BlockBody>

        <div style="height: 145px;"></div>

        <div
            class="resource-editor__footer"
        >
            <div class="resource-editor__footer__box">
                <el-button
                    size="medium"
                    round
                    class="resource-editor__footer__box__cancel"
                    type="text"
                    @click="goBack"
                >{{isUpdateResource ? $t('resource.cancel'): $t('resource.cancelCreating')}}
                </el-button>
                <el-button
                    size="medium"
                    round
                    @click="onSubmitButtonClick(false)"
                >{{isUpdateResource ? $t('resource.save'): $t('resource.completeCreating')}}
                </el-button>
                <el-button
                    size="medium"
                    type="primary"
                    round
                    @click="onSubmitButtonClick(true)"
                >{{isUpdateResource ? $t('resource.saveAndRelease'): $t('resource.createAndRelease')}}
                </el-button>
            </div>
        </div>


        <CreateReleaseModal
            v-if="isShowReleaseSearchDialog"
            @close="isShowReleaseSearchDialog = false"
            :disabledReleaseIDs="releasedList.map(i => i.id)"
            @addRelease="createRelease"
            @createNew="createRelease"
            :showType="resourceType"
        />

        <!--        <el-dialog-->
        <!--            width="750px"-->
        <!--            top="10vh"-->
        <!--            center-->
        <!--            :visible="false"-->
        <!--        >-->
        <!--            &lt;!&ndash;            :historicalReleases="releasesList"&ndash;&gt;-->
        <!--            <release-search-->
        <!--                :release-source="targetResourceData"-->
        <!--                :tabLayout="['my-release']"-->
        <!--                :historicalReleases="this.releasedList.map(i => ({releaseId: i.id}))"-->
        <!--                @add="createRelease"-->
        <!--            />-->
        <!--            <div slot="footer">-->
        <!--                <el-button-->
        <!--                    round-->
        <!--                    type="primary"-->
        <!--                    class="create-release-btn"-->
        <!--                    @click="createRelease()">{{$t('resource.createANewRelease')}}-->
        <!--                </el-button>-->
        <!--            </div>-->
        <!--        </el-dialog>-->
    </div>
</template>

<script>
    export {default} from './index';
</script>

<style lang="less" scoped>
    @import 'index.less';
</style>
