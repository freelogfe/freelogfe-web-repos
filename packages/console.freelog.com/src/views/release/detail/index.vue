<template>
  <div class="release-detail-wrapper" v-if="release" v-loading="isShowContentLoading">
    <div class="r-d-w-header clearfix">
      <div class="r-d-w-main-content">
        <el-alert class="r-d-w-waring" type="warning" :closable="false" v-if="!isOnline">
          <div slot="title">
            当前发行未上线，未有可用策略！
            <router-link :to="`/release/edit/${release.releaseId}`" v-if="isOwnRelease">前去编辑</router-link>
          </div>
        </el-alert>
        <div class="preview-box">
          <img :src="release.previewImages[0]" alt="" :class="{'resource-default-preview':!release.previewImages[0]}" >
        </div>
        <div class="cont">
          <div class="r-d-w-name">
            <span>{{release.username}}/{{release.releaseName}}</span>
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
    <div class="r-d-w-policy" v-if="release.policies.length">
      <div class="r-d-w-main-content clearfix">
        <div class="r-d-w-p-left">
          <div class="r-d-w-p-current-releases">
            <h3>当前发行策略</h3>
            <ul>
              <li
                      class="release-policy-item"
                      :class="{'active': p.policyId === activePolicy.policyId}"
                      v-for="(p, index) in release.policies"
                      :key="'p'+index"
                      @click="exchangeActivePolicy(p)">
                <el-checkbox v-model="selectedRPolicyIdsList" :label="p.checkedLabel" size="medium">{{p.policyName}}</el-checkbox>
              </li>
            </ul>
          </div>
          <div class="r-d-w-p-upcast-releases" v-if="baseUpcastReleasesList.length">
            <h3>上抛发行策略</h3>
            <ul>
              <li class="r-d-w-p-u-r-item" v-for="(r, index) in baseUpcastReleasesList" :key="'bur-'+index">
                <div class="r-item-name" :class="{'selected': r.isSelectedPolicy}">{{r.releaseName}}</div>
                <div class="release-policy-item" v-for="(p, index) in r.policies" :key="index" @click="exchangeActivePolicy(p)">
                  <el-checkbox v-model="selectedUpcastRPolicyIdsList" :label="p.checkedLabel" size="medium" >{{p.policyName}}</el-checkbox>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="r-d-w-p-right">
          <pre class="r-d-w-p-text" v-if="activePolicy" v-html="activePolicy.policyText"></pre>
        </div>
        <div class="r-d-w-p-auth-btn" @click="showSignBox">获取授权</div>
        <div class="r-d-w-p-compare-btn" @click="showPolicyCompareBox" v-if="release.policies.length > 1">策略对比</div>
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
    <el-dialog
            title="策略对比"
            width="740px"
            :visible.sync="compareDialogVisible"
            v-if="release.policies.length > 1"
    >
      <div class="r-d-w-r-p-compare" v-for="(item, index) in comparePolices" :key="'c-p-' + index">
        <div class="r-d-w-r-p-btn" 
          :class="{'active': item.activeIndex === index}" 
          v-for="(p, index) in release.policies" 
          :key="'p-btn-' + index"
          @click="exchangeComparePolicy(item, index)">{{p.policyName}}</div>
        <div class="r-d-w-r-p-box">
          <h4>{{release.policies[item.activeIndex].policyName}}</h4>
          <pre class="r-d-w-r-p-text" v-html="release.policies[item.activeIndex].policyText"></pre>
        </div>
      </div>
    </el-dialog>
    <el-dialog
            center
            title="签约确认"
            width="640px"
            :visible.sync="signDialogVisible"
    >
      <div class="r-d-w-r-sign">
        <h4>节点选择</h4>
        <el-checkbox-group class="r-d-w-r-node-list" v-model="checkedNodeList" v-if="nodes.length">
          <el-checkbox
                  class="r-d-w-r-node-item"
                  v-for="(node, index) in nodes"
                  :key="'node-'+index"
                  :label="node.nodeId"
                  size="medium"
                  :checked="rSubordinateNodesIds.indexOf(node.nodeId) !== -1"
                  :disabled="rSubordinateNodesIds.indexOf(node.nodeId) !== -1"
          >{{node.nodeName}}</el-checkbox>
        </el-checkbox-group>
        <div class="rdwr-no-nodes" v-else>
          <el-alert type="warning" show-icon :closable="false">
            <div class="" slot="title">
              你还没有创建节点；<a href="/node/create" target="_blank">前去创建？</a>
            </div>
          </el-alert>
        </div>
        <h4>策略确认</h4>
        <div class="r-d-w-r-s-releases" >
          <div class="rdwr-s-r-item" v-for="(item, index) in selectedPolicies" :key="'s-p-'+index">
            <span class="rdwr-s-r-item-name">{{item.releaseName}}</span>
            <span class="rdwr-s-r-item-policy">
              {{item.policyName}}
            </span>
          </div>
        </div>
        <div class="rdwr-s-btn-group">
          <el-button class="rdwr-s-btn rdwr-s-btn-cancel" @click="signDialogVisible = false">取消</el-button>
          <el-button type="primary" class="rdwr-s-btn rdwr-s-btn-sign" :disabled="checkedNodeList.length === 0" @click="authSign">签约</el-button>
        </div>
      </div>
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
</style>
