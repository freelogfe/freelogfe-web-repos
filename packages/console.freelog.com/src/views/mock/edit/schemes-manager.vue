<template>
  <div class="resource-schemes-manager-wrap" v-loading="loading">
    <el-tabs v-model="curTabName" :before-leave="switchTabHandler" class="schemes-nav-tabs">
      <el-tab-pane
              v-for="(item, index) in tabs"
              :key="index"
              :name="item.name">
        <div slot="label" class="scheme-title" :class="['scheme-title-status-'+item.data.scheme.status]">
          <el-button class="auth-name" type="text" :class="[SCHEME_STATUS_MAP[item.data.scheme.status].className]">
            <i class="el-icon-remove"></i>
            <i class="el-icon-circle-check"></i>
            {{item.data.scheme.authSchemeName}}
          </el-button>
        </div>
        <lazy-component>
          <SchemeDetail :detail="item.data"></SchemeDetail>
        </lazy-component>
      </el-tab-pane>
      <el-tab-pane name="createTab">
        <span slot="label" class="add-new-scheme-tab-btn"><i class="el-icon-plus"></i>{{$t('resourceEditView.addNewScheme')}}<i class="dot solid" v-if="!tabs.length"></i></span>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
            :visible.sync="showSettingDialog"
            width="450px"
            :show-close="false"
            center>
      <div slot="title" class="scheme-dialog-title">{{$t('resourceEditView.addScheme')}}</div>
      <div class="scheme-dialog-bd">
        <el-input :placeholder="$t('resourceEditView.inputPlaceholder')"
                  v-model="editingScheme.authSchemeName"></el-input>
        <span class="scheme-dialog-create-tip">
          <i class="el-icon-warning"></i>
          {{$t('resourceEditView.createSchemeTip')}}
        </span>
      </div>
      <div slot="footer" class="scheme-dialog-footer">
        <el-button type="text" class="sdf-cancel-btn" style="color: #999999;margin-right: 10px;"
                   @click="hideSettingDialogHandler"> {{$t('common.cancel')}}
        </el-button>
        <el-button type="primary" style="padding: 8px 30px;" size="medium" round @click="saveSchemeHandler"> {{$t('common.confirm')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {SCHEME_STATUS_MAP, SCHEME_PUBLISH_STATUS} from '@/config/scheme'
  import {RESOURCE_STATUS_MAP} from '@/config/resource'
  import {onloadSchemesForResource} from '@/data/scheme/loader'
  import SchemeDetail from './scheme.vue'


  export default {
    name: 'resource-schemes-manager',

    data() {
      return {
        SCHEME_STATUS_MAP,
        curTabName: '',
        tabs: [],
        showSettingDialog: false,
        editingScheme: {},
        loading: false
      }
    },

    props: {
      resourceDetail: Object
    },

    components: {
      SchemeDetail
    },

    watch: {
      'resourceDetail.resourceId'() {
        this.querySchemes()
      }
    },

    mounted() {
      this.querySchemes()
    },

    methods: {
      showSettingDialogHandler(scheme, index) {
        this.editingScheme = {
          authSchemeName: scheme.authSchemeName,
          scheme: scheme
        }
        this.showSettingDialog = true
      },
      hideSettingDialogHandler() {
        this.showSettingDialog = false
        this.editingScheme = {}
      },
      disableSchemeHandler(data, index) {
        const {scheme} = data

        this.shouldShowConfirmTip(data)
          .then(() => {
            this.updateAuthScheme({isOnline: 0}, scheme)
              .then(data => {
                this.updateTabData(this.tabs[index], data)
              }).catch(this.$error.showErrorMessage)
          }).catch(() => {
        })
      },
      updateTabData(tabData, data) {
        tabData.data.scheme.status = data.status
        tabData.data.isEnabled = data.status === SCHEME_PUBLISH_STATUS.enabled
      },
      shouldShowConfirmTip(data) {
        const {isPublished} = data
        var enabledCnt = 0
        this.tabs.forEach(tab => {
          if (tab.data.isEnabled) {
            enabledCnt++
          }
        })
        if (!isPublished || enabledCnt > 1) {
          return Promise.resolve()
        } else {
          return this.$confirm(this.$t('resourceEditView.disableSchemeTip'), this.$t('resourceEditView.disableSchemeTitle'), {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            center: true,
            showClose: false,
            roundButton: true,
            cancelButtonClass: 'scheme-dialog-cancel-btn',
            customClass: 'scheme-tip-dialog'
          })
        }
      },
      querySchemes() {
        if (!this.resourceDetail.resourceId) return
        this.loading = true

        onloadSchemesForResource(this.resourceDetail.resourceId, {policyStatus: 2}).then((authSchemes) => {
          if (authSchemes && authSchemes.length) {
            authSchemes.forEach(this.addTab)
            this.setActiveTab(0)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      setActiveTab(index) {
        if (this.tabs.length) {
          index = index === undefined ? (this.tabs.length - 1) : index
          this.curTabName = this.tabs[index].name
        }
      },
      switchTabHandler(activeName, oldActiveName) {
        switch (activeName) {
          case 'createTab':
            this.showCreateSchemeDialog()
            return false
          default:
            break
        }
      },
      showCreateSchemeDialog() {
        this.showSettingDialogHandler({authSchemeName: ''})
      },
      createTab(scheme) {
        return this.createAuthScheme({
          authSchemeName: scheme.authSchemeName,
          resourceId: this.resourceDetail.resourceId
        })
          .then(this.addTab)
          .then((tabData) => {
            this.curTabName = tabData.name
          })
      },
      createAuthScheme(data) {
        return this.$services.authSchemes.post(data)
          .then((res) => {
            if (res.data.errcode === 0) {
              return res.getData()
            }
            throw new Error(res.data.msg)
          })
      },
      updateAuthScheme(data, schemeData) {
        return this.$services.authSchemes.put(schemeData.authSchemeId, data)
          .then((res) => {
            if (res.data.errcode === 0) {
              return res.getData()
            }
            throw new Error(res.data.msg)
          })
      },
      saveSchemeHandler() {
        var editingScheme = this.editingScheme
        this.createTab(editingScheme).then(this.hideSettingDialogHandler)
      },
      addTab(scheme) {
        const newTabName = scheme.authSchemeId
        const tabData = {
          title: scheme.authSchemeName || this.$t('resourceEditView.defaultSchemeName'),
          name: newTabName,
          content: 'resource-auth-scheme',
          data: {
            id: newTabName,
            scheme,
            resource: this.resourceDetail,
            isPublished: RESOURCE_STATUS_MAP.published === this.resourceDetail.status,
            isEnabled: scheme.status === SCHEME_PUBLISH_STATUS.enabled
          }
        }

        this.tabs.push(tabData)
        scheme.tabId = newTabName

        return tabData
      },
      handleInputConfirm(scheme, ev) {
        this.updateAuthScheme({authSchemeName: scheme.authSchemeName}, scheme)
        ev.target.blur()
      }
    }
  }
</script>


<style lang="less" scoped>
  @import '../../../styles/variables.less';

  .resource-schemes-manager-wrap {
    width: 100%;
    margin: auto;
    padding-top: 10px;

    .scheme-dialog-title {
      color: #333333;
      font-size: 16px;
    }

    .scheme-dialog-footer {
      margin-top: 20px;

      .sdf-cancel-btn {
        margin-right: 10px; padding: 8px 30px; border: 1px solid #ddd; border-radius: 20px;
        color: #999;
      }
    }

    .scheme-dialog-bd {
      margin-top: 10px;
      .scheme-dialog-create-tip {
        color: #e6a23c;
        font-size: 12px;
        float: right;
        margin-top: 10px;
      }
    }

    .scheme-title {
      > span {
        &:after {
          content: '';
          display: block;
          height: 2px;
          width: 72px;
          position: absolute;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 1;
        }
      }
    }

    .schemes-nav-tabs {
      .input-auth-name {
        width: 180px;
        border: none;
        outline: none;
        background: transparent;
        font-size: 14px;
        font-weight: 600;
        &:focus {
        }
      }

      .auth-name {
        color: #363636;
        padding: 0 0 4px 0;
        font-size: 16px;
        margin-left: 3px;
        border-radius: 0;
        i {
          font-size: 20px;
          vertical-align: middle;
          display: none;
        }

        .el-icon-circle-check {
          color: #84CCA8;
        }
        .el-icon-remove {
          color: #E27C80;
        }

        &.on-state .el-icon-circle-check,
        &.off-state .el-icon-remove {
          display: inline-block;
        }

        &.deleted-state {
          color: #D8D8D8;
        }
      }

      .scheme-title-status-4 {

      }
    }

    .add-new-scheme-tab-btn {
      color: #999999;
    }

    .el-icon-plus {
      padding-right: 6px;
      font-weight: 800;
    }
  }
</style>

<style lang="less">
  @import "../../../styles/variables";

  .scheme-tip-dialog {
    .scheme-dialog-cancel-btn {
      border: none;
      color: #999;
    }

    .el-message-box__content {
      margin-top: 20px;
    }
    .el-message-box__btns {
      margin-top: 30px;
      .el-button {
        padding-left: 30px;
        padding-right: 30px;
      }
    }
  }

  .resource-schemes-manager-wrap {
    .el-dialog__header {
      /*border-bottom: 1px solid #DDDDDD;*/
    }

    .schemes-nav-tabs > .el-tabs__header {
      width: @main-content-width-1190;
      margin: auto;
    }

    .el-tabs__nav-wrap {
      &:after,
      .el-tabs__active-bar {
        display: none;
      }

      .el-tabs__item.is-active:after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background: #409EFF;
        position: relative;
        top: -2px;
      }
    }
  }

  @media screen and (max-width: 1250px) {
    .resource-schemes-manager-wrap {
      .schemes-nav-tabs > .el-tabs__header {
        width: @main-content-width-990;
      }
    }
  }
</style>