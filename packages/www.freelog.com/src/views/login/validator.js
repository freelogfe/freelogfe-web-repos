import i18n from '@/lib/i18n/index'
export const validateLoginName = function (rule, value, callback) {
  if (value) {
    if (!EMAIL_REG.test(value) && !PHONE_REG.test(value)) {
      callback(new Error(i18n.t('login.validateErrors[0]')))
    } else {
      callback()
    }
  } else {
    callback(new Error(i18n.t('login.validateErrors[1]')))
  }
}

export default validateLoginName
export const EMAIL_REG = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
export const PHONE_REG = /^1[34578]\d{9}$/
