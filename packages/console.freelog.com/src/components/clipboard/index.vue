<template>
    <div @click="copyHandler">
        <textarea class="clip-text" :value="value" ref="copyText"></textarea>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'clip-board',
  data() {
    return {}
  },

  props: {
    value: String
  },
  mounted() {
  },
  methods: {
    copyHandler() {
      const copyTextarea = this.$refs.copyText
      copyTextarea.select()
      try {
        const successful = document.execCommand('copy')
        this.$emit('copyDone', successful)
      } catch (err) {
        this.$emit('copyDone', false)
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .clip-text {
        width: 0;
        height: 0;
        opacity: 0;
        font-size: 0;
    }
</style>
