import { compilePolicy, beautifyPolicy } from '@freelog/freelog-policy-lang'


import rules from '../rules'

export default {
  name: 'policy-tpl-creator',
  data() {
    const type = this.$route.meta.type
    return {
      type,
      data: {
        name: '',
        template: '',
        templateType: (type === 'node') ? 2 : 1
      },
      rules
    }
  },

  mounted() {

  },
  methods: {
    createPolicyTpl(data) {
      return this.$services.policyTemplate.post(data)
        .then((res) => {
          const resData = res.data
          if (resData.errcode === 0) {
            this.$message.success(this.$t('common.createSuccessTip'))
            this.$router.push({ path: `/${this.type}/policy_tpl/detail`, query: { id: resData.data.id } })
          } else {
            this.$error.showErrorMessage(res)
          }
        })
        .catch(this.$error.showErrorMessage)
    },
    validatePolicy() {
      const tpl = this.data.template
      const ret = compilePolicy(tpl)

      if (ret.errorMsg) {
        this.$message.error(ret.errorMsg)
        return false
      }
      this.data.template = beautifyPolicy(tpl)
      this.$message.success(this.$t('policy.checked'))
      return true
    },
    submitHandler() {
      const data = Object.assign({}, this.data)

      if (this.validatePolicy()) {
        data.template = btoa(data.template)
        this.createPolicyTpl(data)
      }
    }
  }
}
