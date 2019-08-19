<template>
    <div class="mock-resource-editor" style="margin: 0 auto;">

        <HeaderAlert/>

        <BlockBody :tilte="$t('resourceUpload')">

            <SmallTitle>{{$t('resourceType')}}</SmallTitle>

            <div style="padding-left: 40px;">
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

            <SmallTitle>{{$t('resourceFile')}}</SmallTitle>

            <div style="padding-left: 40px; padding-right: 40px;">
                <UploadFile
                    :fileType="resourceType"
                    :fileInfo="uploadFileInfo"
                    :onFileInfoChange="onFileInfoChange"
                    @error="onUploadNoType"
                />
            </div>

            <SmallTitle>{{$t('resourceName')}}</SmallTitle>

            <div style="padding-left: 40px;">
                <el-input
                    :disabled="isUpdateResource"
                    :minlength="1"
                    :maxlength="60"
                    v-model="resourceName"
                    :placeholder="$t('enterResourceName')"
                    style="width: 590px;"
                ></el-input>

                <span style="color: #c3c3c3; font-size: 14px; font-weight: 500; padding-left: 10px;">{{resourceName.length}}/60</span>
            </div>

            <div style="height: 20px;"></div>
        </BlockBody>

        <BlockBody :tilte="$t('dependency')">
            <DependentReleaseList
                :dataSource="depList"
                :mockDataSource="depMockList"
                :isLock="false"
                @onChange="onChangeDeps"
                @onChangeMock="onChangeMock"
                :currentID="$route.params.mockResourceId"
            />
        </BlockBody>

        <BlockBody :tilte="$t('description')">
            <!--            ref="editor"-->
            <!--             v-model="formData.description"-->
            <!--            :config="editorConfig"-->
            <!--            @load="imgUploadSuccessHandler"-->
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
            <!-- meta 输入框 -->
            <!--            v-model="meta"-->
            <!--            @validate="checkMetaValid"-->
            <!--            :placeholder="$t('resourceEditView.inputMetaTip')"-->
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
                    @click="submit"
                >{{isUpdateResource ? $t('save'): $t('completeCreating')}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export {default} from './index';
</script>

<style lang="less" scoped>
    @import 'index.less';
</style>
