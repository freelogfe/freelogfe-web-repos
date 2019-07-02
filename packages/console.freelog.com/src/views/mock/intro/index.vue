<template>
  <div class="res-intro-wrapper">
    <div class="user-avatar" v-if="avatarUrl">
      <img class="resource-author-img"
           :src="avatarUrl"
           alt="">
    </div>
    <div class="res-content">
      <p class="res-name">{{resource.resourceName}}</p>
      <slot></slot>
      <div class="res-origin">
        <span class="res-author">by: {{resource.userName}}</span>
        <span class="res-date">{{resource.updateDate|fmtDate('YYYY-MM-DD')}}</span>
      </div>
      <div>
        <a target="_blank" class="more-detail-link"
           :href="'/resource/detail/'+ resource.resourceId">{{$t('resourceDetailView.moreTip')}}>></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'resource-intro',
  data() {
    return {}
  },

  props: {
    resource: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    avatarUrl() {
      if (this.resource.userId) {
        return `https://image.freelog.com/headImage/${this.resource.userId}?x-oss-process=style/head-image`
      }
      return ''
    }
  }
}
</script>


<style lang="less" scoped>
  @import "index.less";
</style>
