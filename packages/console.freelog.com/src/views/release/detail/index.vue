<i18n src="./detail.i18n.json"></i18n>
<template>
  <div class="release-detail-wrapper" v-if="release" v-loading="isShowContentLoading">
    <div class="r-d-w-header clearfix">
      <div class="r-d-w-main-content">
        <el-alert class="r-d-w-waring" type="warning" :closable="false" v-if="!isOnline">
          <div slot="title">
            当前发行未上线，无可用策略！
            <router-link :to="`/release/edit/${release.releaseId}`" v-if="isOwnRelease">前去编辑</router-link>
          </div>
        </el-alert>
        <el-alert class="r-d-w-waring" type="warning" :closable="false" v-if="!isUsable">
          <div slot="title">
            当前发行的上抛发行未上线，不可用！
          </div>
        </el-alert>
        <div class="preview-box">
          <img :src="release.previewImages[0]" alt="" :class="{'resource-default-preview':!release.previewImages[0]}" >
        </div>
        <div class="cont">
          <div class="r-d-w-name">
            <span>{{release.releaseName}}</span>
            <el-select class="r-d-w-version" :disabled="release.resourceVersions.length === 1" v-model="activeReleaseVersion" default-first-option>
              <el-option
                      class="r-d-w-version-option"
                      v-for="item in release.resourceVersions"
                      :key="item.version"
                      :label="item.version"
                      :value="item.version">
              </el-option>
            </el-select>
            <i :class="[isCollectedRelease ? 'el-icon-star-on' : 'el-icon-star-off']" @click="collectReleaseHandler"></i>
          </div>
          <div class="r-d-w-info">
            <span class="r-i-type">{{release.resourceType}}</span>
            <span class="r-i-date">{{release.updateDate | fmtDate}}</span>
            <span class="r-i-version">发行ID {{release.releaseId}}</span>
          </div>
          <div class="r-d-w-h-desc">{{release.intro}}</div>
        </div>
      </div>
    </div>

    <div class="r-d-w-auth-box">
      <div class="r-d-w-main-content">
        <div class="r-d-w-node-list">
          <h3>步骤1：选择签约节点 <a title="添加节点" class="rdw-w-create-node" href="/node/create" target="_blank" v-if="nodes.length"><i class="el-icon-plus"></i></a></h3>
          <el-select class="r-d-node-select" v-model="checkedNodeId" placeholder="请选择签约节点" v-if="nodes.length">
            <el-option
              v-for="node in nodes"
              :key="node.nodeId"
              :label="node.nodeName + (rSubordinateNodesIds.indexOf(node.nodeId) !== -1 ? '（已签约）':'')"
              :value="node.nodeId">
            </el-option>
          </el-select>
          <div class="rdwr-no-nodes" v-else>
            <el-alert type="warning" show-icon :closable="false">
              <div class="" slot="title">
                你还没有创建节点；<a href="/node/create" target="_blank">前去创建？</a>
              </div>
            </el-alert>
          </div>
        </div>  
        <div class="r-d-w-policy-box " :class="{'highlight': checkedNodeId!=''}">
          <h3>
            步骤2：选择授权策略<span><i class="el-icon-top"></i> 上抛</span>
          </h3>
          <div class="rdw-p-scheme-box">
            <div class="rdw-p-left-box">
              <h4>当前发行</h4>
              <release-depend-item
                class="rdw-hide-detial-btn"
                :release="release"
                :is-active="selectedRelease.releaseId === release.releaseId"
                :resolveStatus="release.resolveStatus"
                :contractsMap="contractsMap"
                @exchange-item="exchangeSelectedRelease"></release-depend-item>
              <h4 v-if="baseUpcastReleasesList.length">基础上抛</h4>
              <release-depend-item
                      v-for="(urItem, _index) in baseUpcastReleasesList"
                      :key="'dep-item-'+_index"
                      is-scond-level
                      resolveStatus="upcast"
                      :release="urItem"
                      :is-active="selectedRelease.releaseId === urItem.releaseId"
                      :contractsMap="contractsMap"
                      @exchange-item="exchangeSelectedRelease"></release-depend-item>
            </div>
            <div class="rdw-p-right-box">
              <sign-policy-list 
                :release="selectedRelease"
                :policies="selectedRelease.policies" 
                :contracts="nodeContracts"
                :rSubordinateNodesIds="rSubordinateNodesIds"
                :checkedNodeId="checkedNodeId"
                :nodeMap="nodeMap"
              ></sign-policy-list>
            </div>
          </div>
          <div class="rdw-p-auth-btn-bar" v-if="rSubordinateNodesIds.indexOf(checkedNodeId) === -1">
            <el-button type="primary" class="rdw-p-auth-btn" @click="showSignBox">获取授权</el-button>
          </div>
          <el-button class="rdw-p-compare-btn" v-if="selectedRelease.policies.length > 1" @click="compareDialogVisible = true">策略对比</el-button>
        </div>
      </div>  
    </div>
    
    <div class="r-d-w-main-content">
      <div class="r-d-w-description">
        <h2>资源描述</h2>
        <div class="ql-snow">
          <div v-if="resourceDetail.resourceInfo.description"
               class="ql-editor"
               v-html="resourceDetail.resourceInfo.description"></div>
          <div class="" v-else>
            暂无描述
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="策略对比" width="740px" :visible.sync="compareDialogVisible" v-if="selectedRelease.policies.length > 1">
      <policies-compare :selectedRelease="selectedRelease"></policies-compare>
    </el-dialog>
    <el-dialog title="签约确认" width="640px" :visible.sync="signDialogVisible" center>
      <signed-confirm 
        :checkedNodeId="checkedNodeId"
        :checkedNodeName="nodeMap[checkedNodeId]"
        :release="release"
        :baseUpcastReleasesList="baseUpcastReleasesList"
        @cancel-sign="signDialogVisible = false"
        @auth-signed="authSign"></signed-confirm>
    </el-dialog>
  </div>
</template>

<script>
  import ReleaseDetail from './index.js'
  export default ReleaseDetail
</script>

<style type="text/less" lang="less" scoped>
@import './index.less';
</style>

<style type="text/less" lang="less">
  .release-detail-wrapper {
    .el-dialog__body {
      overflow: hidden; padding: 0px;
    }
    .r-d-node-select {
      .el-input__inner {
        border:1px solid rgba(145,199,255,1);
      }
    }
    
  }
  .r-d-w-version {
    transform: scale(.7);
    .el-input__inner {
       height: 24px; padding: 0 8px; line-height: 24px;

    }
    .el-input__icon { width: 15px; line-height: 24px; }
  }
  .r-d-w-version-option {
    height: 22px; line-height: 22px; padding: 0 10px; text-align: center;
    span { display: inline-block; transform: scale(.7); }
  }
  
  .el-dialog__header {
    padding: 15px;
  }

  
  .rdwr-s-r-dropdown-item {
    line-height: 26px;

    .el-icon-check { color: #fff; }
    &.checked {
      color: #409EFF;
      .el-icon-check { color: #409EFF; }
    }
  }
  .rdw-hide-detial-btn {
    .r-name {
      a { visibility: hidden; }
    }
  }
</style>
