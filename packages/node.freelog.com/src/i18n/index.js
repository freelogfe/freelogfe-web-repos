
import Vue from 'vue'
import initI18n, { I18n } from '@freelog/freelog-common-lib/src/i18n'
import cn from './locales/cn'
import en from './locales/en'
Vue.use(I18n)
export default initI18n({ cn, en })
