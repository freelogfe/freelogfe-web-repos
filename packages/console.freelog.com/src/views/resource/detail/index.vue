<template>
  <section class="res-detail-wrap" :class="[{'owner-resource': isOwnerResource}, resourceDetail.resourceInfo.status === 2? 'on-line-resource': 'off-line-resource']">
    <div class="res-detail-hd clearfix"  ref="resIntro">
      <div class="res-hd-wrap">
        <div class="res-digest">
          <div class="rt-side">
            <p>
              <el-button class="res-act-btn" type="primary" @click="getResourceAuthHandler">{{$t('resourceDetailView.addPresentableText')}}</el-button>
            </p>
            <p>
              <el-button class="res-act-btn" @click="favorHandler">{{resourceDetail.isFavor? $t('resourceDetailView.deleteFavorText'): $t('resourceDetailView.favorText')}}</el-button>
            </p>
          </div>
          <div class="lf-side">
            <div class="res-title">{{resourceDetail.resourceInfo.resourceName}} <span class="off-line-tip">({{$t('resourceDetailView.offlineTip')}})</span></div>
            <div class="res-origin-info">
              <span class="res-type">{{resourceDetail.resourceInfo.resourceType}}</span>
              <span class="res-type">{{resourceDetail.resourceInfo.resourceId}}</span>
              <span class="res-update-time">{{$t('resourceDetailView.lastUpdateText')}} {{resourceDetail.resourceInfo.updateDate|fmtDate}}</span>
            </div>
          </div>
        </div>
        <div class="res-author-info">
          <div class="user-avatar-img">
            <i class="el-icon-fa-user-circle"></i>
            <img :src="avatarUrl" alt=""/>
          </div>
          <span class="res-author-name">{{resourceDetail.resourceInfo.userName}}</span>
        </div>
      </div>
    </div>
    <div class="res-detail-content" ref="detailContent">
      <div>
        <div class="res-detail-nav-tabs-wrap" ref="tabs">
          <ul class="res-detail-nav-tabs">
            <li :class="{active:activeTab===tab.name}"
                :key="tab.name"
                v-for="tab in tabs" @click="scrollInto(tab.name)">
              {{tab.title}}
            </li>
          </ul>
        </div>
        <div class="res-detail-bd" ref="detailBody">
          <div class="res-detail-info" ref="resSchemes">
            <ResourceSchemes class="res-schemes-content" :resource="resourceDetail.resourceInfo"></ResourceSchemes>
          </div>

          <div class="res-detail-desc res-detail-info ql-snow" ref="resDesc">
            <div v-if="resourceDetail.resourceInfo.description"
                 class="ql-editor"
                 v-html="resourceDetail.resourceInfo.description"></div>
            <div v-else class="empty-res-desc-text">{{ $t('resourceDetailView.noDescTip') }}</div>
          </div>
          <div class="res-detail-meta res-detail-info" ref="resMeta">
            <pre class="meta-info">{{formatMeta()}}</pre>
          </div>
        </div>
        <div class="res-detail-ft">
          <el-button class="res-act-btn" @click="favorHandler">{{resourceDetail.isFavor? $t('resourceDetailView.deleteFavorText'):$t('resourceDetailView.favorText')}}</el-button>
          <el-button class="res-act-btn" type="primary" @click="getResourceAuthHandler">{{$t('resourceDetailView.addPresentableText')}}</el-button>
        </div>
      </div>
      <a class="up-to-top" href="#" ref="upBtn">
        <i class="el-icon-arrow-up"></i>
      </a>
    </div>

    <el-dialog width="640px" title="" :visible.sync="showOptionsDialog">
      <div class="opts-content-wrap">
        <div class="select-target-header">
          <div class="resource-name">{{resourceDetail.resourceInfo.resourceName}}</div>
          <div class="selected-resource-auth-scheme-policy"></div>
        </div>
        <div class="select-target-bd">
          <h4 class="opts-bd-title">{{ $t('resourceDetailView.addResourceToNode') }}</h4>
          <div class="opts-container">
            <ul class="checkbox-group node-opts" v-if="nodes.length">
              <li class="checkbox-item"
                  v-for="node in nodes"
                  :key="node.nodeId"
                  :class="{'node-opt-selected': node.selected}"
                  @click="nodeOptCheckHandler(node)">
                <i class="node-opt-check-status checked-opt" v-if="node.checked"></i>
                <i class="node-opt-check-status unchecked-opt" v-else></i>
                {{node.nodeName}}
              </li>
            </ul>
            <div v-else>
              {{$t('resourceDetailView.noNodesTip')}}<router-link to="/node/create">{{$t('resourceDetailView.createNodeTip')}}</router-link>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button class="deep-color-btn" type="primary" @click="confirmAuthHandler">{{ $t('common.confirm')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import ResourceDetail from './index'

export default ResourceDetail
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
