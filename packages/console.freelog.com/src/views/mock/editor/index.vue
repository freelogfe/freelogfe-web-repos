<template>
    <div class="mock-editor">

        <div
            style="margin: 0 auto; width: 1190px;"
        >
            <BreadCrumb
                v-if="!!$route.params.bucketName"
                :list="[
                    {text: $t('mock.mockPool'), to: `/mock/display?activatedBucketName=${$route.params.bucketName}`},
                    {text: $t('mock.createMockResource')}
                ]"
            />
            <BreadCrumb
                v-else
                :list="[
                    {text: $t('mock.mockPool'), to: `/mock/display?activatedBucketName=${bucketName}`},
                    {text: $t('mock.mockResourceInfo')}
                ]"
            />
        </div>

        <HeaderAlert/>

        <BlockBody :tilte="$t('mock.resourceUpload')">

            <SmallTitle>{{$t('mock.resourceType')}}</SmallTitle>

            <div class="mock-editor__type">
                <el-select
                    class="mock-editor__type__select"
                    v-model="resourceType"
                    @change="onChangeResourceType"
                    :placeholder="$t('mock.resourceType')"
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
                    class="animated mock-editor__type__tip"
                    :class="{shake: resourceTypeTip}"
                >
                    <small>•</small>
                    {{$t('mock.beforeUpload')}}
                </div>
            </div>

            <SmallTitle>{{$t('mock.resourceFile')}}</SmallTitle>

            <div class="mock-editor__upload">
                <UploadFile
                    :fileType="resourceType"
                    :fileInfo="uploadFileInfo"
                    :onFileInfoChange="onFileInfoChange"
                    @error="onUploadNoType"
                />
            </div>

            <SmallTitle>{{$t('mock.resourceName')}}</SmallTitle>

            <div class="mock-editor__name">
                <el-input
                    :disabled="isUpdateResource"
                    :minlength="1"
                    :maxlength="60"
                    v-model="resourceName"
                    :placeholder="$t('mock.enterResourceName')"
                    class="mock-editor__name__input"
                />

                <span
                    class="mock-editor__name__length"
                >{{resourceName.length}}/60</span>
            </div>

            <div style="height: 20px;"></div>
        </BlockBody>

        <BlockBody :tilte="$t('mock.dependency')">
            <DependentReleaseList
                :dataSource="depList"
                :mockDataSource="depMockList"
                :isLock="false"
                @onChange="onChangeDeps"
                @onChangeMock="onChangeMock"
                :currentID="$route.params.mockResourceId"
            />
        </BlockBody>

        <BlockBody :tilte="$t('mock.description')">
            <!--            ref="editor"-->
            <!--             v-model="formData.description"-->
            <!--            :config="editorConfig"-->
            <!--            @load="imgUploadSuccessHandler"-->
            <RichEditor
                class="mock-editor__description"
                width="100%"
                :placeholder="$t('mock.enterDescription')"
                v-model="description"
            >
            </RichEditor>
        </BlockBody>

        <div v-if="!visibleMetaInput">
            <div style="height: 35px;"></div>
            <el-button
                round
                class="mock-editor__meta__button"
                size="medium"
                @click="showMetaInput"
            ><i class="el-icon-plus"/> {{$t('mock.addMeta')}}
            </el-button>
        </div>

        <BlockBody
            v-if="visibleMetaInput"
            :tilte="$t('mock.metaInfo')">
            <!-- meta 输入框 -->
            <!--            v-model="meta"-->
            <!--            @validate="checkMetaValid"-->
            <!--            :placeholder="$t('mock.resourceEditView.inputMetaTip')"-->
            <div style="padding: 20px;">
                <div class="mock-editor__meta__input">
                    <MetaInfoInput
                        @validate="checkMetaValid"
                        v-model="metaInfo"
                    ></MetaInfoInput>
                </div>
            </div>
        </BlockBody>

        <div style="height: 145px;"></div>

        <div
            class="mock-editor__footer"
        >
            <div class="mock-editor__footer__box">
<!--                <el-button-->
<!--                    size="medium"-->
<!--                    round-->
<!--                    class="mock-editor__footer__box__cancel"-->
<!--                    type="text"-->
<!--                    @click="goBack"-->
<!--                >{{isUpdateResource ? $t('mock.cancel'): $t('mock.cancelCreating')}}-->
<!--                </el-button>-->
                <el-button
                    size="medium"
                    round
                    type="primary"
                    @click="submit"
                >{{isUpdateResource ? $t('mock.save'): $t('mock.completeCreating')}}
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
