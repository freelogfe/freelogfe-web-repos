<template>
  <div class="f-toast" v-if="visible">
    <div class="msg">{{msg}}</div>
    <div class="duration">({{tDuration}}秒后跳转...)</div>
  </div>
</template>

<script>
export default {
  name: 'f-toast',

  data() {
    return {
      msg: '',
      visible: false,
      timer: null,
      duration: 0,
      tDuration: 0,
      afterCountDown: null
    }
  },

  methods: {
    countDown() {
      this.timer = setTimeout(() => {
        this.tDuration = this.tDuration - 1
        if(this.tDuration > 0) {
          this.countDown()
        }else {
          this.visible = false
          if(typeof this.afterCountDown === 'function') {
            this.afterCountDown()
          }
        }
      }, 1000)
    },
    clearTimer() {
      clearTimeout(this.timer)
    }
  },

  mounted() {
    this.tDuration = this.duration
    this.countDown()
  },

  destroyed() {
    this.clearTimer()
  },
}
</script>

<style lang="less" scoped>
  .f-toast {
    position: fixed; top: 50%; left: 50%; z-index: 100;
    padding: 12px 20px; border-radius: 6px;
    background-color: rgba(0, 0, 0, .6); color: #fff; text-align: center;
    transform: translate(-50%, -50%);

    .msg { font-size: 18px; }
    .duration {
      font-size: 12px; color: #d6d6d6;
    }
  }
</style>

