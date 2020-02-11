const walk = require('walk')
const path = require('path')
const fs = require('fs-extra')

const walker = walk.walk("./lib")
walker.on("file", function (root, fileStats, next){
  if(/.js$/.test(fileStats.name)) {
    const pkgJson = require('./package')
    pkgJson.main = path.join('./lib', fileStats.name)
    fs.writeJsonSync('./package.json', pkgJson, {
      spaces: 2
    })
  }else {
    next()
  }
})
