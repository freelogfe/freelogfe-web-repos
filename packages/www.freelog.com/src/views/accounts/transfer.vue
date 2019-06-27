<template>
  <div class="account-transfer-view">
    <account-layout :title="navTitle">
      <el-form label-width="120px"
               :rules="rules"
               :model="form"
               style="width: 500px"
               ref="formRef"
               label-position="left">
        <el-form-item :label="$t('accounts.transfer.fromAccountId')">
          {{form.fromAccountId}}
          <!--<el-input size="small" v-model="form.fromAccountId" style="width: 300px"></el-input>-->
        </el-form-item>
        <el-form-item :label="$t('accounts.transfer.fromAccountId')">
          <el-input size="small" v-model="form.toAccountId"></el-input>
        </el-form-item>
        <el-form-item :label="$t('accounts.transfer.toAccountId')">
          <el-input size="small" v-model="form.amount" style="width: 150px"></el-input>
          <label>{{currencyInfo.abbr}}</label>
        </el-form-item>
        <el-form-item :label="$t('accounts.transfer.password')">
          <el-input size="small" v-model="form.password" type="password" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('accounts.transfer.remark')">
          <el-input size="small" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button class="ft-btn" type="primary" @click="transferHandler">{{$t('accounts.transfer.transferText')}}</el-button>
      </template>
    </account-layout>
  </div>
</template>


<script>
import AccountTypes from '@/config/account-types'
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'account-transfer-view',

  data() {
    return {
      form: {
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        password: '',
        remark: ''
      },
    }
  },

  props: {},

  components: { AccountLayout },

  mounted() {
    this.form.fromAccountId = this.renderData.accountId
  },

  computed: {
    rules() {
      const $i18n = this.$i18n
      return {
        fromAccountId: [{ required: true, trigger: 'blur', message: $i18n.t('accounts.transfer.placeholder[0]') }],
        toAccountId: [{ required: true, trigger: 'blur', message: $i18n.t('accounts.transfer.placeholder[1]') }],
        amount: [{ required: true, trigger: 'blur', message: $i18n.t('accounts.transfer.placeholder[2]') }],
        password: [{ required: true, trigger: 'blur', message: $i18n.t('accounts.transfer.placeholder[3]') }]
      }
    },
    navTitle() {
      return `${this.currencyInfo.name}` + this.$i18n.t('accounts.transfer.transferText')
    },
    currencyInfo() {
      const i = this.renderData.currencyType
      return this.$i18n.t(`accounts.currencyAccounts[${i}]`)
    },
    renderData() {
      return this.$route.query
    }
  },

  methods: {
    transferHandler() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const form = Object.assign({}, this.form)
          form.amount *= this.currencyInfo.unit
          this.$axios.post('/v1/pay/transfer', form).then((res) => {
            const { data } = res
            if (data.ret === 0 && data.errcode === 0) {
              this.$message.success(this.$i18n.t('accounts.transfer.message.success'))
              this.$router.push('/user/accounts')
            } else {
              this.$error.showErrorMessage(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
  .account-transfer-view {
    label {
      color: #999999;
      margin-left: 10px;
    }
  }
</style>
