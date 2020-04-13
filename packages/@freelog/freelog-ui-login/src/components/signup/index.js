import {isSafeUrl} from '../../utils'
import { LOGIN_PATH } from '../../constant'
import {validateLoginIphone, validateLoginEmail, validateUsername, USERNAME_REG, EMAIL_REG, PHONE_REG} from '../../validator'
import { loginSuccessHandler } from '../../login'
import en from '@freelog/freelog-i18n/ui-login/en'
import zhCN from '@freelog/freelog-i18n/ui-login/zh-CN'

export default {
  name: 'f-signup',
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
    const checkUserName = (rule, value, callback) => {
      if (value && (USERNAME_REG.test(value))) {
        this.fetchUserInfo(value)
          .then(res => {
            if (res === 1) {
              this.disabledCheckCode = true
              callback(new Error(this.$t('signup.existentUserName')))
            } else {
              this.disabledCheckCode = false
              callback()
            }
          })
      } else {
        callback()
      }
    }
    const checkLoginEmail = (rule, value, callback) => {
      if (value && (EMAIL_REG.test(value))) {
        this.fetchUserInfo(value)
          .then(res => {
            if (res === 1) {
              this.disabledCheckCode = true
              callback(new Error(this.$t('signup.existentEmail')))
            } else {
              this.disabledCheckCode = false
              callback()
            }
          })
      } else {
        callback()
      }
    }
    const checkLoginpPhone = (rule, value, callback) => {
      if (value && (PHONE_REG.test(value))) {
        this.fetchUserInfo(value)
          .then(res => {
            if (res === 1) {
              this.disabledCheckCode = true
              callback(new Error(this.$t('signup.existentIphone')))
            } else {
              this.disabledCheckCode = false
              callback()
            }
          })
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('signup.passwordInputTip')))
      } else {
        if (this.model.checkPassword !== '') {
          this.$refs.signupForm.validateField('checkPassword')
        }
        callback()
      }
    }

    const validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('signup.checkPasswordInputTip')))
      } else if (value !== this.model.password) {
        callback(new Error(this.$t('signup.inconsistentPasswordTip')))
      } else {
        callback()
      }
    }
    const _validateLoginIphone = (...args) => {
      this.IphoneErrorMsg = ''
      validateLoginIphone.apply(this, args)
    }
    const _validateLoginEmail = (...args) => {
      this.EmailErrorMsg = ''
      validateLoginEmail.apply(this, args)
    }

    const rules = {
      loginIphone: [
        {required: true, message: this.$t('signup.emptyIphoneTip'), trigger: 'change'},
        {validator: validateLoginIphone.bind(this), trigger: 'blur'},
        {validator: checkLoginpPhone.bind(this), trigger: 'blur'},
      ],
      loginEmail: [
        {required: true, message: this.$t('signup.emptyEmailTip'), trigger: 'change'},
        {validator: validateLoginEmail.bind(this), trigger: 'change'},
        {validator: checkLoginEmail.bind(this), trigger: 'blur'},
      ],
      username: [
        {required: true, message: this.$t('signup.validateErrors.username_empty'), trigger: 'change'},
        {validator: validateUsername.bind(this), trigger: 'blur'},
        {validator: checkUserName.bind(this), trigger: 'blur'},
      ],
      password: [
        {required: true, message: this.$t('signup.passwordInputTip'), trigger: 'change'},
        {validator: validatePassword, trigger: 'blur'},
        {min: 6, message: this.$t('signup.passwordLengthRule'), trigger: 'blur'}
      ],
      checkPassword: [
        {required: true, message: this.$t('signup.checkPasswordPlaceholder'), trigger: 'change'},
        {validator: validateCheckPassword},
        {min: 6, message: this.$t('signup.passwordLengthRule'), trigger: 'blur'}
      ],
      authCode: [
        {required: true, message: this.$t('signup.authCodeInputTip'), trigger: 'change'},
      ]
    }
    const model = {
      loginIphone: '',
      loginEmail: '',
      username: '',
      password: '',
      checkPassword: '',
      authCode: ''
    }
    return {
      model,
      rules,
      error: null,
      loading: false,
      logining: false,
      readonly: true,
      sending: false,
      disabledCheckCode: false,
      waitingTimer: 0,
      registerTypes: [ 'loginIphone', 'loginEmail' ],
      selectedRegisterType: 'loginIphone',
      EmailErrorMsg: '',
      IphoneErrorMsg: '',
      authCodeErrorMsg: ''
    }
  },

  computed: {
    disabledCheckCodeBtn() {
      return this.waitingTimer> 0 || !(EMAIL_REG.test(this.model.loginEmail) || PHONE_REG.test(this.model.loginIphone)) || this.disabledCheckCode
    },
    accountType() {
      var type = ''
      if (EMAIL_REG.test(this.model.loginName)) {
        type = 'email'
      } else if (PHONE_REG.test(this.model.loginName)) {
        type = 'phone'
      }

      return type
    },
    vcodeBtnText() {
      if (this.sending) {
        return this.$t('signup.sendingText')
      } else if (this.waitingTimer) {
        setTimeout(() => {
          this.waitingTimer--
        }, 1e3)
        return this.$t('signup.timerText', {time: this.waitingTimer})
      }

      return this.$t('signup.checkcodeBtnText')
    }
  },

  watch: {
    selectedRegisterType() {
      this.$nextTick(() => {
        const $input = this.$refs['iphone'] || this.$refs['email']
        if ($input != null) {
          $input.focus()
          $input.blur()
        }
      })
      if (this.selectedRegisterType === this.registerTypes[0]) {
        this.model.loginIphone = this.model.loginEmail
        this.model.loginEmail = ''
      }
      if (this.selectedRegisterType === this.registerTypes[1]) {
        this.model.loginEmail = this.model.loginIphone
        this.model.loginIphone = ''
      }
    }
  },

  mounted() {
    //阻止浏览器自动填充
    setTimeout(() => {
      this.readonly = false
    }, 1e3)
  },

  methods: {
    fetchUserInfo(value) {
      return  this.$axios(`/v1/userinfos/detail?keywords=${value}`).then(res => res.data)
                .then(res => {
                  if (res.data == null) {
                    return 0
                  } else {
                    return 1
                  }
                }).catch(e => 0)
    },
    getLoginName() {
      switch(this.selectedRegisterType) {
        case this.registerTypes[0]: {
          this.model.loginName = this.model.loginIphone
          break
        }
        case this.registerTypes[1]: {
          this.model.loginName = this.model.loginEmail
          break
        }
        default:
      }
      return this.model.loginName
    },
    async submit(ref) {
      if (this.loading) return

      const validPromise = new Promise(resolve => {
        this.$refs[ref].validate((valid) => {
          resolve(valid)
        })
      })
      const valid = await validPromise
      // 检验不通过
      if (!valid) return 
      
      this.loading = true
      const data = {}
      Object.keys(this.model).forEach((key) => {
        if (key !== 'checkPassword' && this.registerTypes.indexOf(key) === -1) {
          data[key] = this.model[key]
        }
      })
      data['loginName'] = this.getLoginName()
      try {
        var res = await this.$axios.post('/v1/userinfos/register', data).then(res => res.data)
      } catch (e) {
        this.$message.error(this.$t('signup.serverError'))
        return 
      }
      if (res.errcode === 0) {
        if(res.data) {
          window.localStorage.setItem('loginName', res.data.loginName)
        }
        try {
          const userInfo = await this.loginRequest({
            loginName: data['loginName'],
            password: data['password'],
            isRemember: 1
          })
          loginSuccessHandler(userInfo, this.$route.query.redirect)
        } catch(e) {
          this.$router.push(LOGIN_PATH)
          console.error(e)
        }
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    loginRequest(data) {
      return this.$axios.post("/v1/passport/login", data).then(res => res.data)
        .then(res => {
          if (res.ret === 0 && res.errcode === 0) {
            var userInfo = res.data
            userInfo.loginName = data.loginName
            return Promise.resolve(userInfo)
          }
          return Promise.reject(res.msg)
        })
    },
    sendCheckCodeNotifyHandler() {
      if (this.sending || !this.getLoginName()) return

      this.sending = true
      this.$axios.post(`/v1/message/send`, {
        loginName: this.model.loginName,
        authCodeType: 'register'
      }).then(res => {
        const {ret, errcode, data, msg} = res.data

        this.sending = false
        if (ret === 0 && errcode === 0) {
          this.waitingTimer = 60
        } else {
          switch(errcode) {
            case 100: {
              if (this.selectedRegisterType === this.registerTypes[0]) {
                this.IphoneErrorMsg = this.$t('signup.validateErrors.iphone_registered')
              } else {
                this.EmailErrorMsg = this.$t('signup.validateErrors.Email_registered')
              }
              break
            }
            default: {
              this.$message.error(msg)
            }
          }
        }
      })
      .catch(e => this.$message.error(e))
    },
  }
}
