<template>
  <div>
    <user-aside-nav v-show="isShowSidebar"></user-aside-nav>
    <el-main class="main-app-content" :class="[themeCls]">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </el-main>
  </div>
</template>

<script>
import UserAsideNav from '@/components/UserAsideNav/index.vue'

export default {
  data() {
    return {
      isShowSidebar: true
    }
  },

  computed: {
    themeCls() {
      return this.$route.meta.theme || 'white'
    },
    isError() {
      return (typeof this.$route.meta.error === 'undefined') ? false : this.$route.meta.error
    },
  },

  watch: {
    '$route.fullPath'() {
      this.resolveFullPath()
    }
  },

  mounted() {
    this.resolveFullPath()
  },
  components: {
    UserAsideNav
  },

  methods: {
    resolveFullPath() {
      const { meta: { hideAside } } = this.$route
      this.isShowSidebar = !hideAside
    }
  }
}
</script>

