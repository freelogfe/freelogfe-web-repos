// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  //资源市场
  'default e2e tests': (browser) => {
    // console.log(process.env.VUE_DEV_SERVER_URL)
    browser.resizeWindow(1000, 800)
    browser
      .url('http://console.testfreelog.com/')
      .waitForElementVisible('.login-section', 1e3)
      .assert.elementPresent('.login-form')
      .assert.containsText('.js-login-btn', '登录')
      .setValue('input[name=username]', 'src@freelog.com')
      .setValue('input[name=password]', '123456')
      .click('.js-login-btn')
      .waitForElementVisible('.app-wrapper', 1e3)
      .assert.elementPresent('.user-profile')
      .waitForElementPresent('.resource-list-item', 1e3)
      .assert.containElements('.resource-list', '.resource-list-item')


    browser.getCookies((result) => {
      browser.assert.equal(result.value.length, 1)
      browser.assert.equal(result.value[0].name, 'authInfo')
      browser.assert.equal(result.value[0].domain, '.testfreelog.com')
    })

    browser.end()
  }
}
