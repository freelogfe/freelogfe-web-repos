export default {
  name: 'tool-bar',
  data() {
    return {
      hidden: true,
      profileUrl: `//www.${window.FreelogApp.Env.mainDomain}/profile`
    }
  },
  mounted() {
    this.initHotKeyEvent()
  },
  methods: {
    // ctrl+T唤起工具栏
    initHotKeyEvent() {
      const keyCodes = {
        ctrl: 17,
        T: 84
      }
      let keydown = {}
      const self = this
      const isCtrlT = keyCode => (keyCodes.ctrl === keyCode || keyCodes.T === keyCode)
      window.addEventListener('keydown', (ev) => {
        if (isCtrlT(ev.keyCode)) {
          keydown[ev.keyCode] = true
          if (keydown[keyCodes.ctrl] && keydown[keyCodes.T]) {
            self.toggleToolBar()
            keydown = {}
          }
        }
      })

      window.addEventListener('keyup', (ev) => {
        if (isCtrlT(ev.keyCode)) {
          keydown[ev.keyCode] = false
        }
      })
    },
    showAuthDialog() {
      window.FreeLogApp.trigger(window.FreeLogApp.EventCode.showSystemDialog, {
        callback() {
          console.log('close dialog@toolbar')
        }
      })
    },
    toggleToolBar() {
      this.hidden = !this.hidden
    },
    show() {
      this.hidden = false
    },
    hide() {
      this.hidden = true
    }
  }
}
