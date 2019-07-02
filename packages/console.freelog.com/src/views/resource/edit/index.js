/*
policy更新后，后续签订的policy按新的来，已签约过的按更新前的
 */
import {mapGetters} from 'vuex'
import {onloadResourceDetail} from '@/data/resource/loader'
import ResourceInputs from '../input/index.vue'
import ResourceDetailIntro from './intro.vue'
import SchemesManager from './schemes-manager.vue'

export default {
  name: 'resource-detail-edit',
  data() {
    return {
      isDev: process.env.NODE_ENV === 'development',
      resourceDetail: {},
      viewMode: this.$route.query.view || 'preview'  //edit or preview
    }
  },
  computed: {
    ...mapGetters({
      session: 'session'
    }),
    actionUrl() {
      const origin = window.location.origin.replace('console', 'qi')
      return `${origin}/v1/resources/updateResourceContext/${this.resourceDetail.resourceId}`
    }
  },
  components: {
    ResourceInputs,
    ResourceDetailIntro,
    SchemesManager
  },
  mounted() {
    const params = this.$route.params
    if (params.resourceId) {
      onloadResourceDetail(params.resourceId)
        .then((data) => {
          if (data.userId !== this.session.user.userId) {
            this.$router.push('/')
          } else {
            this.resourceDetail = data
          }
        }).catch(this.$error.showErrorMessage)
    }
  },
  methods: {
    executeNext(callback) {
      if (this.isRequesting) return
      this.isRequesting = true
      if (this.$refs.inputArea.nextHandler) {
        this.$refs.inputArea.nextHandler().then((detail) => {
          if (detail) {
            Object.assign(this.resourceDetail, detail)
          }
          this.isRequesting = false
          callback()
        }).catch((err) => {
          this.isRequesting = false
          this.$nextTick(() => {
            const $error = this.$el.querySelector('.el-form-item__error')
            if ($error) {
              $error.parentElement.scrollIntoView()
              window.scrollBy(0, -80) // 填补fixed占位的高度
            } else {
              this.$error.showErrorMessage(err)
            }
          })
        })
      } else {
        this.isRequesting = false
        callback()
      }
    },
    updateResourceHandler() {
      this.executeNext(() => {
        this.$message.success(this.$t('resourceEditView.updateSuccess'))
        this.switchModeHandler()
      })
    },
    switchModeHandler(mode) {
      this.viewMode = mode ? mode : (this.viewMode === 'edit' ? 'preview' : 'edit')
      if (this.viewMode === 'preview') {
        window.scrollTo(0,0)
      }
    }
  }
}
