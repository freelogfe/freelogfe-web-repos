<template>
  <div class="fl-policy-list-wrap">
    <policy-editor
        v-for="policy in policyList"
        :key="policy.policyId"
        :policy="policy"
        :policyList="policyList"
        @save="savePolicyHandler"
        @delete="deletePolicyHandler"></policy-editor>
    <div>
      <el-button type="text" class="add-new-policy-btn" @click="addNewPolicyHandler">
        <span><i class="el-icon-plus"></i>{{$t('components.policyList.addPolicy')}}<i class="dot solid" v-if="!policyList.length"></i></span>
      </el-button>
    </div>
  </div>
</template>


<script>
  import {isFunction} from '../../lib/utils'
  import PolicyEditor from '../PolicyEditor/index.vue'

  export default {
    name: 'policy-list',

    data() {
      return {
        policyList: []
      }
    },

    components: {PolicyEditor},

    props: {
      list: Array,
      savePolicies: Function
    },

    mounted() {
      this.resolveList(this.list)
    },

    watch: {
      list(newVal) {
        this.resolveList(newVal)
      }
    },

    methods: {
      resolveList(list) {
        this.policyList = list.slice(0)
      },
      addNewPolicyHandler() {
        this.policyList.push({
          policyName: this.$t('components.policyList.unnamedPolicy'),
          policyText: '',
          // disabled: false
        })
      },
      deletePolicyHandler(policy) {
        var list = this.policyList
        for (let i = 0; i < list.length; ++i) {
          let p = list[i]
          if (p === policy) {
            list.splice(i, 1)
            break
          }
        }
      },
      getChangeData(policy) {
        var policyInfo = {
          updatePolicies: [],
          addPolicies: []
        }
        if (policy.policyId) {
          policyInfo.updatePolicies = policyInfo.updatePolicies || []
          policyInfo.updatePolicies.push({
            policyId: policy.policyId,
            policyName: policy.policyName,
            status: policy.disabled ? 0 : 1
          })
        } else if (policy.policyText) {
          policyInfo.addPolicies = policyInfo.addPolicies || []
          policyInfo.addPolicies.push({
            policyName: policy.policyName,
            policyText: btoa(policy.policyText)
          })
        }
        return {policyInfo}
      },
      savePolicyHandler(policy) {
        var payload = this.getChangeData(policy)
        if (isFunction(this.savePolicies)) {
          this.savePolicies(payload, policy)
        } else {
          this.$emit('save', {data: payload, policy})
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .fl-policy-list-wrap {
    .add-new-policy-btn {
      color: #333333;
      font-weight: bold;
      font-size: 14px;
      span {
        height: 40px;
        display: flex;
        align-items: center;
        .el-icon-plus {
          display: inline-block;
          background-color: #EEEEEE;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          font-size: 25px;
          margin-right: 10px;
        }

        .dot {
          margin-top: -22px;
        }
      }
    }
  }
</style>
