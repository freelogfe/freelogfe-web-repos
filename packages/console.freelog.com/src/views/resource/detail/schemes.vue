<template>
  <div class="res-scheme-detail-container">
    <el-breadcrumb class="res-schemes-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
              @click.native="switchResourceHandler(breadcrumb, index)"
              v-for="(breadcrumb,index) in breadcrumbs">
        <span class="res-breadcrumb-title">{{breadcrumb.resourceName || breadcrumb.resourceId}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <ResourceScheme :resource="currentResource" @switch="switchBreadcrumbHandler"></ResourceScheme>
  </div>
</template>

<script>
  import ResourceScheme from './resource-scheme.vue'

  export default {
    name: 'resource-detail-schemes',

    data() {
      return {
        breadcrumbs: [],
        currentResource: {}
      }
    },

    props: {
      resource: Object
    },

    components: {ResourceScheme},

    watch: {
      'resource.resourceId'() {
        this.initView()
      }
    },

    mounted() {
      this.initView()
    },

    methods: {
      initView() {
        if (!this.resource.resourceId) {
          return
        }

        this.breadcrumbs = [this.resource]
        this.currentResource = this.breadcrumbs[0]
      },
      switchResourceHandler(resource, index) {
        this.breadcrumbs.splice(index + 1)
        this.currentResource = resource
      },
      switchBreadcrumbHandler(resource) {
        this.breadcrumbs.push(resource)
        this.currentResource = resource
      }
    }
  }
</script>

<style lang="less" scoped>
  .res-scheme-detail-container {
    overflow: hidden;
    .res-breadcrumb-title {
      font-size: 16px;
    }

    .res-schemes-breadcrumb {
      margin-bottom: 6px;
      cursor: pointer;
    }
  }
</style>