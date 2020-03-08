<template>
  <div class="i18n-m-namespace-edit-mode">
    <div class="i-m-nem-head">
      <div class="module-select-box">
        <label for="module-select">模块（或项目）名称：</label>
        <el-select id="module-select" :value="selectedModuleName" @change="exchangeModules">
          <el-option 
            v-for="item in reposModules" 
            :key="item.name" 
            :label="item.name" 
            :value="item.name"></el-option>
        </el-select>
      </div>
      <el-input 
          class="module-search-input"
          type="text" 
          suffix-icon="el-icon-search"
          placeholder="请输入内容进行Key筛选" 
          v-model="searchInputStr" @keyup.enter.native="filterNamespaceListByInput"></el-input>
      <div>
        <el-button class="add-new-namescpace-btn" type="danger" @click="showNewKeyDialog = true">添加新Key</el-button>
        <el-button type="primary" :disabled="changedKeys.length === 0" @click="saveChanges">
          保存<span>（共{{changedKeys.length}}个Key更改）</span>  
        </el-button>
      </div>
    </div>
    <div class="i-m-nem-sidebar" v-loading="isRefreshingSidebar">
      <ul>
        <li 
          :class="{'active': item.key === selectedNamespace.key}"
          v-for="(item, index) in filteredNamespaceList" 
          :key="item.key + 'index'"
          @click="handleSelectNamespace(index)">
          <span class="change-badge" v-if="changedKeysMap[item.key]">{{badgeMap[changedKeysMap[item.key].operation]}}</span>
          {{item.key}}
        </li>
      </ul>
    </div>
    <div class="i-m-nem-body" v-if="filteredNamespaceList.length">
      <div class="i-m-nem-breadcrumb-box">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in selectedModule.keys" :key="'breadcrumb-'+index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="i-m-nem-selected-key">{{selectedNamespace.key}}</span>
      </div>
      <namespace-card 
        v-for="lang in languages" 
        :key="lang"
        :language="lang"
        :title="languagesMap[lang]"
        :selectedNamespace="selectedNamespace"
        @value-update="handleChanges"></namespace-card>
    </div>
    <el-dialog class="i-m-nem-add-namescpace-dialog" title="新增Key" width="480px" center :visible.sync="showNewKeyDialog">
      <el-input placeholder="输入key" v-model="newKey" @input="validateNewKey"></el-input>
      <p class="add-key-error">{{newKeyValidtedError}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showNewKeyDialog = false">取 消</el-button>
        <el-button type="primary" size="small" :disabled="newKeyValidtedError != ''" @click="addNewKey">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import objectPath from 'object-path'
import NamespaceCard from './namespace-card.vue'
export default {
  name: 'namespace-edit-mode',
  components: { NamespaceCard },
  props: {
    repository: Object,
    fetchJSONFileContent: Function
  },
  data() {
    return {
      badgeMap: {
        'update': '改',
        'add': '增',
        'delete': '删'
      },
      languages: [ 'zh-CN', 'en' ],
      languagesMap: {
        'en': '英文', 
        'zh-CN': '中文',
      },
      isRefreshingSidebar: true,
      searchInputStr: '',
      selectedModuleName: '',
      selectedModule: null,
      targetModuleI18nData: null,
      targetNamespaceList: [],
      filteredNamespaceList: [],
      selectedNamespace: null,
      showNewKeyDialog: false,
      newKey: '',
      timer: null,
      newKeyValidtedError: '',
      changedKeys: [],
    }
  },
  computed: {
    repositoryName() {
      return this.repository.repositoryName
    },
    reposModules() {
      return this.repository.directoryTree
    },
    reposModulesMap() {
      const map = {}
      this.repository.directoryTree.forEach(item => {
        map[item.name] = item
      })
      return map
    },
    changedKeysMap() {
      const map = {}
      this.changedKeys.forEach(item => {
        map[item.key] = item
      })
      return map
    },
    isMultifileStructure() {
      if (this.selectedModule !== null) {
        if(this.selectedModule.children[0].children.length > 1) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    changedKeys() {

    }
  },
  methods: {
    init() {
      if (this.reposModules) {
        this.exchangeModules(this.reposModules[0].name)
      }
    },
    fetchModuleDataByModuleName(module) {
      return this.$axios.get(`//i18n.testfreelog.com/v1/i18n/trackedRepository/data?targetPath=${encodeURIComponent(module.path)}&pathType=2`)
        .then(res => res.data)
        .then(res => {
          if (res.errcode === 0) {
            return objectPath.get(res.data, module.keys)
          } else {
            throw new Error(res.msg)
          }
        })
        .catch(e => this.$error.showErrorMessage(e))
    },
    resolveI18nData(i18nData) {
      this.targetNamespaceList = this.getNamespaceListFromI18nData(this.targetModuleI18nData['zh-CN'])
      this.checkSpaceListByLang()
      this.filterNamespaceListByInput()
    },
    getNamespaceListFromI18nData(data) {
      const list = []
      for(const [ key, value ] of Object.entries(data)) {
        if (Array.isArray(value)) {
          list.push({ key, value, valueType: 'array' })
        } else if (typeof value === 'string') {
          list.push({ key, value, valueType: 'string' })
        } else {
          const arr = this.getNamespaceListFromI18nData(value).map(item => {
            item.key = `${key}.${item.key}`
            return item
          })
          list.push(...arr)
        }
      }
      return list
    },
    checkSpaceListByLang() {
      const tmpI18nData = this.targetModuleI18nData
      const languages = Object.keys(tmpI18nData).filter(lang => lang !== 'zh-CN')
      this.targetNamespaceList.forEach(item => {
        item['zh-CN'] = item.value
        for (let i = 0; i < languages.length; i++) {
          const lang = languages[i]
          item[lang] = objectPath.get(tmpI18nData, `${lang}.${item.key}`)
        }
      })
    },
    filterNamespaceListByInput() {
      const str = this.searchInputStr.replace(/^(\s*)|(\s*)$/g, '')
      this.filteredNamespaceList = this.targetNamespaceList.filter(item => {
        return item.key.indexOf(str) !== -1
      })
      this.handleSelectNamespace(0)
    },
    async exchangeModules(moduleName) {
      if (this.changedKeys.length > 0) {
        try {
          await this.$confirm(`当前操作将会清空模块${this.selectedModuleName}的${this.changedKeys.length}个key更改，是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          this.$message({ type: 'success',  message: `已切换至名称为${this.selectedModuleName}的模块（或项目）!`})
        } catch(e) {
          this.$message({ type: 'info', message: '已取消切换模块（或项目）'}) 
          return
        }
      } 
      this.selectedModuleName = moduleName
      this.searchInputStr = ''
      this.changedKeys = []
      this.selectedModule = this.reposModulesMap[this.selectedModuleName]
      try {
        this.isRefreshingSidebar = true
        this.targetModuleI18nData = await this.fetchModuleDataByModuleName(this.selectedModule)
        this.isRefreshingSidebar = false
        this.resolveI18nData(this.targetModuleI18nData)
        this.handleSelectNamespace(0)
      } catch(e) {
        this.isRefreshingSidebar = false
        this.targetModuleI18nData = null
        this.targetNamespaceList = []
        console.error(e)
      }
      
    },
    handleSelectNamespace(index) {
      this.selectedNamespace = this.filteredNamespaceList[index]
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
        if (objectPath.get(this.targetModuleI18nData['zh-CN'], key) != null || this.changedKeysMap[key] != null){
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
          valueType: 'string',
          'en': '', 
          'zh-CN': '',
        })
        this.showNewKeyDialog = false
        this.newKey = ''
        this.handleSelectNamespace(0)
      }
    },
    handleChanges(updateData) {
      const { key, operation } = updateData
      const changedKeys = this.changedKeys
      // 当前变更的key是否存在“已变更key的列表”，并获取它的序号
      let targetIndex = -1
      for (let i = 0; i < changedKeys.length; i++) {
        if (changedKeys[i].key === key) {
          targetIndex = i
          break
        }
      }
      switch (operation) {
        case 'update': {
          if (targetIndex !== -1) {
            changedKeys.splice(targetIndex, 1)
          }
          changedKeys.unshift(updateData)
          break
        }
        case 'delete': {
          if (targetIndex !== -1) {
            changedKeys.splice(targetIndex, 1)
          } 
          changedKeys.unshift(updateData)
          break
        }
        case 'add': {
          if (targetIndex === -1) {
            changedKeys.unshift(updateData)
            this.filteredNamespaceList.unshift(updateData)
          }
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
      const changedFiles = []
      const changedKeys = this.changedKeys
      const modulePath = this.selectedModule.path
      if (this.isMultifileStructure) {
        this.languages.forEach(lang => {
          const tmpI18nData = this.targetModuleI18nData[lang]
          const fileNameSet = new Set()
          for (let j = 0; j < changedKeys.length; j++) {
            const tmpArr = changedKeys[j].key.split('.')
            fileNameSet.add(tmpArr[0])
            objectPath.set(tmpI18nData, changedKeys[j].key, changedKeys[j][lang])
          }
          for (const filename of fileNameSet) {
            changedFiles.push({
              targetJSONString: JSON.stringify(objectPath.get(tmpI18nData, filename)),
              targetPath: [ modulePath, lang, `${filename}.json` ].join('/')
            })
          }
        })
      } else {
        this.languages.forEach(lang => {
          const tmpI18nData = this.targetModuleI18nData[lang]
          for (let j = 0; j < changedKeys.length; j++) {
            objectPath.set(tmpI18nData, changedKeys[j].key, changedKeys[j][lang])
          }
          changedFiles.push({
            targetJSONString: JSON.stringify(tmpI18nData),
            targetPath: [ modulePath, lang, 'index.json' ].join('/')
          })
        })
          
      }
      console.log(changedFiles)
      return {
        repositoryName: this.repositoryName,
        changedFiles
      }
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="less" scoped>
.i18n-m-namespace-edit-mode {

}

.i-m-nem-sidebar {
  position: fixed; top: 131px; bottom: 0; z-index: 10;
  width: 300px; border-right: 1px solid #e6e6e6;
  background-color: #fff;
  ul { box-sizing: border-box; height: 100%; padding: 5px 0; overflow: auto; }
  li { 
    margin: 3px 0; padding: 3px 10px;
    word-break: break-word; font-size: 14px; cursor: pointer;
    &:hover, &.active {
      background-color: #409EFF; color: #fff;
    }
    .change-badge {
      display: inline-block;
      padding: 2px 5px; border-radius: 50%;
      font-size: 12px; background-color: #F56C6C;color: #fff;
      transform: scale(.8);
    }
  }
}

.i-m-nem-head {
  margin-left: 300px; padding: 20px 20px 0; border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  .module-select-box {
    display: inline-block; margin-bottom: 20px;
  }
  .module-search-input { 
    width: 360px; margin-left: 20px; margin-bottom: 20px; 
    label { position: absolute; line-height: 40px; }
    .el-input { box-sizing: border-box; padding-left: 57px; }
  }
  .add-new-namescpace-btn {  }
  .el-button { margin: 0 20px 20px 0;  }
}

.i-m-nem-body {
  margin-left: 300px; padding: 20px;
  .i-m-nem-breadcrumb-box {
    display: flex; margin-bottom: 15px; line-height: 32px;
    .el-breadcrumb {line-height: 32px; }
    .i-m-nem-selected-key { margin-left: 30px; color: #409EFF; }
  }
  .i-m-nem-edit-item { 
    float: left; width: 48%;
    &:not(:last-child) {
      margin-right: 3%; 
    }
  }
}
</style>

<style lang="less">
  .i-m-nem-add-namescpace-dialog {
    .add-key-error {
      margin-top: 8px;
      line-height: 20px; font-size: 12px; color: #F56C6C; 
    }
  }
</style>
