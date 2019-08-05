<template>
  <div class="scheme-manage-wrapper" v-loading="isLoading">
    <div class="s-m-w-tags">
      <span v-show="type !== 'edit'"><i class="no-resolve"></i>未解决</span>
      <span><i class="resolved"></i>已解决</span>
      <span><i class="el-icon-top"></i>上报解决</span>
    </div>
    <div class="cont clearfix">
      <div class="s-m-w-c-left">
        <div
                v-for="(rItem, index) in depReleasesDetailList"
                :key="'dep-item-'+index"
        >
          <release-depend-item
                  :release="rItem"
                  :resolveStatus="rItem.resolveStatus"
                  :selectedRelease="selectedRelease"
                  @exchange-item="exchangeSelectedRelease"></release-depend-item>
          <release-depend-item
                  is-scond-level
                  v-for="(urItem, index) in rItem.baseUpcastReleases"
                  :key="'dep-item-'+index"
                  :release="urItem"
                  :resolveStatus="urItem.resolveStatus"
                  :selectedRelease="selectedRelease"
                  @exchange-item="exchangeSelectedRelease"></release-depend-item>
        </div>
      </div>
      <div class="s-m-w-c-right">
        <div
                :class="['s-m-w-c-upcast-btn', { 'selected': isSelectedReleaesUpcast }]"
                v-if="type === 'create'"
                @click="upcastHandler">
          <span class="u-check-box" v-if="!isSelectedReleaesUpcast"></span>
          <i class="el-icon-circle-check" v-else></i>上抛
        </div>
        <div :class="['s-m-w-c-p-wrapper', { 'disabled': isSelectedReleaesUpcast }]">
          <div
                  class="s-m-w-c-policy"
                  :class="{ 'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]) }"
                  v-for="(policy, index) in tmpSelectedPolicies"
                  :key="'policy-' + index"
          >
            <div class="smw-c-p-signed" v-if="contractsMap && contractsMap[policy.contractId]">
              <div class="p-name" @click="selectPolicy(policy, index)">
                <span class="p-n-check-box" v-if="!policy.isSelected"></span>
                <i class="el-icon-check" v-else></i>
                {{policy.policyName}}
                <span class="contract-status" :class="['status-'+contractsMap[policy.contractId].status]">{{contractsMap[policy.contractId].statusTip}}</span>
                <!-- <span class="smw-c-p-s-text">（已签约）</span> -->
              </div>
              <div class="p-auth-info">
                <div>
                  <span>授权方：{{contractsMap[policy.contractId].partyOne}}</span>
                  <span>被授权方：{{contractsMap[policy.contractId].partyTwo}}</span>
                </div>
                <div>
                  <span>合同ID：{{policy.contractId}}</span>
                  <span>签约时间：{{contractsMap[policy.contractId].updateDate | fmtDate}}</span>
                </div>
              </div>
              <el-tooltip placement="top" content="此发行存在历史签约，可直接使用当前合同">
                <i class="el-icon-info"></i>
              </el-tooltip>
              <div class="p-detail">
                <contract-detail
                        class="contract-policy-content"
                        :contract.sync="contractsMap[policy.contractId]"
                        :policyText="contractsMap[policy.contractId].contractClause.policyText"
                        @update-contract="updateContractAfterEvent"></contract-detail>
              </div>
            </div>
            <div class="smw-c-p-box" v-else>
              <div class="p-name" @click="selectPolicy(policy, index)">
                <span class="p-n-check-box" v-if="!policy.isSelected"></span>
                <i class="el-icon-check" v-else></i>{{policy.policyName}}<span v-if="policy.status === 0">（已下线）</span>  
              </div>
              <div class="p-detail">
                <pre class="p-segment-text" >{{fmtPolicyTextList(policy)}}</pre>
              </div>
            </div>
          </div>
        </div>

      </div>
      <scheme-float-ball
            class="s-m-w-c-floatball"
            :selectedAuthSchemes="selectedAuthSchemes"
            :upcastReleases="baseUpcastReleases"
            v-if="type === 'create'"></scheme-float-ball>
    </div>
  </div>
</template>

<script>
  import SchemeManage from './scheme.js'
  export default SchemeManage
</script>

<style lang="less" type="text/less" scoped>
  @import './index.less';
</style>
