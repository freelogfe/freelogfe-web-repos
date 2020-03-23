import { isSafeUrl } from '../../utils'
import { LOGIN_PATH, SIGN_PATH } from '../../constant'
import { EMAIL_REG, PHONE_REG, validateLoginName, validatePassword } from '../../validator'
import en from '@freelog/freelog-i18n/ui-login/en';
import zhCN from '@freelog/freelog-i18n/ui-login/zh-CN';

const steps = ['authCode', 'success']
const remainTimer = 3
export default {
  name: 'f-reset-password',
  props: {
    showClose: {
      type: Boolean,
      default: false
    }
  },
  i18n: {
    messages: {
      en,
      'zh-CN': zhCN,
    }
  },

  data() {
    // form validate rules
    const rules = {
      loginName: [
        { required: true, message: this.$t('resetPassword.loginNamePlaceholder'), trigger: 'change' },
        // { validator: validateLoginName.bind(this), trigger: 'blur' },
      ],
      authCode: [
        { required: true, message: this.$t('resetPassword.authCodeInputTip'), trigger: 'change' },
        { min: 6, max: 6, message: this.$t('signup.authCodeLengthRule'), trigger: 'blur' },
      ],
      password: [
        { required: true, message: this.$t('resetPassword.inputPasswordTip'), trigger: 'change' },
        { min: 6, message: this.$t('signup.passwordLengthRule1'), trigger: 'blur' },
        { max: 24, message: this.$t('signup.passwordLengthRule2'), trigger: 'blur' },
        { validator: validatePassword.bind(this), trigger: 'blur' },
      ]
    }
    
    return {
      model: {
        loginName: '',
        authCode: '',
        password: ''
      },
      rules,
      error: null,
      loading: false,
      sending: false,
      waitingTimer: 0,
      readonly: true,
      valid: false,
      steps,
      step: steps[0],
      remainTimer,
    }
  },

  computed: {
    loginLink() {
      return this.resolveLink(LOGIN_PATH)
    },
    signupLink() {
      return this.resolveLink(SIGN_PATH)
    },
    disabledCheckCodeBtn() {
      return this.waitingTimer> 0 || !(EMAIL_REG.test(this.model.loginName) || PHONE_REG.test(this.model.loginName))
    },
    vcodeBtnText() {
      if (this.sending) {
        return this.$t('resetPassword.sendingText')
      } else if (this.waitingTimer) {
        setTimeout(() => {
          this.waitingTimer--
        }, 1e3)
        return this.$t('resetPassword.timerText', {time: this.waitingTimer})
      }

      return this.$t('resetPassword.checkcodeBtnText')
    }
  },

  watch: {
    step() {
      if (this.step === 'success') {
        this.goToLoginAfterCountdown()
      }
    },
  },

  mounted() {
    //阻止浏览器自动填充
    setTimeout(() => {
      this.readonly = false
    }, 1e3)
    if (this.step === 'success') {
      this.goToLoginAfterCountdown()
    }
  },

  methods: {
    resolveLink(path) {
      var link = `${path}`
      if (this.$route != null) {
        const { redirect } = this.$route.query
        if (isSafeUrl(redirect)) {
          link = `${link}?redirect=${redirect}`
        }
      }else {
        const hostName = `${window.location.protocol}//www.${window.FreelogApp.Env.mainDomain}`
        link = `${hostName}${link}`
      }
      return link
    },
    submit(ref) {
      this.$refs[ref].validate((valid) => {
        if (!valid) {
          return
        }
        this.loading = true

        this.$axios.post('/v1/userinfos/resetPassword', this.model).then((res) => {
          if (res.data.errcode === 0) {
            this.step = this.steps[1]
            // this.$message.success(this.$t('resetPassword.resetSuccess'))
            // let redirect = this.$route.query.redirect
            // this.$router.push({ query: { redirect } })
          } else {
            this.$message.error(res.data.msg)
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          let errMsg = ''
          errMsg = this.$t('resetPassword.defaultErrorMsg')

          switch (err.response && err.response.status) {
            case 401:
              errMsg = this.$t('resetPassword.identifyError')
              break
            case 500:
              errMsg = this.$t('resetPassword.serverError')
              break
            default:
              errMsg = this.$t('resetPassword.appError')
          }
          this.$message.error(errMsg)
        })
      })
    },
    sendCheckCodeNotifyHandler() {
      this.$refs.authCodeInput.focus()
      this.$refs.authCodeInput.blur()
      if (!(EMAIL_REG.test(this.model.loginName) || PHONE_REG.test(this.model.loginName))) {
        this.$message.error(this.$t('resetPassword.wrongLoginName'))
        return 
      }
      if (this.sending || !this.model.loginName) return

      this.sending = true
      this.$axios.post(`/v1/message/send`, {
        loginName: this.model.loginName,
        authCodeType: 'resetPassword'
      }).then(res => {
        const {ret, errcode, data, msg} = res.data

        this.sending = false
        if (ret === 0 && errcode === 0) {
          this.waitingTimer = 60
        } else {
          this.$message.error(msg)
        }
      })
    },
    goToLoginAfterCountdown() {
      this.remainTimer = remainTimer
      const timer = setInterval(() => {
        this.remainTimer--
        if (this.remainTimer === 0) {
          clearInterval(timer)
          window.location.href = LOGIN_PATH
        }
      }, 1e3)
    }
  }
}
