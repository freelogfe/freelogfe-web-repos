
export const EMAIL_REG = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
export const PHONE_REG = /^1[34578]\d{9}$/
export const USERNAME_REG = /^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/
export function validateUsername(rule, value, callback) {
  if (value) {
    if (value.length > 30) {
      callback(new Error(this.$t('signup.validateErrors.username_leng')))
    } else if (!USERNAME_REG.test(value)) {
      callback(new Error(this.$t('signup.validateErrors.username')))
    } else {
      callback()
    }
  } else {
    callback(new Error(this.$t('signup.validateErrors.username_empty')))
  }
}

export const validateLoginName = function (rule, value, callback) {
  if (value) {
    if (!EMAIL_REG.test(value) && !PHONE_REG.test(value)) {
      callback(new Error(this.$t('login.validateErrors.loginName')))
    } else {
      callback()
    }
  } else {
    callback(new Error(this.$t('login.validateErrors.loginName_empty')))
  }
}

export const validateLoginIphone = function (rule, value, callback) {
  if (value) {
    if (!PHONE_REG.test(value)) {
      callback(new Error(this.$t('login.validateErrors.iphone')))
    } else {
      callback()
    }
  } else {
    callback(new Error(this.$t('login.validateErrors.loginName_empty')))
  }
}

export const validateLoginEmail = function (rule, value, callback) {
  if (value) {
    if (!EMAIL_REG.test(value)) {
      callback(new Error(this.$t('login.validateErrors.email')))
    } else {
      callback()
    }
  } else {
    callback(new Error(this.$t('login.validateErrors.loginName_empty')))
  }
}

export default validateLoginName
