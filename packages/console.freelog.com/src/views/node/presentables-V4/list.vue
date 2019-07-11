<template>
  <pagination class="node-presentable-row"
              :config="tableConfig"
              :formatHandler="formatHandler"
              ref="listRef"
              :showFooter="showFooter"
              :pagination="paginationConfig">
    <template slot="list">
      <el-table-column
              label=""
              width="100">
        <template slot-scope="scope">
          <div>
            <a :href="`/release/edit/${scope.row.releaseInfo.releaseId}`" target="_blank">
              <img :src="scope.row.releaseInfo.postImgUrl | padImage"
                   :class="{'resource-default-preview':!scope.row.releaseInfo.postImgUrl}"
                   alt="">
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              label="">
        <template slot-scope="scope">
          <p class="resource-name" :title="scope.row.presentableName">{{ scope.row.presentableName }} </p>
        </template>
      </el-table-column>
      <el-table-column
              width="150"
              :label="$t('resource.resourceType')">
        <template slot-scope="scope">
          <div>
            <span class="resource-type" :class="['is-'+scope.row.releaseInfo.resourceType]">{{scope.row.releaseInfo.resourceType}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              width="180"
              :label="$t('contract.state')">
        <template slot-scope="scope">
          <div class="contract-state-info" :class="[
                      scope.row.hasContract?'active-status-2':'active-status-0',
                      {'is-presentable-online':scope.row.isOnlineChecked}
                    ]">
            <i class="dot"></i>
            <div class="scheme-state">
              <div>
                <template v-if="scope.row.hasContract">{{$t('contract.signedText')}}</template>
                <template v-else>
                  {{$t('contract.unsignedText')}}
                </template>
              </div>
              <p class="scheme-info" v-if="scope.row.scheme && scope.row.scheme.selectedPolicy">
                {{scope.row.scheme.authSchemeName}}/{{scope.row.scheme.selectedPolicy.policyName}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
              width="250"
              label="">
        <template slot-scope="{row}">
          <div class="presentable-nav-links active-status-0">
            <router-link :to="row.detailLink + '?tab=contract'">
              <el-button type="text" class="nav-link-btn"
                         :disabled="!row.hasContract">{{ $t('node.tabTitles.contract') }}<i class="dot" v-if="row.hasContract && row.isContractActived === false"></i>
              </el-button>
            </router-link>
            <span>|</span>
            <router-link :to="row.detailLink + '?tab=policy'">
              <!--<el-button type="text" class="nav-link-btn">{{ $t('node.tabTitles.policy') }}<i class="dot" v-if="(row.status&2) !== 2"></i>-->
              <!--</el-button>-->
              <el-button type="text" class="nav-link-btn">{{ $t('node.tabTitles.policy') }}<i class="dot" v-if="row.policies.length === 0"></i>
              </el-button>
            </router-link>
          </div>
        </template>
        </el-table-column>
        <slot name="append"></slot>
    </template>
    <template slot="empty">
      <slot name="empty"></slot>
    </template>
  </pagination>
</template>

<script>
import {PRESENTABLE_STATUS_TIPS} from '@/config/presentable'
import {loadAuthSchemes} from '@/data/scheme/loader'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'node-presentable-list',

  data() {
    return {
      tableConfig: {
        rowClassName: 'resource-row',
        'cell-class-name': 'res-row-cell',
        'show-header': false
      },
      paginationConfig: {
        target: `/v1/presentables`,
        params: {
          nodeId: this.$route.params.nodeId
        }
      }
    }
  },

  props: {
    params: Object,
    showFooter: Boolean
  },

  components: {Pagination},

  watch: {
    params: {
      deep: true,
      handler() {
        this.reload()
      }
    },
    $route() {
      if (!this.$route.params.nodeId) return
      this.paginationConfig.params.nodeId = this.$route.params.nodeId
    }
  },

  mounted() {
    this.reload()
  },

  methods: {
    setParams() {
      var params = Object.assign({
        nodeId: this.$route.params.nodeId
      }, this.params || {})

      this.$set(this.paginationConfig, 'params', params)
    },
    refresh() {
      this.$refs.listRef.reload()
    },
    reload() {
      this.setParams()
      this.refresh()
    },
    formatHandler(list) {
      if (!list || !list.length) {
        return []
      }


      var maps = {}
      var presentablesIdMap = {}
      const promises = []

      list.forEach((item, index) => {
        let contract = this.getPresentableContract(item)

        maps[item.resourceId] = index
        presentablesIdMap[item.presentableId] = item
        item.releaseInfo.postImgUrl = this.resolvePostImgUrl(item.releaseInfo)
        this.resolvePresentable(item)
      })

      const presentableIds = Object.keys(presentablesIdMap)
      if(presentableIds) {
        const p = this.fetchPresentablesContractState(presentableIds)
          .then(data => {
            data.forEach(item => {
              const { authResult, presentableId } = item
              const presentable = presentablesIdMap[presentableId]
              presentable.isContractActived = !!authResult.isAuth
            })
          })
        promises.push(p)
      }
      Promise.all(promises)
        .then(() => {
          this.fillWarningTips(list)
        })

      return list
    },
    fillWarningTips(presentables) {
      const contractTips = {
        'no': '已签约合同未全部激活',
        'yes': '全部激活'
      }
      const policyTips = {
        'no': '没有可用策略',
        'yes': '已有策略'
      }

      console.log(JSON.parse(JSON.stringify(presentables)))
      presentables.forEach(presentable => {
        let warningTips = []

        if (presentable.policies.length) {
          var isHasPolicy = presentable.policies.some(policy => policy.status === 1)
          if (!isHasPolicy) {
            warningTips.push(policyTips.no)
          }
        } else {
          warningTips.push(policyTips.no)
        }

        if (presentable.hasContract && !presentable.isContractActived) {
          warningTips.push(contractTips.no)
        }

        if (warningTips.length) {
          this.$set(presentable, 'warningTip', warningTips.join(','))
        }
      })
    },
    //查询presentable合同激活情况
    fetchPresentablesContractState(presentableIds) {
      return this.$axios.get(`/v1/auths/presentables/batchNodeAndReleaseSideAuth`, {
        params: {
          presentableIds: presentableIds.join(','),
        }
      }).then(res => {
        const {ret, errcode, msg, data} = res.data
        if (ret === 0 && errcode === 0) {
          return data
        } else {
          this.$error.showErrorMessage(msg)
        }
      })
    },
    resolvePresentable(item) {
      item.isOnlineChecked = !!item.isOnline
      item._statusInfo = PRESENTABLE_STATUS_TIPS[item.status]
      item.isReady = (item.status & 7) === 7
      if(item.resolveReleases) {
        item.hasContract = item.resolveReleases.length > 0
      }
      item.detailLink = `/node/${this.$route.params.nodeId}/presentable/${item.presentableId}`
    },
    getSelectedPolicy(scheme, contract) {
      for (let i = 0; i < scheme.policy.length; i += 1) {
        const policy = scheme.policy[i]
        if (policy.segmentId === contract.policySegmentId) {
          return policy
        }
      }
    },
    getPresentableContract(presentableInfo) {
      const { resolveReleases = [], releaseInfo } = presentableInfo
      const leng = resolveReleases.length
      for(let i = 0; i < leng; i++) {
        if(resolveReleases[i].releaseId === releaseInfo.releaseId) {
          let { contracts = [] } = resolveReleases[i]
          return contracts.length ? contracts[0] : null
        }
      }
      return null
    },
    resolvePostImgUrl(release) {
      return release.postImgUrl || ''
    },
  }
}
</script>


<style lang="less" scoped>
  @import "../../../styles/mixin";

  .node-presentable-row {
    .dot {
      margin-right: 5px;
    }

    img {
      width: 80px;
      height: 60px;
      display: inline-block;
    }

    .contract-state-info {
      display: flex;
      align-items: center;
      width: 100%;
      .scheme-state {
        display: inline-block;
        width: 95%;
        i {
          color: #EA7171;
          font-size: 20px;
          vertical-align: middle;
        }
      }
      .scheme-info {
        .text-ellipsis;
        font-size: 12px;
      }
    }

    .resource-name {
      .text-ellipsis;
      width: 100%;
    }

    .resource-type {
      background-color: #F1F1F1;
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 14px;
      color: #666666;
      max-width: 110px;
      display: inline-block;
      .text-ellipsis;
      &.is-page_build {
        color: #E89D1F;
        background-color: rgba(249, 191, 93, .2);
      }
    }

    .presentable-nav-links {
      span {
        color: #D8D8D8;
        padding: 0 6px;
      }

      .nav-link-btn {
        position: relative;
      }

      .dot {
        position: absolute;
        top: 0;
        right: -11px;
        &:after {
          border-width: 4px;
          width: 0;
          height: 0;
        }
      }
    }
  }
</style>
