<!--<i18n src="../../i18n-locales/ui-login.json"></i18n>-->
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
import { isSafeUrl, setItemForStorage, getItemFromStorage } from "../../utils";
import {
  SIGN_PATH,
  RESET_PASSWORD_PATH,
  LOGIN_NAME,
  USER_SESSION,
  LAST_AUTH_INFO
} from "../../constant";
import FToast from "../toast/index.vue";
import {validateLoginName} from '../../validator'
import en from '../../../../freelog-i18n/ui-login/en';
import zhCN from '../../../../freelog-i18n/ui-login/zh-CN';

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
          trigger: "blur"
        },
        { validator: validateLoginName.bind(this), trigger: "blur" }
      ],
      password: [
        {
          required: true,
          message: $i18n.t("login.ruleMessages[1]"),
          trigger: "blur"
        },
        { min: 6, message: $i18n.t("login.ruleMessages[2]"), trigger: "blur" }
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
    submit(ref) {
      const self = this
      this.$refs[ref].validate(valid => {
        if (!valid) {
          return
        }

        const data = Object.assign(this.model, {
          isRememer: this.rememberUser ? 1 : 0
        })

        this.fetchLogin(data).then(userInfo => {
          this.afterLogin(userInfo)
        })
      })
    },
    fetchLogin(data) {
      this.error = null
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
          console.log(err);
          this.$emit("after-login-fail")
          const $i18n = this.$i18n
          if (typeof err === "string") {
            this.error = { title: "", message: err }
          } else {
            this.error = {
              title: $i18n.t("login.errorTitle"),
              message: err.response.errorMsg || $i18n.t("login.errors[0]")
            }
            switch (err.response && err.response.status) {
              case 401:
                this.error.message = $i18n.t("login.errors[1]")
                break
              case 500:
                this.error.message = $i18n.t("login.errors[2]")
                break
              default:
                this.error.message = $i18n.t("login.errors[3]")
            }
          }
          this.loading = false
        })
    },
    afterLogin(userInfo) {
      if (userInfo == null) return 
      this.$emit("after-login-success")
      const win = window
      setItemForStorage(USER_SESSION, userInfo)
      setItemForStorage(LOGIN_NAME, userInfo.loginName)
      const lastAuthInfo = getItemFromStorage(LAST_AUTH_INFO)
      var targetLink = '/'
      if(lastAuthInfo && lastAuthInfo.userId === userInfo.userId) {
        const redirect = this.$route.query.redirect
        if (isSafeUrl(redirect)) {
          targetLink = redirect
        }
      }
      window.location.replace(targetLink)
    }
  }
}
</script>

<style lang="less" scoped>
.login-section {
  position: relative;
  width: 550px; height: auto;

  .login-body {
    .login-error-box {
      .el-icon-close {
        position: absolute; top: 4px; right: 4px; z-index: 10;
        padding: 6px;
        font-size: 16px; cursor: pointer;
      }
      .el-alert { 
        margin-top: 10px; margin-bottom: 20px; padding: 16px 20px 20px; border: 1px solid #ECBCBC; 
        background-color: #F7ECEC;
      }
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
  .el-alert {  
    .el-alert__content {
      padding-right: 12px;
      font-size: 14px;
      .el-alert__description {
        font-size: 14px; color: #DA3F3F;
      }
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
