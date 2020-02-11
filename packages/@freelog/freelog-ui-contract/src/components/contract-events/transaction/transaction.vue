<!--<i18n src="../../../i18n-locales/transaction.json"></i18n>-->
<template>
  <div class="transaction-wrap">

    <el-form label-position="left" class="small-el-form" :label-width="formLabelWidth" :model="contractDetail">
      <el-form-item :label="$t('transaction.contractId')">
        {{contractDetail.contractId}}
      </el-form-item>
      <el-form-item :label="$t('transaction.partyOne')">
        {{contractDetail.partyOne}}
      </el-form-item>
      <el-form-item :label="$t('transaction.partyTwo')">
        {{contractDetail.partyTwo}}
      </el-form-item>
      <el-form-item :label="$t('transaction.contractAccountName')" v-if="false">
        {{params.contractAccountName}}
      </el-form-item>
      <el-form-item :label="$t('transaction.unitType')" v-if="amount !== 0">
        {{amount}} {{unitType}}
      </el-form-item>
      <el-form-item :label="accountLabel">
        <el-select
                :loading="isLoadingAccount"
                :loading-text="$t('transaction.loadingAccountText')"
                size="small"
                :placeholder="$t('transaction.accountPlaceholder')"
                v-model="accountId"
                @visible-change="selectVisibleChange"
        >
          <el-option
            v-for="item in accountOptions"
            :key="item.accountId"
            :label="item.accountId"
            :value="item.accountId">
          </el-option>
        </el-select>
        <el-tooltip placement="top">
          <div slot="content">
            <p><a style="color: white" :href="accountHref" target="_blank">{{$t('transaction.noAccountTip')}}</a></p>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('transaction.password')" class="t-password" v-if="isNeedPassword">
        <el-input type="password" size="small" style="max-width: 300px;" v-model="password"
                  :placeholder="$t('transaction.passwordPlaceholder')"></el-input>
      </el-form-item>
      <el-form-item class="button-group">
        <el-button @click="doneHandler">{{$t('transaction.cancelBtnText')}}</el-button>
        <el-button type="primary" @click="sure" :disabled="!isCanSubmit">{{$t('transaction.sureBtnText')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TransactionEvent from './index.js'

export default TransactionEvent
</script>

<style lang="less" type="text/less" scoped>
  .transaction-wrap {
    width: 400px;
    margin: auto;

    .el-form-item {

      &.t-password{
        margin-top: 10px;
      }
    }

    .button-group {
      margin-top: 20px;
    }

    .el-tooltip{ margin-left: 10px; }
  }
</style>
