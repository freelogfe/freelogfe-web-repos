import en from '../../../../../freelog-i18n/ui-contract/en';
import zhCN from '../../../../../freelog-i18n/ui-contract/zh-CN';

export default {
  name: 'license-event',
  i18n: {
    messages: {
      en,
      'zh-CN': zhCN,
    }
  },
  props: ['contractDetail', 'params'],
  data() {
    return {
      accepted: false,
      licenses: []
    }
  },
  computed: {
    formLabelWidth() {
      return this.$i18n.locale === 'zh-CN' ? '90px' : '140px'
    },
  },
  methods: {
    loadLicenses() {
      const promises = this.params.licenseIds.map(rid => this.loadLicenseContent(rid))

      Promise.all(promises).then((list) => {
        this.licenses = list
      }).catch(this.$error.showErrorMessage)
    },
    loadLicenseContent(resourceId) {
      return this.$axios.get(`/v1/auths/resource/${resourceId}.data`)
        .then((res) => {
          if(typeof res.data.errcode !== 'undefined' && res.data.errcode === 15) {
            this.$message.warning(this.$i18n.t('license.msgs[0]'))
            return
          }
          return res.data
        })
    },
    signHandler() {
      this.$axios.post('/v1/contracts/events/signingLicenses', {
        contractId: this.contractDetail.contractId,
        eventId: this.params.eventId,
        licenseIds: this.params.licenseIds
      }).then((res) => {
        if (res.data.errcode === 0) {
          this.doneHandler(true)
          this.$message.success(this.$i18n.t('license.msgs[1]'))
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    doneHandler(shouldUpdate, data = {}) {
      this.$emit('close', { shouldUpdate, data })
    }
  },
  mounted() {
    this.loadLicenses()
  }
}
