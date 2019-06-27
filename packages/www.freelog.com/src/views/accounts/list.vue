<template>
  <div class="account-list-manager-view">
    <account-layout :title="navTitle" :showFooter="false">
      <div class="account-list-wrap">
        <el-table
                :data="cardClips">
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span class="cell-title">{{$t('accounts.list.tableColumn[0]')}}</span>
              <el-button type="text" class="create-new-account-btn" @click="gotoAddAccountHandler"><i
                      class="el-icon-plus"></i></el-button>
            </template>
            <template slot-scope="{row}">
              <div class="cell-account-name">
                {{row.label}}<span class="split-line"> | </span>{{row.cardNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
                  :label="$t('accounts.list.tableColumn[1]')"
                  width="180">
            <template slot-scope="{row}">
              {{row.balance|humanizeCurrency(currencyInfo.abbr)}} {{currencyInfo.abbr}}
            </template>
          </el-table-column>
          <el-table-column
                  :label="$t('accounts.list.tableColumn[2]')"
                  v-if="currencyInfo.abbr=== 'feth'"
                  width="150">
            <template slot-scope="{row}">
              <el-button size="small" class="test-btn" :disabled="row._isGifted" :class="{done: row._isGifted}" @click="officialTapHandler(row)">
                {{row._isGifted ? $t('accounts.list.giftedStatus[1]') : $t('accounts.list.giftedStatus[0]')}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
                  width="100"
                  align="center"
                  :label="$t('accounts.list.tableColumn[3]')">
            <template slot-scope="{row}">
              <el-button type="text" @click="deleteAccountHandler(row)"><i class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </account-layout>
  </div>
</template>

<script>
import AccountTypes from '@/config/account-types'
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'account-list-manager-view',

  data() {
    return {
      amount: '',
      cardNo: '',
      cardClips: [],
      renderData: Object.assign(this.$route.params, this.$route.query)
    }
  },

  props: {},

  components: { AccountLayout },

  mounted() {
    this.loadCardclips()
      .then(this.loadAccountsBalance)
      .then((list) => {
        this.cardClips = list.map(this.resolveCard)
      })
  },

  computed: {
    navTitle() {
      let title
      if (this.currencyInfo.abbr === 'feth') {
        title = this.$i18n.t('accounts.addrName[0]')
      } else {
        title = `${this.currencyInfo.name} ${this.currencyInfo.extBindAddrName}`
      }
      return title + ' ' + this.$i18n.t('accounts.list.manageText')
    },
    currencyInfo() {
      const i = this.renderData.currencyType
      return this.$i18n.t(`accounts.currencyAccounts[${i}]`)
    }
  },

  methods: {
    gotoAddAccountHandler() {
      this.$router.push({
        path: '/user/accounts/add',
        query: {
          currencyType: this.renderData.currencyType,
          backPath: this.$route.fullPath
        }
      })
    },
    loadAccountBalance(account) {
      return this.$axios.get('/v1/pay/helper/feather/balance', {
        params: {
          address: account.cardNo
        }
      }).then((res) => {
        const {
          data, ret, errcode, msg
        } = res.data
        if (ret === 0 && errcode === 0) {
          account.balance = data.balance
        } else {
          console.error(msg)
          account.balance = 0
        }
        return account
      })
    },
    loadAccountsBalance(list) {
      const promises = list.map(this.loadAccountBalance)
      return Promise.all(promises)
    },
    officialTapHandler(account) {
      return this.$axios.post('/v1/pay/officialTap', {
        cardNo: account.cardNo,
        currencyType: account.currencyType
      }).then((res) => {
        const {
          ret, errcode, msg
        } = res.data
        if (this.isSuccess(res.data)) {
          account.balance = 100 * this.currencyInfo.unit
          account._isGifted = true
          this.$message.success(this.$i18n.t('accounts.list.giftedStatus[2]'))
        } else if (ret === 0 && errcode !== 0) {
          this.$message.error(msg)
          // account._isGifted = true
          // this.$message.info('已领取过啦！')
        } else {
          this.$message.error(msg)
        }
      })
    },
    deleteAccountHandler(account) {
      this.$confirm(this.$i18n.t('accounts.list.deleteConfirm'))
        .then(() => {
          this.$axios.delete(`/v1/pay/cardclips/${account.cardNo}`).then((res) => {
            if (this.isSuccess(res.data)) {
              this.$message.success(this.$i18n.t('accounts.list.deleteSuccess'))
              this.deleteAccountFromCards(account)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {

        })
    },
    deleteAccountFromCards(account) {
      const cards = this.cardClips
      for (let i = 0; i < cards.length; i += 1) {
        if (cards[i].cardNo === account.cardNo) {
          cards.splice(i, 1)
          break
        }
      }
    },
    resolveCard(card) {
      card.label = `${card.cardAlias || card.bankName}`
      card.value = card.cardNo
      card._isGifted = card.balance > 0
      return card
    },
    loadCardclips() {
      return this.$axios.get(`/v1/pay/cardclips?currencyType=${this.renderData.currencyType}`)
        .then((res) => {
          const { data } = res
          if (this.isSuccess(data)) {
            return data.data
          }
          return Promise.reject(data.msg)
        })
    },
    isSuccess(data) {
      return (data.ret === 0 && data.errcode === 0)
    },
  }
}
</script>

<style lang="less" scoped type="text/less">
  .account-list-manager-view {
    .split-line {
      color: #606266;
      font-size: 18px;
      vertical-align: middle;
      font-weight: normal;
    }
    .account-list-wrap {
      width: 95%;

      .cell-account-name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .create-new-account-btn {
      background-color: #4497EC;
      color: white;
      height: 20px;
      width: 20px;
      border-radius: 20px;
      border: 1px solid;
      line-height: 18px;
      padding: 0;
      margin-left: 5px;
      i {
        font-size: 12px;
        font-weight: bold;
      }
    }

    .test-btn {
      background-color: #F5A623;
      border-color: #F5A623;
      color: white;
      padding: 7px 0;
      width: 60px;
      &.done {
        background-color: #EFEFEF;
        border-color: #EFEFEF;
        color: #999999;
      }
    }
    .el-icon-delete {
      color: #EA7171;
      font-size: 20px;
    }
  }
</style>
