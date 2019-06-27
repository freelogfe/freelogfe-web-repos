<template>
  <div class="add-pay-account-view">
    <AccountLayout :title="$t('accounts.addPayAccount.title')" :showFooter="false" :goBackFn="goBackHandler">
      <el-form label-position="left" :label-width="formLabelWidth">
        <el-form-item :label="$t('accounts.addPayAccount.accountName')" :rules="createRules" required>
          <el-input size="small"
                    v-model="form.cardAlias"
                    :placeholder="$t('accounts.addPayAccount.accountNamePlaceholder')"
                    style="width:300px" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="addrName" required>
          <el-input size="small" v-model="form.cardNo"
                    :placeholder="addrNamePlaceholder"
                    style="width:600px"
                    auto-complete="off"></el-input>
          <div class="form-item-tip" v-if="currencyInfo.abbr === 'feth'">{{$t('accounts.addPayAccount.createAddrTip')}}
            <el-button type="text" @click="showCreateEthDialog">{{$t('accounts.addPayAccount.createAddrBtnText')}}</el-button>
          </div>
        </el-form-item>
        <el-form-item style="text-align: left; margin-top: 60px">
          <el-button @click="goBackHandler" class="cancel-btn">{{$t('accounts.addPayAccount.cancelBtnText')}}</el-button>
          <el-button type="primary" @click="addCardNoHandler" class="add-btn">{{$t('accounts.addPayAccount.addBtnText')}}</el-button>
        </el-form-item>
      </el-form>
    </AccountLayout>

    <el-dialog
            :title="$t('accounts.addPayAccount.dialogTitle')"
            :visible.sync="shouldShowCreateDialog"
            width="600px"
            :before-close="handleClose">
      <h3 style="margin-bottom: 20px;text-align: center">{{$t('accounts.addPayAccount.dialogHead')}}</h3>
      <el-form :model="createEthForm" status-icon
               :rules="createEthRules"
               ref="createEthForm"
               :label-width="dialogLabelWidth">
        <el-form-item :label="$t('accounts.addPayAccount.dialogPass')" prop="pass">
          <el-input size="small" type="password" v-model="createEthForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('accounts.addPayAccount.dialogCheckPass')" prop="checkPass">
          <el-input size="small" type="password" v-model="createEthForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="shouldShowCreateDialog = false">{{$t('accounts.addPayAccount.cancelBtnText')}}</el-button>
          <el-button type="primary" @click="createEthAccount">{{$t('accounts.addPayAccount.submitBtnText')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import AccountTypes from '@/config/account-types'
import { isSafeUrl } from '@/lib/security'

import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'create-pay-account',

  data() {
    const $i18n = this.$i18n
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error($i18n.t('accounts.addPayAccount.errors[0]')))
      } else {
        if (this.createEthForm.checkPass !== '') {
          this.$refs.createEthForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error($i18n.t('accounts.addPayAccount.errors[1]')))
      } else if (value !== this.createEthForm.pass) {
        callback(new Error($i18n.t('accounts.addPayAccount.errors[2]')))
      } else {
        callback()
      }
    }
    return {
      createEthForm: {
        pass: '',
        checkPass: ''
      },
      createEthRules: {
        pass: [
          { required: true, message: $i18n.t('accounts.addPayAccount.messages[0]'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
          { min: 6, message: $i18n.t('accounts.addPayAccount.messages[2]'), trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: $i18n.t('accounts.addPayAccount.messages[1]'), trigger: 'blur' },
          { validator: validatePass2, trigger: 'change' },
          { min: 6, message: $i18n.t('accounts.addPayAccount.messages[2]'), trigger: 'blur' }
        ]
      },

      form: {
        cardAlias: '',
        cardNo: ''
      },
      createRules: {
        cardAlias: [
          { required: true, message: $i18n.t('accounts.addPayAccount.messages[3]'), trigger: 'blur' },
          // {min: 6, message: '最少1个字符', trigger: 'blur'}
        ],
        cardNo: [
          { required: true, message: $i18n.t('accounts.addPayAccount.messages[4]'), trigger: 'blur' }
        ]
      },
      shouldShowCreateDialog: false,
    }
  },

  components: { AccountLayout },

  computed: {
    formLabelWidth() {
      return this.$i18n.locale === 'cn' ? '120px' : '150px'
    },
    dialogLabelWidth() {
      return this.$i18n.locale === 'cn' ? '120px' : '230px'
    },
    currencyInfo() {
      return AccountTypes[this.$route.query.currencyType]
    },
    addrName() {
      let name
      switch (this.currencyInfo.type) {
        case 1:
          name = this.$i18n.t('accounts.addrName[0]')
          break
        case 2:
        case 3:
        case 4:
        default:
          name = this.$i18n.t('accounts.addrName[1]')
      }

      return name
    },
    addrNamePlaceholder() {
      return this.$i18n.t('accounts.addPayAccount.inputText') + ' ' + this.addrName.toLocaleLowerCase()
    }
  },

  methods: {
    addCardNoHandler() {
      this.addCardToCardclips(this.form)
        .then(() => {
          this.$message.success(this.$i18n.t('accounts.addPayAccount.addPaySeccessMsg'))
        }).catch(this.$error.showErrorMessage)
    },
    handleClose(done) {
      this.$refs.createEthForm.resetFields()
      done()
    },
    showCreateEthDialog() {
      this.shouldShowCreateDialog = true
    },
    createEthAccount() {
      const $i18n = this.$i18n
      this.$confirm($i18n.t('accounts.addPayAccount.confirm.msg'), $i18n.t('accounts.addPayAccount.confirm.tip'), {
        confirmButtonText: $i18n.t('accounts.addPayAccount.confirm.sureBtnText'),
        cancelButtonText: $i18n.t('accounts.addPayAccount.confirm.cancelBtnText'),
        type: 'warning'
      }).then(() => {
        this.$refs.createEthForm.validate((valid) => {
          if (valid) {
            this.$axios.post('/v1/pay/helper/feather/createEthAccount', {
              password: this.createEthForm.pass
            }).then((res) => {
              const {
                data, ret, errcode, msg
              } = res.data
              if (ret === 0 && errcode === 0) {
                this.form.cardNo = data.address
                this.$message.success($i18n.t('accounts.addPayAccount.confirm.success'))
              } else {
                this.$message.error(msg || $i18n.t('accounts.addPayAccount.confirm.error'))
              }
              this.shouldShowCreateDialog = false
            })
          } else {
            console.log('error submit!!')
          }
        })
      }).catch(() => {
      })
    },
    addCardToCardclips(form) {
      return this.$axios.post('/v1/pay/cardclips', Object.assign({
        currencyType: this.currencyInfo.type
      }, form)).then((res) => {
        const {
          ret, errcode, msg
        } = res.data
        if (ret === 0 && errcode === 0) {
          this.$message.success(this.$i18n.t('accounts.addPayAccount.addPaySeccessMsg'))
          this.goBackHandler()
          return null
        }
        return Promise.reject(msg)
      })
    },
    goBackHandler() {
      if (this.$route.query.backPath && isSafeUrl(this.$route.query.backPath)) {
        this.$router.push(this.$route.query.backPath)
      } else {
        this.$router.push('/user/accounts')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .add-pay-account-view {
    .form-item-tip {
      font-size: 12px;
      color: #999999;
      margin-top: -11px;
      > button {
        font-size: 12px;
      }
    }

    .add-btn,
    .cancel-btn{
      min-width: 90px;
      /*padding: 10px 40px;*/
    }

    .cancel-btn {
      margin-right: 15px;
    }
  }
</style>
