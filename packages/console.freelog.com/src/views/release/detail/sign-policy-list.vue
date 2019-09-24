<i18n src="./detail.i18n.json"></i18n>
<template>
  <div>
    <div class="signed-list" v-if="signedPolicies.length">
      <h3>
        {{type !== 'edit' ? $t('signedContracts') : $t('signStatus[0]')}} 
        <el-tooltip placement="right" :content="$t('tips[2]')" v-if="type !== 'edit'" >
          <i class="el-icon-info"></i>
        </el-tooltip>
      </h3>
      <div class="s-l-item" v-for="policy in signedPolicies" :key="policy.policyId">
        <div class="p-name" :class="[type]" @click="selectPolicy(signedPolicies, policy)">
          <span class="p-n-check-box" v-if="!policy.isSelected"></span>
          <i class="el-icon-check" v-else></i>
          {{policy.policyName}}
          <span class="contract-status" :class="['status-'+contractsPolicyIdMap[policy.policyId].status]">{{contractsPolicyIdMap[policy.policyId].statusTip}}</span>
        </div>
        <div class="p-auth-info">
          <span>{{$t('contractID')}}：{{contractsPolicyIdMap[policy.policyId].contractId}}</span>
          <span>{{$t('signingDate')}}：{{contractsPolicyIdMap[policy.policyId].updateDate | fmtDate}}</span>
        </div>
        <div class="p-detail">
          <contract-detail
                  class="contract-policy-content"
                  :contract.sync="contractsPolicyIdMap[policy.policyId]"
                  :policyText="contractsPolicyIdMap[policy.policyId].contractClause.policyText"
                  @update-contract="updateContractAfterEvent"></contract-detail>
        </div>
      </div>
    </div>
    <div class="no-sign-list" v-if="nodSignPolicies.length">
      <h3>
        签约
        <el-tooltip placement="right" effect="light">
          <div class="s-m-w-c-ubh-tip" slot="content">
            作为被授权方，如果您满足且接受授权方的授权策略，则可以选择和授权方签约。授权双方之间存在一个按照未来发生的事件改变资源授权状态的机制，称之为合约。
            <ul>
              <li>合约的复用：授权方和被授权方的合约在同一个授权方（节点或发行）范围内可以复用。</li>
              <li>合约的启用和停用：如果您和授权方的多个授权策略签订了多个合约，则在管理合约时，至少要有一个合约是启用状态。您可以选择启用或者停用其中某一个或某几个合约，在授权链中，系统仅会验证启用合约的授权状态。</li>
            </ul>
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </h3>
      <div class="no-s-l-item" v-for="p in nodSignPolicies" :key="p.policyId">
        <div class="p-name" :class="[type]" @click="selectPolicy(nodSignPolicies, p)">
          <span class="p-n-check-box" v-if="!p.isSelected"></span>
          <i class="el-icon-check" v-else></i>
          {{p.policyName}}<span v-if="p.status === 0">（{{$t('offline')}}）</span>  
        </div>
        <div class="p-detail">
          <pre class="p-segment-text" >{{fmtPolicyTextList(p)}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { beautifyPolicy } from '@freelog/freelog-policy-lang'
import { ContractDetail } from '@freelog/freelog-ui-contract'
import { CONTRACT_STATUS_TIPS } from '@/config/contract.js'
export default {
  name: 'sign-policy-list',
  components: { ContractDetail },
  props: {
    policies: {
      type: 'Array',
      default: () => []
    },
    contracts: {
      type: 'Array',
      default: () => []
    },
    release: {
      type: "Object",
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {
    // policyId和contract的映射
    contractsPolicyIdMap() {
      const map = {}
      this.contracts.forEach(c => {
        c.statusTip = CONTRACT_STATUS_TIPS[c.status]
        map[c.policyId] = c
      })
      return map
    },
    signedPolicies() {
      return this.policies.filter(p => this.contractsPolicyIdMap[p.policyId]).map(p => {
        const contract = this.contractsPolicyIdMap[p.policyId]
        p.contractId = contract.contractId
        return p
      })
    },
    nodSignPolicies() {
      return this.policies.filter(p => !this.contractsPolicyIdMap[p.policyId]).map(p => {
        p.contractId = ''
        return p
      })
    }
  },
  watch: {
    contracts() {
      const tmpPolicies = this.release.selectedPolicies
      const leng = tmpPolicies.length
      for(let i = 0; i < leng; i++) {
        const p = tmpPolicies[i]
        const contract = this.contractsPolicyIdMap[p.policyId]
        if(p.contractId) {
          if(!contract) {
            p.contractId = ''
            tmpPolicies.splice(i, 1, p)
          }
        }else {
          if(contract) {
            p.contractId = contract.contractId
            tmpPolicies.splice(i, 1, p)
          }
        }
      }
    },
  },
  methods: {
    fmtPolicyTextList(p) {
      return beautifyPolicy(p.policyText)
    },
    // 选择策略
    selectPolicy(policies, policy) {
      if(this.type === 'edit') return 

      policy.isSelected = !policy.isSelected
      this.policies = this.policies.map(p => p)
      if(policy.isSelected) {
        this.togglePolicy(this.release.selectedPolicies, policy, 'add')
      }else {
        this.togglePolicy(this.release.selectedPolicies, policy, 'delete')
      }
    },
    togglePolicy(policies, policy, type) {
      this.toggleArrayItem(type, policies, policy, (i1, i2) => i1.policyId === i2.policyId)
    },
    toggleArrayItem(type, arr, target, verify) {
      var index = -1
      for(let i = 0; i < arr.length; i++) {
        if(verify(target, arr[i])) {
          index = i
          break
        }
      }
      switch (type) {
        case 'add': {
          if(index === -1) {
            arr.push(target)
          }
          break
        }
        case 'delete': {
          if(index !== -1) {
            arr.splice(index, 1)
          }
        }
        default: {}
      }
    },
  },
}
</script>

<style lang="less">
.no-sign-list, .signed-list {
  h3 {
    margin-bottom: 8px;
    font-size: 14px; color: #4497EC;
  }
}
.no-s-l-item, .s-l-item  {
  margin-bottom: 20px; border: 1px solid #ccc; border-top-left-radius: 4px; border-top-right-radius: 4px;
  color: #333;
  
  
  .p-name {
    position: relative; cursor: pointer;
    padding: 10px 0 10px 40px;
    font-size: 16px; color: #333;

    .p-n-check-box {
      display: inline-block;
      position: absolute; left: 15px; top: 50%; z-index: 10; transform: translateY(-50%);
      width: 16px; height: 16px; border: 1px solid #333; border-radius: 2px;
    }

    .el-icon-check {
      position: absolute; left: 13px; top: 50%; z-index: 10; transform: translateY(-50%);
      padding-left: 3px; font-size: 14px; font-weight: bold; color: #fff;
      &:after {
        content: '';
        position: absolute; left: 2px; top: -2px; z-index: -2;
        width: 16px; height: 16px; border: 1px solid #4497EC; border-radius: 2px;
        background-color: #4497EC; color: #fff;
      }
    }
  }
  .p-detail {
    padding: 10px 15px; font-size: 14px;  border-top: 1px solid #ccc;
  }
}

.signed-list {
  margin-bottom: 20px;
}
.s-l-item {
  position: relative;
  border: 1px solid #ccc; border-radius: 4px; background-color: #fbfbfb;
  
  .p-name{ 
    margin-top: 8px; font-weight: 600;

    .contract-status {
      display: inline-block; 
      margin-left: 10px; padding: 0 10px; border: 1px solid; border-radius: 12px;
      font-size: 14px;
    
      &.status-0 { color: #fff; border-color: #999; background: #999; }
      &.status-1, &.status-2 { color: #FBB726; border-color: #FBB726; }
      &.status-4 { color: #45BC7B; border-color: #45BC7B; }
      &.status-3, &.status-5, &.status-6 { color: #fff; border-color: #E35A5F; background: #E35A5F; }
    }
  }

  .p-auth-info {
    padding: 5px 15px 10px; 
    span { display: inline-block; width: 49%; color: #999; }
  }
}
  
</style>