<template>
  <div id="release-create" v-loading="resourceDetail === null" v-if="resourceDetail !== null">
    <el-form class="r-c-w-cont" ref="createReleaseForm" :model="formData" :rules="rules">
      <div class="r-c-w-row r-c-w-resource clearfix">
        <div class="preview-box">
          <img :src="previewImage" alt="" :class="{'resource-default-preview':!previewImage}">
        </div>
        <div class="cont">
          <h2>
            {{resourceDetail.aliasName}}
            <div class="rcw-info">
              {{resourceDetail.resourceType}} | {{resourceDetail.updateDate | fmtDate}}
            </div>
          </h2>
          <p class="rcw-intro">
            {{resourceDetail.intro}}
          </p>
        </div>
      </div>
      <div class="r-c-w-row r-c-w-name">
        <h3>发行名称</h3>
        <div style="margin-bottom: 10px; font-size: 13px; color: rgb(175, 175, 175);">
          <strong>• 发行一旦创建，则不可编辑名称（且在同个用户范围内必须唯一）。</strong>
        </div>
        <el-form-item prop="releaseName" class="cont">
          {{session.user.username}} /
          <el-input
                  autofocus
                  validate-event
                  show-word-limit
                  maxlength="100"
                  v-model="formData.releaseName"/>
        </el-form-item>
      </div>
      <div class="r-c-w-row r-c-w-upcast" v-if="depReleasesList.length">
        <h3>基础上抛</h3>
        <div class="cont">
          <div
                  class="upcast-release-item"
                  v-for="(item, index) in baseUpcastReleases"
                  :key="'upcast-release-' + index"
          ><i class="el-icon-back"></i>{{item.releaseName}}
          </div>
          <div class="no-upcase-releases" v-if="baseUpcastReleases.length === 0">初始版本所选择的上报将成为基础上抛</div>
        </div>
      </div>
      <div class="r-c-w-row r-c-w-version">
        <h3>版本号</h3>
        <el-form-item prop="version" class="cont">
          <i>*</i>
          <el-input v-model="formData.version"></el-input>
          <!--<div class="release-name">-->
          <!--<img :src="resourceDetail.previewImages ? resourceDetail.previewImages[0] : ''" alt="" :class="{'resource-default-preview':!(resourceDetail.previewImages && resourceDetail.previewImages[0])}" >-->
          <!--{{resourceDetail.aliasName}}-->
          <!--</div>-->
        </el-form-item>
      </div>
      <div class="r-c-w-row r-c-w-scheme" v-if="depReleasesList.length">
        <h3>方案</h3>
        <div class="cont">
          <scheme-manage
                  type="create"
                  :baseUpcastReleases.sync="baseUpcastReleases"
                  :depReleasesList="depReleasesList"
                  :depReleasesDetailList.sync="depReleasesDetailList"
                  @update-resolved-releases="updateResolvedReleases"
          ></scheme-manage>
        </div>
      </div>
    </el-form>
    <div class="r-c-w-footer">
      <div class="body">
        <div class="cancel" @click="cancelCreateRelease">取消创建</div>
        <el-button class="create" type="primary" size="small" round @click="createRelease('createReleaseForm')">创建发行</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import SchemeManage from '../scheme/index.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'release-creator',
    components: {SchemeManage},
    data() {
      const validateName = (rule, value, callback) => {
        if(value.length < 1 || value.length > 60) {
          callback('长度必须在 1–60 字符之间')
        }else if(/^[^\/\\\:\*\?\"\<\>\|\!]+$/.test(value)) {
          callback()
        }else {
          callback('名称不能包含空格和以下字符：\ / : * ? " < > |!')
        }
      }
      const validateVersion = (rule, value, callback) => {
        if(/^\d+\.\d+.\d+$/.test(value)) {
          callback()
        }else {
          callback(new Error('版本号格式有误！'))
        }
      }

      return {
        resourceDetail: null,
        releaseName: '',
        formData: {
          releaseName: '',
          version: '0.1.0'
        },
        rules: {
          releaseName: [
            { required: true, message: '发行名不能为空！', trigger: 'blur'},
            { validator: validateName, trigger: 'blur' }
          ],
          version: [
            { required: true, message: '版本号不能为空！', trigger: 'blur'},
            { validator: validateVersion, trigger: 'blur' }
          ]
        },
        baseUpcastReleases: [],
        depReleasesList: [],
        depReleasesDetailList: [],
        upcastDepReleasesIds: [],
        upcastDepReleasesMap: {},
        resolvedReleases: []
      }
    },
    computed: Object.assign({
      projection() {
        return ["releaseId", "resourceType", "releaseName", "latestVersion", "baseUpcastReleases", "policies", "updateDate",].join(',')
      },
      previewImage() {
        if (!this.resourceDetail) {
          return ''
        } else {
          return this.resourceDetail.previewImages[0] || ''
        }
      }
    }, mapGetters({
      session: 'session'
    })),
    watch: {
      dependencies() {

      },
    },
    methods: {
      updateResolvedReleases(releases) {
        this.resolvedReleases = releases.map(r => {
          return {
            releaseId: r.releaseId,
            contracts: r.policies.filter(p => p.isSelected).map(p => {
              return {policyId: p.policyId}
            })
          }
        })
      },
      cancelCreateRelease() {
        this.$router.go(-1)
        // this.$router.push(`/resource/detail/${this.resourceDetail.resourceId}`)
      },
      getFormData() {
        const data = {
          resourceId: this.resourceDetail.resourceId,
          releaseName: this.formData.releaseName,
          version: this.formData.version,
          baseUpcastReleases: this.baseUpcastReleases.map(r => {
            return {releaseId: r.releaseId}
          }),
          resolveReleases: this.resolvedReleases
        }
        if (this.previewImage) {
          data.previewImages = [this.previewImage]
        }
        return data
      },
      createRelease(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            const formData = this.getFormData()
            this.$services.ReleaseService.post(formData)
              .then(res => res.data)
              .then(res => {
                if (res.errcode === 0 && res.data) {
                  this.$message({type: 'success', message: '发行创建成功！'})
                  if (res.data.releaseId) {
                    this.$router.push(`/release/edit/${res.data.releaseId}`)
                  }
                } else {
                  this.$message({type: 'error', message: res.msg})
                }
              })
              .catch(e => this.$message({type: 'error', message: e.toString()}))
          } else {
            return false;
          }
        });
      },
    },
    created() {
      if (this.$route.query.resourceId) {
        this.$services.resource.get(this.$route.query.resourceId)
        .then(res => res.data)
        .then(res => {
          if (res.errcode === 0) {
            this.resourceDetail = res.data
            this.depReleasesList = res.data.systemMeta.dependencies || []
            this.formData.releaseName = res.data.aliasName
          } else {
            this.$message({type: 'error', message: res.msg})
          }
        })
        .catch(e => this.$message({type: 'error', message: e.toString()}))
      }

    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../styles/variables.less';

  #release-create {
    padding-left: 50px;

    .r-c-w-cont {
      width: @main-content-width-990;
      margin: auto;
      padding-top: 40px;
    }

    .r-c-w-row {
      margin-bottom: 30px;
      h3 {
        position: relative;
        margin-bottom: 5px;
        padding: 10px;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          z-index: 1;
          width: 3px;
          height: 12px;
          background-color: #333;
          transform: translateY(-50%);
        }
      }
    }

    .r-c-w-resource {
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);

      .preview-box {
        float: left;
        overflow: hidden;
        width: 100px;
        height: 75px;
        border-radius: 2px;
        box-shadow: 0 0 1px #999;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .cont {
        padding-left: 120px;
        h2 {
          font-size: 16px;
        }
      }
      .rcw-info {
        float: right;
        font-size: 13px;
        font-weight: 400;
        color: #999;
      }
      .rcw-intro {
        margin-top: 15px;
        font-size: 13px;
      }
    }

    .r-c-w-name {
      .cont {
        font-size: 18px;
        color: #333;
      }

      .el-input {
        width: 340px;
      }
    }

    .r-c-w-upcast {
      .upcast-release-item {
        position: relative;
        display: inline-block;
        margin-right: 15px;
        height: 26px;
        padding: 0 16px 0 26px;
        border: 1px solid #FFA6A8;
        border-radius: 14px;
        line-height: 26px;
        background-color: #FFF4F4;
        color: #333;
        font-weight: 500;
      }
      .el-icon-back {
        position: absolute;
        left: 12px;
        top: 50%;
        z-index: 1;
        transform: translateY(-50%) rotate(90deg);
        color: #EA7171;
        font-weight: bold;
      }
      .no-upcase-releases {
        color: #999;
      }
    }

    .r-c-w-version {
      .cont {
        display: flex;
        align-items: center;
      }

      i {
        margin-right: 5px;
        color: #FA686D;
      }
      .el-input {
        width: 210px;
      }
      .release-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 300px;
        padding: 5px;
        margin-left: 30px;
        line-height: 30px;
        background-color: #FAFBFB;
        img {
          float: left;
          width: 40px;
          height: 30px;
          margin-right: 5px;
        }
        span {
          display: inline-block;
        }
      }
    }

    .r-c-w-scheme {

    }

    .r-c-w-footer {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 99;
      padding-left: 50px;
      box-shadow: 0 0px 1px #0006;
      background-color: #fff;
      text-align: right;

      .body {
        width: @main-content-width-990;
        margin: auto;
        padding: 10px 0;
      }
      .cancel {
        display: inline-block;
        margin-right: 10px;
        padding: 6px 12px;
        cursor: pointer;
        &:hover {
          color: #999;
        }
      }
    }
  }

</style>

<style lang="less" type="text/less">
  #release-create {
    .el-input {
      .el-input__inner {
        padding-right: 55px;
      }
      .el-input__count {
        .el-input__count-inner {
          background-color: inherit;
        }
      }
    }
    .el-form-item__content {
      display: inline-block;
      .el-form-item__error {
        white-space: nowrap;
        left: 106%; top: 50%; transform: translateY(-50%);
      }
    }
    .r-c-w-name {
      .el-form-item__content {
        .el-form-item__error { left: 103%; }
      }
    }
  }
</style>
