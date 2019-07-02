<template>
  <div class="fl-contracts-manager-wrap clearfix" v-loading="loading">
    <div class="contract-list-wrapper">
      <h4 class="label-title">{{ $t('components.contractManager.resourceList')}}</h4>

      <div class="contract-list-panel">
        <div v-if="masterContract.contractId">
          <p class="sub-label-title">{{ $t('components.contractManager.masterResource')}}</p>
          <div class="contract-item"
               :class="['contract-status-'+masterContract.status,
               {'current':currentContract.contractId===masterContract.contractId}]"
               @click="showContractDetailHandler(masterContract)">
            <div v-if="masterContract.releaseDetail">
              <i class="dot"></i>
              <span v-if="masterContract.releaseDetail.releaseName">{{masterContract.releaseDetail.releaseName}}</span>
              <span v-else>{{ $t('components.contractManager.subResourceId')}} {{masterContract.contractId}}</span>
            </div>
          </div>
        </div>
        <div v-if="contractList.length">
          <p class="sub-label-title"
             v-if="masterContract.contractId">{{ $t('components.contractManager.bubbleResources')}} <span class="contracts-num">{{contractList.length}}</span></p>
          <ul class="contract-list">
            <li class="contract-item"
                v-for="contract in contractList"
                :key="contract.contractId"
                :class="['contract-status-'+contract.status, {'current':currentContract.contractId===contract.contractId}]"
                @click="showContractDetailHandler(contract)">
              <div>
                <span class="res-contract-title" v-if="contract.releaseDetail.releaseName">{{contract.releaseDetail.releaseName}}</span>
                <span class="res-contract-title" v-else>{{ $t('components.contractManager.subResourceId')}} {{contract.contractId}}</span>
                <span class="contract-state-tip" :class="['contract-state-'+contract.statusInfo.type]"
                      v-if="contract.statusInfo">{{contract.statusInfo.desc}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="contract-exec-container" v-if="currentContract.contractId">
      <contract-detail :contract="currentContract" @update="updateContractHandler"></contract-detail>
    </div>
  </div>
</template>

<script>
  import ResourceList from './index'

  export default ResourceList
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
