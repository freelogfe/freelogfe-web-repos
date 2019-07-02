<template>
    <div
        class="mock-input-wrap"
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
                <h4>资源上传</h4>
                <div class="input-area res-info-input-wrap">
                    <div class="input-lf-side">

                        <!-- 上传类型 -->
                        <div
                            class="require-input input-item"
                        >
                            <div style="font-size: 13px; color: #666; line-height: 35px;">资源类型</div>
                            <div style="display: flex; align-items: flex-end;">
                                <el-popover
                                    ref="typePopTip"
                                    placement="top"
                                    title=""
                                    width="200"
                                    trigger="hover"
                                    :disabled="enabledEditResourceType">
                                    {{$t('resourceEditView.changeTypeTip')}}{{showCreatorInputItem?
                                    $t('resourceEditView.changeTypeTip2'): ''}}
                                </el-popover>
                                <el-select
                                    :disabled="!enabledEditResourceType || initIsUploadedState"
                                    v-model="formData.resourceType"
                                    allow-create
                                    filterable
                                    @change="resourceTypeChange"
                                    v-popover:typePopTip
                                    class="resource-type"
                                    placeholder="资源类型"
                                    style="background-color: #fff;"
                                >
                                    <el-option
                                        label="资源类型"
                                        value="">
                                    </el-option>
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <div
                                    v-if="doHighlightSelectTip"
                                    style="font-size: 13px; padding-left: 20px;"
                                    :style="{color: doHighlightSelectTip? 'red': '#afafaf'}"
                                    class="animated"
                                    :class="doHighlightSelectTip ? 'shake': ''"
                                >
                                    <small>•</small>
                                    上传资源之前需要选择资源类型
                                </div>
                            </div>
                        </div>
                        <!--                        {{formData.resourceType}}-->

                        <!-- 文件上传按钮 -->
                        <div
                            class="resource-file-input require-input special input-item"
                            v-if="showCreatorInputItem"
                        >
                            <div style="font-size: 13px; color: #666; line-height: 35px;">资源文件</div>
                            <div
                                v-if="initIsUploadedState"
                                style="background-color: #fafbfb; padding: 0 10px; display: flex; align-items: center; justify-content: space-between;">
                                <div style="line-height: 46px; font-size: 14px; color: #333;">
                                    <span style="padding-right: 70px;">{{formData.filename}}</span>
                                    <span>{{humanizeSize(formData.filesize)}}</span>
                                </div>

                                <a
                                    @click="clearUploadedResourceInfo"
                                    class="el-icon-circle-close"
                                ></a>
                            </div>
                            <div v-if="!initIsUploadedState">
                                <!-- 上传按钮 -->
                                <div
                                    v-show="shouldShowResourceUploader !== false"
                                    class="resource-file-uploader-wrap"
                                >
                                    <el-upload
                                        v-if="showCreatorInputItem"
                                        class="resource-file-uploader"
                                        drag
                                        :accept="formData.resourceType === 'image' ? 'image/*': '*'"
                                        ref="resourceUploader"
                                        :action="uploadResourceFileAction"
                                        :with-credentials="true"
                                        :multiple="false"
                                        :data="{resourceType: formData.resourceType}"
                                        :headers="uploader.headers"
                                        :before-upload="beforeUploadHandler"
                                        :on-error="errorHandler"
                                        :on-change="fileChangeHandler"
                                        :on-success="successHandler"
                                        :show-file-list="false"
                                        :disabled="!formData.resourceType"
                                        :on-progress="uploadProgressHandler"
                                        v-popover:uploadPopTip
                                        :auto-upload="true"
                                    >
                                        <div style="display: flex; align-items: flex-end;">
                                            <el-button
                                                ref="sourceUploadButton"
                                                @click="onClickUploadResource"
                                            >上传资源
                                            </el-button>
                                            <span style="font-size: 13px; color: #afafaf; padding-left: 20px;"><small>•</small> 资源最大不超过50M</span>
                                        </div>
                                    </el-upload>
                                </div>

                                <div style="height: 10px;"></div>

                                <!-- 上传进度 -->
                                <div
                                    class="resource-upload-state
                                 clearfix"
                                    style="display: block;"
                                    v-show="shouldShowResourceUploader === false"
                                >
                                    <!-- v-show="shouldShowResourceUploader === true" -->
                                    <div style="background-color: #fafbfb;">
                                        <div
                                            style="display: flex; justify-content: space-between;  font-size: 16px; color: #333; padding: 0 20px; line-height: 45px; height: 45px">
                                            <span>{{formData.filename}}</span>
                                            <span>{{humanizeSize(formData.filesize)}}</span>
                                        </div>
                                        <div
                                            style="padding: 18px 20px; border-top: 1px solid #e8e8e8; display: flex; align-items: center;">
                                            <el-progress
                                                :percentage="uploaderStates.resource.percentage"
                                                :stroke-width="14"
                                                color="#409eff"
                                                :show-text="false"
                                                style="flex-shrink: 1; width: 100%;"
                                            ></el-progress>
                                            <!-- 进度条右侧 -->
                                            <!--                                            v-if="!uploaderStates.resource.isExistResource"-->
                                            <div
                                                style="
                                            width: 130px;
                                            box-sizing: border-box;
                                            flex-shrink: 0;
                                            padding-left: 10px;
                                            color: #3f9cfd;
                                            font-size: 14px;
                                            font-weight: 600;">

                                                <span
                                                    style="display: flex; align-items: center; justify-content: space-between;"
                                                    v-if="uploaderStates.resource.percentage < 100"
                                                >
                                                    <span>{{uploaderStates.resource.percentage + '%'}}</span>
                                                    <a
                                                        @click="clearUploaderHandler('resource')"
                                                        style="font-size: 20px; color: #D5D5D5;"
                                                        class="el-icon-circle-close"
                                                    ></a>
                                                </span>

                                                <div
                                                    v-if="uploaderStates.resource.percentage === 100"
                                                    style="display: flex; align-items: center; justify-content: space-between;"
                                                >
                                                    <i
                                                        style="font-size: 20px; color: #5cd217;"
                                                        class="el-icon-circle-check"
                                                    ></i>
                                                    <span style="font-size: 13px; color: #333;">上传成功</span>


                                                    <el-popover
                                                        placement="top"
                                                        width="160"
                                                        v-model="isShowDeleteUploadeFilePopover">
                                                        <div style="height: 10px;"></div>
                                                        <p style="font-size: 14px; color: #333; font-weight: 600; text-align: center;">
                                                            确定删除资源文件？</p>
                                                        <div style="height: 10px;"></div>
                                                        <div style="text-align: center; margin: 0;">
                                                            <el-button
                                                                style="color: #999;"
                                                                size="mini"
                                                                type="text"
                                                                @click="isShowDeleteUploadeFilePopover = false"
                                                            >取消
                                                            </el-button>
                                                            <el-button
                                                                type="danger"
                                                                size="mini"
                                                                @click="deleteUploadedFile"
                                                            >确定
                                                            </el-button>
                                                        </div>
                                                        <!--                                                            @click="clearUploadedResourceInfo"-->
                                                        <a
                                                            slot="reference"
                                                            style="font-size: 20px; color: #D5D5D5;"
                                                            class="el-icon-circle-close"
                                                        ></a>
                                                    </el-popover>

                                                    <!--                                                <el-button size="small" @click="onClickUpload">重新上传</el-button>-->
                                                </div>

                                            </div>
                                            <!--                                        <span-->
                                            <!--                                            v-else="uploaderStates.resource.isExistResource"-->
                                            <!--                                            style="width: 75px; flex-shrink: 0; padding-left: 14px; color: red; font-size: 14px; font-weight: 600;">-->
                                            <!--                                            重复上传-->
                                            <!--                                        </span>-->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 资源名称输入框 -->
                        <div class="require-input input-item">
                            <div style="font-size: 13px; color: #666; line-height: 35px;">资源名称</div>
                            <el-form-item prop="resourceName">
                                <input
                                    :disabled="isMockEditMode"
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
                    >
                        <div style="font-size: 13px; color: #666; line-height: 35px;">资源封面</div>
                        <div style="display: flex; align-items: flex-end;">
                            <!--                            <el-upload-->
                            <!--                                style="background-color: #fff;"-->
                            <!--                                v-show="!uploaderStates.thumbnail.isUploading"-->
                            <!--                                drag-->
                            <!--                                ref="thumbnailUploader"-->
                            <!--                                accept="image/*"-->
                            <!--                                :action="uploadPreviewImageAction"-->
                            <!--                                :with-credentials="true"-->
                            <!--                                :data="uploader.data"-->
                            <!--                                :headers="uploader.headers"-->
                            <!--                                :on-error="errorHandler"-->
                            <!--                                :on-change="previewImageChangeHandler"-->
                            <!--                                :on-success="imageUploadSuccessHandler"-->
                            <!--                                :before-upload="validateImageHandler"-->
                            <!--                                :show-file-list="false"-->
                            <!--                                :auto-upload="true"-->
                            <!--                            >-->

                            <!--                                <div-->
                            <!--                                    v-if="!formData.previewImage"-->
                            <!--                                    class="resource-thumbnail-input__button-cover"-->
                            <!--                                >-->
                            <!--                                    <i class="el-icon-circle-plus" style="color: #EDEDED"></i>-->
                            <!--                                    <p class="thumbnail-tip" style="color: #666666">上传封面</p>-->
                            <!--                                </div>-->

                            <!--                                <template v-if="formData.previewImage">-->
                            <!--                                    <img-->
                            <!--                                        :src="formData.previewImage"-->
                            <!--                                        style="height: 100%;"-->
                            <!--                                        alt=""-->
                            <!--                                    >-->
                            <!--                                    <div-->
                            <!--                                        class="resource-thumbnail-input__button-cover_uploaded"-->
                            <!--                                    >-->
                            <!--                                        <i class="el-icon-circle-plus" style="color: #fff"></i>-->
                            <!--                                        <p class="thumbnail-tip" style="color: #fff">重新上传</p>-->
                            <!--                                    </div>-->
                            <!--                                </template>-->
                            <!--                            </el-upload>-->
                            <UploadCover
                                :imageUrl="formData.previewImage"
                                :onUploaded="imageUploadSuccessHandler"
                            />
                            <div style="display: flex; padding-left: 20px; font-size: 13px; color: #afafaf;">
                                <span>*&nbsp;</span>
                                <div>只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M 建议尺寸为800X600</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 依赖列表 -->
            <div class="input-item-wrap">
                <!--                <h4>{{$t('resourceEditView.depResources')}}</h4>-->
                <h4>依赖发行</h4>
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

                        <!-- + 添加依赖 的按钮 -->
                        <el-button
                            class="add-dep-btn"
                            @click="showSearchDialogHandler"
                            type="text"
                            v-popover:depsPopTip
                            size="mini"><i class="el-icon-plus"></i>添加依赖发行
                            <!--                            {{$t('resourceEditView.addDepResource')}}-->
                        </el-button>

                    </div>

                    <!-- 依赖列表 -->
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

            <!-- 资源介绍 -->
            <div class="input-item-wrap">
                <h4>{{$t('resourceEditView.introTitle')}}</h4>
                <div
                    class="input-area"
                    style="padding: 20px;"
                >
                    <rich-editor
                        class="res-desc-editor"
                        ref="editor"
                        width="100%"
                        v-model="formData.description"
                        :config="editorConfig"
                        @load="imgUploadSuccessHandler"
                        :placeholder="$t('resourceEditView.inputDescTip')"
                    >
                    </rich-editor>
                </div>
            </div>

            <div class="input-item-wrap" v-if="doShowMeta">
                <h4>{{$t('resourceEditView.metaTitle')}}</h4>
                <div
                    class="input-area"
                    style="padding: 20px;"
                >
                    <!-- meta 输入框 -->
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

        <!-- 添加依赖的搜索弹出框 -->
        <el-dialog
            width="750px"
            top="10vh"
            center
            :visible.sync="showSearchResourceDialog"
        >
            <release-search :tabLayout="['search', 'my-release', 'favor', 'mock-search']"
                            @add="addDepReleaseHandler"></release-search>
        </el-dialog>

        <!-- 上传文件有问题的 dialog -->
        <el-dialog
            custom-class="upload-error-dialog"
            :visible="!!uploadErrorDialogText"
            width="30%"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <div style="height: 20px;"></div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <i class="el-icon-warning" style="color: #FFC000; font-size: 20px;"></i> <span
                style="font-size: 14px; color: #333; font-weight: 600; padding-left: 10px;">{{uploadErrorDialogText}}</span>
            </div>
            <div style="height: 40px;"></div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <el-button type="text" style="color: #999;" @click="hideUploadErrorDialog">取消</el-button>
                &nbsp;&nbsp;&nbsp;
                <el-button
                    type="primary"
                    plain
                    round
                    @click="onClickUpload"
                >重新选择
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import ResourceInput from './index'

    export default ResourceInput
</script>

<style lang="less" scoped>
    @import "index.less";

    .mock-input-wrap .input-list .input-item-wrap .input-rect {
        background-color: #fff;
    }
</style>

<style lang="less">
    @import "reset-el.less";

    .mock-input-wrap .resource-thumbnail-input .el-upload-dragger {
        border: 1px dashed #cbcbcb;
    }

    .mock-input-wrap .resource-type input {
        background-color: #fff;
    }

    /*.mock-input-wrap{*/
    /*    .no-header-dialog {*/
    /*        .el-dialog__header {*/
    /*            display: none;*/
    /*        }*/

    /*        .el-dialog__body {*/
    /*            padding-bottom: 20px;*/
    /*        }*/
    /*    }*/
    /*}*/

</style>
