<template>
    <div>
        <div
            v-if="!!fileInfo.name && !fileInfo.fileID && percentage === null"
            style="background-color: #fafbfb; padding: 0 10px; display: flex; align-items: center; justify-content: space-between;">
            <div style="line-height: 46px; font-size: 14px; color: #333;">
                <span style="padding-right: 70px;">{{fileInfo.name}}</span>
                <span>{{fileSize}}</span>
            </div>
            <a
                @click="onFileInfoChange"
                class="el-icon-circle-close"
            ></a>
        </div>

        <el-upload
            v-show="!fileInfo.name"
            :action="uploadResourceFileAction"
            :accept="accept"
            :on-change="handleChange"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :with-credentials="true"
            :on-success="onSuccess"
            :on-progress="onProgress"
            :data="{resourceType: fileType}"
        >
            <el-button
                ref="sourceUploadButton"
                @click="onClickButton"
            >上传资源
            </el-button>
            <span
                slot="tip"
                style="font-size: 13px; color: #afafaf; padding-left: 20px; display: inline-block; vertical-align: bottom;"
            ><small>•</small> 资源最大不超过50M</span>
        </el-upload>

        <div
            style="background-color: #fafbfb;"
            v-if="percentage !== null"
        >
            <div
                style="display: flex; justify-content: space-between;  font-size: 16px; color: #333; padding: 0 20px; line-height: 45px; height: 45px">
                <span>{{fileInfo.name}}</span>
                <span>{{fileSize}}</span>
            </div>
            <div
                style="padding: 18px 20px; border-top: 1px solid #e8e8e8; display: flex; align-items: center;">
                <el-progress
                    :percentage="percentage || 0"
                    :stroke-width="14"
                    color="#409eff"
                    :show-text="false"
                    style="flex-shrink: 1; width: 100%;"
                ></el-progress>
                <div
                    style="width: 130px;box-sizing: border-box;flex-shrink: 0;padding-left: 10px;color: #3f9cfd;font-size: 14px;font-weight: 600;"
                >

                    <span
                        v-if="percentage !== null && percentage < 100"
                        style="display: flex; align-items: center; justify-content: space-between;"
                    >
                        <span>{{percentage + '%'}}</span>
                        <a
                            @click="deleteUploadedFile"
                            class="el-icon-circle-close"
                        ></a>
                    </span>

                    <div
                        v-if="percentage === 100"
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
                            v-model="visiblePopover"
                        >
                            <div style="height: 10px;"></div>
                            <p style="font-size: 14px; color: #333; font-weight: 600; text-align: center;">
                                确定删除资源文件？</p>
                            <div style="height: 10px;"></div>
                            <div style="text-align: center; margin: 0;">
                                <el-button
                                    style="color: #999;"
                                    size="mini"
                                    type="text"
                                    @click="deleteUploadedFileCancel"
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
                                class="el-icon-circle-close"
                            ></a>
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>

        <!-- 上传文件有问题的 dialog -->
        <el-dialog
            :visible="!!errorText"
            width="30%"
            :close-on-click-modal="false"
            :show-close="false"
        >
<!--            <div style="height: 20px;"></div>-->
            <div style="display: flex; align-items: center; justify-content: center;">
                <i
                    class="el-icon-warning"
                    style="color: #FFC000; font-size: 20px;"
                ></i>
                <span style="font-size: 14px; color: #333; font-weight: 600; padding-left: 10px;"> {{errorText}}</span>
            </div>
            <div style="height: 40px;"></div>
            <div style="display: flex; align-items: center; justify-content: center;">
                <el-button
                    type="text"
                    style="color: #999;"
                    @click="hideUploadErrorDialog"
                >取消</el-button>
                &nbsp;&nbsp;&nbsp;
                <el-button
                    type="primary"
                    plain
                    round
                    @click="onClickUpload"
                >重新选择</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export {default} from './index';
</script>

<style scoped lang="less">
    .el-icon-circle-close {
        color: #d5d5d5;
        font-size: 20px;
        cursor: pointer;

        &:hover {
            color: #f02323;
        }
    }

</style>
