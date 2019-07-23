<template>
    <div style="margin: 0 auto; width: 1200px;">

        <!--        <HeaderAlert/>-->

        <BlockBody tilte="资源上传">

            <SmallTitle>资源类型</SmallTitle>

            <div style="padding-left: 40px;">
                <el-select
                    style="width: 160px; line-height: 38px;"
                    v-model="resourceType"
                    @change="onChangeResourceType"
                    placeholder="资源类型"
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
                    上传资源之前需要选择资源类型
                </div>
            </div>

            <SmallTitle>资源文件</SmallTitle>

            <div style="padding-left: 40px; padding-right: 40px;">
                <UploadFile
                    :noRepeat="true"
                    :fileType="resourceType"
                    :fileInfo="uploadFileInfo"
                    :onFileInfoChange="onFileInfoChange"
                    @error="onUploadNoType"
                />
            </div>

            <SmallTitle>资源名称</SmallTitle>

            <div style="padding-left: 40px;">
                <el-input
                    :disabled="isUpdateResource"
                    :minlength="1"
                    :maxlength="100"
                    v-model="resourceName"
                    placeholder="输入资源名称"
                    style="width: 590px;"
                ></el-input>

                <span style="color: #c3c3c3; font-size: 14px; font-weight: 500; padding-left: 10px;">{{resourceName.length}}/100</span>
            </div>

            <SmallTitle :dot="false">资源封面</SmallTitle>

            <div style="padding-left: 40px;">
                <UploadCover
                    :imageUrl="coverURL"
                    :onUploaded="coverUploaded"
                />

                <div
                    style="font-size: 13px; padding-left: 20px; display: inline-block; vertical-align: bottom; color: #afafaf;"
                >
                    <small style="vertical-align: top;">•&nbsp;</small>
                    <div style="display: inline-block;">
                        只支持JPG/PNG/GIF，GIF文件不能动画化，<br/>大小不超过5M
                        建议尺寸为800X600
                    </div>
                </div>
            </div>

            <div style="height: 20px;"></div>
        </BlockBody>

        <BlockBody tilte="依赖">
            <DependentReleaseList
                :dataSource="[]"
                :isLock="true"
                :onChange="onChangeDeps"
            />
<!--            <div style="padding-left: 20px; height: 60px; align-items: center; display: flex;">-->
<!--                <el-button-->
<!--                    size="small"-->
<!--                    icon="el-icon-plus"-->
<!--                    circle-->
<!--                    @click="showDepDialog"-->
<!--                ></el-button>-->
<!--                <span style="padding-left: 10px; font-size: 14px; color: #333;">添加依赖</span>-->
<!--            </div>-->
<!--            <DepList-->
<!--                :data="depList"-->
<!--                :onChange="onChangeDeps"-->
<!--            ></DepList>-->
<!--            <div style="height: 10px;"></div>-->

<!--            &lt;!&ndash; 添加依赖的搜索弹出框 &ndash;&gt;-->
<!--            <el-dialog-->
<!--                width="750px"-->
<!--                top="10vh"-->
<!--                center-->
<!--                :visible.sync="visibleDepDialog"-->
<!--            >-->
<!--                &lt;!&ndash;                @add="addDepReleaseHandler"&ndash;&gt;-->
<!--                <ReleaseSearch-->
<!--                    :tabLayout="['search', 'my-release', 'favor']"-->
<!--                    @add="addDep"-->
<!--                ></ReleaseSearch>-->
<!--            </el-dialog>-->
        </BlockBody>

        <BlockBody tilte="资源描述">
            <!--            ref="editor"-->
            <!--             v-model="formData.description"-->
            <!--            :config="editorConfig"-->
            <!--            @load="imgUploadSuccessHandler"-->
            <RichEditor
                style="box-sizing: border-box; margin: 0;"
                width="100%"
                placeholder="请输入资源描述"
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
            ><i class="el-icon-plus" style="font-weight: 600;"></i> 添加meta信息
            </el-button>
        </div>

        <BlockBody
            v-if="visibleMetaInput"
            tilte="meta信息">
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
                >{{isUpdateResource ? '取消': '取消创建'}}
                </el-button>
                <el-button
                    size="medium"
                    round
                    type="primary"
                    @click="onSubmitButtonClick(false)"
                >{{isUpdateResource ? '保存': '完成创建'}}
                </el-button>
                <el-button
                    size="medium"
                    round
                    @click="onSubmitButtonClick(true)"
                >{{isUpdateResource ? '保存并发行': '创建并发行'}}
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
                @add="createRelease"
            ></release-search>
            <div slot="footer">
                <el-button
                    round
                    type="primary"
                    class="create-release-btn"
                    @click="createRelease()">创建新发行
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
