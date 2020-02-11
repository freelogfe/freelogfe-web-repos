<!--<i18n src="../../i18n-locales/contractSigning.json"></i18n>-->
<template>
    <el-dialog
            center
            :title="$t('contractSigning.confirm.title')"
            width="440px"
            top="25vh"
            :visible.sync="isShowDialog"
            @close="confirmCancel"
            append-to-body
    >
      <div class="rcb-confirm-cont">
        <div class="confirm-set-default-contract" v-if="confirmType === 'set-default-contract'">
          {{$t('contractSigning.confirm.content_default')}}
        </div>
        <div class="confirm-sign-contract" v-if="confirmType === 'sign-contract'">
          <div class="csn-presentable-name"><span>{{$t('contractSigning.confirm.resourceName')}}</span>&nbsp;&nbsp;&nbsp;&nbsp;{{presentableName}}</div>
          <div class="csn-policy-name">{{$t('contractSigning.confirm.content_sign[0]')}}&nbsp;&nbsp;&nbsp;&nbsp;{{policyName}}&nbsp;&nbsp;&nbsp;&nbsp;{{$t('contractSigning.confirm.content_sign[1]')}}</div>
          <div class="csn-set-default">
            <el-checkbox v-model="isDefault">{{$t('contractSigning.confirm.checkboxText')}}</el-checkbox>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="rcb-confirm-btn-box">
          <button class="cbb-btn cbb-cancel" @click="confirmCancel">{{$t('contractSigning.confirm.cancelBtnText')}}</button>
          <button class="cbb-btn cbb-sure" @click="confirmSure">{{$t('contractSigning.confirm.sureBtnText')}}</button>
        </div>
      </div>
    </el-dialog>
</template>

<script>
  import en from '@freelog/freelog-i18n/ui-contract/en';
  import zhCN from '@freelog/freelog-i18n/ui-contract/zh-CN';

  export default {
    name: 'contract-confirm',
    i18n: {
      messages: {
        en,
        'zh-CN': zhCN,
      }
    },
    props: {
      visible: {
        type: Boolean,
      },
      confirmType: {
        type: String,
      },
      presentableName: {
        type: String,
      },
      policyName: {
        type: String
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShowDialog: false,
      }
    },
    methods: {
      toggleSetDefaultContract() {
        this.$emit('update:isDefault', !this.isDefault)
      },
      confirmCancel() {
        this.$emit('update:visible', false)
      },
      confirmSure() {
        this.$emit('sure',{ isSetDefault: this.isDefault })
        this.$emit('update:visible', false)
      },
    },
    watch: {
      visible() {
        this.isShowDialog = this.visible
      }
    },
    beforeMount() {
      this.isShowDialog = this.visible
    }

  }
</script>

<style lang="less" type="text/less" scoped>
  .rcb-confirm-cont{
    text-align: center;

    .confirm-set-default-contract{
      font-size: 16px;
      font-weight: bold;
      color: #222;
    }

    .csn-presentable-name{
      margin-bottom: 20px;
      font-size: 16px;
      color: #333;
    }

    .csn-policy-name{
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #222;
    }

    .csn-set-default{
      font-size: 14px;
      color: #c6c6c6;
      cursor: pointer;
    }

  }

  .rcb-confirm-btn-box{
    text-align: center;

    .cbb-btn {
      padding: 6px 20px;
      font-size: 14px;
      border: none;
      outline: 0;
      cursor: pointer;

      &.cbb-cancel {
        color: #666;
      }
      &.cbb-sure {
        border: 1px solid #CECECE;
        border-radius: 4px;
        color: #333;

        &.disabled {
          border: 1px solid #CECECE;
          border-radius: 4px;
          background: #F9F9F9;
          color: #999;
          pointer-events: none;
        }
      }

    }
  }
</style>
