/*
policy更新后，后续签订的policy按新的来，已签约过的按更新前的
 */

import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

import {mapGetters} from 'vuex'
import {loadDetail} from '@/data/resource/loader'
import {onloadNodeList} from '@/data/node/loader'
import {cssSupports} from '@/lib/utils'
import ResourceSchemes from './schemes.vue'

export default {
  name: 'resource-detail',
  data() {
    return {
      resourceId: this.$route.params.resourceId,
      activeTab: 'resIntro',
      resourceDetail: {
        resourceInfo: {
          status: 2
        },
        isFavor: false
      },
      showOptionsDialog: false,
      selectedNode: '',
      nodes: [],
      activeScheme: ''
    }
  },

  computed: Object.assign({
    tabs(){
      return [{
        name: 'resIntro',
        title: this.$t('resourceDetailView.tabs[0]')
      }, {
        name: 'resSchemes',
        title: this.$t('resourceDetailView.tabs[1]')
      }, {
        name: 'resDesc',
        title: this.$t('resourceDetailView.tabs[2]')
      }, {
        name: 'resMeta',
        title: this.$t('resourceDetailView.tabs[3]')
      }]
    },
    isOwnerResource() {
      return this.resourceDetail.resourceInfo.isOwner && process.env.NODE_ENV === 'development'
    },
    avatarUrl() {
      const userId = this.resourceDetail.resourceInfo.userId
      return userId ? `https://image.freelog.com/headImage/${userId}?x-oss-process=style/head-image` : ''
    }
  }, mapGetters({
    session: 'session'
  })),
  components: {
    ResourceSchemes
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollFn)
  },
  methods: {
    init() {
      loadDetail(this.resourceId).then((res) => {
        if (this.session && this.session.user) {
          res.isOwner = (res.userId === this.session.user.userId)
        } else {
          res.isOwner = false
        }
        this.resourceDetail.resourceInfo = res
      }).catch((err) => {
        this.$router.push('/')
        console.error(err)
      })

      this.isFavorResource().then((isFavor) => {
        this.resourceDetail.isFavor = isFavor
      }).catch((err) => {
        console.warn(err)
      })

      this.initScrollEvent()
    },
    initScrollEvent() {
      const $header = document.querySelector('.nav-header')
      const $tabs = this.$refs.tabs
      const $upBtn = this.$refs.upBtn
      const $body = this.$refs.detailBody
      const marginTop = $header.getBoundingClientRect().height
      const originLeft = $tabs.getBoundingClientRect().left
      const tabLeft = getComputedStyle($tabs).left
      let prevTop
      let st = +new Date()
      let fixed = false

      this.scrollFn = () => {
        // throttle
        const et = +new Date()
        if (et - st < 20) return
        st = et

        const rect = $body.getBoundingClientRect()
        if (rect.top <= marginTop && !fixed) {
          fixed = true
          $tabs.style.left = `${originLeft}px`
          $tabs.classList.add('sticky-tabs')
        } else if (rect.top >= marginTop && fixed) {
          fixed = false
          $tabs.style.left = tabLeft || `-130px`
          $tabs.classList.remove('sticky-tabs')
        }
        $upBtn.classList[(rect.top <= prevTop) ? 'add' : 'remove']('show')
        prevTop = rect.top
      }
      window.addEventListener('scroll', this.scrollFn)
    },
    isFavorResource() {
      return this.$services.collections.get(this.resourceId).then((res) => {
        if (res.data.errcode === 0) {
          return !!res.data.data
        }
        throw new Error(res)
      })
    },
    previewHandler() {
      this.$message.warning('todo')
    },
    favorResource() {
      return this.$services.collections.post({
        resourceId: this.resourceId
      }).then((res) => {
        if (res.data.errcode === 0) {
          this.$message.success(this.$t('resourceDetailView.favorSuccessText'))
          this.resourceDetail.isFavor = true
        } else {
          this.$error.showErrorMessage(res)
        }
      })
    },
    deleteFavorResource() {
      return this.$services.collections.delete(this.resourceId).then((res) => {
        if (res.data.errcode === 0) {
          this.$message.success(this.$t('resourceDetailView.deleteFavorSuccessText'))
          this.resourceDetail.isFavor = false
        } else {
          this.$error.showErrorMessage(res)
        }
      })
    },
    formatMeta(){
      var meta = this.resourceDetail.resourceInfo.meta || {}
      return Object.keys(meta).length ? JSON.stringify(meta, null, 4) : this.$t('resourceDetailView.noMetaTip')
    },
    favorHandler() {
      if (this.favoring) {
        return
      }

      this.favoring = true
      let callback
      if (!this.resourceDetail.isFavor) {
        callback = this.favorResource()
      } else {
        callback = this.deleteFavorResource()
      }

      callback.then(() => {
        this.favoring = false
      }).catch((err) => {
        this.favoring = false
        this.$error.showErrorMessage(err)
      })
    },
    loadNodes() {
      if (this.nodes.length) {
        return Promise.resolve(this.nodes)
      }

      return Promise.all([this.loadResourceOwners(), onloadNodeList()]).then((res) => {
        const resourceOwners = res[0]
        const nodeList = res[1].dataList || []
        const ownersMap = {}
        resourceOwners.forEach((item) => {
          ownersMap[item.nodeId] = item
        })

        nodeList.map((node) => {
          node.checked = !!ownersMap[node.nodeId]
          if (node.checked) {
            node._presentable = ownersMap[node.nodeId]
            node.selected = true
          }
          return node
        })

        return nodeList
      })
    },
    loadResourceOwners() {
      return this.$axios.get('/v1/presentables/resourceSubordinateNodes', {
        params: {
          resourceId: this.resourceId
        }
      }).then(res => res.getData())
    },
    showNodeOptions() {
      return new Promise((resolve, reject) => {
        this.loadNodes().then((nodes) => {
          this.nodes = nodes
          this.showOptionsDialog = true
          resolve(nodes)
        }).catch(reject)
      })
    },
    getResourceAuthHandler() {
      this.showNodeOptions().catch(this.$error.showErrorMessage)
    },
    hideOptionsDialogHandler() {
      this.showOptionsDialog = false
    },
    confirmAuthHandler() {
      this.hideOptionsDialogHandler()
      const selectedNodes = []
      this.nodes.forEach((node) => {
        if (node.checked && !node._presentable) {
          selectedNodes.push(node.nodeId)
        }
      })

      if (selectedNodes.length) {
        const promises = selectedNodes.map(nodeId => this.createPresentable(nodeId))

        Promise.all(promises).then(() => {
          this.$message.success(this.$18n.t('resourceDetailView.addPresentableSuccessText'))
        }).catch(this.$error.showErrorMessage)
      }
    },
    createPresentable(nodeId) {
      const resourceInfo = this.resourceDetail.resourceInfo
      return this.$services.presentables.post({
        nodeId,
        presentableName: resourceInfo.resourceName,
        resourceId: resourceInfo.resourceId
      }).then((res) => {
        if (res.data.errcode !== 0) {
          return Promise.reject(res.data.msg)
        }
        return res.getData()
      })
    },
    nodeOptCheckHandler(node) {
      node.checked = !node.checked
      this.$forceUpdate()
    },
    scrollInto(target) {
      const $el = this.$refs[target]

      if (!$el) {
        return console.error(`not found target ${target}`)
      }

      this.activeTab = target
      if (typeof $el.scrollIntoView === 'function') {
        $el.scrollIntoView(true)
        window.scrollBy(0, -120) // 填补fixed占位的高度
      } else {
        window.scrollTo(0, $el.offsetTop - 60)
      }
    }
  }
}
