<template>
  <div
          class="r-dependencies-item"
          :class="{ 'second-level': isScondLevel, 'active': selectedRelease.releaseId === release.releaseId }"
          @click="exchangeSelectedRelease(release)"
  >
    <div class="r-item-cont">
      <p class="r-name" :class="[resolveStatus]"><i class="el-icon-top"></i>{{release.releaseName}}</p>
      <div class="r-info" v-if="release.policies">
        <span>{{release.resourceType}}</span>
        <span>{{release.latestVersion.version}}</span>
        <span>{{release.updateDate | fmtDate }}</span>
      </div>
      <div class="r-policies">
        <template v-if="!release.isUpcasted">
          <div class="r-p-item" v-for="(p, index) in release.selectedPolicies" :key="'s-policy-'+index">{{p.policyName}}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'depend-item',
    props: {
      release: Object,
      resolveStatus: String,
      selectedRelease: Object,
      isScondLevel: Boolean
    },
    methods: {
      exchangeSelectedRelease(item) {
        this.$emit('exchange-item', item)
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .r-dependencies-item {
    cursor: pointer;
    &.active {
      border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #fff;
    }

    .r-item-cont {
      padding: 10px 0 10px 10px; overflow: hidden;
    }

    .r-name, .r-info, .r-policies { padding-left: 20px; }
    .r-name {
      position: relative;
      margin-bottom: 6px;
      font-size: 16px; color: #333; font-weight: 500;

      i {
        position: absolute; left: 0; top: 50%; z-index: 1;
        transform: translateY(-50%); color: transparent;
      }

      &.no-resolve, &.resolved{
        i {
          width: 12px; height: 12px; border-radius: 50%; overflow: hidden;
          font-size: 12px;
        }
      }
      // &.no-resolve{
      //   i { background-color: #FFBD28; color: #FFBD28; }
      // }
      // &.resolved{
      //   i { background-color: #84CCA8; color: #84CCA8; }
      // }
      &.upcast {
        i { color: #EA7171; font-weight: bold; }
      }
    }
    .r-info {
      margin-bottom: 6px;
      font-size: 12px; color: #999;
      span{
        padding-right: 5px;
        &:not(:first-child) {
          padding-left: 5px; border-left: 1px solid #999;
        }
      }
    }
    .r-policies {
      margin-right: 8px; 
      .r-p-item {
        display: inline-block;
        margin: 0 8px 8px 0; padding: 2px 10px; border: 1px solid #A5D1FF; border-radius: 2px;
        background-color: #E9F4FF; color: #248fff;
      }
    }
    &.second-level {
      padding: 0 0 0 40px; cursor: pointer;
      &.active {  border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #fff; }
      .r-name { font-size: 14px; }
      .r-policies { border-width: 0; }
    }
  }
</style>
