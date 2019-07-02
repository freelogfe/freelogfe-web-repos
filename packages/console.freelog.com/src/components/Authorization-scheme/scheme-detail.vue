<template>
  <div class="scheme-detail-box">
    <h3 class="scheme-title">{{$t('components.authScheme.schemeTitle')}}</h3>
    <ul class="tab-box">
      <li
              v-for="(authScheme, index) in authSchemeList"
              :key="'auth-scheme-tab'+ index"
              :class="{
                'active': index === activeAuthSchemeTabIndex,
              }"
              @click="exchnageActiveTab(index)"
      >
        <i
                class="el-icon-circle-check"
                :class="{ 'selected': index === selectedAuthSchemeTabIndex }"
        ></i>
        {{authScheme.authSchemeName}}
      </li>
    </ul>
    <div class="tab-pane">
      <div class="tab-row row-resource" v-if="upcastResourcesArr.length">
        <h3>{{$t('components.authScheme.unsignedResources')}}</h3>
        <ul>
          <li
                  v-for="(upcastResource, index) in upcastResourcesArr"
                  :key="'upcastResource'+index"
                  :class="{
                    'selected': index === selectedUpcastResourceIndex,
                    'upcasted': upcastResource.isNoResolved,
                    'active-1': upcastResource.selectedAuthSchemeTabIndex !== -1,
                    'active-2': !!upcastResource.isFinishSelectedAuthScheme
                  }"
                  @click="selectUpcastResource(index)"
          >
            <span>{{upcastResource.resourceName}}</span>
            <!--<span class="history-text" v-if="upcastResource.isHasSignHistory"> (存在历史签约)</span>-->
            <span
                    class="upcast-resource-line"
                    v-show="index === selectedUpcastResourceIndex && (currentOpenedResources.length - 1) > resourceLevelIndex"
            ></span>
          </li>
        </ul>
      </div>
      <div class="tab-row row-policy">
        <h3>{{$t('components.authScheme.policyTitle')}}</h3>
        <div class="policyList">
          <div
                  v-for="(policy, index) in policyList"
                  :key="'policy'+index"
                  class="policy-item"
                  :class="{ 'active': index === curSchemeSelectedPolicyIndex, 'has-sign-history': policy.isHasSignHistory, 'disabled': policy.isDisbale }"
                  v-if="policy.status === 1"
          >
            <div class="p-item-name" @click="selectPolicyItem(index, policy)">
              <i class="el-icon-circle-check" v-if="index === curSchemeSelectedPolicyIndex"></i>
              <span class="p-item-check" v-if="index !== curSchemeSelectedPolicyIndex"></span>
              {{policy.policyName}}
              <span class="has-sign-history-text" v-if="policy.isHasSignHistory && !policy.isDisbale">({{$t('components.authScheme.hadSigned')}})</span>
              <span class="disabled-text" v-if="policy.isDisbale">({{$t('components.authScheme.unavailable')}})</span>
              <!--<span class="disabled-text" v-if="policy.status === 0">(已下架)</span>-->
            </div>
            <div class="policy-detail">
              <pre class="policy-segment-text">{{fmtPolicyTextList[index]}}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { beautifyPolicy } from '@freelog/freelog-policy-lang'

  export default {
    name: 'scheme-detail',
    components: {},
    data() {
      return {
        selectedUpcastResourceIndex: -1,
        curSchemeSelectedPolicyIndex: -1,
      }
    },
    props: {
      authType: String,
      isCanUpdateContract: Boolean,
      currentOpenedResources: Array,
      resourceAuthScheme: Object,
      resourceLevelIndex: Number,
      resourceMap: Object,
      authSchemeIdentityAuthMap: Object,
      activeAuthSchemeTabIndex: Number,
      selectedAuthSchemeTabIndex: Number,
      checkIsCanExchangeSelection: Function,
    },
    methods: {
      // 切换"授权方案"Tab
      exchnageActiveTab(index) {
        if (this.activeAuthSchemeTabIndex !== index) {
          this.$emit('update:activeAuthSchemeTabIndex', index)
        }
        this.$emit('refresh-opened-resource', this.resourceLevelIndex)
      },
      // 选择"上抛资源"
      selectUpcastResource(index) {
        this.selectedUpcastResourceIndex = this.activeScheme.selectedUpcastResourceIndex = index
        this.$emit('show-upcast-resource-scheme', this.upcastResourcesArr[index], this.resourceLevelIndex)
      },
      // 选择"授权策略"
      selectPolicyItem(index, policy) {
        var self = this
        if (policy.isDisbale) {
          return
        }

        if (this.checkIsCanExchangeSelection) {
          if (!this.checkIsCanExchangeSelection()) {
            return
          }
        }

        self.exchangePolicyItem(index)
        self.checkIsFinishAllAuth()
        this.$emit('refresh-selected-auth-schemes')

        return
        // 以下代码功能暂留 2019/01/21
        // 存在parentResourceId即为upcastResource，须确认父级资源是否已选中授权方案
        if ((this.resourceLevelIndex - 1) >= 0) {
          let {selectedAuthSchemeTabIndex, activeAuthSchemeTabIndex, resourceName, authSchemeList} = this.currentOpenedResources[this.resourceLevelIndex - 1]
          if (selectedAuthSchemeTabIndex === -1) {
            this.$message.error(this.$t('components.authScheme.selectPolicyMessages[0]',{resourceName}))
            return
          } else if (selectedAuthSchemeTabIndex !== activeAuthSchemeTabIndex) {
            var parentResourceActiveScheme = authSchemeList[activeAuthSchemeTabIndex]
            this.$message.error(this.$t('components.authScheme.selectPolicyMessages[1]',{
              resourceName,
              authSchemeName:parentResourceActiveScheme.authSchemeName
            }))
            return
          }
        }

        const {isEffect, msg} = this.isEffectSelectedScheme(index)
        if (isEffect) {
          this.$messageBox.confirm(msg, {
            callback(action) {
              if (action === 'confirm') {
                self.$emit('cancel-scheme-selection', self.upcastResourcesArr)
                self.exchangePolicyItem(index)
                self.checkIsFinishAllAuth()
                self.$emit('refresh-selected-auth-schemes')
              }
            }
          })
        } else {
          self.exchangePolicyItem(index)
          self.checkIsFinishAllAuth()
          this.$emit('refresh-selected-auth-schemes')
        }

      },
      // 是否影响原本的"授权方案及策略"的选择
      isEffectSelectedScheme(index) {
        let str = ''
        let isEffect = false

        if (this.activeAuthSchemeTabIndex !== this.selectedAuthSchemeTabIndex && this.selectedAuthSchemeTabIndex !== -1) {
          str = this.$t('components.authScheme.switchSchemeTip')
          isEffect = true
        } else if (this.curSchemeSelectedPolicyIndex === index) {
          if (this.selectedUpcastResourceIndex !== -1 && this.upcastResourcesArr[this.selectedUpcastResourceIndex].selectedAuthSchemeTabIndex !== -1) {
            str = this.$t('components.authScheme.cancelSelectedSchemeTip')
            isEffect = true
          }
        }

        return {
          isEffect, msg: this.$t('components.authScheme.confirmMsg',{str})
        }
      },
      exchangePolicyItem(index) {
        if (this.curSchemeSelectedPolicyIndex === index) {
          this.curSchemeSelectedPolicyIndex = -1
          this.$emit('update:selectedAuthSchemeTabIndex', -1)
        } else {
          this.curSchemeSelectedPolicyIndex = index
          this.$emit('update:selectedAuthSchemeTabIndex', this.activeAuthSchemeTabIndex)
        }
        this.resourceAuthScheme.selectedPolicyIndex = this.curSchemeSelectedPolicyIndex
      },
      // 是否所有资源（包括上抛资源）都已选择策略
      checkIsFinishAllAuth() {
        var leng = this.currentOpenedResources.length
        for(let i = leng - 1; i >= 0; i--) {
          let isFinishSelectedAS = false
          const { authSchemeList, selectedAuthSchemeTabIndex, resourceName } = this.currentOpenedResources[i]
          if(selectedAuthSchemeTabIndex !== -1) {
            const { bubbleResources } = authSchemeList[selectedAuthSchemeTabIndex]
            if(bubbleResources.length) {
              let isFinishBubbleSelections = true
              for(let j = 0; j < bubbleResources.length; j++) {
                const { resourceId } =  bubbleResources[j]
                if(!this.resourceMap[resourceId] || !this.resourceMap[resourceId].isFinishSelectedAuthScheme ) {
                  isFinishBubbleSelections = false
                  break
                }
              }
              isFinishSelectedAS = isFinishBubbleSelections
            }else {
              isFinishSelectedAS = true
            }
          }
          this.currentOpenedResources[i].isFinishSelectedAuthScheme = isFinishSelectedAS
        }

      },
    },
    computed: {
      authSchemeList() {
        return this.resourceAuthScheme.authSchemeList
      },
      activeScheme() {
        return this.authSchemeList[this.activeAuthSchemeTabIndex]
      },
      upcastResourcesArr() {
        return this.activeScheme.bubbleResources.map(item => {
          const {resourceId} = item
          if (!this.resourceMap[resourceId]) {
            item.selectedAuthSchemeTabIndex = -1
            return item
          } else {
            return this.resourceMap[resourceId]
          }
        })
      },
      policyList() {
        var {authSchemeId} = this.activeScheme
        var tempMap = this.authSchemeIdentityAuthMap[authSchemeId]

        return this.activeScheme.policy.map(p => {
          if (tempMap && tempMap[p.segmentId]) {
            const {status, authResult: {isAuth}, purpose} = tempMap[p.segmentId]
            p.isDisbale = !isAuth || ((purpose & 2) !== 2 && this.authType === 'presentable') || ((purpose & 1) !== 1 && this.authType === 'resource')
          } else {
            p.isDisbale = false
          }
          return p
        })
      },
      fmtPolicyTextList() {
        return this.policyList.map(policy => {
          return beautifyPolicy(policy.policyText)
        })
      },
    },
    watch: {
      currentOpenedResources() {
        this.activeScheme.bubbleResources = this.activeScheme.bubbleResources.slice(0)
        this.$emit('refresh-selected-auth-schemes')
      },
      selectedAuthSchemeTabIndex() {
        if (this.activeAuthSchemeTabIndex !== this.selectedAuthSchemeTabIndex) {
          this.curSchemeSelectedPolicyIndex = -1
        } else {
          this.curSchemeSelectedPolicyIndex = this.resourceAuthScheme.selectedPolicyIndex
        }
      },
      activeScheme() {
        if (this.activeAuthSchemeTabIndex !== this.selectedAuthSchemeTabIndex) {
          this.curSchemeSelectedPolicyIndex = -1
        } else {
          this.curSchemeSelectedPolicyIndex = this.resourceAuthScheme.selectedPolicyIndex
        }
        this.selectedUpcastResourceIndex = typeof this.activeScheme.selectedUpcastResourceIndex === 'undefined' ? -1 : this.activeScheme.selectedUpcastResourceIndex
      }
    },
    mounted() {
      this.curSchemeSelectedPolicyIndex = this.resourceAuthScheme.selectedPolicyIndex
      this.selectedUpcastResourceIndex = typeof this.activeScheme.selectedUpcastResourceIndex === 'undefined' ? -1 : this.activeScheme.selectedUpcastResourceIndex
    },
  }

</script>

<style lang="less" scoped>
  @import './scheme-detail.less';
</style>

