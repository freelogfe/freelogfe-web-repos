/*eslint-disable*/

const path = require('path')
const userHome = require('user-home')

const ossConfig = require(path.join(userHome, '.freelog', 'oss-config.json')) // 避免泄漏oss keys

const targetPath = 'pagebuild/'
module.exports = {
  // aliyun oss 配置
  oss: ossConfig,
  // git分支名对应的发布环境
  local: './dist',
  deploys: [{
    branch: 'publish',
    env: 'prod',
    bucket: 'frcdn',
    path: targetPath
  }, {
    branch: 'beta',
    env: 'beta',
    bucket: 'frcdn',
    path: 'beta/'
  }, {
    branch: 'daily',
    env: 'test',
    bucket: 'test-frcdn',
    path: targetPath
  }, {
    branch: 'master',
    env: 'test',
    bucket: 'test-frcdn',
    // cmd: `npm run build:test`,
    path: targetPath
  }],
  after() {
    // 同步前端模板
    // https://api.freelog.com/test/v1/node/web/triggerUpdateNodeTemplateEvent
  }
}
