export default {
  name: 'fl-switch',
  data() {
    return {}
  },
  props: {
    width: {
      type: String,
      default() {
        return '50px'
      }
    },
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    activeText: String,
    inactiveText: String,
    disabled: Boolean
  },

  mounted() {
  },
  computed: {
    checked() {
      return this.value
    }
  },
  methods: {
    switchHandler() {
      if (this.disabled) return
      // this.$emit('input', !this.value)
      this.$emit('change', !this.value)
    }
  }
}
