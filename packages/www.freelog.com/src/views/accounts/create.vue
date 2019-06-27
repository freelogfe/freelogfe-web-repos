<template>
  <div class="create-account-view">
    <account-layout :title="navTitle">
      <div class="create-account-input-wrap">
        <el-form :label-width="formLabelWidth"
                 ref="createForm"
                 :model="form"
                 label-position="left"
                 @validate="validateForm"
                 :rules="rules">
          <el-form-item :label="$t('accounts.create.accountName')" prop="accountName">
            <el-input size="small" class="input-area" v-model="form.accountName"></el-input>
            <label class="input-tip">{{$t('accounts.create.accountNameTip')}}</label>
          </el-form-item>
          <el-form-item :label="$t('accounts.create.password')" prop="password">
            <password-input class="input-area" v-model="form.password"></password-input>
            <label class="input-tip">{{$t('accounts.create.passwordTip')}}</label>
          </el-form-item>
          <el-form-item :label="$t('accounts.create.checkPassword')" prop="checkPassword">
            <password-input class="input-area" v-model="form.checkPassword"></password-input>
            <label v-show="validPassword"><i class="valid-icon"></i></label>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <el-button class="ft-btn" type="primary" @click="createHandler">{{$t('accounts.create.text')}}</el-button>
      </template>
    </account-layout>
  </div>
</template>


<script>
import accountTypes from '@/config/account-types'
import PasswordInput from '@/components/PasswordInput/index.vue'
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'account-create-view',

  data() {
    const reg = /^\d{6}$/
    const $i18n = this.$i18n
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error($i18n.t('accounts.create.errors[0]')))
      } else if (!reg.test(value)) {
        callback(new Error($i18n.t('accounts.create.errors[2]')))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.createForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error($i18n.t('accounts.create.errors[1]')))
      } else if (!reg.test(value)) {
        callback(new Error($i18n.t('accounts.create.errors[2]')))
      } else if (value !== this.form.password) {
        callback(new Error($i18n.t('accounts.create.errors[3]')))
      } else {
        callback()
      }
    }

    return {
      form: {
        accountName: '',
        password: '',
        checkPassword: ''
      },
      validPassword: false,
      rules: {
        accountName: [
          { required: true, message: $i18n.t('accounts.create.messages[0]'), trigger: 'blur' },
          {
            min: 2, max: 20, message: $i18n.t('accounts.create.messages[1]'), trigger: 'change'
          }
        ],
        password: [
          { required: true, message: $i18n.t('accounts.create.messages[2]'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
          {
            min: 6, max: 6, message: $i18n.t('accounts.create.messages[3]'), trigger: 'change'
          }
        ],
        checkPassword: [
          { required: true, message: $i18n.t('accounts.create.messages[4]'), trigger: 'blur' },
          { validator: validateCheckPass, trigger: 'change' },
          {
            min: 6, max: 6, message: $i18n.t('accounts.create.messages[3]'), trigger: 'change'
          }
        ]
      }
    }
  },

  components: { AccountLayout, PasswordInput },

  mounted() {
  },

  computed: {
    formLabelWidth() {
      return this.$i18n.locale === 'cn' ? '100px' : '150px'
    },
    currencyType() {
      return this.$route.query.currencyType
    },
    currencyTypeInfo() {
      const i = this.currencyType || '1'
      return this.$i18n.t(`accounts.currencyAccounts[${i}]`)
    },
    navTitle() {
      return this.$i18n.t('accounts.create.text') + ` ${this.currencyTypeInfo.name} ` + this.$i18n.t('accounts.create.accountText')
    }
  },

  methods: {
    validateForm(field, flag) {
      if (field === 'checkPassword') {
        this.validPassword = flag
      }
    },
    cancelHandler() {
      this.goBack()
    },
    goBack() {
      this.$router.push('/user/accounts')
    },
    createHandler() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/v1/pay/accounts', {
            accountName: this.form.accountName,
            currencyType: this.currencyTypeInfo.value,
            password: this.form.password
          }).then((res) => {
            const { data } = res
            if (data.ret === 0 && data.errcode === 0) {
              this.$message.success(this.$i18n.t('accounts.create.successMsg'))
              this.goBack()
            } else {
              this.$message.error(data.msg || this.$i18n.t('accounts.create.failMsg'))
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .create-account-view {
    .create-account-input-wrap {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;

      .valid-icon {
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url("../../assets/img/success.png") no-repeat;
        background-size: 100%;
        vertical-align: middle;
      }
      .input-area {
        width: 380px;
        margin-right: 10px;
      }

      .input-tip {
        color: #999999;
        font-size: 14px;
      }
    }
  }
</style>
