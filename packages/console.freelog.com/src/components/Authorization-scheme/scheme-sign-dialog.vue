<template>
  <el-dialog
          class="s-c-dialog"
          :title="dialogTitle"
          width="800px"
          append-to-body
          center
          :visible="visible"
          :show-close="false"
  >
    <div class="resolved-duty-statements" v-show="resolvedDutyStatements.length">
      <h3>{{$t('components.authScheme.signedDepsTip',{length: resolvedDutyStatements.length})}}</h3>
      <el-table
              :data="renderDutyStatements"
              :row-class-name="tableRowClassName"
              stripe
              style="width: 100%"
      >
        <el-table-column prop="resourceName" :label="$t('components.authScheme.resourceName')" width="350"></el-table-column>
        <el-table-column prop="authSchemeName" :label="$t('components.authScheme.authSchemeName')" ></el-table-column>
        <el-table-column prop="policyName" :label="$t('components.authScheme.policyName')" ></el-table-column>
        <el-table-column prop="signState" :label="$t('components.authScheme.signState')" ></el-table-column>
      </el-table>
    </div>
    <div class="resolved-bubble-resources" v-show="resolvedBubbleResources.length">
      <h3>{{$t('components.authScheme.unsignedDepsTip',{length: resolvedBubbleResources.length})}}</h3>
      <ul>
        <li
                v-for="(item, index) in resolvedBubbleResources"
                :key="'r-b-r-' + index"
        >
          <span class="r-b-r-i-reousrce-name">{{item.resourceName}}</span>
        </li>
      </ul>
    </div>
    <div class="no-resolved-duty-statements" v-if="false">
      {{$t('components.authScheme.noResolvedTip')}}
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="hideDialog">{{$t('common.cancel')}}</el-button>
      <el-button
              type="primary"
              class="sign-btn"
              :class="{ 'disabled': !isNeedResignContracts }"
              @click="signContract"
      >{{signBtnText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'scheme-sign-dialog',
    props: {
      resolvedDutyStatements: {
        type: Array,
        default: function() {
          return []
        }
      },
      resolvedBubbleResources: {
        type: Array,
        default: function() {
          return []
        }
      },
      visible: {
        type: Boolean,
        default: false
      },
      authType: String,
      presentableId: String,
      authSchemeId: String
    },
    computed: {
      renderDutyStatements() {
        return this.formatResolvedDutyStatements(this.resolvedDutyStatements)
      }
    },
    data() {
      return {
        isNeedResignContracts: true,
        dialogTitle: this.$t('components.authScheme.signConfirmTitle'),
        signBtnText: this.$t('components.authScheme.signConfirmText')
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (!row.contractId) {
          return 'warning-row'
        }
        return ''
      },
      hideDialog() {
        this.$emit('update:visible', false)
      },
      getPresentableSignData() {
        const data = this.resolvedDutyStatements.map(item => {
          const { resourceId, authSchemeId, segmentId, contractId = '' } = item
          if(contractId && contractId !== '') {
            return { resourceId, authSchemeId, policySegmentId: segmentId, contractId }
          }else {
            return { resourceId, authSchemeId, policySegmentId: segmentId }
          }
        })
        return data
      },
      getResourceSignData() {
        const data = {
          dutyStatements: this.resolvedDutyStatements.map(item => {
            const { resourceId, authSchemeId, policySegmentId } = item
            return { resourceId, authSchemeId, policySegmentId }
          }),
          bubbleResources: this.resolvedBubbleResources.map(item => {
            return { resourceId: item.resourceId }
          })
        }
        return data
      },
      signContract() {
        if(this.isNeedResignContracts) {
          switch (this.authType) {
            case 'presentable': {
              this.$axios.put(`/v1/presentables/${this.presentableId}`, {
                contracts: this.getPresentableSignData()
              })
                .then(res => res.data)
                .then(res => {
                  if(res.errcode === 0) {
                    this.hideDialog()
                    this.$emit('done', res.data)
                  }else {
                    this.$message.error(res.msg)
                  }
                })
              break
            }
            case 'resource': {
              this.$axios.put(`/v1/resources/authSchemes/${this.authSchemeId}/batchSignContracts`, this.getResourceSignData())
                .then(res => res.data)
                .then(res => {
                  if (res.errcode === 0) {
                    this.hideDialog()
                    this.$emit('done', res.data)
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              break
            }
            default: {}
          }
        }
      },
      formatResolvedDutyStatements(resolvedDutyStatements) {
        if(resolvedDutyStatements.length) {
          let isAllHasSignHistory = true
          const targetArr = resolvedDutyStatements
            .map(item => {
              const { isHasSignHistory, contractId } = item
              if(isHasSignHistory) {
                item.signState = this.$t('contract.signedText')
              }else {
                isAllHasSignHistory = false
                item.signState = this.$t('contract.unsignedText')
              }

              return item
            })
          if(isAllHasSignHistory) {
            this.dialogTitle = this.$t('components.authScheme.dialogTitles[0]')
          }else {
            this.dialogTitle = this.$t('components.authScheme.dialogTitles[1]')
          }
          return targetArr
        }else {
          return this.resolvedDutyStatements
        }
      },
    },
    watch: {
      resolvedDutyStatements() {
      },
    }
  }
</script>

<style lang="less" type="text/less">
  .s-c-dialog {
    .no-resolved-duty-statements {
      text-align: center;
      margin-top: 30px;
    }
    h3 {
      position: relative;
      margin-top: 30px; padding-left: 10px;
      font-size: 14px;
      color: #333333;

      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 1;
        transform: translateY(-50%);
        content: '';
        display: block;
        width: 3px;
        height: 14px;
        background-color: #666;
      }
    }

    .resolved-duty-statements {
      .r-d-s-i-reousrce-name {
      }
      .r-d-s-i-auth-scheme-name {
      }
      .r-d-s-i-policy-name {
      }
    }

    .resolved-bubble-resources {
      ul { padding-left: 10px; }

      li {
        margin-top: 12px;
      }
      .r-b-r-i-reousrce-name {
      }
    }



    .el-table {
      .cell {
        white-space: nowrap;
      }
      .warning-row {
        color: #e6a23c;
      }
    }

    .el-dialog__body {
      padding-top: 0; border-top: 1px solid #DDD;
    }
    .el-dialog__footer {
      height: 50px;
      padding: 0 20px;
      border-top: 1px solid #DDD;
      line-height: 50px;
      text-align: right;

      .cancel-btn {
        padding: 6px 30px;
        border-width: 0;
      }
      .sign-btn {
        padding: 6px 30px;
        border-radius: 17px;
        background: #409EFF;
        color: #fff;

        &.disabled {
          background-color: #D8D8D8; border-color: #D8D8D8; cursor: not-allowed;
        }
      }
    }
  }
</style>
