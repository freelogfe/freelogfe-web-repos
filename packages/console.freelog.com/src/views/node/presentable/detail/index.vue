<template>
  <section class="presentable-detail-wrapper">
    <presentable-detail-header :resource="resourceInfo"
                               :presentable="presentableInfo"
                               :contracts.sync="presentableInfo.contracts"></presentable-detail-header>
    <div class="presentable-content-panels">
      <el-tabs v-model="activeTabName" @tab-click="handleClick" :stretch="true">
        <el-tab-pane :name="TAB_NAMES.base">
          <span slot="label" class="panel-tab-name">
            {{$t('presentable.tabNames.info')}}
          </span>
          <div class="panel-content">
            <lazy-component>
              <presentable-detail-base
                      :resource="resourceInfo"
                      :presentable="presentableInfo">
              </presentable-detail-base>
            </lazy-component>
          </div>
        </el-tab-pane>
        <el-tab-pane :name="TAB_NAMES.scheme">
          <span slot="label" class="panel-tab-name">{{$t('presentable.tabNames.schemes')}}<i class="dot solid" v-if="!isDependenciesDone"></i></span>
          <div class="panel-content">
            <lazy-component>
              <authorization-scheme-manage
                      v-if="resourceInfo.resourceId"
                      :contracts.sync="presentableInfo.contracts"
                      :resourceInfo="resourceInfo"
                      :presentableInfo="presentableInfo"
                      authType="presentable"
                      @update-selected-scheme="updateSelectedScheme"
              ></authorization-scheme-manage>
            </lazy-component>
          </div>
        </el-tab-pane>
        <el-tab-pane :name="TAB_NAMES.contract">
          <span slot="label" class="panel-tab-name">{{$t('presentable.tabNames.contracts')}}<i class="dot solid" v-if="!isContractsDone"></i></span>
          <div class="panel-content contract-manager-wrap">
            <ContractManager :contracts="presentableInfo.contracts"
                             @contracts-change="contractsChangeHandler"
                             v-if="presentableInfo.contracts&&presentableInfo.contracts.length"></ContractManager>
            <div class="empty-contract-tip" v-else>
              {{$t('presentable.uncreatedContractTip')}}
              <router-link :to="$route.path + '?tab=scheme'">
                <el-button type="text">{{$t('presentable.gotoCreateContractTip')}}</el-button>
              </router-link>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :name="TAB_NAMES.policy" :lazy="true">
          <span slot="label" class="panel-tab-name">{{$t('presentable.tabNames.policies')}}<i class="dot solid" v-if="!isPoliciesDone"></i></span>
          <div class="panel-content policy-manager-wrap">
            <policy-list :list="presentableInfo.policy" @save="savePoliciesHandler"></policy-list>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import PresentableDetail from './index'

export default PresentableDetail
</script>

<style lang="less" scoped>
  @import "index.less";
</style>

<style lang="less">
  .presentable-detail-wrapper  {
    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__nav-scroll {
      padding: 0 168px;
    }

    .el-tabs__content {
      overflow: inherit;
    }
  }
</style>
