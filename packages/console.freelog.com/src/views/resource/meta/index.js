import { codemirror, codeMirrorOptions } from '@/lib/codemirror'
import 'codemirror/mode/javascript/javascript'

const throttle = require('lodash/throttle')
require('codemirror/theme/idea.css')

export default {
  name: 'resource-meta-info',
  data() {
    const cmOpts = Object.assign({}, codeMirrorOptions)
    Object.assign(cmOpts, {
      mode: {
        name: 'javascript',
        json: true
      },
      viewportMargin: Infinity,
      theme: 'idea',
      lineNumbers: false,
      gutters: []
    })

    return {
      errorMsg: '',
      editorOptions: cmOpts,
      data: this.value
    }
  },
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    }
  },

  watch: {
    value() {
      this.data = this.value
    }
  },
  mounted() {

  },
  methods: {
    onCodeChange(val) {
      this.data = val

      if (!this.validator) {
        this.validator = throttle(() => {
          this.validateJSON()
        }, 2e3)
      } else {
        this.validator()
      }
      this.$emit('input', this.data)
    },
    validateJSON() {
      try {
        if (this.data) {
          JSON.parse(this.data)
        }
        this.clearErrorMsg()
      } catch (err) {
        this.errorMsg = `${this.$t('metaInput.metaJSONError')}！${err}`
      }

      this.$emit('validate', this.errorMsg)
    },
    clearErrorMsg() {
      this.errorMsg = ''
    }
  }
}
