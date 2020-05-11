<!--<i18n src="./detail.i18n.json"></i18n>-->
<template>
  <div class="f-sign-policy-list">
    <div class="signed-list" v-if="signedPolicies.length">
      <h3>待执行合约</h3>
      <div class="s-l-item" v-for="policy in signedPolicies" :key="policy.pCombinationID">
        <div class="p-name" :class="{'isSigned': policy.isSigned}" @click="selectPolicy(signedPolicies, policy)">
          <!-- <template v-if="!policy.isSigned">
            <span class="p-n-check-box" v-if="selectedPolicies.indexOf(policy.policyId) === -1"></span>
            <i class="el-icon-check" v-else></i>
          </template> -->
          {{policy.policyName}}
          <span class="contract-status" :class="['status-'+policy.contract.status]">{{policy.statusTip}}</span>
        </div>
        <div class="p-auth-info">
          <span>合约ID：{{policy.contract.contractId}}</span>
          <span>合约时间：{{policy.contract.updateDate | fmtDate}}</span>
        </div>
        <div class="p-detail">
          <contract-detail
            class="contract-policy-content"
            :contract.sync="policy.contract"
            :policyText="policy.contract.contractClause.policyText"
            @update-contract="updateContractAfterEvent(policy)"></contract-detail>
        </div>
      </div>
    </div>
    <div class="no-sign-list" v-if="nodSignPolicies.length">
      <h3>以下策略可进行签约</h3>
      <div class="no-s-l-item" :class="{'disabled': p.status === 0}" v-for="p in nodSignPolicies" :key="p.pCombinationID">
        <div class="p-name" @click="selectPolicy(nodSignPolicies, p)">
          <!-- <template v-if="!p.isSigned">
            <span class="p-n-check-box" v-if="selectedPolicies.indexOf(p.policyId) === -1"></span>
            <i class="el-icon-check" v-else></i>
          </template> -->
          {{p.policyName}}<span v-if="p.status === 0">（已下线）</span>
        </div>
        <el-button class="p-sign-btn" type="primary" size="mini" @click="signNewPolicy(p)">签约</el-button>
        <div class="p-detail">
          <contract-policy :policy="p"></contract-policy>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContractDetail from '@freelog/freelog-ui-contract/src/components/contract-detail/index.vue'
import ContractPolicy from '@freelog/freelog-ui-contract/src/components/contract-policy/index.vue'

const CONTRACT_STATUS_TIPS = {
  '-1': "未创建合同",
  1: "未开始执行",
  2: "待执行",
  3: "系统锁住",
  4: "生效中",
  5: '',
  6: "合同已终止"
}

export default {
  name: 'sign-policy-list',
  components: { ContractDetail, ContractPolicy },
  props: {
    defaultContract: Object,
    contracts: {
      type: Array,
      default: () => []
    },
    policies: {
      type: Array,
      default: () => []
    },
    selectedPolicies: Array,
  },
  data() {
    return {
      nodSignPolicies: [],
      signedPolicies: [],
    }
  },
  computed: {

  },
  watch: {
    policies() {
      this.resolvePolicies()
    },
    contracts() {
      const map = {}
      for (let contract of this.contracts) {
        map[contract.policyId] = contract
      }
      for (let p of this.policies) {
        if (map[p.policyId]) {
          p.contract = map[p.policyId]
          p.isSigned = true
        }
      }
      this.resolvePolicies()
    },
    selectedPolicies() {
      for (let p of this.policies) {
        if (this.selectedPolicies.indexOf(p.policyId) === -1) {
          p.selected = false
        } else {
          p.selected = true
        }
      }
    },
  },
  mounted() {
    this.resolvePolicies()
  },
  methods: {
    resolvePolicies() {
      this.signedPolicies = this.getSignedPolicies()
      this.nodSignPolicies = this.getNoSignedPolicies()
    },
    getNoSignedPolicies() {
      return this.policies.filter(p => p.contract == null).map(p => {
        p.statusTip = ''
        return p
      })
    },
    getSignedPolicies() {
      return this.policies.filter(p => p.contract != null).map(p => {
        p.statusTip = CONTRACT_STATUS_TIPS[p.contract.status]
        return p
      })
    },
    // 选择策略
    selectPolicy(policies, policy) {
      const selectedPolicyId = policy.policyId
      const index = this.selectedPolicies.indexOf(selectedPolicyId)
      if (index === -1) {
        // 单选
        this.selectedPolicies.splice(0)
        this.selectedPolicies.push(selectedPolicyId)
      } else {
        this.selectedPolicies.splice(index, 1)
      }
      this.$emit('update:selectedPolicies', this.selectedPolicies)
    },
    signNewPolicy(policy) {
      this.$emit('sign-a-contract', policy)
    },
    updateContractAfterEvent() {
      this.resolvePolicies()
    },
  },
  filters: {
    fmtDate: function (value) {
      if (!value) return ''
      const oDate = new Date(value)
      const year = oDate.getFullYear()
      const _month = oDate.getMonth() + 1
      const month = _month > 9 ? _month : '0' + _month
      const date = oDate.getDate()
      return `${year}-${month}-${date}`
    }
  }
}
</script>

<style lang="less" scoped>
// .f-sign-policy-list {
//   max-height: 400px; overflow: auto;
// }
.list-enter-active {
  transition: all .3s;
}
.list-enter {
  opacity: 0;
  transform: translateX(50px);
}

.no-sign-list, .signed-list {
  h3 {
    margin-bottom: 8px;
    font-size: 14px; font-weight: 400; color: #666;
    .el-icon-info { color: #c6c6c6; }
  }
}
.no-s-l-item, .s-l-item  {
  position: relative;
  margin: 0 5px 20px; 
  color: #333; box-shadow: 0px 0px 3px rgba(0, 0, 0, .4);
  &.disabled { opacity: 0.5; pointer-events: none; }

  .p-name {
    position: relative; cursor: pointer;
    padding: 10px 0 10px 15px;
    font-size: 14px; color: #333;
    &.isSigned { pointer-events: none; cursor: auto; padding-left: 15px; background-color: #FAFBFB; }

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
  .p-sign-btn {
    position: absolute; top: 7px; right: 15px; z-index: 10;
    border-radius: 20px;
    font-size: 12px;
  }
  .p-detail {
    padding: 10px 15px; border-top: 1px solid #ccc; font-size: 14px;
  }
}

.signed-list {
  margin-bottom: 20px;
}
.s-l-item {
  position: relative;
  border: 1px solid #ccc; border-radius: 4px; background-color: #FAFBFB;

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
