<template>
    <div
        class="upload-cover"
    >
        <el-upload
            class="avatar-uploader"
            accept="image/*"
            ref="uploader"
            :with-credentials="true"
            :action="uploadPreviewImageAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :multiple="multiple"
            :auto-upload="multiple"
            :on-change="changeImageHandler"
            :drag="true"
        >
            <a @click="initData" ref="uploadHandleRef">
                <div
                    class="re-upload-mask"
                    :style="{height: height + 'px', width: width + 'px'}"
                    v-if="imageUrl"
                >
                    <i class="el-icon-circle-plus" style="color: #fff; font-size: 40px;"></i>
                    <span v-if="textVisible && !!reUploadText"
                          style="color: #fff; font-weight: 600; font-size: 14px; padding-top: 10px;">{{reUploadText}}</span>
                </div>

                <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    class="avatar"
                    :style="{height: height + 'px', width: width + 'px'}"
                />

                <div
                    :style="{height: height + 'px', width: width + 'px'}"
                    style="display: flex; align-items: center; justify-content: center; flex-direction: column;"
                    v-else
                >
                    <i
                        style="color: #666; font-size: 40px;"
                        class="el-icon-circle-plus"
                    ></i>
                    <span v-if="textVisible && !!uploadText"
                          style="color: #666; font-weight: 600; font-size: 14px; padding-top: 10px;">{{uploadText}}</span>
                </div>
            </a>
        </el-upload>

        <el-dialog
            custom-class="upload-error-dialog"
            :visible="!!tmpImageUrl"
            width="600"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <div style="width: 450px; height: 450px; margin: 0 auto;">
                <img
                    style="max-width: 400px; max-height: 400px;"
                    :src="tmpImageUrl"
                    ref="tmpImage"
                />
            </div>
            <div style="height: 40px;"></div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <el-button
                    type="text"
                    style="color: #999;"
                    @click="tmpImageUrl = ''"
                >取消
                </el-button>
                &nbsp;&nbsp;&nbsp;
                <el-button
                    type="primary"
                    plain
                    round
                    @click="saveCropImageHandler"
                >裁剪
                </el-button>
            </div>
        </el-dialog>

        <!-- 上传文件有问题的 dialog -->
        <el-dialog
            custom-class="upload-error-dialog"
            :visible="showDialog"
            width="30%"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <div style="height: 20px;"></div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <i class="el-icon-warning" style="color: #FFC000; font-size: 20px;"></i> <span
                style="font-size: 14px; color: #333; font-weight: 600; padding-left: 10px;">封面图片不能超过5M</span>
            </div>
            <div style="height: 40px;"></div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <el-button
                    type="text"
                    style="color: #999;"
                    @click="hideUploadDialog"
                >取消
                </el-button>
                &nbsp;&nbsp;&nbsp;
                <el-button
                    type="primary"
                    plain
                    round
                    @click="emitUpload"
                >重新选择
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Index from './index';

    export default Index;
</script>

<style lang="less">
    @import "index";
</style>
