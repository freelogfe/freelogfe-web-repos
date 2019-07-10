<i18n src="../../i18n-locales/contractSigning.json"></i18n>
<template>
  <div v-if="isRender">
    <div class="cutoff-line"></div>
    <div class="sc-content" style="min-height: 620px;">
      <div class="sc-left-box sc-resource-list">
        <ul>
          <li class="sc-resource-item"
              :class="{'active': index === selectedIndex}"
              v-for="(item, index) in presentableList"
              :key="'sc-item-' + (index + 1)"
              @click="selectedResource(index)">
            {{item.presentableName}}
            <div class="sc-tag-box" >
              <span :class="['sc-tag', `sc-tag-${item.c_dContractType}`]">
                {{item.c_dContractTagName}}
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="sc-cutoff-line-2"></div>
      <contract-signing-single
              class="sc-right-box"
              type="multi"
              :presentable="selectedPresentable"
              @update-default-contract="updateDefaultContract"
      ></contract-signing-single>
    </div>
  </div>
</template>

<script>
  import ContractSigningSingle from './signing-single.vue'

  import { getContractState, } from './common.js'
  import { getUserInfo } from "../../utils.js"

  export default {
    name: 'contract-signing-multi',
    components: {
      ContractSigningSingle,
    },
    props: {
      presentableList: {
        type: Array,
        required: true
      },
      selectedIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isRender: false,
        contracts: [],                  // 所有presentable的默认合同
        defaultContract: null,
        dContractType: '',
        dContractTagName: ''
      }
    },
    computed: {
      selectedPresentable: {
        get() {
          return this.presentableList[this.selectedIndex]
        }
      },
      nodeId() {
        return this.selectedPresentable.nodeId
      },
      userId() {
        var userInfo = getUserInfo()
        return userInfo && userInfo.userId
      },
      selectedResourceId() {
        return this.selectedPresentable.resourceId
      },
    },
    methods: {
      init() {
        const resourceIds = this.presentableList.map(p => p.resourceId)
        return this.$axios.get(`/v1/contracts/`, {
          params: {
            pageSize: this.presentableList.length,
            resourceIds: resourceIds.join(','),
            contractType: 3,
            partyOne: this.nodeId,
            partyTwo: this.userId,
            isDefault: 1
          }
        })
          .then(res => {
            if(res.data.errcode === 0) {
              return res.data.data.dataList
            }else {
              return Promise.reject(res.data.msg)
            }
          })
          .catch(e => this.$message.error(e))
          .then((contracts) => {
            this.contracts = contracts
            this.resolveContracts()
            this.isRender = true
          })
      },
      resolveContracts (){
        var map = {}

        this.contracts.forEach(contract => {
          if(this.selectedResourceId === contract.resourceId) {
            this.defaultContract = contract
          }
          map[contract.resourceId] = contract
        })
        this.resourceIdContractMap = map

        this.resolvePretentableContract()
      },
      resolvePretentableContract() {
        this.presentableList.forEach(p => {
          p.c_contract = this.resourceIdContractMap[p.resourceId] || null
          this.resolvePresentableC_Contract(p)
        })
      },
      resolvePresentableC_Contract(presentable) {
        const { type, tagName } = getContractState.call(this, presentable.c_contract)
        presentable.c_dContractType = type
        presentable.c_dContractTagName = tagName
      },
      selectedResource(index) {
        this.$emit('update:selectedIndex', index)
      },
      updateDefaultContract(contract) {
        if(this.selectedPresentable.c_contract) {
          if(this.selectedPresentable.c_contract.status !== contract.status){
            this.$emit('updated-contract')
          }
        }else{
          this.$emit('updated-contract')
        }
        this.resourceIdContractMap[contract.resourceId] = contract
        this.selectedPresentable.c_contract = contract
        this.resolvePresentableC_Contract(this.selectedPresentable)
        this.presentableList.splice(this.selectedIndex, 1, this.selectedPresentable)
      },
    },
    watch: {
      presentableList(newV, oldV) {
        this.resolvePretentableContract()
      },
    },
    beforeMount() {
      this.init()
    },
    mounted() {

    },
    destroyed() {

    }
  }
</script>

<style lang='less' scoped type="text/less">

  .cutoff-line {
    position: relative;
    top: -20px;
    height: 1px;
    margin: 0 -20px;
    background: #ddd;
  }

  .sc-content {
    position: relative;
    /*display: flex;*/
    margin: 0 -20px;
    text-align: left;
  }

  .sc-left-box {
    width: 300px;
    min-width: 300px;
  }

  .sc-cutoff-line-2 {
    position: absolute;
    left: 300px;
    top: -20px;
    bottom: -20px;
    width: 1px;
    background-color: #ddd;
  }

  .sc-right-box {
    position: relative;
    top: -20px;
    margin-left: 300px;
    flex: 1;
    padding: 0 20px;
  }

  .sc-resource-list {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .sc-resource-list ul {
    overflow-y: scroll;
    position: absolute;
    left: 0;
    top: -20px;
    bottom: -20px;
    right: 0;
  }

  .sc-resource-item {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #222;

    &.active {
      padding-left: 17px;
      border-left: 3px solid #3C99FC;
      background-color: #f4f4f4;
    }
  }

  .sc-tag-box{
    margin-top: 5px;

    .sc-tag{
      margin-left: 0;
    }
  }

</style>

