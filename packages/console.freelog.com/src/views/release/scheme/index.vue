<template>
  <div class="scheme-manage-wrapper" v-loading="isLoading">
    <div class="s-m-w-tags">
      <template v-show="type !== 'edit'">
        <span><i class="contract-status status-2"></i>执行中</span>
        <span><i class="contract-status status-4"></i>生效中</span>
        <span><i class="contract-status status-6"></i>合同终止</span>
      </template>
      <span><i class="el-icon-top"></i>上报解决</span>
    </div>
    <div class="cont clearfix">
      <div class="s-m-w-c-left">
        <div
                v-for="(rItem, index) in depReleasesDetailList"
                :key="'dep-box-'+index"
        >
          <release-depend-item
                  :release="rItem"
                  :resolveStatus="rItem.resolveStatus"
                  :selectedRelease="selectedRelease"
                  :contractsMap="contractsMap"
                  @exchange-item="exchangeSelectedRelease"></release-depend-item>
          <release-depend-item
                  is-scond-level
                  v-for="(urItem, _index) in rItem.baseUpcastReleases"
                  :key="'dep-item-'+_index"
                  :release="urItem"
                  :resolveStatus="urItem.resolveStatus"
                  :selectedRelease="selectedRelease"
                  :contractsMap="contractsMap"
                  @exchange-item="exchangeSelectedRelease"></release-depend-item>
        </div>
      </div>
      <div class="s-m-w-c-right">
        <template v-if="type === 'create'">
          <div class="s-m-w-c-upcast-box">
            <div class="s-m-w-c-ub-head">上抛 <i class="el-icon-info"></i></div>
            <div class="s-m-w-c-ub-body">
              <div
                      :class="['s-m-w-c-upcast-btn', { 'selected': isSelectedReleaesUpcast }]"
                      @click="upcastHandler">
                <span class="u-check-box" v-if="!isSelectedReleaesUpcast"></span>
                <i class="el-icon-circle-check" v-else></i>上抛
              </div>
            </div>
          </div>
          <div class="s-m-w-c-p-wrapper" :class="[{ 'disabled': isSelectedReleaesUpcast }]">
            <div class="s-m-w-c-head">
               签约 <i class="el-icon-info"></i>
            </div>
            <div
                    class="s-m-w-c-policy"
                    :class="{ 'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]) }"
                    v-for="(policy, index) in tmpNoSignedPolicies"
                    :key="'p-nosigned-' + index"
            >
              <div class="smw-c-p-box">
                <div class="p-name" :class="[type]" @click="selectPolicy(policy, index)">
                  <span class="p-n-check-box" v-if="!policy.isSelected"></span>
                  <i class="el-icon-check" v-else></i>
                  {{policy.policyName}}<span v-if="policy.status === 0">（已下线）</span>  
                </div>
                <div class="p-detail">
                  <pre class="p-segment-text" >{{fmtPolicyTextList(policy)}}</pre>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>  
          <div class="s-m-w-c-p-wrapper" :class="[{ 'disabled': isSelectedReleaesUpcast }]">
            <template v-if="tmpSignedPolicies.length">
              <div class="s-m-w-c-head">
                <div class="p-auth-info" v-if="selectedRelease.contracts && selectedRelease.contracts.length > 0">
                  <div><label>授权方：</label><span>{{selectedRelease.releaseName}}</span></div>
                  <div><label>被授权方：</label><span>{{release.releaseName}}</span></div>
                </div>
              </div>
              <h4 class="s-m-w-c-p-title">已签约</h4> 
              <div
                class="s-m-w-c-policy"
                :class="{ 'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]) }"
                v-for="(policy, index) in tmpSignedPolicies"
                :key="'p-signed-' + index"
              >
                <div class="smw-c-p-signed" v-if="contractsMap && contractsMap[policy.contractId]">
                    <div class="p-name" >
                      {{policy.policyName}}
                      <span class="contract-status" :class="['status-'+contractsMap[policy.contractId].status]">{{contractsMap[policy.contractId].statusTip}}</span>
                      <div class="p-enabled-btn" @click="toggleEnabledContract(policy)">{{ policy.isEnbledContract ? '搁置' : '启用'}}</div>
                    </div>
                    <div class="p-auth-info">
                      <span>合同ID：{{policy.contractId}}</span>
                      <span>签约时间：{{contractsMap[policy.contractId].updateDate | fmtDate}}</span>
                    </div>
                    <div class="p-detail">
                      <contract-detail
                              class="contract-policy-content"
                              :contract.sync="contractsMap[policy.contractId]"
                              :policyText="contractsMap[policy.contractId].contractClause.policyText"
                              @update-contract="updateContractAfterEvent"></contract-detail>
                    </div>
                </div>
              </div>
            </template>
            <template v-if="tmpNoSignedPolicies.length">
              <h4 class="s-m-w-c-p-title">以下策略可进行新的签约</h4>
              <div
                      class="s-m-w-c-policy"
                      :class="{ 'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]) }"
                      v-for="(policy, index) in tmpNoSignedPolicies"
                      :key="'p-' + index"
              >
                <div class="smw-c-p-box">
                  <div class="p-name" :class="[type]">
                    {{policy.policyName}}<span v-if="policy.status === 0">（已下线）</span>
                    <div class="p-signed-btn" @click="policySignImmediately(policy)">签约</div>
                  </div>
                  <div class="p-detail"><pre class="p-segment-text" >{{fmtPolicyTextList(policy)}}</pre></div>
                </div>
              </div>
            </template>
          </div>
        </template>
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
