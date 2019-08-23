/*eslint-disable*/

const path = require('path')
const userHome = require('user-home')

const ossConfig = require(path.join(userHome, '.freelog', 'oss-config.json')) // 避免泄漏oss keys

module.exports = {
  // aliyun oss 配置
  oss: ossConfig,
  // git分支名对应的发布环境
  local: './lib',
  deploys: [{
    branch: 'publish',
    env: 'prod',
    bucket: 'frcdn',
    path: 'freelog-common/',
    cmd: `npm run build`,
  }, {
    branch: 'beta',
    env: 'beta',
    bucket: 'frcdn',
    path: 'freelog-common/'
  }, {
    branch: 'daily',
    env: 'test',
    bucket: 'test-frcdn',
    path: 'freelog-common/'
  }, {
    branch: 'master',
    env: 'test',
    bucket: 'test-frcdn',
    path: 'freelog-common/'
  }],
  after() {
    // 同步前端模板
    // https://api.freelog.com/test/v1/node/web/triggerUpdateNodeTemplateEvent
  }
}
