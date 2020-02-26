<template>
  <div class="i18n-management-module-edit-mode" v-if="repository != null">
    <div class="imme-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbs" 
          :key="'breadcrumb-'+index">
          <span class="breadcrumb-item" @click="tapBreadcrumb(index)">{{item.name}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="imme-main-content">
      <template v-if="pathTypes.indexOf(currentPathType) < 3">
        <div class="imme-list">
          <div class="imme-dir" v-for="(dir, index) in dirs" :key="'dir-'+index" @click="tapDir(dir)">
            <i class="el-icon-folder"></i>
            <p>{{dir.name}}</p>
          </div>
          <div class="imme-dir imme-add-dir" v-if="currentPathType === 'repository'" @click="addDir">
            <i class="el-icon-plus"></i>
            <p>添加文件夹</p>
          </div>
        </div>
        <div class="imme-list">
          <div class="imme-file" v-for="(file, index) in files" :key="'file-'+index" @click="tapFile(file)">
            <i class="el-icon-files"></i>
            <div class="imme-file-json">json</div>
            <p>{{file.name}}</p>
          </div>
        </div>
      </template>
      <div class="imme-namespace-box" v-if="zhCNI18nKeyList.length">
        <div class="imme-key-operation">
          <el-button @click="showKeyInput = true">添加命名空间</el-button>
          <el-button class="keys-changes-save-btn" type="primary" @click="saveChanges" v-if="changedKeys.length">保存更改</el-button>
        </div>
        <div class="imme-add-namescpace" v-if="showKeyInput">
          <div class="imme-add-key-box">
            <label>命名空间</label>
            <el-input v-model="newKey" @input="validateNewKey"></el-input>
            <el-button type="primary" :disabled="newKeyValidtedError != ''" @click="addNewKey">添加</el-button>
            <el-button @click="showKeyInput = false">取消</el-button>
          </div>
          <p class="imme-add-key-error">{{newKeyValidtedError}}</p>
        </div>
        <div class="imme-namespace-list">
          <namespace-item 
            v-for="(keyItem, index) in zhCNI18nKeyList" 
            :key="'key-item-'+index"
            :zhCNItem="keyItem"
            :enItem="enI18nKeyMap[keyItem.key] || null"
            @value-update="handleChanges"
            @name-space-delete="handleChanges"></namespace-item>
        </div>
        
      </div>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import namespaceItem from './namespace-item.vue'
import { codemirror, codeMirrorOptions } from '@/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import objectPath from 'object-path'
require('codemirror/theme/idea.css')
const throttle = require('lodash/throttle')
const cloneDeep = require('lodash/cloneDeep')

var lastBreadcrumbs = []
export default {
  name: 'i18n-manament-home',
  components: { codemirror, namespaceItem },
  props: {
    repository: Object,
    fetchJSONFileContent: Function,
  },
  data() {
    return {
      pathTypes: [ 'repository', 'module', 'language', 'file' ],
      currentPathType: '',
      breadcrumbs: [],
      breadcrumbsMap: {},
      dirs: [],
      files: [],
      zhCNI18nKeyList: [],
      enI18nKeyList: [],
      changedKeys: [],
      showKeyInput: false,
      newKey: '',
      timer: null,
      newKeyValidtedError: ''
    }
  },
  computed: {
    repositoryName() {
      return this.repository ? this.repository.repositoryName : ''
    },
    directoryTree() {
      return this.repository ? this.repository.directoryTree : []
    },
    zhCNI18nKeyMap() {
      const obj = {}
      this.zhCNI18nKeyList.forEach((item, index) => {
        item.index = index
        obj[item.key] = item
      })
      return obj
    },
    enI18nKeyMap() {
      const obj = {}
      this.enI18nKeyList.forEach((item, index) => {
        item.index = index
        obj[item.key] = item
      })
      return obj
    },
  },
  watch: {
    breadcrumbs() {
      const leng = this.breadcrumbs.length
      if (leng === 0) return
      lastBreadcrumbs = this.breadcrumbs
      const breadcrumbData = this.breadcrumbs[leng - 1]
      this.currentPathType = breadcrumbData.currentPathType
      const [ type_repository, type_module, type_language, type_file ] = this.pathTypes

      console.log('breadcrumbData.currentPathType --', breadcrumbData.currentPathType)

      switch(breadcrumbData.currentPathType) {
        case type_repository: {
          this.files = []
          this.zhCNI18nKeyList = []
          this.enI18nKeyList = []
          this.dirs = breadcrumbData.targetData.filter(item => item.keysType === 'module')
          break
        }
        case type_module: {
          this.files = []
          this.zhCNI18nKeyList = []
          this.enI18nKeyList = []
          this.dirs = breadcrumbData.targetData.filter(item => item.keysType === 'language')
          break
        }
        case type_language: {
          this.dirs = this.zhCNI18nKeyList = this.enI18nKeyList = []
          this.files = breadcrumbData.targetData.filter(item => item.keysType === 'file' || item.keysType === 'data')
            .map(file => {
              file.name = file.name.replace(/(\.json)$/i, '')
              return file
            })
          break
        }
        case type_file: {
          this.dirs = this.files = []
          const { targetData, comparedData, language } = breadcrumbData
          if (language === 'zh-CN') {
            this.zhCNI18nKeyList = this.getI18nFileKeyList(targetData)
            this.enI18nKeyList = this.getI18nFileKeyList(comparedData)
          } else {
            this.zhCNI18nKeyList = this.getI18nFileKeyList(comparedData)
            this.enI18nKeyList = this.getI18nFileKeyList(targetData)
          }
          break
        }
        default:
      }
    },
    changedKeys() {
      this.logJSON(this.changedKeys, 'changedKeys')
      this.logJSON(this.zhCNI18nKeyList, 'zhCNI18nKeyList')
    },
  },
  methods: {
    logJSON(obj, msg) {
      console.log(`${msg}:`, JSON.parse(JSON.stringify(obj)))
    },
    tapBreadcrumb(index) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1)
    },
    tapDir(dir) {
      const { children = [], name, keys, keysType } = dir
      this.breadcrumbs.push({
        name, keys, 
        currentPathType: keysType,
        targetData: children
      })
    },
    addDir() {
      this.$message.warning('暂未完成')
    },
    async tapFile(file) {
      const { targetData, comparedData } = await this.resolveI18nFileData(file)
      const { name, keys, keysType, language, fileName, path } = file
      this.breadcrumbs.push({
        currentPathType: keysType, 
        path, fileName, language, name, keys, targetData, comparedData,
      })
    },
    async resolveI18nFileData(file) {
      const { name, path, keys, keysType, language, fileName } = file
      const _keys = fileName !== 'index' ? keys : keys.slice(0, -1)
      const targetData = await this.fetchJSONFileContent(path, _keys)

      const comparedLang = language === 'en' ? 'zh-CN' : 'en'
      const comparedPath = path.replace(`/${language}/`, `/${comparedLang}/`)
      let comparedKeys = keys.map(item => item === language ? comparedLang : item)
      comparedKeys = fileName !== 'index' ? comparedKeys : comparedKeys.slice(0, -1)
      const comparedData = await this.fetchJSONFileContent(comparedPath, comparedKeys)
      
      return {
        targetData, comparedData
      }
    },
    getI18nFileKeyList(data) {
      const list = []
      for(const [ key, value ] of Object.entries(data)) {
        if (Array.isArray(value)) {
          list.push({ key, value, valueType: 'array' })
        } else if (typeof value === 'string') {
          list.push({ key, value, valueType: 'string' })
        } else {
          const arr = this.getI18nFileKeyList(value).map(item => {
            item.key = `${key}.${item.key}`
            return item
          })
          list.push(...arr)
        }
      }
      return list
    },
    validateNewKey(key) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let error = ''
        key = key.replace(/^(\s*)|(\s*)$/g, '')
        if (key === '') {
          this.newKeyValidtedError = '命名格式有误; key不能为空'
          return 
        }
        const isValid = /^[_-\w\d\.]+$/.test(key)
        if (!isValid) {
          this.newKeyValidtedError = '命名格式有误; key由大小字母、数字和字符（_、-、.）组合而成'
          return 
        }
        if (this.zhCNI18nKeyMap[key] != null || this.enI18nKeyMap[key] != null){
          this.newKeyValidtedError = '命名冲突： 当前key已存在！'
          return 
        } 
        this.newKeyValidtedError = ''
      }, 50)
    },
    addNewKey() {
      if (this.newKeyValidtedError === '') {
        this.handleChanges({
          operation: 'add',
          key: this.newKey, 
          value: { 'en': '', 'zh-CN': '' }
        })
        this.showKeyInput = false
        this.newKey = ''
      }
    },
    handleChanges(updateData) {
      const { key, operation, language, value } = updateData
      const changedKeys = this.changedKeys
      let targetIndex = -1
      for (let i = 0; i < changedKeys.length; i++) {
        if (changedKeys[i].key === key) {
          targetIndex = i
          break
        }
      }
      switch (operation) {
        case 'update': {
          let item
          if (targetIndex !== -1) {
            item = changedKeys[targetIndex]
            changedKeys.splice(targetIndex, 1)
            item.value[language] = value
          } else {
            item= { key, operation, value: { [language]: value } }
          }
          changedKeys.unshift(item)
          break
        }
        case 'delete': {
          if (targetIndex !== -1) {
            changedKeys.splice(targetIndex, 1)
          } 
          changedKeys.unshift({ key, operation })
          this.updateKeyList('delete', key)
          break
        }
        case 'add': {
          if (targetIndex === -1) {
            changedKeys.unshift({ key, operation, value })
            this.updateKeyList('add', key, value)
          }
          break
        }
      }
    },
    updateKeyList(updateType, key, value) {
      switch(updateType) {
        case 'delete': {
          const zhCNItem = this.zhCNI18nKeyMap[key]
          const enItem = this.enI18nKeyMap[key]
          if (zhCNItem) {
            this.zhCNI18nKeyList.splice(zhCNItem.index, 1)
          }
          if (enItem) {
            this.enI18nKeyList.splice(enItem.index, 1)
          }
          break
        }
        case 'add': {
          this.zhCNI18nKeyList.unshift({ key, value: value['zh-CN'], valueType: 'string' })
          this.enI18nKeyList.unshift({ key, value: value['en'], valueType: 'string' })
          break
        }
      }
    },
    async saveChanges() {
      const saveData = this.resolveSaveData()
      const res = await this.$axios.put('//i18n.testfreelog.com/v1/i18n/trackedRepository/data', saveData).then(res => res.data)
      if (res.errcode === 0) {
        this.$message.success(`保存成功！`)
        this.changedKeys = []
        this.$emit('update-repository-changes', res.data)
        saveData.changedFiles.forEach(change => {
          this.$emit('update-cache-JSONString', {
            path: change.targetPath, 
            value: JSON.parse(change.targetJSONString)
          })
        })
        
      } else {
        this.$message.error(`保存失败！`)
      }
    },
    resolveSaveData() {
      const breadcrumbData = this.breadcrumbs[this.breadcrumbs.length - 1]
      this.logJSON(this.changedKeys, 'saveChanges - changedKeys')
      const { language, targetData, comparedData, path } = breadcrumbData
      var zhCNTargetJSONString, enTargetJSONString, zhCNPath, enPath
      if (language === 'zh-CN') {
        zhCNPath = path
        enPath = path.replace(`/${language}/`, '/en/')
        zhCNTargetJSONString = this.getTargetJSONStringByChanges(cloneDeep(targetData), this.changedKeys, 'zh-CN')
        enTargetJSONString = this.getTargetJSONStringByChanges(cloneDeep(comparedData), this.changedKeys, 'en')
      } else {
        zhCNPath = path.replace(`/${language}/`, '/zh-CN/')
        enPath = path
        zhCNTargetJSONString = this.getTargetJSONStringByChanges(cloneDeep(comparedData), this.changedKeys, 'zh-CN')
        enTargetJSONString = this.getTargetJSONStringByChanges(cloneDeep(targetData), this.changedKeys, 'en')
      }
      return {
        repositoryName: this.repositoryName,
        changedFiles: [{
          targetPath: zhCNPath, 
          targetJSONString: zhCNTargetJSONString
        },{
          targetPath: enPath, 
          targetJSONString: enTargetJSONString
        }]
      } 
    },
    getTargetJSONStringByChanges(data, changes, language) {
      for (const change of changes) {
        const { key, operation, value } = change
        switch(operation) {
          case 'add':
          case 'update': {
            if (value[language] != null) {
              objectPath.set(data, key, value[language])
            }
            break
          }
          case 'delete': {
            objectPath.del(data, key)
            break
          }
          default:
        }
      }
      return JSON.stringify(data)
    }
  },
  async mounted() {
    if (lastBreadcrumbs.length === 0) {
      lastBreadcrumbs.push({
        keys: [ this.repositoryName ],
        currentPathType: 'repository',
        name: this.repositoryName,
        targetData: this.directoryTree
      })
    } 
    this.breadcrumbs = lastBreadcrumbs
  },
}
</script>

<style lang="less" scoped>
.i18n-management-module-edit-mode {
  padding: 20px;
  .imme-header {
    margin-bottom: 20px; padding: 10px 0 20px;
    font-size: 16px; color: #000;
    .breadcrumb-item { 
      cursor: pointer; 
      &:hover { color: #409EFF; }
    }
  }
  .imme-main-content {
    .imme-list {
      overflow: hidden;
      .imme-dir, .imme-file {
        position: relative;
        float: left; cursor: pointer; box-sizing: border-box;
        width: 150px; margin-bottom: 15px; margin-right: 15px; padding: 10px; border: 1px solid transparent; border-radius: 4px;
        text-align: center; color: #555;
        p { 
          display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
          height: 36px; line-height: 18px; 
        }
        &:hover {
          border-color: #409EFF; color: #409EFF;
        }
        &.imme-add-dir {
          border-color: #cbcbcb; color: #cbcbcb;

          &:hover {
            border-color: #67C23A; color: #67C23A;
          }
          
        }
        .el-icon-folder, .el-icon-plus, .el-icon-files { 
          padding: 15px 40px; font-size: 48px; 

        }
        .imme-file-json { 
          position: absolute; top: 45px; left: 50%; z-index: 5;
          transform: translateX(-50%) scale(.8); 
        }
      }
    }

    .imme-namespace-box {
      max-width: 900px;
      .imme-key-operation { 
        margin-bottom: 20px;
        .keys-changes-save-btn { float: right; }
      }
      .imme-add-namescpace {
        margin: 20px 0; padding: 20px; border: 1px solid #E6A23C; border-radius: 4px;
        background-color: #fff;
        .imme-add-key-box {
          display: flex;
          .el-input { margin-right: 10px; }
          label { min-width: 60px; line-height: 40px; }
        }
        .imme-add-key-error { margin-top: 5px; padding-left: 60px; line-height: 20px; color: #F56C6C; }
      }
    }
  }
}

</style>

<style lang="less">

</style>
