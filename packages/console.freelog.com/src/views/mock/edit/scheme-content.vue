<template>
  <div v-loading="isShowLoading" :style="[boxStyle]" >
    <template v-if="resourceDependencies.length">
      <div class="resource-dependencies">
        <h3>{{ $t('resourceEditView.depsListTitle')}}</h3>
        <ul>
          <li
                  v-for="(dependency, index) in resourceDependencies"
                  :key="'dependency-'+index"
                  :class="{
                    'selected': index === selectedDependencyIndex,
                    'active-1': dependency.authResolveState === 0,
                    'active-2': dependency.authResolveState === 1
                }"
                  @click="exchangeDependencyIndex(index)"
          >
            <span>{{dependency.resourceName}}</span>
            <span class="line" v-show="index === selectedDependencyIndex"></span>
          </li>
        </ul>
        <div class="r-d-btn-box" v-if="!isPreventExchangeSelection && !isAbandon">
          <div class="r-d-btn" @click="finishDependeciesHandler">
            签约
          </div>
        </div>
      </div>
      <div class="dependencies-resolve-box">
        <authorization-scheme-manage
                v-for="(dependency, index) in resourceDependencies"
                :key="'a-s-m-'+index"
                v-show="index === selectedDependencyIndex"
                authType="resource"
                :resourceInfo.sync="dependency"
                :contracts="contracts"
                :bubbleResourcesMap="bubbleResourcesMap"
                :isPreventExchangeSelection="isPreventExchangeSelection"
                :isAbandon="isAbandon"
                :isShowFooter="false"
                :isScrollBar="false"
                @exchange-auth-resolve-state="exchangeAuthResolveState"
                @update-resolved-auth-scheme="getResolvedAuthScheme"
        ></authorization-scheme-manage>
      </div>
    </template>
    <p class="no-resource-dependeny" v-else>{{ $t('resourceEditView.noDepsTip')}}</p>
    <scheme-suspension-ball
            :isShow="!isAbandon && !isPreventExchangeSelection"
            :selectedAuthSchemes="resolvedDutyStatements"
            :unResolveAuthResources="resolvedBubbleResources"
    ></scheme-suspension-ball>
    <scheme-sign-dialog
            authType="resource"
            :visible.sync="isDialogVisible"
            :resolvedDutyStatements="resolvedDutyStatements"
            :resolvedBubbleResources="resolvedBubbleResources"
            :authSchemeId="scheme.authSchemeId"
            @done="afterSginContract"
    ></scheme-sign-dialog>
  </div>
</template>

<script>
  import AuthorizationSchemeManage from '@/components/Authorization-scheme/index.vue'
  import SchemeSignDialog from '@/components/Authorization-scheme/scheme-sign-dialog.vue'
  import SchemeSuspensionBall from '@/components/Authorization-scheme/scheme-suspension-ball.vue'

  export default {
    name: 'scheme-content',
    props: {
      resourceInfo: Object,
      boxStyle: Object,
      scheme: Object,
      activeTabName: String,
    },
    data() {
      return {
        isShowLoading: false,
        isDialogVisible: false,
        selectedDependencyIndex: -1,
        resourceDependencies: [],
        resolvedAuthSchemeMap: {},
        resolvedBubbleResources: [],
        resolvedDutyStatements: [],
        contracts: [],
        isPreventExchangeSelection: false,
      }
    },
    components: {
      AuthorizationSchemeManage,
      SchemeSignDialog,
      SchemeSuspensionBall,
    },
    computed: {
      resourceId() {
        return this.resourceInfo.resourceId
      },
      bubbleResourcesMap() {
        var bubbleResourcesMap = {}
        this.scheme.bubbleResources.forEach(b => {
          bubbleResourcesMap[b.resourceId] = 1
        })
        return bubbleResourcesMap
      },
      isAbandon() {
        return this.scheme.status === 4
      }
    },
    methods: {
      getDependenciesDetail() {
        const resourceDependencies = this.resourceInfo.systemMeta.dependencies || []
        if (resourceDependencies.length === 0) return
        this.isShowLoading = true
        var resourceIds = resourceDependencies.map(i => i.resourceId).join(',')
        this.$axios.get(`/v1/resources/list?resourceIds=${resourceIds}`)
          .then(res => res.data)
          .then(res => {
            if (res.errcode === 0) {
              this.resourceDependencies = res.data
              this.selectedDependencyIndex = 0
            } else {
              this.$message.error(res.msg)
            }
            this.isShowLoading = false
          })
          .catch(e => {
            this.$message.error(e)
            this.isShowLoading = false
          })
      },
      exchangeDependencyIndex(index) {
        if (index === this.selectedDependencyIndex) return
        this.selectedDependencyIndex = index

      },
      // 切换资源"授权处理状态"
      exchangeAuthResolveState() {
        this.resourceDependencies = this.resourceDependencies.slice()
      },
      // 获取"依赖授权"的处理结果
      getResolvedAuthScheme({resourceId, selectedAuthSchemes, unResolveAuthResources}) {
        if (this.isPreventExchangeSelection || this.isAbandon) return
        this.resolvedAuthSchemeMap[resourceId] = {
          selectedAuthSchemes, unResolveAuthResources
        }

        this.resolvedDutyStatements = []
        this.resolvedBubbleResources = []
        for (let i = 0; i < this.resourceDependencies.length; i++) {
          const denpency = this.resourceDependencies[i]
          const map = this.resolvedAuthSchemeMap[denpency.resourceId]
          if (map) {
            const {selectedAuthSchemes, unResolveAuthResources} = map
            selectedAuthSchemes.forEach(item => {
              const {resourceId, resourceName, authSchemeId, authSchemeName, segmentId, policyName} = item
              this.resolvedDutyStatements.push({
                resourceName, authSchemeName, policyName,
                resourceId, authSchemeId,
                policySegmentId: segmentId
              })
            })
            unResolveAuthResources.forEach(item => this.resolvedBubbleResources.push({
              resourceId: item.resourceId,
              resourceName: item.resourceName
            }))
          }
        }
      },
      // 授权方案 之 "处理依赖与签约"
      finishDependeciesHandler() {
        var isFinish = true

        for (let i = 0; i < this.resourceDependencies.length; i++) {
          const denpency = this.resourceDependencies[i]
          if (denpency.authResolveState === -1 || typeof denpency.authResolveState === 'undefined') {
            this.$message.error(this.$t('resourceEditView.requiredDepsTip'))
            isFinish = false
            break
          }
        }

        this.isDialogVisible = isFinish
      },
      afterSginContract(data) {
        const {dutyStatements, bubbleResources} = data
        let scheme = this.scheme
        Object.assign(scheme, {dutyStatements, bubbleResources})
        this.$emit('update:scheme', scheme)
        this.contracts = [this.contracts, ...dutyStatements]
        this.isPreventExchangeSelection = true
        this.$message.success(this.$t('resourceEditView.createSuccess'))
        this.$emit('update:activeTabName', 'contract-manager')
      },
      signContract() {
        const data = {
          dutyStatements: this.resolvedDutyStatements.map(item => {
            const {resourceId, authSchemeId, policySegmentId} = item
            return {resourceId, authSchemeId, policySegmentId}
          }),
          bubbleResources: this.resolvedBubbleResources.map(item => {
            return { resourceId: item.resourceId }
          })
        }
        const {authSchemeId} = this.scheme
        this.$axios({
          method: 'PUT',
          url: `/v1/resources/authSchemes/${authSchemeId}/batchSignContracts`,
          data
        })
          .then(res => res.data)
          .then(res => {
            if (res.errcode === 0) {
              const {dutyStatements, bubbleResources} = res.data
              let scheme = this.scheme
              scheme = Object.assign({}, scheme, {dutyStatements, bubbleResources})
              this.$emit('update:scheme', scheme)
              this.contracts = [this.contracts, ...dutyStatements]
              this.isPreventExchangeSelection = true
              this.$message.success(this.$t('resourceEditView.createSuccess'))
            } else {
              this.$message.error(res.msg)
            }
          })
      }
    },
    mounted() {
      this.contracts = this.scheme.dutyStatements || []
      this.isPreventExchangeSelection = this.scheme.dutyStatements.length > 0 || this.scheme.bubbleResources.length > 0
      this.getDependenciesDetail()
    },
    destroyed() {
    },
  }
</script>

<style type="text/less" lang="less">
  .el-tabs__content {
    overflow: inherit;
  }

</style>
<style lang="less" type="text/less" scoped>

  .resource-dependencies {
    position: absolute;
    top: -15px;
    bottom: 0;
    z-index: 5;
    width: 340px;
    padding-top: 40px;
    border-right: 1px solid #D8D8D8;

    h3 {
      position: relative;
      margin-left: 55px;
      padding-left: 8px;
      font-size: 14px;
      color: #666;

      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 1;
        transform: translateY(-50%);
        content: '';
        display: block;
        width: 3px;
        height: 14px;
        background-color: #666;
      }
    }

    ul {
      margin-top: 20px;
      margin-left: 55px;
    }

    li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 7px;
      font-size: 14px;
      color: #333333;
      cursor: pointer;

      &:before {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 8;
        transform: translateY(-50%);
        content: '';
        display: block;
        width: 12px;
        height: 12px;
        border: 2px solid #EA7171;
        border-radius: 50%;
      }

      &.active-1:before {
        border: 3px solid #89D1AD;
        background-color: #fff;
      }

      &.active-2:before {
        background-color: #89D1AD;
        border-color: #89D1AD;
      }

      .line {
        &:before {
          content: '';
          display: block;
          position: absolute;
          left: 30px;
          right: 0;
          top: 50%;
          z-index: -1;
          height: 1px;
          background-color: #666;
        }

        &:after {
          content: '';
          display: block;
          transform: translateY(-50%);
          position: absolute;
          top: 50%;
          right: -10px;
          z-index: 5;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #666;
          background-color: #fff;
        }
      }
      span {
        padding-right: 6px;
        background-color: #fff;
        z-index: 10;
      }
      span.history-text {
        color: #999;
      }
    }

    .r-d-btn-box {
      margin-top: 50px;

      .r-d-btn {
        width: 220px;
        margin: auto;
        padding: 10px 0;
        border: 1px solid #A5D1FF;
        border-radius: 21px;
        background: #E9F4FF;
        color: #409EFF;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
      }
    }

  }

  .dependencies-resolve-box {
    overflow: hidden;
    margin-left: 340px;
    padding: 0 30px;
  }

  .no-resource-dependeny {
    font-size: 14px;
    text-align: center;
  }
</style>
