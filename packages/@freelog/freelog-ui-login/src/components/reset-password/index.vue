<template>
  <section class="reset-password-section">
    <template v-if="step === steps[0]">
      <header>
        <div class="h-logo" ><i class="freelog fl-icon-logo-freelog" /></div>
        <h2 class="heading">
          {{$t('resetPassword.heads[0]')}}
          <div class="reset-password-intro">{{$t('resetPassword.heads[1]')}}</div>
        </h2>
      </header>
      <div class="reset-password-body">
        <div class="reset-password-error-box">
          <i class="el-icon-close" v-if="showClose" @click="tapCloseBtn"></i>
          <el-alert type="error" :title="error.title" :description="error.message" v-if="error" />
        </div>
        <el-form class="reset-password-form" auto-complete="off" :model="model" :rules="rules" ref="formRef">
          <el-form-item prop="loginName" :label="$t('resetPassword.loginName')">
            <el-input type="text" v-model="model.loginName"></el-input>
          </el-form-item>
          <el-form-item prop="authCode" :label="$t('resetPassword.verifyCode')">
            <div>
              <el-input type="text" v-model="model.authCode" style="width: 280px"></el-input>
              <el-button class="vcode-btn" style="width: 110px"
                        @click="sendCheckCodeNotifyHandler"
                        :disabled="disabledCheckCodeBtn">
                {{vcodeBtnText}}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="password" :label="$t('resetPassword.password')">
            <el-input type="password" v-model="model.password"></el-input>
          </el-form-item>
          <el-form-item class="reset-password-btns">
            <el-button type="primary"
                      style="width: 100%;"
                      :loading="loading"
                      @click="submit('formRef')">{{ loading ? $t('resetPassword.resetPasswordBtns[0]') : $t('resetPassword.resetPasswordBtns[1]') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="reset-password-footer">
        <a :href="loginLink">{{$t('resetPassword.backToLoginTexts[0]')}}</a>
        <a :href="signupLink">{{$t('resetPassword.registerNewUser')}}</a>
      </div>
    </template>
    <div class="reset-password-success-box" v-if="step === steps[1]">
      <div><i class="freelog fl-icon-shenqingchenggong"></i></div>
      <p class="reset-pw-success-msg">{{$t('resetPassword.successMsg')}}</p>
      <p class="reset-pw-success-footer">
        {{$t('resetPassword.backToLoginTexts[1]', {time: remainTimer})}}
        <a :href="loginLink">{{$t('resetPassword.backToLoginTexts[2]')}}</a>
      </p>
    </div>
  </section>
</template>

<script>
import ResetView from './index'

export default ResetView
</script>

<style lang="less" scoped>
  @import "../../styles/mixin.less";
  .reset-password-section {
    header {
      .reset-password-intro { 
        margin-top: 10px; margin-bottom: 30px;
        line-height: 20px; font-size: 14px; font-weight: 400; color: #000; 
      }
    }

    .vcode-btn {
      margin-left: 4px; padding: 12px 0;
      background-color: #409EFF; color: #fff;
      &.is-disabled {
        background-color: #CCCCCC; color: #fff;
      }
    }

    .reset-password-btns {
      margin: 40px 0 20px; text-align: center;
    }

    .reset-password-footer {
      margin-top: 30px; text-align: center;
      a { margin: 0 20px; font-size: 14px; color: #666666; }
    }

    .user-op {
      float: right;
      color: #1f2d3d;
      height: 20px;

      &:hover {
        color: #409EFF;
      }
    }

    .reset-password-success-box {
      width: 490px; margin: 30% auto; padding: 22px 0 40px;  border: 1px solid #F0F0F0; border-radius: 10px;
      background-color: #fff; text-align: center;
      .fl-icon-shenqingchenggong { font-size: 76px; color: #7ED321; }
      .reset-pw-success-msg {
        margin: 15px 0 50px;
        font-size: 18px; color: #000;
      }
      .reset-pw-success-footer {
        font-size: 14px; color: #999; 
        a { color: #409EFF; } 
      }
    }

    .reset-password-error-box {
      .error-box()
    }
  }
</style>

<style lang="less">
  @import "../../styles/mixin.less";
  .reset-password-section {
    .el-alert {  
      .error-alert()
    }
  }
</style>
