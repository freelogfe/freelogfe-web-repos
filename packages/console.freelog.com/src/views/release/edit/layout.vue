<template>
  <div class="release-editor-layout" v-if="release !== null">
    <div class="r-e-l-header clearfix">
      <div class="r-e-l-main-content">
        <div class="preview-box">
          <UploadCover 
            width="100"
            height="75"
            :imageUrl="coverImageUrl"
            :textVisible="false"
            :onUploaded="uploadCoverSuccess"
          ></UploadCover>
          <img :src="release.previewImages[0]" alt="" :class="{'resource-default-preview':!release.previewImages[0]}" >
        </div>
        <div class="cont">
          <div class="r-e-l-name">
            <template v-if="!isEditingReleaseName">
              <router-link :to="`/release/detail/${release.releaseId}?version=${selectedVersion}`">
                {{release.releaseName}}
              </router-link>
              <!-- <span class="el-icon-edit-outline" @click="tapEditName"></span> -->
            </template>
            <template v-else>
              <el-input
                      autofocus
                      show-word-limit
                      type="text"
                      maxlength="100"
                      v-model="tmpReleaseName"
                      placeholder="请输入发行名称"></el-input>
              <el-button size="small" round type="primary" class="r-e-l-name-save" @click="saveEditName">保存</el-button>
              <el-button size="small" round class="r-e-l-name-cancel" @click="cancelEditName">取消</el-button>
            </template>
            <span class="r-e-l-version">{{selectedVersion || release.latestVersion.version}}</span>
          </div>
          <div class="r-e-l-info">
            <span class="r-i-type">{{release.resourceType}}</span>
            <span class="r-i-date">{{release.updateDate | fmtDate}}</span>
            <span class="r-i-version">发行ID {{release.releaseId}}</span>
          </div>
          <div class="r-e-l-upcast" v-if="release.baseUpcastReleases.length > 0">
            <strong>基础上抛</strong>
            <span
                    class="upcast-release-item"
                    v-for="(item, index) in release.baseUpcastReleases"
                    :key="'upcast-release-' + index"
            ><i class="el-icon-back"></i>{{item.releaseName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="r-e-l-main-content">
      <div class="r-e-l-row r-e-l-release" :class="{ 'tuck-up': isTuckUpRelease }">
        <h3>发行相关 <i class="el-icon-arrow-up" @click="isTuckUpRelease = !isTuckUpRelease"></i></h3>
        <div class="cont">
          <div class="r-e-w-release-intro">
            <h4>
              发行简介
              <div class="r-e-w-btn-group">
                <el-button type="primary" class="edit" size="mini" round v-if="!isEditingIntro && release.intro !== ''" @click="editIntroHandler">编辑</el-button>
                <template v-if="isEditingIntro">
                  <el-button type="primary" class="save" size="small" round @click="saveIntroHandler">保存</el-button>
                  <el-button class="cnacel" size="small" round @click="cancelEditHandler">取消</el-button>
                </template>
              </div>
            </h4>
            <div class="r-e-w-edit-box" v-if="isEditingIntro">
              <el-input type="textarea" :rows="4" v-model="tempEditingIntro"></el-input>
            </div>
            <template v-else>
              <div class="r-e-w-edit-add-btn" v-if="release.intro === ''" @click="editIntroHandler">
                添加简介
              </div>
              <p v-else>{{release.intro}}</p>
            </template>
          </div>
          <div class="r-e-w-release-policy">
            <h4>
              策略
              <el-tooltip class="r-e-w-r-p-tip" effect="light" content="无策略的发行不会出现在市场中" placement="right" v-if="release.policies.length === 0 && !isShowEditPolicy">
                <i class="el-icon-warning"></i>
              </el-tooltip>
              <div class="r-e-w-btn-group" v-else>
                <el-button type="primary" class="add" size="mini" round v-if="!isShowEditPolicy"  @click="addPolicyHandler"><i class="el-icon-plus"></i></el-button>
                <template v-else>
                  <el-button type="primary" class="save" size="small" round @click="savePolicyHandler">保存</el-button>
                  <el-button class="cnacel" size="small" round @click="cancelPolicyHandler">取消</el-button>
                </template>
              </div>
            </h4>
            <div style="position: relative;">
              <template v-if="!isShowEditPolicy">
                <div class="r-e-w-r-policy-add-btn" v-if="release.policies.length === 0"  @click="addPolicyHandler">
                  添加策略
                </div>
                <div class="r-e-w-r-p-list" v-else>
                  <policy-list
                          :policyList="release.policies"
                          @add-policy="addPolicyHandler"
                          @update-policies="updatePolicies"
                  ></policy-list>
                </div>
              </template>
              <policy-editor
                      :showFooterBtns="false"
                      :policy="editTmpPolicy"
                      class="r-e-w-r-p-editor"
                      v-if="isShowEditPolicy"
              ></policy-editor>
            </div>
          </div>
        </div>
      </div>
      <div class="r-e-l-row r-e-l-r-version" :class="{ 'tuck-up': isTuckUpVersion }">
        <h3>版本相关 <i class="el-icon-arrow-up" @click="isTuckUpVersion = !isTuckUpVersion"></i></h3>
        <div class="cont">
          <slot name="about-version"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UploadCover from '@/components/UploadCover/index.vue'
  import PolicyEditor from '@/components/PolicyEditor/index.vue'
  // import PolicyList from '@/components/PolicyList/list.vue'
  import PolicyList from '@/components/PolicyList/list/index.vue'
  import policy from "../../../services/policy"
  const defualtImageUrl = 'http://console.testfreelog.com/public/img/resource.jpg'
  export default {
    name: 'release-editor-layout',
    components: {
      PolicyEditor, PolicyList, UploadCover,
    },

    props: {
      release: Object,
      type: String,
      selectedVersion: String
    },

    data() {
      return {
        tmpReleaseName: '',
        isEditingReleaseName: false,
        coverImageUrl: this.release.previewImages[0] || defualtImageUrl,
        editTmpPolicy: { policyName: '未命名策略', policyText: '' },
        isShowEditPolicy: false,
        isEditingIntro: false,
        isTuckUpRelease: true,
        isTuckUpVersion: false,
        tempEditingIntro: this.release.intro,
      }
    },

    methods: {
      updateRelease(params, message) {
        return this.$services.ReleaseService.put(this.release.releaseId, params)
          .then(res => {
            const {errcode, ret, msg, data} = res.data
            if (errcode === 0 && ret === 0) {
              this.$emit('update:release', data)
              message && this.$message({ type: 'success', message })
            } else {
              this.$error.showErrorMessage(msg)
            }
            return data
          }).catch(this.$error.showErrorMessage)
      },
      uploadCoverSuccess(url) {
        this.updateRelease({
          previewImages: [url]
        }, '封面更新成功！')
        .then(() => {
          this.coverImageUrl = url
        })
      },
      savePolicyHandler() {
        const { policyName, policyText } = this.editTmpPolicy

        this.updateRelease({
          policyInfo: {
            addPolicies: [{
              policyName, policyText: window.btoa(policyText)
            }]
          }
        }, '策略添加成功！')
          .then(() => {
            this.editTmpPolicy = { policyName: '未命名策略', policyText: '' }
            this.isShowEditPolicy = false
          })
      },
      cancelPolicyHandler() {
        this.isShowEditPolicy = false
      },
      addPolicyHandler(policy) {
        this.isShowEditPolicy = true
      },
      updatePolicies(policy) {
        this.updateRelease({
          policyInfo: {
            updatePolicies: [ policy ]
          }
        })
          .then(() => {
            if(policy.status === 1) {
              this.$message({type: 'success', message: `策略"${policy.policyName}"已启用！`})
            }else if(policy.status === 0){
              this.$message({type: 'warning', message: `策略"${policy.policyName}"已停用！`})
            }
          })
      },
      editIntroHandler() {
        this.isEditingIntro = true
        this.tempEditingIntro = this.release.intro
      },
      cancelEditHandler() {
        this.isEditingIntro = false
        this.tempEditingIntro = ''
      },
      saveIntroHandler() {
        var successMsg = this.release.intro === '' ? '发行简介添加成功！' : '发行简介更新成功！'
        const intro = this.tempEditingIntro.replace(/^(\s*)|(\s*)$/g, '')
        this.updateRelease({ intro }, successMsg)
          .then(() => {
            this.isEditingIntro = false
          })
      },
      tapEditName() {
        this.tmpReleaseName = this.release.releaseName
        this.isEditingReleaseName = true
      },
      saveEditName() {
        this.updateRelease({
          "releaseName": this.tmpReleaseName,
        }, '发行名称更新成功！')
        .then((data) => {
          this.isEditingReleaseName = false
        })
      },
      cancelEditName() {
        this.tmpReleaseName = this.release.releaseName
        this.isEditingReleaseName = false
      },
    },
    created() {
      this.isTuckUpRelease = this.type === 'add'

      'UI4.0-发行-修复发行管理bug'
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import './layout.less';
</style>
<style lang="less" type="text/less">
.release-editor-layout {
  .preview-box {
    #upload-cover {
      .el-upload {
          border: none; border-radius: 2px;
        }
    }
  }
}
</style>
