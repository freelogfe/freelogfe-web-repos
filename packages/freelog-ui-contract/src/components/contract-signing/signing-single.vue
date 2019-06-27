<template>
  <div class="ss-content">
    <template v-if="type ==='single'">
      <div class="ss-cont-header">
        {{presentableName}}
        <span
                :class="['sc-tag', `sc-tag-${dContractType}`]"
        >{{dContractTagName}}</span>
      </div>
    </template>
    <template>
      <resource-contract
              v-if="isRenderResoureContract"
              :defaultContract.sync="defaultContract"
              :presentable="presentable">
      </resource-contract>
    </template>
  </div>
</template>

<script>
  import resourceContract from './signing-box.vue'
  import { getContractState, } from './common.js'
  import { getUserInfo } from "../../utils.js"

  export default {
    name: 'contract-signing-single',
    components: {
      resourceContract,
    },
    props: {
      type: {
        type: String,
        default: 'single'
      },
      presentable: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        isRenderResoureContract: false,
        defaultContract: null,
        dContractType: '',
        dContractTagName: '',
        contracts: [],
      }
    },
    computed: {
      // 节点资源名称
      presentableName() {
        return this.presentable.presentableName
      },
      userId() {
        var userInfo = getUserInfo()
        return userInfo && userInfo.userId
      },
    },
    methods: {
      reInitialData() {
        this.isRenderResoureContract = false
        this.getContracts()
        this.$forceUpdate()
      },
      // 获取该资源的所有合同
      getContracts() {
        const { presentableId } = this.presentable
        return this.$axios.get(`/v1/contracts/contractRecords?targetIds=${presentableId}&partyTwo=${this.userId}`)
          .then(res => {
            if(res.data.errcode === 0) {
              return res.data.data
            }else {
              return Promise.reject(rea.data.msg)
            }
          })
          .then(contracts => {
            this.contracts = contracts
            this.presentable.policy = this.presentable.policy.filter(p => p.status === 1)
            this.resolveContracts()
            this.resolveDefaultContractState()
            this.isRenderResoureContract = true
          })
          .catch((e) => this.$message.error(e))
      },
      resolveContracts (){
        var map = {}
        this.contracts.forEach(contract => {
          if(contract.isDefault) {
            this.defaultContract = contract
          }
          map[contract.segmentId] = contract
        })

        this.presentable.policy.forEach(p => {
          p.contract = map[p.segmentId] || null
        })
        this.$set(this.presentable, this.presentable.policy)
      },
      resolveDefaultContractState() {
        const { type, tagName } = getContractState.call(this, this.defaultContract)
        this.dContractType = type
        this.dContractTagName = tagName
      }
    },
    watch: {
      defaultContract() {
        this.$emit('update-default-contract', this.defaultContract)
      },
      presentable() {
        this.contracts = []
        this.reInitialData()
      }
    },
    beforeMount() {
      this.reInitialData()
    },
    destroyed() {

    }
  }
</script>

<style lang='less' scoped type="text/less">

  .ss-content {
    box-sizing: border-box;
    padding: 0 45px; text-align: left;

    .ss-cont-header {
      padding: 5px 0 10px;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      color: #222;
      font-weight: bold;

    }
  }
</style>

