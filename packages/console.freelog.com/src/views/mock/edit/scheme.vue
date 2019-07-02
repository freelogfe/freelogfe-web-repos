<template>
  <div class="resource-scheme-manager-wrap">
    <el-tabs tab-position="top" v-model="activeTabName" @tab-click="changeTabHandler">
      <el-tab-pane :name="TAB_NAMES.info" :lazy="true">
        <span slot="label" class="panel-tab-name">{{ $t('resourceEditView.panelsTabName[0]')}}<i class="dot solid" v-if="isSchemeReady"></i></span>
        <div class="panel-content info-manager-wrap">
          <SchemeInfo :scheme="detail.scheme" ref="info"></SchemeInfo>
        </div>
      </el-tab-pane>
      <el-tab-pane :name="TAB_NAMES.scheme">
        <span slot="label" class="panel-tab-name">{{ $t('resourceEditView.panelsTabName[1]')}}<i class="dot solid" v-if="!isDependenciesDone"></i></span>
        <div class="panel-content">
          <lazy-component>
            <scheme-content
                    :resourceInfo="detail.resource"
                    :scheme.sync="detail.scheme"
                    :boxStyle="schemeContentBoxStyle"
                    :activeTabName.sync="activeTabName"
                    ref="scheme"
            ></scheme-content>
          </lazy-component>
        </div>
      </el-tab-pane>
      <el-tab-pane :name="TAB_NAMES.contract">
        <span slot="label" class="panel-tab-name">{{ $t('resourceEditView.panelsTabName[2]')}}<i class="dot solid" v-if="!isContractsDone"></i></span>
        <div class="panel-content contract-manager-wrap">
          <ContractManager :contracts="detail.scheme.dutyStatements"
                           @contracts-change="contractsChangeHandler"
                           ref="contract"
                           v-if="detail.scheme.dutyStatements&&detail.scheme.dutyStatements.length"></ContractManager>
          <div class="empty-contract-tip" v-else>
            <div v-if="isDependenciesDone">
              {{ $t('resourceEditView.noContractTip')}}
            </div>
            <div v-else>
              {{ $t('resourceEditView.createContractTip')}}
              <router-link :to="$route.path + '?tab=scheme'">
                <el-button type="text">{{ $t('resourceEditView.createContractText')}}</el-button>
              </router-link>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :name="TAB_NAMES.policy" :lazy="true">
        <span slot="label" class="panel-tab-name">{{ $t('resourceEditView.panelsTabName[3]')}}<i class="dot solid" v-if="!isPoliciesDone"></i></span>
        <div class="panel-content policy-manager-wrap">
          <PolicyManager :list="detail.scheme.policy"
                         ref="policy"
                         @save="savePoliciesHandler"></PolicyManager>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ContractManager from '@/components/ContractManager/index.vue'
  import PolicyManager from '@/components/PolicyList/index.vue'
  import {SCHEME_PUBLISH_STATUS} from '@/config/scheme'
  import SchemeContent from './scheme-content.vue'
  import SchemeInfo from './scheme-info.vue'

  const TAB_NAMES = {
    policy: 'policy-manager',
    contract: 'contract-manager',
    scheme: 'scheme-manager',
    info: 'info-manager'
  }
  export default {
    name: 'resource-scheme-manager',
    data() {
      return {
        TAB_NAMES,
        activeTabName: TAB_NAMES.scheme,
        resourceInfo: {},
        contracts: []
      }
    },
    props: {
      detail: Object
    },
    components: {
      ContractManager,
      PolicyManager,
      SchemeContent,
      SchemeInfo
    },
    computed: {
      wrapperWidth() {
        return document.querySelector('.resource-schemes-manager-wrap').offsetWidth
      },
      schemeContentBoxStyle() {
        return {
          position: 'relative',
          left: (this.wrapperWidth - window.innerWidth) / 2 + 'px',
          width: window.innerWidth + 'px',
          margin: 0
        }
      },
      isDependenciesDone() {
        const {resource, scheme} = this.detail
        return !resource.systemMeta.dependencies.length ||
          (scheme.bubbleResources.length > 0 || scheme.dutyStatements.length > 0)
      },
      isContractsDone() {
        const {scheme} = this.detail
        var isValid = true
        if (scheme.dutyStatements && scheme.dutyStatements.length > 0) {
          isValid = this.contracts.every(contract => {
            return contract.status === 4
          })
        }

        return isValid
      },
      isPoliciesDone() {
        return this.detail.scheme.policy.length > 0
      },
      isEnabled(){
        return this.detail.scheme.status === SCHEME_PUBLISH_STATUS.enabled
      },
      isSchemeReady(){
        return this.isDependenciesDone && this.isContractsDone && this.isPoliciesDone && !this.isEnabled
      }
    },
    methods: {
      contractsChangeHandler(contracts) {
        this.contracts = contracts
      },
      savePoliciesHandler({data}) {
        this.$services.authSchemes.put(this.detail.scheme.authSchemeId, data)
          .then(res => {
            const {errcode, ret, msg, data} = res.data
            if (errcode === 0 && ret === 0) {
              this.detail.scheme.policy = data.policy
            } else {
              this.$error.showErrorMessage(msg)
            }
          }).catch(this.$error.showErrorMessage)
      },
      changeTabHandler(tab){
        var name = tab.name.split('-')[0]
        var $panel = this.$refs[name]
        if ($panel) {
          $panel.$emit('show')
        }
      }
    },
    mounted() {
      if (!this.isDependenciesDone) {
        this.activeTabName = TAB_NAMES.scheme
      } else if (!this.isContractsDone) {
        this.activeTabName = TAB_NAMES.contract
      } else if (!this.isPoliciesDone) {
        this.activeTabName = TAB_NAMES.policy
      } else {
        this.activeTabName = TAB_NAMES.info
      }
    },
  }
</script>


<style lang="less" scoped>
  @import "../../../styles/variables";

  .resource-scheme-manager-wrap {
    .panel-content {
      min-height: 500px;
    }
    .empty-contract-tip {
      text-align: center;
      font-size: 14px;
      color: #666;
    }

    .policy-manager-wrap,
    .info-manager-wrap,
    .contract-manager-wrap {
      width: @main-content-width-1190;
      margin: auto;
    }
  }

  @media screen and (max-width: 1250px) {
    .resource-scheme-manager-wrap {
      .policy-manager-wrap,
      .contract-manager-wrap {
        width: @main-content-width-990;
      }
    }
  }
</style>

<style lang="less">
  .resource-scheme-manager-wrap {
    .el-tabs__nav {
      width: 800px;
      min-width: auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .el-tabs__nav-scroll {
      padding: 0 168px;
      display: flex;
      justify-content: center;
    }

    .el-tabs__content {
      overflow: inherit;
    }

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__nav-wrap {
      &:after {
        display: block !important;
      }
    }
  }
</style>
