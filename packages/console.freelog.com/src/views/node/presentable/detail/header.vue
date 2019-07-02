<template>
  <div class="presentable-detail-header-wrap">
    <div class="pdh-body">
      <div class="lf-side">
        <div class="presentable-info">
          <div class="p-presentable-name">
            <span class="p-name">{{presentable.presentableName}}</span>
          </div>
          <FreelogTags v-model="presentable.userDefinedTags"
                       class="p-user-tags"
                       :actionText="$t('presentable.addLabel')"
                       :isCanCURD="false"></FreelogTags>
        </div>
        <div class="res-info" v-if="resource&&resource.resourceName"><a :href="'/resource/detail/'+resource.resourceId"
                                                                        target="_blank">{{resource.resourceName}}</a> |
          {{resource.userName}} | {{resource.updateDate|fmtDate}} |
          {{resource.resourceType}}
        </div>
        <p :class="contractStateCls"><i class="dot"></i>{{contractState}}</p>
      </div>

      <router-link :to="nodeIndexUrl" class="back-to-node-page">
        <el-button type="primary" plain round class="back-btn"><i class="el-icon-back"></i>{{$t('presentable.nodeIndex')}}</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
  import FreelogTags from '@/components/Tags/index.vue'


  export default {
    name: 'presentable-detail-header',
    data() {
      return {}
    },

    props: {
      presentable: Object,
      resource: Object
    },

    components: {
      FreelogTags,
    },

    computed: {
      contractState() {
        var scheme = this.presentable.scheme
        var text

        if (!scheme) {
          text = this.$t('presentable.unsignedText')
        } else {
          text = `${this.$t('presentable.signedText')} (${scheme.authSchemeName}/${scheme.selectedPolicy.policyName})`
        }
        return text
      },
      contractStateCls() {
        return this.presentable.scheme ? 'active-status-2' : 'active-status-0'
      },
      nodeIndexUrl() {
        return `/node/${this.$route.params.nodeId}`
      }
    },

    methods: {}
  }
</script>
<style scoped lang="less" type="text/less">
  @import '../../../../styles/variables.less';

  .presentable-detail-header-wrap {
    background-color: #FAFBFB;
    .pdh-body {
      width: @main-content-width-1190;
      margin: auto;
      padding: 20px 0;
      display: flex;
      align-items: center;

      .lf-side {
        flex: 1;
      }
      .presentable-info {
        position: relative;
        margin-bottom: 10px;
        display: flex;
        .p-presentable-name {
          white-space: nowrap;
          margin-right: 20px;
        }
        i {
          color: #333333;
          font-size: 18px;
          margin-left: 10px;
        }

        .p-user-tags {
        }

        .presentable-name-input {
          outline: none;
          background-color: white;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          padding: 7px 10px;
          min-width: 200px;
          max-width: 600px;
        }
      }
      .p-name {
        color: #333333;
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
      }
    }

    .dot {
      margin-right: 10px;
    }
    .res-info {
      color: #999999;
      font-size: 14px;
      margin-bottom: 10px;
      a {
        color: #999999;
      }
    }

    .back-to-node-page {
      .back-btn {
        background-color: white;
        color: #409EFF;
        padding: 8px 15px;
        i {
          margin-right: 6px;
        }
      }
    }
  }

  @media screen and (max-width: 1250px) {
    .presentable-detail-header-wrap .pdh-body {
      width: @main-content-width-990;
    }
  }
</style>