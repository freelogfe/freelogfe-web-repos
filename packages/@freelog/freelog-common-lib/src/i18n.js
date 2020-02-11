
import I18n from 'vue-i18n'
import { getEnvLanguage } from './initEnv'

export { I18n }
export default function initI18n(locales) {
  return new I18n({
    locale: getEnvLanguage(),
    messages: {
      en: locales.en,
      cn: locales.cn,
      'zh-CN': locales.cn
    }
  })
}

// https://kazupon.github.io/vue-i18n/dynamic.html
  // ElementLocale.i18n((key, value) => i18n.t(key, value))

  // our default language that is prelaoded
  // const loadedLanguages = ['en']
  //
  // function setI18nLanguage(lang) {
  //   i18n.locale = lang
  //   axios.defaults.headers.common['Accept-Language'] = lang // 设置请求头部
  //   document.querySelector('html').setAttribute('lang', lang) // 根元素增加lang属性
  //   return lang
  // }
  //
  // export function loadLanguageAsync(lang) {
  //   if (i18n.locale !== lang) {
  //     if (!loadedLanguages.includes(lang)) {
  //       return import(/* webpackChunkName: "lang-[request]" */ `./locales/${lang}`).then(msgs => {
  //         i18n.setLocaleMessage(lang, msgs.default)
  //         loadedLanguages.push(lang)
  //         return setI18nLanguage(lang)
  //       })
  //     }
  //     return Promise.resolve(setI18nLanguage(lang))
  //   }
  //   return Promise.resolve(lang)
  // }

  // // 在vue-router的beforeEach的全局钩子了处理
  // router.beforeEach((to, from, next) => {
  //   const lang = to.params.lang
  //   loadLanguageAsync(lang).then(() => next())
  // })
  //
