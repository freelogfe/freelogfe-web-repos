import {initI18n} from '@freelog/freelog-common-lib'
import en from '@freelog/freelog-i18n/console/en';
import console_new_en from '@freelog/freelog-i18n/console_new/en';
import cn from '@freelog/freelog-i18n/console/zh-CN';
import console_new_cn from '@freelog/freelog-i18n/console_new/zh-CN';
import axios from './axios'

// ElementLocale.i18n((key, value) => i18n.t(key, value))
// https://kazupon.github.io/vue-i18n/dynamic.html

//
const loadedLanguages = ['en'] // our default language that is prelaoded

function setI18nLanguage(lang) {
    i18n.locale = lang
    axios.defaults.headers.common['Accept-Language'] = lang // 设置请求头部
    document.querySelector('html').setAttribute('lang', lang) // 根元素增加lang属性
    return lang
}

export function loadLanguageAsync(lang) {
    if (i18n.locale !== lang) {
        if (!loadedLanguages.includes(lang)) {
            return import(/* webpackChunkName: "lang-[request]" */ `@freelog/freelog-i18n/console/${lang}`).then(msgs => {
                i18n.setLocaleMessage(lang, msgs.default)
                loadedLanguages.push(lang)
                return setI18nLanguage(lang)
            })
        }
        return Promise.resolve(setI18nLanguage(lang))
    }
    return Promise.resolve(lang)
}

//
// // 在vue-router的beforeEach的全局钩子了处理
// router.beforeEach((to, from, next) => {
//   const lang = to.params.lang
//   loadLanguageAsync(lang).then(() => next())
// })
//

export default initI18n({
    cn: {
        ...cn,
        ...console_new_en,
    },
    en: {
        ...en,
        ...console_new_cn,
    }
})
