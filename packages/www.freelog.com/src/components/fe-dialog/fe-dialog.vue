<template>
  <transition name="dialogfade" @after-leave="afterLeave">
    <div v-show="visible" style="position: relative;z-index: 10000;">
      <div class="fe-dialog-wrapper" @click.self="handleWrapperClick">
        <div
                class="fe-dialog"
                :class="[customClass]"
                ref="dialog"
                :style="style"
        >
          <div class="fe-dialog-header">
            <slot name="title">
              <h3 class="fe-dialog-title" v-html="title" :style="{textAlign: titleTextAlign}"></h3>
            </slot>
            <button type="button" class="fe-dialog-header-btn"
                    aria-label="Close"
                    v-if="showClose"
                    @click="handleClose">
              <i class="fe-model-close">&times;</i>
            </button>
          </div>
          <div class="fe-dialog-body" v-if="rendered">
            <slot></slot>
          </div>
          <div class="fe-dialog-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
      <div class="fe-dialog-mask"></div>
    </div>
  </transition>
</template>


<script>
export default {
  name: 'fe-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: ''
    },
    titleTextAlign: {
      type: String,
      default: 'left'
    },
    closeOnClickDialog: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: String,
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '10vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    isDestoryedBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      closed: false,
      rendered: false,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        //   this.$el.addEventListener('scroll', this.updatePopper)
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0
        })
      } else if (!this.closed) {
        this.$emit('close')
      }
    }
  },
  computed: {
    style() {
      const style = {}
      if (!this.fullscreen) {
        style.marginTop = this.top
        if (this.width) {
          style.width = this.width
        }
      }
      return style
    }
  },
  methods: {
    handleWrapperClick() {
      // if (!this.closeOnClickDialog) return
      this.handleClose()
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    afterLeave() {
      this.$emit('closed')
    }
  },
  mounted() {
    this.rendered = this.visible
  },
  updated() {
    // 是否卸载body-slot
    if (this.visible) {
      this.rendered = true
    } else if (this.isDestoryedBody) {
      this.timer = setTimeout(() => {
        this.rendered = false
      }, 800)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped type="text/less">
  .dialogfade-enter-active {
    transition: all .3s ease;
  }

  .dialogfade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .dialogfade-enter, .dialogfade-leave-to {
    opacity: 0;
  }

  .fe-dialog-mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
  }

  .fe-dialog-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    overflow: auto;
    overscroll-behavior-y: contain;
  }

  .fe-dialog {
    box-sizing: border-box;
    position: relative;
    margin: 0 auto 50px;
    border-radius: 2px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  }

  .fe-dialog-header {
    padding: 20px;

    h3 {
      font-size: 16px;
      color: #222;
    }

    .fe-model-close {
      color: #999;
      font-style: normal;
      font-size: 22px;
    }

  }

  .fe-dialog-header-btn {
    position: absolute;
    top: 16px;
    right: 20px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
  }

  .fe-dialog-body {
    padding: 20px;
    font-size: 14px;
    color: #606266;
  }

  .fe-dialog-footer {
    box-sizing: border-box;
    padding: 20px;
    padding-top: 10px;
    text-align: right;
  }
</style>
