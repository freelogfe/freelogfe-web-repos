<template>
  <section class="node-detail-container">
    <div class="node-info-wrap">
      <h3 class="title">{{detail.nodeName}}</h3>
      <div class="node-link">
        <a :href="`//${detail.nodeDomain}${domainSuffix}`" target="_blank">{{detail.nodeDomain}}{{domainSuffix}}</a>
        <clip-board
                style="display: inline-block"
                @copyDone="copyDoneHandler"
                :value="resolveDomain(detail)">
          <a href="javascript:;">
            <i class="fl-icon-node-page fl-icon"></i>
          </a>
        </clip-board>
      </div>
    </div>

    <node-presentables></node-presentables>
  </section>
</template>

<script>
import NodeDetail from './index'

export default NodeDetail
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
