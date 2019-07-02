<template>
  <section id="resource-detail" class="res-detail-wrap" :class="[{'owner-resource': isOwnerResource}]">
    <div class="res-detail-hd clearfix"  ref="resIntro">
      <div class="res-hd-wrap">
        <div class="res-digest">
          <div class="l-side">
            <div class="resource-thumbnail-input">
              <el-upload
                      v-show="!uploaderStates.thumbnail.isUploading"
                      class="resource-thumbnail-uploader"
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
                      :auto-upload="true">
                <img :src="resPreviewImage" :class="{'resource-default-preview': resPreviewImage === ''}" style="height: 100%;" alt="">
                <div class="r-t-update-preview-image">
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
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
          </div>
          <div class="r-side">
            <div class="res-title">
              <span v-if="!isAliasnameEditing">{{resourceDetail.resourceInfo.aliasName}}</span>
              <el-input v-else v-model="resourceDetail.resourceInfo.aliasName"></el-input>
              <span class="res-detail-edit-btn" v-if="!isAliasnameEditing" @click="isAliasnameEditing = true">修改</span>
              <template v-else>
                <span class="res-detail-save-btn" @click="saveResourceAliasName">保存</span>
                <span class="res-detail-cancel-btn" @click="isAliasnameEditing = false">取消</span>
              </template>
            </div>
            <div class="res-origin-info">
              <span class="res-type">{{resourceDetail.resourceInfo.resourceType}}</span>
              <span class="res-type">{{resourceDetail.resourceInfo.resourceId}}</span>
              <span class="res-update-time">{{$t('resourceDetailView.lastUpdateText')}} {{resourceDetail.resourceInfo.updateDate|fmtDate}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="res-detail-content" ref="detailContent">
      <div>
        <div class="res-detail-nav-tabs-wrap" ref="tabs"></div>
        <div class="res-detail-bd" ref="detailBody">
          <div class="res-detail-bd-row res-detail-release">
            <div class="header clearfix">
              <h3>所属发行</h3>
              <div class="operation-box">
                <button class="add-to-release-btn" @click="tapAddToReleaseBtn">加入现有发行</button>
                <button class="create-release-btn" @click="createNewRelease">全新发行</button>
              </div>
            </div>
            <div class="body">
              <ul class="releases-list" v-if="releasesList.length">
                <li v-for="(release, index) in releasesList" :key="'release-'+ (index+1)">
                  <span class="r-l-name">{{release.releaseName}}</span>
                  <span class="r-l-version">{{release.resourceVersion.version}}</span>
                  <span class="r-l-createdate">{{release.resourceVersion.createDate | fmtDate}}</span>
                </li>
              </ul>
              <div class="res-detail-bd-row-placeholder" v-else>资源未有发行</div>
            </div>
          </div>
          <div class="res-detail-bd-row res-detail-dependencies">
            <div class="header clearfix">
              <h3>依赖</h3>
              <el-tooltip placement="top" :disabled="releasesList.length === 0" content="资源已存在发行，不可修改依赖">
                <div class="operation-box" :class="{'disabled': releasesList.length > 0 }" @click="tapAddDependencyBtn" >
                    <i class="el-icon-plus"></i>添加依赖
                </div>
              </el-tooltip>
            </div>
            <div class="body">
              <ul class="res-dependencies-list" v-if="dependencies.length">
                <li
                        v-for="(dependency, index) in dependencies"
                        :key="'dependency-'+ (index+1)">
                  <el-button class="delete-dependency-btn" v-if="releasesList.length === 0" @click="deleteDependency(index)">-</el-button>
                  <span class="r-d-l-name">{{dependency.releaseName}}</span>
                  <span class="r-d-l-type">{{dependency.resourceType}}</span>
                  <span class="r-d-l-version">{{dependency.latestVersion.version}}</span>
                  <span class="r-d-l-updatedate">{{dependency.updateDate | fmtDate}}</span>
                </li>
              </ul>
              <div class="res-detail-bd-row-placeholder" v-else>
                暂无依赖
              </div>
            </div>
          </div>
          <div class="res-detail-bd-row res-detail-desc ql-snow" ref="resDesc">
            <div class="header clearfix">
              <h3>资源描述</h3>
              <div class="operation-box">
                <button class="edit-btn" v-if="!isDescEditing" @click="editDesc">编辑</button>
                <template v-else>
                  <button class="cancel-btn" @click="isDescEditing = false">取消</button>
                  <button class="save-btn" @click="saveDesc">保存</button>
                </template>
              </div>
            </div>
            <div class="body">
              <div class="input-area" v-show="isDescEditing">
                <rich-editor class="res-desc-editor"
                             ref="editor"
                             width="100%"
                             v-model="resourceDetail.resourceInfo.description"
                             :config="editorConfig"
                             @load="imgUploadSuccessHandler"
                             :placeholder="$t('resourceEditView.inputDescTip')"></rich-editor>
              </div>
              <template v-if="!isDescEditing">
                <div v-if="resourceDetail.resourceInfo.description"
                     class="ql-editor"
                     v-html="resourceDetail.resourceInfo.description"></div>
                <div v-else class="empty-res-desc-text">{{ $t('resourceDetailView.noDescTip') }}</div>
              </template>

            </div>
          </div>
          <div class="res-detail-bd-row res-detail-meta" ref="resMeta">
            <div class="header clearfix">
              <h3>meta信息</h3>
              <div class="operation-box">
                <button class="edit-btn" v-if="!isMetaEditing" @click="editMeta">编辑</button>
                <template v-else>
                  <button class="cancel-btn" :class="{'disabled': metaValid}" @click="isMetaEditing = false">取消</button>
                  <button class="save-btn" :class="{'disabled': metaValid}" @click="saveMeta">保存</button>
                </template>
              </div>
            </div>
            <div class="body">
              <div class="input-area" v-if="isMetaEditing">
                <resource-meta-info v-model="meta" @validate="checkMetaValid" :placeholder="$t('resourceEditView.inputMetaTip')"></resource-meta-info>
              </div>
              <pre class="meta-info" v-else>{{tempMeta}}</pre>
            </div>
          </div>
        </div>
        <div class="res-detail-ft">

        </div>
      </div>
      <a class="up-to-top" href="#" ref="upBtn">
        <i class="el-icon-arrow-up"></i>
      </a>
    </div>

    <el-dialog width="750px"
               top="10vh"
               center
               :visible.sync="isShowReleaseSearchDialog">
      <release-search @add="releaseSearchHandler"></release-search>
    </el-dialog>
  </section>
</template>

<script>
  import ResourceDetail from './index'

  export default ResourceDetail
</script>

<style lang="less" type="text/less">
  #resource-detail {
    .el-dialog__header {padding: 0; }

    .el-dialog__body { padding: 10px 20px 30px; }
    .el-dialog__headerbtn{ z-index: 100; }
  }
</style>
<style lang="less" scoped>
  @import "index.less";
</style>
