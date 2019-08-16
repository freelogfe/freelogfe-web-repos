<template>
    <div
        id="upload-cover"
    >
        <el-upload
            class="avatar-uploader"
            accept="image/*"
            :with-credentials="true"
            :action="uploadPreviewImageAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
            <a ref="uploadHandleRef">
                <div
                    class="re-upload-mask"
                    :style="{height: height + 'px', width: width + 'px'}"
                    v-if="imageUrl"
                >
                    <i class="el-icon-circle-plus" style="color: #fff; font-size: 40px;"></i>
                    <span v-if="textVisible && !!reUploadText" style="color: #fff; font-weight: 600; font-size: 14px; padding-top: 10px;">{{reUploadText}}</span>
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
                    <span v-if="textVisible && !!uploadText" style="color: #666; font-weight: 600; font-size: 14px; padding-top: 10px;">{{uploadText}}</span>
                </div>
            </a>
        </el-upload>

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
    export default {
        name: 'upload-cover',
        props: {
            // 图像封面
            imageUrl: String,
            // 上传图片成功后回调，将图片 url 传出
            onUploaded: Function,
            width: {
                type: Number,
                default: 200,
            },
            height: {
                type: Number,
                default: 170,
            },
            textVisible: {
                type: Boolean,
                default: true   
            },
            uploadText: {
                type: String,
                default: '上传封面', // 选择封面
            },
            reUploadText: {
                type: String,
                default: '重新上传', // 重新上传
            }
        },
        data() {
            return {
                // 是否显示提示框
                showDialog: false,
            };
        },
        methods: {
            /**
             * 图片上传完成
             */
            handleAvatarSuccess(res, file) {
                if (res.errcode !== 0) {
                    return;
                }
                // console.log(res, 'resresresresresresres');
                this.onUploaded && this.onUploaded(res.data);
                // this.imageUrl = URL.createObjectURL(file.raw);
                // console.log(this.imageUrl, 'this.imageUrlthis.imageUrl');
            },
            /**
             * 在图片上传之前
             */
            beforeAvatarUpload(file) {
                // const isJPG = file.type === 'image/jpeg';
                const isLt5M = file.size / 1024 / 1024 <= 5;

                if (!isLt5M) {
                    // this.$message.error('上传头像图片大小不能超过 2MB!');
                    this.showDialog = true;
                    return false;
                }
            },
            /**
             * 隐藏 dialog
             */
            hideUploadDialog() {
                this.showDialog = false;
            },
            /**
             * 触发上传封面事件
             */
            emitUpload() {
                this.hideUploadDialog();
                // console.log(this.$refs.uploadHandleRef, 'this.uploadHandleRefthis.uploadHandleRef');
                this.$refs.uploadHandleRef.click();
            },
        },
        computed: {
            /**
             * 获取接口 origin
             * @return {string}
             */
            apiHostName() {
                const arr = window.location.hostname.split('.');
                arr.shift();
                arr.unshift('qi');
                return arr.join('.');
            },
            /**
             * 组织好 上传图片 的 URL
             * @return {string}
             */
            uploadPreviewImageAction() {
                return `//${this.apiHostName}/v1/resources/temporaryFiles/uploadPreviewImage`;
            },
        }
    }
</script>

<style lang="less">
    #upload-cover {
        /*padding: 10px;*/
        background-color: #fff;
        display: inline-block;

        .avatar-uploader {
            .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;

                &:hover {
                    border-color: #409eff;

                    .re-upload-mask {
                        display: flex;
                    }
                }

                .re-upload-mask {
                    /*width: 200px;*/
                    /*height: 170px;*/
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
            }

        }


        /*.avatar-uploader-icon {*/
        /*    font-size: 28px;*/
        /*    color: #8c939d;*/
        /*    width: 200px;*/
        /*    height: 170px;*/
        /*    !*line-height: 178px;*!*/
        /*    text-align: center;*/
        /*}*/

        .avatar {
            /*width: 200px;*/
            /*height: 170px;*/
            display: block;
        }


    }

</style>
