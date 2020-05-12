<template>
  <div class="f-auth-box">
    <div class="f-auth-exception-head">
      <div class="f-auth-exception-img" :class="{ 'signed': authDefaultContract != null }"></div>
      <div class="f-auth-exception-msg">{{authDefaultContract == null ? '您与当前节点无授权关系，若继续浏览，需要选择下方策略与节点进行签约' : '您有待执行的合约，若继续浏览节点，请执行合约'}}</div>
    </div>
    <f-sign-policy-list 
      :policies="authPresentablePolicies" 
      :defaultContract="authDefaultContract"
      :contracts="contracts"
      :selectedPolicies.sync="selectedPolicies"
      @sign-a-contract="signAContract"></f-sign-policy-list>
    <contract-signing-dialog
        :activeIndex="activePresentableIndex"
        :visible.sync="isShowDialog"
        @close-dialog="hideAuthDialog"
        :presentableList="scAuthPresentableList"></contract-signing-dialog>
  </div>
</template>

<script>
import { GO_TO_LOGIN, SHOW_AUTH_DIALOG } from '../../../_core/events/pb-event-names'
import { checkLoginStatus } from '@freelog/freelog-ui-login/src/core'
import FSignPolicyList from './sign-policy-list.vue'
import ContractSigningDialog from '@freelog/freelog-ui-contract/src/components/contract-signing/contract-signing-dialog.vue'

const noop = function() {}
var authCallback = noop
export default {
  name: 'f-auth-box',
  props: {
    pbAuthErrorData: Object,
  },
  components: { 
    FSignPolicyList, 
    ContractSigningDialog,
  },
  data() {
    return {
      isShowDialog: false,
      scAuthPresentableList: [],
      activePresentableIndex: 0,
      isLogin: false,
      contracts: [],
      selectedPolicies: [],
    }
  },
  computed: {
    nodeId() {
      return window.__auth_info__.__auth_node_id__
    },
    userId() {
      return window.__auth_info__.__auth_user_id__
    },
    authPresentableInfo() {
      try {
        if (this.pbAuthErrorData == null) return null
        return this.pbAuthErrorData.data.presentableInfo
      } catch(e) {
        return null
      }
    },
    authPresentablePolicies() {
      return this.authPresentableInfo != null ? this.authPresentableInfo.policies : []
    },
    authDefaultContract() {
      try {
        if (this.pbAuthErrorData == null) return null
        return this.pbAuthErrorData.data.contract
      } catch(e) {
        return null
      }
    },
  },
  watch: {},
  async mounted() {
    window.FreelogApp.$loading.show()
    await this.init()
    window.FreelogApp.$loading.hide()
  },
  methods: {
    async init() {
      this.initEvents()
      const loginStatus = await checkLoginStatus()
      this.isLogin = loginStatus === 1
      if (loginStatus !== 1) {
        window.FreelogApp.trigger(GO_TO_LOGIN)
      }
      if (this.authDefaultContract != null) {
        this.fetchPBContracts()
          .then(contracts => {
            if (contracts && contracts.length > 0) {
              this.contracts = contracts
            }
          })
      }
    },
    initEvents() {
      if(window.FreelogApp.on) {
        window.FreelogApp
          .on(SHOW_AUTH_DIALOG, this.showAuthDialog)
      }
    },
    showAuthDialog({presentableList, activePresentableId, callback = noop}) {
      this.loadContractDialog = true
      if (typeof callback === 'function'){
        authCallback = callback
      }

      if (presentableList.length === 1) {
        activePresentableId = presentableList[0].presentableId
      }

      this.scAuthPresentableList = presentableList
      this.resolvePresentableActiveIndex(activePresentableId)
      this.isShowDialog = true
    },
    resolvePresentableActiveIndex(presentableId) {
      this.activePresentableIndex = 0
      if (typeof presentableId === 'string') {
        for (let i = 0; i < this.scAuthPresentableList.length; i += 1) {
          if (this.scAuthPresentableList[i].presentableId === presentableId) {
            this.activePresentableIndex = i
            break
          }
        }
      }
    },
    hideAuthDialog({ isUpdatedContract }) {
      this.isShowDialog = false
      if (isUpdatedContract) {
        this.refreshAuthPresentList()
          .then((data) => authCallback(data))
          .catch((e) => {
            this.$message.error(e)
            authCallback(null)
          })
      }
    },
    refreshAuthPresentList() {
      let nodeId = null
      const presentableIDs = this.scAuthPresentableList.map((p) => {
        nodeId = p.nodeId
        return p.presentableId
      })

      // 获取presentable授权详情
      return window.FreelogApp.QI.get(`/v1/presentables/auth.json?pids=${presentableIDs}&nodeId=${nodeId}`)
        .then(res => res.data)
        .then((res) => {
          if (res.errcode === 0) {
            return res.data
          }
          return Promise.reject(res.msg)
        })
    },
    hideAuthDialog({ isUpdatedContract }) {
      this.isShowDialog = false
      if (isUpdatedContract) {
        this.refreshAuthPresentList()
          .then((data) => authCallback(data))
          .catch((e) => {
            this.$message.error(e)
            authCallback(null)
          })
      }
    },
    handleAuthError() {
      if(!this.isLogin) {
        window.FreelogApp.trigger(GO_TO_LOGIN)
      }else {
        return new Promise((resolve) => {
          window.FreelogApp.trigger(HANDLE_INVALID_AUTH, { response: this.pbAuthErrorData }, (data) => {
            if(data) {
              resolve(data)
            }
          })
        })
          .then(data => {
            if (data._contractStatus === 3) {
              window.location.reload() // 后续考虑局部更新？
            }
          })
      }
    },
    fetchPBContracts() {
      return this.$axios.get('v1/contracts/list', {
				params: {
					contractType: 3,
					targetIds: this.authPresentableInfo.presentableId,
          partyOne: this.nodeId,
          partyTwo: this.userId,
				}
      })
      .then(res => res.data)
      .then(res => {
        if (res.errcode === 0) {
          return res.data
        } else {
          throw new Error(res.msg)
        }
      })
      .catch(e => this.$message.error(e.toString()))
    },
    signAContract(policy) {
      const { presentableId } = this.authPresentableInfo
      const { policyId } = policy
      const isDefault = 1
      
      this.$axios({
        url: '/v1/contracts',
        method: 'POST',
        data: { presentableId, policyId, isDefault }
      }).then(res => res.data)
        .then((res) => {
          if (res.errcode === 0) {
            this.$message.success({
              type: 'success',
              mes: '签约成功！',
              duration: 3e2
            })
            setTimeout(() => {
              window.location.reload()
            }, 3e2)
          } else {
            if (res.errcode === 30) {
              window.FreelogApp.trigger(GO_TO_LOGIN)
            }
            throw new Error(res.msg)
          }
        })
        .catch((e) => {
          const msg = this.$i18n.t('contractSigning.errors[0]')
          this.$message({
            type: 'error',
            showClose: true,
            message: msg + e
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>

.f-auth-box {
  width: 750px; margin: auto;
  .f-auth-exception-head {
    display: flex; justify-content: center; align-items: center;
    margin-bottom: 10px;
  }
  .f-auth-exception-img {
    width: 280px; height: 280px;
    background-image: url(../../../assets/images/Sign_a_contract.png); 
    background-size: 100% 100%; background-repeat: no-repeat;
    &.signed { background-image: url(../../../assets/images/Pending.png);  }
  }
  .f-auth-exception-msg {
    width: 290px; margin-left: 60px;
    font-size: 16px; color: #2C3643;
  }
}
.f-sign-btns-bar {
  margin-top: 30px; text-align: center;
  .el-button {
    width: 160px; height: 40px; line-height: 40px; padding: 0;
    background-color: #4291CD;
  }
}
</style>
