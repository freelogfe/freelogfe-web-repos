<template>
  <section id="resource-detail" class="res-detail-wrap" :class="[{'owner-resource': isOwnerResource}]">

    <div class="res-detail-bd-row res-detail-release-history">
      <div class="header clearfix">
        <h2>历史发行</h2>
      </div>
      <div class="body">
        <ul class="releases-list" v-if="releasesList.length">
          <li v-for="(release, index) in releasesList" :key="'release-'+ (index+1)">
            <span class="r-l-name">{{release.releaseName}}</span>
            <span class="r-l-version">{{release.resourceVersion.version}}</span>
            <span class="r-l-createdate">{{release.resourceVersion.createDate | fmtDate}}</span>
          </li>
        </ul>
        <div class="res-detail-bd-row-placeholder" v-else>暂无历史发行...</div>
      </div>
    </div>
    <div class="res-detail-bd-row res-detail-release-info">
      <div class="header clearfix">
        <h2>资源信息</h2>
      </div>
      <div class="body">
        <h3 class="rdr-i-name">资源名称</h3>
        <el-input
                class="rdr-i-name__input"
                show-word-limit
                maxlength="40"
                v-model="resourceDetail.resourceInfo.aliasName"></el-input>
        <h3>资源封面</h3>
        <div class="resource-thumbnail-input">
<!--          <el-upload-->
<!--                  v-show="!uploaderStates.thumbnail.isUploading"-->
<!--                  class="resource-thumbnail-uploader"-->
<!--                  drag-->
<!--                  ref="thumbnailUploader"-->
<!--                  :action="uploadPreviewImageAction"-->
<!--                  :with-credentials="true"-->
<!--                  :data="uploader.data"-->
<!--                  :headers="uploader.headers"-->
<!--                  :on-error="errorHandler"-->
<!--                  :on-change="previewImageChangeHandler"-->
<!--                  :on-success="imageUploadSuccessHandler"-->
<!--                  :before-upload="validateImageHandler"-->
<!--                  :on-progress="uploadProgressHandler"-->
<!--                  :show-file-list="false"-->
<!--                  :auto-upload="true">-->
<!--            <img :src="resPreviewImage" :class="{'resource-default-preview': resPreviewImage === ''}" style="height: 100%;" alt="">-->
<!--            <div class="r-t-update-preview-image">-->
<!--              <i class="el-icon-plus"></i>-->
<!--            </div>-->
<!--          </el-upload>-->
            <UploadCover
                :imageUrl="resPreviewImage"
                :onUploaded="imageUploadSuccessHandler"
            />
          <div class="thumbnail-upload-state" v-show="uploaderStates.thumbnail.isUploading">
            <div>
              <i class="el-icon-circle-close" @click="clearUploaderHandler('thumbnail')"></i>
              <el-progress
                      style="margin-right: 20px;"
                      :stroke-width="10"
                      :percentage="uploaderStates.thumbnail.percentage"
                      color="#333333"></el-progress>
            </div>
          </div>
        </div>
        <div class="resource-thumbnail-input-tip">
<!--          <ul>-->
<!--&lt;!&ndash;            <li>只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M</li>&ndash;&gt;-->
<!--&lt;!&ndash;            <li>建议尺寸为800X600</li>&ndash;&gt;-->
<!--            <li>只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M 建议尺寸为800X600</li>-->
<!--          </ul>-->
            <div style="display: flex; padding-left: 20px; font-size: 13px; color: #afafaf;">
                <span>*&nbsp;</span>
                <div>只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M 建议尺寸为800X600</div>
            </div>
        </div>
      </div>
    </div>
    <div class="res-detail-bd-row res-detail-dependencies">
      <div class="header clearfix">
        <h2>
          依赖
          <span class="rdd-h-info" v-if="releasesList.length > 0">
            <i class="el-icon-info"></i>资源发行后不可更改依赖
          </span>
        </h2>
      </div>
<!--      <div class="body">-->
          <DependentReleaseList
              :dataSource="depList"
              :isLock="releasesList.length !== 0"
              @onChange="onChangeDeps"
          />
<!--        <div class="operation-box" v-if="releasesList.length === 0" @click="tapAddDependencyBtn" >-->
<!--          <i class="el-icon-circle-plus-outline"></i>添加依赖-->
<!--        </div>-->
<!--        <ul class="res-dependencies-list" :class="{'hasBtn': releasesList.length === 0}">-->
<!--          <li-->
<!--                  v-for="(dependency, index) in dependencies"-->
<!--                  :key="'dependency-'+ (index+1)">-->
<!--            <i class="el-icon-remove" v-if="releasesList.length === 0" @click="deleteDependency(index)"></i>-->
<!--            <i class="el-icon-lock" v-else></i>-->
<!--            <span class="r-d-l-name">{{dependency.releaseName}}</span>-->
<!--            <span class="r-d-l-type">{{dependency.resourceType}}</span>-->
<!--            <span class="r-d-l-version">{{dependency.latestVersion.version}}</span>-->
<!--            <span class="r-d-l-updatedate">{{dependency.updateDate | fmtDate}}</span>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <div class="res-detail-bd-row-placeholder" v-if="dependencies.length === 0">-->
<!--          暂无依赖-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="res-detail-bd-row res-detail-desc ql-snow" ref="resDesc">
      <div class="header clearfix">
        <h2>资源描述</h2>
      </div>
      <div class="body">
        <rich-editor class="res-desc-editor"
                     ref="editor"
                     width="100%"
                     v-model="resourceDetail.resourceInfo.description"
                     :config="editorConfig"
                     @load="imgUploadSuccessHandler"
                     :placeholder="$t('resourceEditView.inputDescTip')"></rich-editor>
      </div>
    </div>
    <div class="res-detail-bd-row res-detail-meta" ref="resMeta">
      <div class="add-btn" v-if="meta === '{}' && !isMetaEditing" @click="editMeta">
        <i class="el-icon-plus"></i> 添加meta信息
      </div>
      <template v-else>
        <div class="header clearfix">
          <h2>meta信息</h2>
        </div>
        <div class="body">
          <div class="input-area">
            <resource-meta-info v-model="meta" @validate="checkMetaValid" :placeholder="$t('resourceEditView.inputMetaTip')"></resource-meta-info>
          </div>
        </div>
      </template>
    </div>
    <div class="res-detail-footer">
      <div class="body">
        <el-button round class="rdf-button--cancel" @click="handleCancel">取消</el-button>
        <el-button round type="primary" class="rdf-button--save" @click="handleSave">保存</el-button>
        <el-button round type="primary" class="rdf-button--release" @click="handleRelease">保存并发行</el-button>
      </div>
    </div>

    <el-dialog width="750px"
               top="10vh"
               center
               :visible.sync="isShowReleaseDenpDialog">
      <release-search :tabLayout="['search', 'my-release', 'favor']" :historicalReleases="releasesList" @add="releaseSearchHandler"></release-search>
    </el-dialog>

    <el-dialog width="750px"
               top="10vh"
               center
               :visible.sync="isShowReleaseSearchDialog">
      <release-search :tabLayout="['my-release']" :historicalReleases="releasesList" @add="releaseSearchHandler"></release-search>
      <div class="" slot="footer">
        <el-button round type="primary" class="create-release-btn" @click="createNewRelease">创建新发行</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import ResourceDetail from './index'

  export default ResourceDetail
</script>

<style lang="less" type="text/less">
  #resource-detail {
    .resource-thumbnail-input .el-upload-dragger{ width: 200px; height: 150px; }
    .el-dialog__header {padding: 0; }

    .el-dialog__body {
      padding: 10px 20px;
      .el-tabs__content { overflow: auto; max-height: 370px; }
    }
    .el-dialog__headerbtn{ z-index: 100; }
  }
</style>
<style lang="less" scoped>
  @import "index-v4-1.less";
</style>
