<template>
  <section class="login-section">
    <header>
      <div class="h-logo" ><i class="freelog fl-icon-logo-freelog" /></div>
      <h2 class="heading" :class="{ 'show-error': error }">{{$t('login.head')}}</h2>
    </header>
    <div class="login-body">
      <div class="login-error-box">
        <i class="el-icon-close" v-if="showClose" @click="tapCloseBtn"></i>
        <el-alert type="error" :title="error.title" :description="error.message" v-if="error" />
      </div>
      <el-form class="login-form" auto-complete="off" :model="model" :rules="rules" ref="loginForm">
        <el-form-item prop="loginName" :label="$t('login.loginName')">
          <el-input type="text" name="loginName" v-model="model.loginName"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="login-password" :label="$t('login.password')">
          <a class="user-password" :href="resetPwLink">{{$t('login.resetPW')}}</a>
          <el-input type="password" name="password" v-model="model.password" @keyup.native.enter="submit('loginForm')"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-btns">
          <el-button type="primary" style="width: 100%;" :loading="loading" @click="submit('loginForm')" >
            {{ loading ? $t('login.loginStatus[0]') : $t('login.loginStatus[1]') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-sc-operation">
      {{$t('login.newUserText')}}
      <a :href="signUpLink">{{$t('login.signup')}}</a>
    </div>
  </section>
</template>

<script>
import { isSafeUrl, setItemForStorage, getItemFromStorage } from "../../utils"
import {
  SIGN_PATH,
  RESET_PASSWORD_PATH,
  LOGIN_NAME,
  USER_SESSION,
  LAST_AUTH_INFO
} from "../../constant"
import { loginSuccessHandler } from '../../login'
import { EMAIL_REG, PHONE_REG } from '../../validator'
import en from '@freelog/freelog-i18n/ui-login/en'
import zhCN from '@freelog/freelog-i18n/ui-login/zh-CN'
import FToast from "../toast/index.vue"

export default {
  name: "f-login",
  i18n: {
    messages: {
      en,
      'zh-CN': zhCN,
    }
  },

  components: { FToast },

  props: {
    showClose: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const $i18n = this.$i18n;

    const rules = {
      loginName: [
        {
          required: true,
          message: $i18n.t("login.validateErrors.loginName_empty"),
          trigger: "change"
        },
      ],
      password: [
        {
          required: true,
          message: $i18n.t("login.ruleMessages[1]"),
          trigger: "change"
        },
        // { min: 6, message: $i18n.t("login.ruleMessages[2]"), trigger: "blur" }
      ]
    };
    const loginName = window.localStorage.getItem("loginName") || "";

    return {
      model: {
        loginName,
        password: ""
      },
      rules,
      error: null,
      loading: false,
      rememberUser: true
    };
  },

  computed: {
    resetPwLink() {
      return this.resolveLink(RESET_PASSWORD_PATH)
    },
    signUpLink() {
      return this.resolveLink(SIGN_PATH)
    }
  },

  mounted() {
  },

  methods: {
    tapCloseBtn() {
      this.$emit('close-dialog')
    },
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
    validate(loginName, password) {
      var errMsgs = [] 
      if (loginName === '') {
        errMsgs.push(this.$t('login.validateErrors.loginName_empty'))
      } else {
        if (!EMAIL_REG.test(loginName) && !PHONE_REG.test(loginName)) {
          errMsgs.push(this.$t('login.validateErrors.loginName'))
        }
      }
      if (password.length < 6) {
        if (password === '') {
          errMsgs.push(this.$t('login.ruleMessages[1]'))
        } else {
          errMsgs.push(this.$t('login.ruleMessages[2]'))
        }
      }
      
      if (errMsgs.length > 0) {
        // this.$message.error(errMsgs[0])
        return false
      } else {
        return true
      }
    },
    submit(ref) {
      const { loginName, password } = this.model
      if (!this.validate(loginName, password)) {
        this.$message.error(this.$t('login.validateErrors.wrong_username_password'))
        return 
      } 
      const data = {
        loginName, password,
        isRememer: this.rememberUser ? 1 : 0
      }

      this.loginRequest(data).then(userInfo => {
        loginSuccessHandler(userInfo, this.$route.query.redirect)
        this.$emit("after-login-success")
      })
    },
    loginRequest(data) {
      this.loading = true
      return this.$axios
        .post("/v1/passport/login", data)
        .then(res => {
          this.loading = false
          if (res.data.ret === 0 && res.data.errcode === 0) {
            var userInfo = res.data.data
            userInfo.loginName = data.loginName
            return Promise.resolve(userInfo)
          }
          return Promise.reject(res.data.msg)
        })
        .catch(err => {
          this.$emit("after-login-fail")
          const $i18n = this.$i18n
          let errMsg = ''
          if (typeof err === "string") {
            errMsg = err
          } else {
            errMsg = err.response.errorMsg || $i18n.t("login.errors[0]")
            switch (err.response && err.response.status) {
              case 401:
                errMsg = $i18n.t("login.errors[1]")
                break
              case 500:
                errMsg = $i18n.t("login.errors[2]")
                break
              default:
                errMsg = $i18n.t("login.errors[3]")
            }
          }
          this.$message.error(errMsg)
          this.loading = false
        })
    },
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/mixin.less";
.login-section {
  position: relative;
  width: 550px; height: auto;

  .login-body {
    .login-error-box {
      .error-box()
    }

    .login-password {
      .user-password {
        position: absolute; top: 0; right: 0; z-index: 10;
        line-height: 26px; color: #297CBB;
      }
    }
    .login-btns { margin: 40px 0 ; text-align: center; }
  }
  .login-sc-operation {
    margin-top: 30px;
    line-height: 20px; font-size: 14px; font-weight: 400; 
    text-align: center; color: #666;
    a { color: #409EFF; }
  }
}

@media screen and (max-width: 768px) {
  .login-section {
    box-sizing: border-box; width: 90%; min-width: 320px; max-width: 550px;
    .heading {
      margin-bottom: 20px; font-size: 26px;
    }
    .login-body {
      padding: 30px 40px 10px 40px;
    }
    
  }
}
</style>

<style lang="less">
  @import "../../styles/mixin.less";
  .login-section {
    .el-alert {  
      .error-alert()
    }
  }
  
  @media screen and (max-width: 768px) {
    .login-section {
      .login-sc-operation {
        .el-form-item__content {
          line-height: 28px;
        }
      }
    }
  }
</style>
