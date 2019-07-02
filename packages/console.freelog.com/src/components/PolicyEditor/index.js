import {highlightPolicy, compilePolicy} from '@freelog/freelog-policy-lang'

import PolicyTemplateSelector from './tool/policyTpl.vue'
import QueryPolicyLicense from './tool/queryLicense.vue'

export default {
  name: 'policy-editor',
  data() {
    return {
      showCustomPolicyTplDialog: false,
      currentTool: '',
      mode: 'edit'
    }
  },
  props: {
    policy: {
      type: Object,
      default() {
        return {}
      }
    },

    showValidate: {
      type: Boolean,
      default() {
        return true
      }
    },
    autoSave: {
      type: Boolean,
      default: false
    },
    showFooterBtns: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    disabledPolicy() {
      return this.policy.status === 0
    }
  },

  components: {PolicyTemplateSelector, QueryPolicyLicense},
  watch: {
    policy() {
      this.resolvePolicy(this.policy)
    }
  },
  mounted() {
    this.resolvePolicy(this.policy)
  },
  methods: {
    resolvePolicy(policy) {
      if (policy.policyId) {
        this.mode = 'preview'
        let policyText = policy.policyText
        const ret = compilePolicy(policyText)

        if (!ret.errorMsg) {
          policyText = highlightPolicy(policyText)
        }
        Object.assign(this.policy, {
          policyName: policy.policyName || '',
          policyText,
          policySegmentId: policy.policyId,
          disabled: policy.status === 0
        })
      }
    },
    validate() {
      const ret = compilePolicy(this.policyText)
      if (!ret.errorMsg) {
        this.policyText = highlightPolicy(this.policyText)
        this.$emit('input', this.policyText)
        this.$emit('validate', {done: true})
      } else {
        this.$emit('validate', {
          done: false,
          error: {
            message: ret.errorMsg
          }
        })
        this.$message.error(ret.errorMsg) // 外层控制??
      }
    },
    showToolHandler(toolName) {
      this.currentTool = toolName
      this.showCustomPolicyTplDialog = true
    },
    operationCallback(data) {
      this.showCustomPolicyTplDialog = false

      if (data && data.name) {
        const name = `${data.name}Callback`
        if (typeof this[name] === 'function') {
          this[name](data.data)
        }

        this.$emit('input', this.policyText)
      }
    },
    selectPolicyTemplateCallback(data) {
      this.policy.policyText = data.template
    },
    selectLicenseIdCallback(data) {
      this.policy.policyText += ` ${data.licenseId}`
    },
    changePolicyText(policy) {
      if (this.autoSave) {
        this.savePolicyHandler()
      }
      // to validate
    },
    switchPolicyStatusHandler() {
      var policy = this.policy
      if (policy.policySegmentId) {
        this.$confirm(this.$t('components.policyEditor.switchTip', {
          statusText: policy.disabled ? '上' : '下',
          policyName: policy.policyName
        }))
          .then(() => {
            policy.disabled = !this.disabledPolicy
            this.$emit('save', this.policy)
          }).catch(() => {
        })
      }
    },
    changePolicyNameHandler() {
      if (this.policy.policySegmentId) {
        this.$emit('save', this.policy)
      }
    },
    cancelPolicyHandler() {
      this.$emit('cancel', this.policy)
    },
    savePolicyHandler() {
      this.$emit('save', this.policy)
    }
  }
}
