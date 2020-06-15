import { initI18n } from '@freelog/freelog-common-lib'
import cn from '@freelog/freelog-i18n/www/zh-CN'
import en from '@freelog/freelog-i18n/www/en'

import console_new_en from '@freelog/freelog-i18n/console_new/en'
import console_new_cn from '@freelog/freelog-i18n/console_new/zh-CN'

export default initI18n({ 
  cn: {
    ...cn, ...console_new_cn
  }, 
  en: {
    ...en, ...console_new_en
  },
})
