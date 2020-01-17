<i18n src="../../i18n-locales/ui-login.json"></i18n>
<template>
  <section class="signup-section"
           v-loading="logining"
           :element-loading-text="$t('signup.loadingText')">
    <header>
      <div class="h-logo" ><i class="freelog fl-icon-logo-freelog" /></div>
      <h2 class="heading" :class="{ 'show-error': error }">{{$t('signup.head')}}</h2>
    </header>
    <div class="signup-body">
      <div class="signup-error-box">
        <i class="el-icon-close" v-if="showClose" @click="tapCloseBtn"></i>
        <el-alert type="error" :title="error.title" :description="error.message" v-if="error" />
      </div>
      <el-form class="signup-form" auto-complete="off" :model="model" :rules="rules" ref="signupForm">
        <el-form-item prop="username" :label="$t('signup.username')">
          <el-input type="text" v-model="model.username" :placeholder="$t('signup.usernamePlaceholder')">
          </el-input>
        </el-form-item>
        <div class="signup-register-type-box">
          <div class="signup-radios">
            <el-radio v-model="selectedRegisterType" :label="registerTypes[0]">{{$t('signup.loginIphone')}}</el-radio>
            <el-radio v-model="selectedRegisterType" :label="registerTypes[1]">{{$t('signup.loginEmail')}}</el-radio>
          </div>
          <el-form-item prop="loginIphone" :label="$t('signup.registerType')" v-if="registerTypes[0] === selectedRegisterType">
            <el-input ref="iphone" v-model="model.loginIphone" :placeholder="$t('signup.loginIphonePlaceholder')">
            </el-input>
          </el-form-item>
          <el-form-item prop="loginEmail" :label="$t('signup.registerType')" v-if="registerTypes[1] === selectedRegisterType">
            <el-input ref="email" v-model="model.loginEmail" :placeholder="$t('signup.loginEmailPlaceholder')">
            </el-input>
          </el-form-item>
        </div>
        <el-form-item prop="authCode" :label="$t('signup.verifyCode')">
          <el-input v-model="model.authCode"
                    style="width: 280px"
                    :placeholder="$t('signup.verifyCodePlaceholder')"></el-input>
          <div class="check-code-wrap">
            <el-button class="vcode-btn"
                      style="width: 110px"
                      @click="sendCheckCodeNotifyHandler"
                      :disabled="disabledCheckCodeBtn">
              {{vcodeBtnText}}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item prop="password" :label="$t('signup.password')">
          <el-input type="password" v-model="model.password"
                    :placeholder="$t('signup.passwordPlaceholder')"
                    autocomplete="new-password"
                    :readonly="readonly"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="checkPassword" :label="$t('signup.checkPassword')">
          <el-input type="password" v-model="model.checkPassword"
                    :placeholder="$t('signup.checkPasswordPlaceholder')"
                    autocomplete="new-password"
                    :readonly="readonly"></el-input>
        </el-form-item> -->
        <el-form-item class="signup-btns">
          <el-button type="primary"
                    style="width: 100%;"
                    :loading="loading"
                    @click="submit('signupForm')">{{ loading ? $t('signup.signupingText') : $t('signup.signupedText') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="signup-to-login">
      {{$t('signup.loginTexts[0]')}}
      <a :href="loginLink">{{$t('signup.loginTexts[1]')}}</a>
    </div>
    
  </section>
</template>

<script>
import SignupView from './index'

export default SignupView
</script>

<style lang="less" scoped>
  @import "index.less";
</style>

<style lang="less">
.signup-section {
  .signup-register-type-box {
    .signup-radios {
      .is-checked {
        .el-radio__label { color: #409EFF; }
      }
      .el-radio__label { padding-left: 7px; font-size: 12px; color: #666; }
    }
  }
}
  
</style>
