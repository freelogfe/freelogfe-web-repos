<template>
  <div >
    <nav-top-bar></nav-top-bar>
    <el-container class="app-container" :class="[{ 'noPaddingLeft': !isShowSidebar }]" >
      <user-aside-nav v-show="isShowSidebar"></user-aside-nav>
      <el-main class="main-app-content" :class="[themeCls, routeName]">
        <f-breadcrumb></f-breadcrumb>
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
    <f-footer></f-footer>
  </div>
</template>

<script>
  import NavTopBar from '@/components/NavTop/index.vue'
  import Footer from '@/components/Footer/index.vue'
  import UserAsideNav from '@/components/UserAsideNav/index.vue'
  import FBreadcrumb from './breadcrumb.vue'
  import { LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH } from '@freelog/freelog-ui-login'

  export default {
    data() {
      return {
        isShowSidebar: true,
      }
    },

    components: {
      'f-footer': Footer,
      NavTopBar,
      UserAsideNav,
      FBreadcrumb
    },

    computed: {
      themeCls() {
        return this.$route.meta.theme || 'white'
      },
      routeName() {
        return this.$route.name || ''
      },
      isError() {
        return (typeof this.$route.meta.error === 'undefined') ? false : this.$route.meta.error
      }
    },

    watch: {
      '$route.fullPath'() {
        this.resolveFullPath()
      }
    },

    mounted() {
      this.resolveFullPath()
    },

    methods: {
      resolveFullPath() {
        const { meta: { hideAside }, path } = this.$route
        this.isShowSidebar = !hideAside
        if ([LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH].indexOf(path) !== -1) {
          this.isShowSidebar = false
        }
      }
    }
  }
</script>