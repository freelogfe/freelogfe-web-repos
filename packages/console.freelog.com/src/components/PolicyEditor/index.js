import {highlightPolicy, compilePolicy} from '@freelog/freelog-policy-lang'

import PolicyTemplateSelector from './tool/policyTpl.vue'
import QueryPolicyLicense from './tool/queryLicense.vue'

export default {
  name: 'policy-editor',
  props: {
    policy: {
      type: Object,
      default: () => {}
    },
    policyList: {
      type: Array, 
      default: () => []
    },
    showValidate: {
      type: Boolean,
      default: () => true
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
  components: {PolicyTemplateSelector, QueryPolicyLicense},
  data() {
    return {
      showCustomPolicyTplDialog: false,
      currentTool: '',
      mode: 'edit',
      policyForm: {
        policyName: '',
        policyText: ''
      },
      isValidPolicyName: false,
      policyNameRules: [
        { required: true, message: '授权策略名称不能为空' },
        { max: 30, message: '授权策略名称不能超过30字符' },
        { validator: (rule, value, callback) => {
            const policyNames = this.policyList.map(p => p.policyName.replace(/^(\s*)|(\s*)$/g, ''))
            if (value && policyNames.indexOf(value) !== -1) {
              callback(new Error('该授权策略名称在当前资源的中已存在'))
            } else {
              callback()
            }
          } 
        }
      ],
    }
  },
  computed: {
    disabledPolicy() {
      return this.policy.status === 0
    }
  },
  watch: {
    policy() {
      this.policyForm.policyName = this.policy.policyName
      this.resolvePolicy(this.policy)
    },
    'policyForm.policyName': function () {
      this.$refs['policyForm'].validateField('policyName', (str) => {
        this.isValidPolicyName = str === ''
      })
    },
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
        this.policyForm.policyName = data.data.name
        this.$emit('input', this.policyText)
      }
    },
    selectPolicyTemplateCallback(data) {
      this.policy.policyText = data.template
      this.policy.policyName = data.name
    },
    selectLicenseIdCallback(data) {
      this.policy.policyText += ` ${data.licenseId}`
    },
    changePolicyText(policy) {
      if (this.autoSave) {
        this.savePolicyHandler()
      }
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
      this.$refs['policyForm'].validateField('policyName', (str) => {
        this.isValidPolicyName = str === ''
      })
      if (this.policy.policySegmentId) {
        this.policy.policyName = this.policyForm.policyName
        this.$emit('save', this.policy)
      }
    },
    cancelPolicyHandler() {
      this.policy.policyName = this.policyForm.policyName
      this.$emit('cancel', this.policy)
    },
    savePolicyHandler() {
      this.policy.policyName = this.policyForm.policyName
      this.$emit('save', this.policy)
    }
  }
}
