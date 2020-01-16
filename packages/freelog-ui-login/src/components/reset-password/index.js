import { isSafeUrl } from '../../utils'
import { LOGIN_PATH, SIGN_PATH } from '../../constant'
import {EMAIL_REG, PHONE_REG, validateLoginName} from '../../validator'

export default {
  name: 'f-reset-password',

  data() {
    // form validate rules
    const rules = {
      loginName: [
        { required: true, message: this.$t('resetPassword.loginNamePlaceholder'), trigger: 'blur' },
        { validator: validateLoginName.bind(this), trigger: 'blur' }
      ],
      authCode: [
        { required: true, message: this.$t('resetPassword.authCodeInputTip'), trigger: 'blur' }
      ]
    }
    console.log(' this.$route.query.result', this.$route.query.result)
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
      loginLink: LOGIN_PATH,
      signupLink: SIGN_PATH,
      valid: false,
      steps: ['authCode', 'reset', 'success'],
      step: this.$route.query.result ? this.$route.query.result : 'authCode',
      remainTimer: 5
    }
  },

  computed: {
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
    }
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
    submit(ref) {
      this.$refs[ref].validate((valid) => {
        if (!valid) {
          return
        }

        this.error = null
        this.loading = true

        this.$axios.post('/v1/userinfos/resetPassword', this.model).then((res) => {
          if (res.data.errcode === 0) {
            this.$message.success(this.$t('resetPassword.resetSuccess'))
            let redirect = this.$route.query.redirect
            this.$router.push({ path: LOGIN_PATH, query: { redirect } })
          } else {
            this.error = { title: '', message: res.data.msg }
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          this.error = { title: this.$t('resetPassword.errorTitle'), message: this.$t('resetPassword.defaultErrorMsg') }

          switch (err.response && err.response.status) {
            case 401:
              this.error.message = this.$t('resetPassword.identifyError')
              break
            case 500:
              this.error.message = this.$t('resetPassword.serverError')
              break
            default:
              this.error.message = this.$t('resetPassword.appError')
          }
        })
      })
    },
    sendCheckCodeNotifyHandler() {
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
      this.remainTimer = 5 
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
