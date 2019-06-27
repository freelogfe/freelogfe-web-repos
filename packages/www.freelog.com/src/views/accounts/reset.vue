<template>
  <div class="account-reset-pay-password-view">
    <account-layout :title="navTitle">
      <el-form label-width="120px"
               :rules="rules"
               :model="form"
               ref="formRef"
               label-position="left">
        <el-form-item :label="$t('accounts.reset.oldPassword')" prop="oldPassword">
          <password-input class="input-area" v-model="form.password"></password-input>
        </el-form-item>
        <el-form-item :label="$t('accounts.reset.newPassword')" prop="newPassword">
          <password-input class="input-area" v-model="form.newPassword"></password-input>
        </el-form-item>
        <el-form-item :label="$t('accounts.reset.checkNewPassword')" prop="checkNewPassword">
          <password-input class="input-area" v-model="form.checkNewPassword"></password-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button class="ft-btn" type="primary" @click="resetHandler">{{$t('accounts.reset.sureBtnText')}}</el-button>
      </template>
    </account-layout>
  </div>
</template>


<script>
import PasswordInput from '@/components/PasswordInput/index.vue'
import AccountTypes from '@/config/account-types'
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'account-reset-pay-password-view',

  data() {
    const reg = /^\d{6}$/
    const $i18n = this.$i18n
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error($i18n.t('accounts.reset.errors[0]')))
      } else if (!reg.test(value)) {
        callback(new Error($i18n.t('accounts.reset.errors[2]')))
      } else {
        if (this.form.checkNewPassword !== '') {
          this.$refs.formRef.validateField('checkNewPassword')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error($i18n.t('accounts.reset.errors[1]')))
      } else if (!reg.test(value)) {
        callback(new Error($i18n.t('accounts.reset.errors[2]')))
      } else if (value !== this.form.newPassword) {
        callback(new Error($i18n.t('accounts.reset.errors[3]')))
      } else {
        callback()
      }
    }

    return {
      form: {
        oldPassword: '',
        newPassword: '',
        checkNewPassword: '',
      },
      rules: {
        password: [
          { required: true, message: $i18n.t('accounts.reset.messages[0]'), trigger: 'blur' },
          { min: 6, max: 6, message: $i18n.t('accounts.reset.messages[2]'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: $i18n.t('accounts.reset.messages[0]'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 6, message: $i18n.t('accounts.reset.messages[2]'), trigger: 'blur' }
        ],
        checkNewPassword: [
          { required: true, message: $i18n.t('accounts.reset.messages[1]'), trigger: 'blur' },
          { validator: validateCheckPass, trigger: 'change' },
          { min: 6, max: 6, message: $i18n.t('accounts.reset.messages[2]'), trigger: 'blur' }
        ]
      }
    }
  },

  props: {},
  components: { AccountLayout, PasswordInput },

  mounted() {
  },

  computed: {
    currencyInfo() {
      const i = this.renderData.currencyType
      return this.$i18n.t(`accounts.currencyAccounts[${i}]`)
    },
    navTitle() {
      return this.$i18n.t('accounts.reset.text') + this.currencyInfo.name + this.$i18n.t('accounts.reset.password')
    },
    renderData() {
      return this.$route.query
    }
  },

  methods: {
    resetHandler() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          debugger
          this.$axios.put(`/v1/pay/accounts/${this.renderData.accountId}`, {
            originalPassword: this.form.password,
            newPassword: this.form.newPassword
          }).then((res) => {
            const { data } = res
            if (data.ret === 0 && data.errcode === 0) {
              this.$message.success('支付密码重置成功')
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
  .account-reset-pay-password-view {
    .input-area {
      width: 250px;
    }
  }
</style>
