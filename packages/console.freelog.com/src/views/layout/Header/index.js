import {mapGetters} from 'vuex'
import SearchInput from '@/components/SearchInput/index.vue'
import {gotoLogin} from '../../../lib/utils'

export default {
  name: 'fl-header',

  data() {
    return {
      isSideBarOpen: true,
      domainPostfix: /\.test/.test(window.location.host) ? '.testfreelog.com' : '.freelog.com',
      avatarUrl: ''
    }
  },
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      session: 'session',
      nodes: 'nodes'
    }),
    pageTitle() {
      return (this.$route.meta && this.$route.meta.title) || ''
    }
  },

  components: {
    SearchInput
  },

  created() {
    // this.listenWindowVisibility()
  },
  mounted() {
    if (this.session && this.session.user && this.session.user.userId) {
      this.initData()
    } else {
      this.$store.dispatch('getCurrentUserInfo').then(userInfo => {
        if (!userInfo) {
          this.$store.dispatch('getCurrentUser').then(() => {
            this.initData()
          })
        } else {
          this.initData()
        }
      })
    }
  },

  methods: {
    initData() {
      this.$store.dispatch('loadNodes')
      if (this.session.user.headImage) {
        this.avatarUrl = `${this.session.user.headImage}?x-oss-process=style/head-image`
      }
    },
    errorImageHandler() {
      this.avatarUrl = '' //失败展示昵称
    },
    listenWindowVisibility() {
      const self = this
      let hidden = 'hidden'
      const doc = document

      if (hidden in doc) {
        doc.addEventListener('visibilitychange', onchange)
      } else if ('mozHidden' in doc) {
        hidden = 'mozHidden'
        doc.addEventListener('mozvisibilitychange', onchange)
      } else if ('webkitHidden' in doc) {
        hidden = 'webkitHidden'
        doc.addEventListener('webkitvisibilitychange', onchange)
      } else if ('msHidden' in doc) {
        hidden = 'msHidden'
        doc.addEventListener('msvisibilitychange', onchange)
      } else {
        const events = ['onpageshow', 'onpagehide', 'onfocus', 'onblur']
        events.forEach((name) => {
          window[name] = onchange()
        })
      }

      function onchange(evt) {
        const v = 'visible'
        const h = 'hidden'
        const evtMap = {
          focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
        }
        let type

        evt = evt || window.event
        if (evt.type in evtMap) {
          type = evtMap[evt.type]
        } else {
          type = this[hidden] ? 'hidden' : 'visible'
        }

        if (type === 'visible') {
          self.syncUserSession()
        }
      }
    },
    syncUserSession() {
      this.$store.dispatch('checkUserSession')
        .then((valid) => {
          if (!valid) {
            this.$store.dispatch('getCurrentUser').then(() => {
              window.location.reload()
            })
          }
        })
    },
    logout() {
      this.$store.dispatch('userLogout')
        .then(() => {
          gotoLogin(window.location.href)
        })
        .catch(this.$error.showErrorMessage)
    },
    searchHandler(qs) {
      this.$router.push({path: '/', query: {q: qs}})
    },
    handleCommand(lang) {
      if (lang === this.$i18n.locale) return
      var langMap = {
        'en': 'English',
        'zh-CN': '中文'
      }
      this.$confirm(this.$t('header.langSwitchQuestion', {lang: langMap[lang]}))
        .then(() => {
          window.localStorage.setItem('locale', lang)
          this.$i18n.locale = lang
          window.location.reload()
        }).catch(() => {
      })
    }
  }
}
