import I18n from 'vue-i18n'

function initI18n(locales) {

  var language
  if (/^zh(\-\w+)?/.test(navigator.language)) {
    language = 'zh-CN'
  } else {
    language = 'en'
  }

  const win = window
  win.FreelogApp = win.FreelogApp || {}
  win.FreelogApp.Env = win.FreelogApp.Env || {}

  win.FreelogApp.Env.leaguage = language

  return new I18n({
    locale: language,
    messages: {
      en: locales.en,
      cn: locales.cn,
      'zh-CN': locales.cn
    }
  })
}

export default initI18n
