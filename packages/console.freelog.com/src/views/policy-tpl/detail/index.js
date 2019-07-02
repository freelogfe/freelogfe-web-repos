import { compilePolicy, beautifyPolicy } from '@freelog/freelog-policy-lang'

import PolicyTemplateDetailInfo from '@/components/detail-info/policyTemplate.vue'
import rules from '../rules'
import * as utils from '../utils'

const MODE = {
  VIEW: 'view',
  EDIT: 'edit'
}

export default {
  name: 'policy-tpl-detail',
  data() {
    return {
      mode: MODE.VIEW,
      detail: {},
      rules
    }
  },
  components: {
    PolicyTemplateDetailInfo
  },
  computed: {
    isEditMode() {
      return this.mode === MODE.EDIT
    }
  },
  mounted() {
    const query = this.$route.query
    if (query.id) {
      this.loadDetail(query.id)
        .then((data) => {
          this.detail = data
        })
    } else {
      this.$message.error('参数有误')
    }
  },
  methods: {
    loadDetail(id) {
      return this.$services.policyTemplate.get(id)
        .then(res => res.getData())
    },
    changeModeHandler() {
      const mode = this.mode
      if (mode === MODE.EDIT) {
        this.$refs.detailForm.validate((valid) => {
          if (!valid) {
            return
          }
          this.validatePolicy().then((err) => {
            if (err) {
              this.$message.error(err)
            } else {
              this.saveDetail()
              this.mode = MODE.VIEW
            }
          })
        })
      } else {
        this.mode = MODE.EDIT
      }
    },
    validatePolicy() {
      const promise = Promise.resolve()
      const tpl = this.detail.template
      const ret = compilePolicy(tpl)

      if (!ret.errorMsg) {
        this.detail.template = beautifyPolicy(tpl)
      }

      return promise.then(() => ret.errorMsg)
    },
    cancelEditMode() {
      this.mode = MODE.VIEW
    },
    saveDetail() {
      this.$services.policyTemplate.put(this.detail.id, {
        name: this.detail.name,
        template: btoa(this.detail.template)
      })
    },
    resolveType(type) {
      return utils.resolveType(type)
    },
    resolveStatus(status) {
      return utils.resolveStatus(status)
    }
  }
}
