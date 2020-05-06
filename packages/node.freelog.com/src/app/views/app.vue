<template>
  <div class="pb-app">
    <div class="pb-exception" v-if="isShowPbException">
      <f-auth-box :pbAuthErrorData="pbAuthErrorData"></f-auth-box>
    </div>
   
    <transition name="fade">
      <div class="pb-login-dialog" v-if="loginDialogVisible">
        <FLogin 
          class="pb-l-d-comp" 
          @close-dialog="loginDialogVisible = false"
          @onLoginSuccess="loginSuccessHandler"></FLogin>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import i18n from '@/i18n/index'
  import { getUserInfo, checkLoginStatus } from '@freelog/freelog-ui-login/src/core'
  import EventCenter from '../../_core/events/index'
  import { TOGGLE_TOOL_BAR, GO_TO_LOGIN, HANDLE_INVALID_AUTH, SHOW_AUTH_DIALOG } from '../pb-events/name'
  // import FAuthBox from './components/auth-box.vue'

  export default {
    data() {
      return {
        isShowToolBar: false,
        isShowPbException: false,
        isLogin: false,
        isShowDialog: false,
        loadContractDialog: false,
        pbExceptionMsg: '',
        pbAuthErrorData: null,
        scAuthPresentableList: [],
        activePresentableIndex: 0,
        loginDialogVisible: false
      }
    },
    components: {
      FAuthBox: () => import('./components/auth-box.vue'),
      FLogin: () => import('@freelog/freelog-ui-login').then(({ default: initLogin,  FLogin,  }) => {
        initLogin({ Vue, isRegisterRouter: false, isRegisterComponents: false, i18n })
        return FLogin
      }),
    },
    computed: {},
    async mounted() {
      await this.init()
    },
    methods: {
      async init() {
        this.initEvents()
        /**
         * 当pb存在授权问题
         * 1. 显示"异常页面"
         * 2. 检查用户是否登录，否则提示用户完成"登录"
         */
        const authErrorData = window.__auth_info__ && window.__auth_info__.__auth_error_info__
        if(authErrorData) {
          this.isShowPbException = true
          this.pbAuthErrorData = authErrorData
        }
      },
      initEvents() {
        /**
         * 订阅事件"SHOW_AUTH_DIALOG"、"TOGGLE_TOOL_BAR"
         * 开发者可通过api - window.FreelogApp.trigger 触发事件并唤起对应视图
         */
        if(window.FreelogApp.on) {
          window.FreelogApp.on(GO_TO_LOGIN, this.showLoginDialog)
        }
      },
      async showLoginDialog() {
        this.loginDialogVisible = true
      },
      toggleToolBar() {
        this.isShowToolBar ? this.$refs.toolbar.hide() : this.$refs.toolbar.show()
        this.isShowToolBar = !this.isShowToolBar
      },
      loginSuccessHandler() {
        window.location.reload()
      },
    }
  }
</script>

<style lang="less">
  @import '../styles/pagebuild.less';
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
