<template>
    <div
        class="resource-input-wrap"
        :class="['resource-edit-mode-'+editMode]"
    >
        <el-form
            :model="formData"
            class="input-list"
            label-width="0"
            :rules="rules"
            ref="createForm"
        >
            <div class="input-item-wrap">
                <h4>资源信息</h4>
                <div class="input-area res-info-input-wrap">
                    <div class="input-lf-side">

                        <!-- 资源名称输入框 -->
                        <div class="require-input input-item">
                            <div style="line-height: 35px; font-size: 13px; color: #666;">资源名称</div>
                            <el-form-item prop="resourceName">
                                <input
                                    type="text"
                                    class="input-rect"
                                    v-model="formData.resourceName"
                                    placeholder="输入资源名称"
                                >
                            </el-form-item>
                        </div>

<!--                        <template v-if="formData.resourceType === ResourceTypes.widget">-->
<!--                            <div class="require-input input-item">-->
<!--                                <el-form-item prop="widgetName">-->
<!--                                    <input-->
<!--                                        type="text"-->
<!--                                        v-model="formData.widgetName"-->
<!--                                        class="input-rect"-->
<!--                                        :disabled="!showCreatorInputItem"-->
<!--                                        :placeholder="$t('resourceEditView.widgetName')"-->
<!--                                    >-->
<!--                                </el-form-item>-->
<!--                            </div>-->
<!--                            <div class="require-input input-item">-->
<!--                                <el-form-item prop="widgetVersion">-->
<!--                                    <input type="text" v-model="formData.widgetVersion"-->
<!--                                           class="input-rect"-->
<!--                                           :disabled="!showCreatorInputItem"-->
<!--                                           :placeholder="$t('resourceEditView.widgetVersion')">-->
<!--                                </el-form-item>-->
<!--                            </div>-->
<!--                        </template>-->
                    </div>

                    <!-- 封面上传 -->
                    <div
                        class="resource-thumbnail-input input-item"
                        style="display: flex; align-items: flex-end;"
                    >
                        <el-upload
                            style="background-color: #fff;"
                            v-show="!uploaderStates.thumbnail.isUploading"
                            drag
                            ref="thumbnailUploader"
                            :action="uploadPreviewImageAction"
                            :with-credentials="true"
                            :data="uploader.data"
                            :headers="uploader.headers"
                            :on-error="errorHandler"
                            :on-change="previewImageChangeHandler"
                            :on-success="imageUploadSuccessHandler"
                            :before-upload="validateImageHandler"
                            :on-progress="uploadProgressHandler"
                            :show-file-list="false"
                            :auto-upload="true"
                        >

                            <div
                                v-if="!formData.previewImage"
                                class="resource-thumbnail-input__button-cover"
                            >
                                <i class="el-icon-circle-plus" style="color: #EDEDED"></i>
                                <p class="thumbnail-tip" style="color: #666666">上传封面</p>
                            </div>

                            <template v-if="formData.previewImage">
                                <img
                                    :src="formData.previewImage"
                                    style="height: 100%;"
                                    alt=""
                                >
                                <!--                            <template v-else>-->
                                <div
                                    class="resource-thumbnail-input__button-cover_uploaded"
                                >
                                    <i class="el-icon-circle-plus" style="color: #fff"></i>
                                    <p class="thumbnail-tip" style="color: #fff">重新上传</p>
                                </div>
                            </template>
                            <!--                            </template>-->
                        </el-upload>
                        <div style="display: flex; padding-left: 20px; font-size: 13px; color: #afafaf;">
                            <span>*&nbsp;</span>
                            <div>只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M 建议尺寸为800X600</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="input-item-wrap">
                <h4>{{$t('resourceEditView.depResources')}}</h4>
                <div
                    class="input-area"
                    :class="{'edit-disabled': !canEditDependencies}"
                    style="padding: 20px;"
                >
                    <div>
                        <el-popover
                            ref="depsPopTip"
                            placement="top"
                            title=""
                            width="200"
                            trigger="hover"
                            :disabled="canEditDependencies"
                            :content="$t('resourceEditView.disableModifiedTip')">
                        </el-popover>
                        <el-button
                            class="add-dep-btn"
                            @click="showSearchDialogHandler"
                            type="text"
                            v-popover:depsPopTip
                            size="mini"><i class="el-icon-plus"></i>{{$t('resourceEditView.addDepResource')}}
                        </el-button>
                    </div>
                    <ul
                        class="res-deps-wrap"
                        v-if="deps.length"
                    >
                        <li
                            class="res-dep-item"
                            :key="index"
                            v-for="(dep,index) in deps"
                        >
                            <el-button
                                class="del-dep-btn"
                                @click="removeDepResourceHandler(dep, index)"
                                size="mini"
                                type="text"
                            >
                                <i class="el-icon-remove"></i>
                            </el-button>
                            <i class="dot"></i>{{dep.releaseName}}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="input-item-wrap">
                <h4>{{$t('resourceEditView.introTitle')}}</h4>
                <div
                    class="input-area"
                    style="padding: 20px;"
                >
                    <rich-editor class="res-desc-editor"
                                 ref="editor"
                                 width="100%"
                                 v-model="formData.description"
                                 :config="editorConfig"
                                 @load="imgUploadSuccessHandler"
                                 :placeholder="$t('resourceEditView.inputDescTip')"></rich-editor>
                </div>
            </div>

            <div class="input-item-wrap" v-if="doShowMeta">
                <h4>{{$t('resourceEditView.metaTitle')}}</h4>
                <div
                    class="input-area"
                    style="padding: 20px;"
                >
                    <resource-meta-info
                        v-model="meta"
                        @validate="checkMetaValid"
                        :placeholder="$t('resourceEditView.inputMetaTip')">
                    </resource-meta-info>
                </div>
            </div>

            <div
                style="padding: 15px 0;"
                v-if="!doShowMeta"
            >
                <el-button
                    round
                    style="background-color: #ececec; color: #666666; border: none;"
                    size="medium"
                    @click="onClickButtonAddMetaInfo"
                ><i class="el-icon-plus" style="font-weight: 600;"></i> 添加meta信息
                </el-button>
            </div>
        </el-form>

        <slot></slot>

        <el-dialog width="750px"
                   top="10vh"
                   center
                   :visible.sync="showSearchResourceDialog">
            <release-search @add="addDepReleaseHandler"></release-search>
        </el-dialog>

        <div>

        </div>
    </div>
</template>


<script>
    import ResourceInput from './index'

    export default ResourceInput
</script>

<style lang="less" scoped>
    @import "index.less";

    .resource-input-wrap .input-list .input-item-wrap .input-rect {
        background-color: #fff;
    }
</style>

<style lang="less">
    @import "reset-el.less";

    .resource-input-wrap .resource-thumbnail-input .el-upload-dragger {
        border: 1px dashed #cbcbcb;
    }

    .resource-input-wrap .resource-type input {
        background-color: #fff;
    }
</style>
