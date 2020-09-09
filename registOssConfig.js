#!/usr/bin/env node

/*! *****************************************************************************
本文件 指在 创建  ~/.freelog/oss-config.json 文件
为项目向 git 推送代码注册权限
******************************************************************************** */

const os = require('os');
const path = require('path');
const fs = require('fs');

// 两个key，由 aliyun OSS 生成
const data = {
    accessKeyId: "LTAIWcbdWQYqXLPQ",
    accessKeySecret: "14adw1CXwaWxavnGgj5dvgnk1fiVU2"
};
const ossPath = path.join(os.homedir(), '.freelog',);
if (!fs.existsSync(ossPath)) {
    console.log('创建', ossPath, '目录');
    fs.mkdirSync(ossPath);
}
// fs.writeFileSync(ossPath, JSON.stringify(data));
console.log('在', ossPath, '目录下创建', 'oss-config.json', '文件并写入数据');
fs.writeFileSync(path.join(ossPath, 'oss-config.json'), JSON.stringify(data));
console.log('*** 创建成功 ***');