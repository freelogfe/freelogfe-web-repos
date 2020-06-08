<template>
  <div>
    <contract-signing-dialog
        :activeIndex="activePresentableIndex"
        :visible.sync="isShowDialog"
        @close-dialog="hideAuthDialog"
        :presentableList="scAuthPresentableList"></contract-signing-dialog>
  </div>
</template>

<script>
function noop() {}
let authCallback = noop
import ContractSigningDialog from '@freelog/freelog-ui-contract/src/components/contract-signing/contract-signing-dialog.vue'
export default {
  name: 'freelog-auth-dialog',
  components: { ContractSigningDialog },
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      isShowDialog: false,
      scAuthPresentableList: [],
      activePresentableIndex: 0,
    }
  },
  watch: {
    dialogVisible() {
      this.isShowDialog = this.dialogVisible
    },
    isShowDialog() {
      this.$emit('update:dialogVisible', this.isShowDialog)
    }
  },
  mounted() {
    this.initEvent()
  },
  methods: {
    initEvent() {
      window.FreelogApp.on('SHOW_AUTH_DIALOG', this.showAuthDialog)
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
  },
}
</script>