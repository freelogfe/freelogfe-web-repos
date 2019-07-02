import FreelogSwitch from '@/components/Switch/index.vue'
import {RESOURCE_TYPES} from '@/config/resource'
import PageBuild from './page-build.vue'
import PresentableList from './list.vue'
import SearchResource from '../../resource/search/index.vue'

export default {
  name: 'presentables',
  data() {
    return {
      params: {
        isOnline: 2
      },
      showSearchResource: false,
      isEntering: false,
      searchData: {
        keywords: '',
        isSignContract: '',
        isOnline: 2,
        resourceType: ''
      },
      resourceTypeOptions: Object.keys(RESOURCE_TYPES).map(type => {
        return {
          value: RESOURCE_TYPES[type],
          label: type
        }
      })
    }
  },
  components: {
    FreelogSwitch,
    SearchResource,
    PageBuild,
    PresentableList
  },

  computed: {
    contractStateOptions() {
      return [
        {
          value: '0',
          label: this.$t('presentable.unsignedText')
        },
        {
          value: '1',
          label: this.$t('presentable.signedText')
        }
      ]
    },
    onlineStateOptions() {
      return [
        {
          value: '0',
          label: this.$t('presentable.offlineText')
        },
        {
          value: '1',
          label: this.$t('presentable.onlineText')
        }
      ]
    },
  },

  watch: {},

  mounted() {

  },
  methods: {
    searchHandler(params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          this.params[key] = params[key]
        } else {
          delete this.params[key]
        }
      })

      Object.assign(this.searchData, this.params)
      this.$refs.presentableList.reload()
    },
    changePresentableOnlineHandler(presentable) {
      if (presentable.status & 3 !== 3) {
        return this.$error.showErrorMessage(this.$t('presentable.contractStateError'))
      }

      if (presentable.isLoading) return

      if (RESOURCE_TYPES.pageBuild === presentable.resourceInfo.resourceType) {
        this.isHadPageBuild().then(is => {
          if (is) {
            let text = presentable.isOnline ?
              this.$t('presentable.confirmOffline', {presentableName: presentable.presentableName}) :
              this.$t('presentable.confirmOnline', {presentableName: presentable.presentableName})
            this.$confirm(text)
              .then(() => {
                return this.changePageBuild(presentable)
              })
              .catch(() => {
              })
          } else {
            return this.changePageBuild(presentable)
          }
        })
      } else {
        this.presentableOnlineOrOffline(presentable)
      }
    },
    changePageBuild(presentable) {
      return this.presentableOnlineOrOffline(presentable)
        .then(() => {
          this.$refs.pagebuildRef.refresh()
          this.$refs.presentableList.refresh()
        })
    },
    isHadPageBuild() {
      return this.$store.dispatch('loadNodeDetail', this.$route.params.nodeId)
        .then(nodeInfo => {
          return !!nodeInfo.pageBuildId
        })
    },
    changePresentableStatus(presentable) {
      presentable.isLoading = true
      const url = `/v1/auths/presentables/${presentable.presentableId}/presentableTreeAuthTest`
      return this.$axios.get(url)
        .then(res => {
          const {errcode, ret, msg, data} = res.data
          if (errcode !== 0 || ret !== 0 || data.isAuth === false) {
            presentable.isLoading = false
            return Promise.reject(data.isAuth === false ? this.$t('presentable.unAuthError') : msg)
          }

          if (presentable.isOnlineChecked) {
            presentable.isOnline = 1
          } else {
            presentable.isOnline = 0
          }
          return this.$axios.put(`/v1/presentables/${presentable.presentableId}/onlineOrOffline`, {
            isOnline: presentable.isOnline
          }).then((res) => {
            presentable.isLoading = false
            if (!(res.data.errcode === 0 && res.data.errcode === 0)) {
              return Promise.reject(res.data.msg || this.$t('presentable.updateFailTip'))
            }
          })
        })
        .catch((err) => {
          presentable.isLoading = false
          presentable.isOnlineChecked = !presentable.isOnlineChecked
          presentable.isOnline = presentable.isOnlineChecked ? 1 : 0
          this.$error.showErrorMessage(err)
        })
    },
    presentableOnlineOrOffline(presentable) {
      presentable.isLoading = true
      presentable.isOnline = presentable.isOnlineChecked ? 0 : 1
      return this.$axios.put(`/v1/presentables/${presentable.presentableId}/onlineOrOffline`, {
        isOnline: presentable.isOnline
      })
        .then((res) => {
          presentable.isLoading = false
          if (!(res.data.errcode === 0 && res.data.errcode === 0)) {
            return Promise.reject(res.data.msg || this.$t('presentable.updateFailTip'))
          } else {
            presentable.isOnlineChecked = !!presentable.isOnline
          }
        })
        .catch((err) => {
          presentable.isLoading = false
          presentable.isOnline = presentable.isOnlineChecked ? 1 : 0
          this.$error.showErrorMessage(err)
        })
    },
    showSearchResourceHandler() {
      this.showSearchResource = true
    },
    beforeCloseDialogHandler() {
      this.showSearchResource = false
    },
    addResourceHandler(resource) {
      this.createPresentable({
        nodeId: this.$route.params.nodeId,
        presentableName: resource.resourceName,
        resourceId: resource.resourceId
      }).then((presentable) => {
        this.refresh()
        this.showSearchResource = false
      }).catch(this.$error.showErrorMessage)
    },
    createPresentable(data) {
      return this.$services.presentables.post(data).then((res) => {
        if (res.data.errcode !== 0) {
          return Promise.reject(res.data.msg)
        }
        return res.getData()
      })
    },
    deletePresentableHandler(presentable) {
      this.$confirm(this.$t('presentable.deletePresentableText', {presentableName: presentable.presentableName}))
        .then(() => {
          this.$services.presentables.delete(presentable.presentableId)
            .then(({data}) => {
              var {ret, errcode, msg} = data
              if (ret === 0 && errcode === 0 && data.data) {
                this.$message.success(this.$t('presentable.deleteSuccessTip'))
                this.refresh()
              } else {
                this.$message.fail(msg)
              }
            })
        }).catch(() => {
      })
    },
    refresh() {
      this.$refs.presentableList.refresh()
    },
    showSeachInputHandler(flag) {
      this.isEntering = (flag === undefined) ? !this.isEntering : flag
    }
  }
}
