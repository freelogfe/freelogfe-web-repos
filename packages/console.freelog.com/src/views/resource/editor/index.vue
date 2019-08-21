<template>
    <div class="resource-editor" style="margin: 0 auto;">

        <BlockBody v-if="isUpdateResource" :tilte="'历史发行'">
            <div style="padding: 10px 0;">
                <div
                    v-if="releasedList.length === 0"
                    style="padding: 10px 20px;"
                >暂无发行历史...</div>
                <ReleasedItem
                    v-for="item in releasedList"
                    :name="item.name"
                    :version="item.version"
                    :date="item.date"
                ></ReleasedItem>
            </div>
        </BlockBody>

        <BlockBody :tilte="$t('resourceUpload')">

            <SmallTitle v-if="!isUpdateResource">{{$t('resourceType')}}</SmallTitle>

            <div v-if="!isUpdateResource" style="padding-left: 40px;">
                <el-select
                    style="width: 160px; line-height: 38px;"
                    v-model="resourceType"
                    @change="onChangeResourceType"
                    :placeholder="$t('resourceType')"
                    allow-create
                    filterable
                    :disabled="!!this.uploadFileInfo.name"
                >
                    <el-option
                        v-for="item in resourceTypes"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>

                </el-select>

                <div
                    style="font-size: 13px; padding-left: 20px; display: inline-block; vertical-align: bottom;"
                    :style="{color: resourceTypeTip? 'red': '#afafaf'}"
                    class="animated"
                    :class="{shake: resourceTypeTip}"
                >
                    <small>•</small>
                    {{$t('beforeUpload')}}
                </div>
            </div>

            <SmallTitle v-if="!isUpdateResource">{{$t('resourceFile')}}</SmallTitle>

            <div v-if="!isUpdateResource" style="padding-left: 40px; padding-right: 40px;">
                <UploadFile
                    :noRepeat="true"
                    :fileType="resourceType"
                    :fileInfo="uploadFileInfo"
                    :onFileInfoChange="onFileInfoChange"
                    @error="onUploadNoType"
                />
            </div>

            <SmallTitle>{{$t('resourceName')}}</SmallTitle>

            <div style="padding-left: 40px;">
                <!--                :disabled="isUpdateResource"-->
                <el-input
                    :minlength="1"
                    :maxlength="60"
                    v-model="resourceName"
                    :placeholder="$t('enterResourceName')"
                    style="width: 590px;"
                ></el-input>

                <span style="color: #c3c3c3; font-size: 14px; font-weight: 500; padding-left: 10px;">{{resourceName.length}}/60</span>
            </div>

            <!--            <SmallTitle :dot="false">资源封面</SmallTitle>-->

            <!--            <div style="padding-left: 40px;">-->
            <!--                <UploadCover-->
            <!--                    :imageUrl="coverURL"-->
            <!--                    :onUploaded="coverUploaded"-->
            <!--                />-->

            <!--                <div-->
            <!--                    style="font-size: 13px; padding-left: 20px; display: inline-block; vertical-align: bottom; color: #afafaf;"-->
            <!--                >-->
            <!--                    <small style="vertical-align: top;">•&nbsp;</small>-->
            <!--                    <div style="display: inline-block;">-->
            <!--                        只支持JPG/PNG/GIF，GIF文件不能动画化，<br/>大小不超过5M-->
            <!--                        建议尺寸为800X600-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->

            <div style="height: 20px;"></div>
        </BlockBody>

        <BlockBody :tilte="$t('dependency')">
            <template v-slot:title2 v-if="releasedList.length > 0">
                <div style="color: #999; font-size: 14px; font-weight: normal;">
                    <i class="el-icon-info"></i> 资源发行后不可更改依赖
                </div>
            </template>
<!--            :isLock="releasedList.length > 0"-->
            <DependentReleaseList
                :dataSource="depList"
                :isLock="releasedList.length > 0"
                @onChange="onChangeDeps"
            />
        </BlockBody>

        <BlockBody :tilte="$t('description')">
            <RichEditor
                style="box-sizing: border-box; margin: 0;"
                width="100%"
                :placeholder="$t('enterDescription')"
                v-model="description"
            >
            </RichEditor>
        </BlockBody>

        <div v-if="!visibleMetaInput">
            <div style="height: 35px;"></div>
            <el-button
                round
                style="background-color: #ececec; color: #666666; border: none;"
                size="medium"
                @click="showMetaInput"
            ><i class="el-icon-plus" style="font-weight: 600;"></i> {{$t('addMeta')}}
            </el-button>
        </div>

        <BlockBody
            v-if="visibleMetaInput"
            :tilte="$t('metaInfo')">
            <div style="padding: 20px;">
                <div style="border: 1px solid #E6E6E6;">
                    <MetaInfoInput
                        @validate="checkMetaValid"
                        v-model="metaInfo"
                    ></MetaInfoInput>
                </div>
            </div>
        </BlockBody>

        <div style="height: 145px;"></div>

        <div
            style="display: flex; align-items: center; justify-content: center; position: fixed; bottom: 0; left: 0; right: 0; background-color: #fff; height: 80px; box-shadow:0 -2px 5px 0 rgba(0,0,0,0.1);">
            <div style="width: 1200px; text-align: right;">
                <el-button
                    size="medium"
                    round
                    style="color: #999999;"
                    type="text"
                    @click="goBack"
                >{{isUpdateResource ? $t('cancel'): $t('cancelCreating')}}
                </el-button>
                <el-button
                    size="medium"
                    round
                    type="primary"
                    @click="onSubmitButtonClick(false)"
                >{{isUpdateResource ? $t('save'): $t('completeCreating')}}
                </el-button>
                <el-button
                    size="medium"
                    round
                    @click="onSubmitButtonClick(true)"
                >{{isUpdateResource ? $t('saveAndRelease'): $t('createAndRelease')}}
                </el-button>
            </div>
        </div>

        <el-dialog
            width="750px"
            top="10vh"
            center
            :visible.sync="isShowReleaseSearchDialog"
        >
            <!--            :historicalReleases="releasesList"-->
            <release-search
                :tabLayout="['my-release']"
                :historicalReleases="this.releasedList.map(i => ({releaseId: i.id}))"
                @add="createRelease"
            ></release-search>
            <div slot="footer">
                <el-button
                    round
                    type="primary"
                    class="create-release-btn"
                    @click="createRelease()">{{$t('createANewRelease')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export {default} from './index';
</script>

<style lang="less" scoped>
    @import 'index.less';
</style>
