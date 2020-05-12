<template>
  <div class="pb-app">
    <div class="pb-exception" v-if="isShowPbException">
      <f-auth-box :pbAuthErrorData="pbAuthErrorData"></f-auth-box>
    </div>
   
    <transition name="fade">
      <div class="pb-login-dialog" v-if="loginDialogVisible">
        <f-login 
          class="pb-l-d-comp" 
          @close-dialog="loginDialogVisible = false"
          @onLoginSuccess="loginSuccessHandler"></f-login>
      </div>
    </transition>
  </div>
</template>

<script>
  import { TOGGLE_TOOL_BAR, GO_TO_LOGIN, HANDLE_INVALID_AUTH, SHOW_AUTH_DIALOG } from '../../_core/events/pb-event-names'

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

<style lang="less" scoped>
  @import '../styles/pagebuild.less';
  .pb-login-dialog {
    overflow: auto;
    position: fixed; top: 0; left: 0; z-index: 100;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, .6);

    .pb-l-d-comp {
      margin: 20vh auto 0 auto; box-shadow: none;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<style lang="less">
.f-ui-login-section.pb-l-d-comp {
  padding: 20px 0 30px; border-radius: 10px;
  background-color: #fff;
  .login-body {
    padding-top: 10px; padding-bottom: 0; border-color: transparent; border-radius: 0;
    background-color: transparent;

  }
  .login-sc-operation { margin-top: 0; }
}
</style>
