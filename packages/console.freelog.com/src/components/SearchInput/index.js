export default {
  name: 'freelog-search-input',
  data() {
    return {
      input: '',
      showInput: false
    }
  },
  props: {
    width: {
      type: String,
      default() {
        return '300px'
      }
    }
  },
  mounted() {
  },
  methods: {
    showInputHandler() {
      this.showInput = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    hideInputHandler() {
      this.showInput = false
    },
    searchHandler() {
      this.showInput = true
      this.$emit('search', this.input)
    }
  }
}
