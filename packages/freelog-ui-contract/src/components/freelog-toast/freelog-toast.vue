<template>
  <transition name="toastfade">
    <div class="toast"  v-if="visible">
      <span>{{msg}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'freelog-toast',
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      msg: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        default: 2e3
      },
      isAutoHide: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        timer: null
      }
    },
    watch: {
      visible(newV, oldV) {
        if(newV) {
          this.showToast()
        }else {
          this.hideToast()
        }
      }
    },
    methods: {
      showToast(newV, oldV) {
        this.clear()
        this.visible = true
        if(this.isAutoHide) {
          this.timer = setTimeout(() => {
            this.visible = false
          }, this.duration)
        }
      },
      hideToast() {
        this.clear()
        this.visible = false
      },
      clear() {
        clearTimeout(this.timer)
      }
    },
    updated() {},
    destroyed() {
      this.clear()
    },
  }
</script>

<style lang="less" scoped type="text/less">
  .toastfade-enter-active {
    transition: all .3s ease;
  }

  .toastfade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .toastfade-enter, .toastfade-leave-to {
    opacity: 0;
  }
  .toast{
    position: fixed; top: 40%; left: 50%; z-index: 10001;
    width: 300px; padding: 10px 20px; border-radius: 6px;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, .6); color: #fff; text-align: center;
    font-size: 16px;
  }
</style>