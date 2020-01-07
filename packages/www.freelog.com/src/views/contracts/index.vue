<template>
  <div class="my-contracts-wrap">
    <div class="my-contracts-tabs-bar">
      <div class="tabs-bar">
        <div class="tab-item" :class="{ 'active': identityType === 2 }" @click="identityType = 2">被授权合约</div>
        <div class="tab-item" :class="{ 'active': identityType === 1 }" @click="identityType = 1">授权合约</div>
      </div>
      <el-input class="search-input" size="medium" ref="input" v-model="searchInputStr" 
            :placeholder="'合约ID / 合约名称'"
						:class="{ 'focus': isInputFocus }"
						:style="{width: '400px'}"
						@focus="focusHandler"
						@blur="blurHandler"
						@keyup.enter.native="searchHandler(searchInputStr)">
						<i class="freelog fl-icon-content" :slot="isInputFocus ? 'suffix' : 'prefix'" @click="searchHandler(searchInputStr)"></i>
					</el-input>
    </div>
    <fl-pagination class="my-contracts-list"
                   v-if="isReady"
                   :config="tableConfig"
                   :formatHandler="formatContractList"
                   :pagination="paginationConfig">
      <template slot="list">
        <el-table-column :label="$t(`contracts.tableColumn[0]`)" min-width="230">
          <template slot-scope="scope">
            <p class="contract-name">{{ scope.row.contractName }}</p>
            <p class="contract-id">
              <span>合同ID</span>
              <span>{{scope.row.contractId}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`contracts.tableColumn[1]`)" min-width="180">
          <template slot-scope="scope">
            <contract-part :contract="scope.row" partyType="partyTwo"></contract-part>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`contracts.tableColumn[2]`)" min-width="180">
          <template slot-scope="scope">
            <contract-part :contract="scope.row" partyType="partyOne"></contract-part>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`contracts.tableColumn[3]`)" min-width="120">
          <template slot-scope="scope">
            <span class="contract-status" :class="['status-'+scope.row.status]">{{ resolveStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`contracts.tableColumn[4]`)" min-width="145">
          <template slot-scope="scope">
            <p>{{scope.row.createDate | fmtDate('yyyy.MM.dd')}}</p>
            <p class="item-updateDate">
              <span>更新时间</span>
              <span>{{scope.row.updateDate | fmtDate('yyyy.MM.dd')}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t(`contracts.tableColumn[5]`)" width="80">
          <template slot-scope="scope">
            <el-button round size="mini" class="view-btn" @click="viewContractDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </fl-pagination>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import FlPagination from '@/components/Pagination/index.vue'
import ContractPart from './part.vue'

export default {
  name: 'my-contracts',
  data() {
    const identityType = 2
    return {
      identityType,
      searchForm: {
        type: 'resource',
        input: ''
      },
      searchTypes: [{
        value: 'node',
      }, {
        value: 'resource',
      }, {
        value: 'resourceType',
      }],
      isReady: false,
      isInputFocus: false,
			searchInputStr: '',
      tableConfig: {
        rowClassName: 'contract-row',
        'cell-class-name': 'res-row-cell'
      },
      paginationConfig: {
        target: 'v1/myContracts/list',
        params: {
          identityType,
          keywords: undefined
        }
      }
    }
  },

  components: {
    FlPagination, ContractPart
  },

  computed: {
    ...mapGetters({
      user: 'session'
    })
  },

  created() {
    
  },

  mounted() {
    this.$store.dispatch('getCurrentUserInfo').then((user) => {
      if (user && user.userId) {
        // this.paginationConfig.params.partyTwo = user.userId
        this.isReady = true
      }
    })
  },

  watch: {
    identityType() {
      this.paginationConfig.params.identityType = this.identityType
    }
  },

  methods: {
		focusHandler() {
			this.isInputFocus = true
		},
		blurHandler() {
			this.isInputFocus = false
		},
    viewContractDetail (row) {
      const { contractId } = row

      this.$router.push({
        path: '/user/contracts/detail/',
        query: {
          contractId
        }
      })
    },
    formatNodeDomain(nodeInfo) {
      if (nodeInfo && nodeInfo.nodeDomain) {
        return `${nodeInfo.nodeDomain}.${window.FreelogApp.Env.mainDomain}`
      } else {
        return ''
      }
    },
    resolveStatus(status) {
      let text
      switch (status) {
        case 1:
          text = '待执行'
          break
        case 2:
          text = '待执行'
          break
        case 4:
          text = '授权正常'
          break
        case 3:
        case 5:
        case 6:
          text = '合同终止'
          break
        default:
          text = '未知状态'
      }

      return text
    },
    searchHandler(keywords) {
      keywords = keywords.replace(/^(\s*)|(\s*)$/g, '')
      const identityType = this.identityType
      if (keywords !== '') {
        this.paginationConfig.params.keywords = encodeURIComponent(keywords)
      } else {
        this.paginationConfig.params.keywords = undefined
      }
      this.$message.warning(`未开始设计${keywords}`)
    },
    formatContractList(list) {
      return list
    }
  }
}
</script>

<style lang="less">
  @import "index.less";
</style>
