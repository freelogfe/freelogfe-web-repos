<template>
  <div class="i18n-management-file-edit-mode" v-if="repository != null">
    <aside>
      <el-tree
        :data="repository.directoryTree"
        :props="defaultProps"
        default-expand-all
        @node-click="handleNodeClick">
      </el-tree>
    </aside>
    <div class="i-m-main-content" :class="{ 'comparing': isCompareData }">
      <div class="i-m-mc-left-box" v-if="targetJSONString">
        <div class="i-m-mc-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="'breadcrumb-'+index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button class="save-json" type="primary" size="mini" v-if="isTargetJSONStringChanged"
            :disabled="error1Msg !== ''"
            @click="saveJSONString('targetJSONString')">保存</el-button>
        </div>
        <div class="i-m-mc-code-box">
          <el-alert show-icon type="error" :title="error1Msg"
              v-show="error1Msg"
              @close="clearErrorMsg('targetJSONString')"
              style="margin-bottom: 15px">
          </el-alert>
          <codemirror ref="codeMirror1" key="codeMirror1" :code="targetJSONString" :options="editorOptions" @input="onTargetCodeChange"></codemirror>
        </div>
      </div>
      <div class="i-m-mc-right-box" v-if="comparedJSONString">
        <div class="i-m-mc-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in comparedBreadcrumbs" :key="'breadcrumb-'+index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button class="save-json" type="primary" size="mini" v-if="isComparedJSONStringChanged"
            :disabled="error2Msg !== ''"
            @click="saveJSONString('comparedJSONString')">保存</el-button>
        </div>
        <div class="i-m-mc-code-box">
          <el-alert show-icon type="error" :title="error2Msg"
              v-show="error2Msg"
              @close="clearErrorMsg('comparedJSONString')"
              style="margin-bottom: 15px">
          </el-alert>
          <codemirror ref="codeMirror2" key="codeMirror2" :code="comparedJSONString" :options="editorOptions" @input="onComparedCodeChange"></codemirror>
        </div>
      </div>
      <div class="i-m-mc-empty-box" v-if="selectedPath === ''">
        请在左侧栏选择文件...
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror, codeMirrorOptions } from '@/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import objectPath from 'object-path'
require('codemirror/theme/idea.css')
const throttle = require('lodash/throttle')

var lastSelectedTreeData = null
export default {
  name: 'i18n-manament-home',
  components: { codemirror },
  props: {
    repository: Object,
    fetchJSONFileContent: Function,
  },
  data() {
    return {
			editorOptions: Object.assign({}, codeMirrorOptions, {
        mode: {
          name: 'javascript',
          json: true
        },
				viewportMargin: 50,
				viewportMargin: Infinity,
				gutters: [] }),
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      selectedPath: '',
      comparedPath: '',
      targetJSONString: '',
      isTargetJSONStringChanged: false,
      comparedJSONString: '',
      isComparedJSONStringChanged: false,
      breadcrumbs: [],
      comparedBreadcrumbs: [],
      isCompareData: true,
      validator: {},
      errorMsgMap: {
        targetJSONString: '',
        comparedJSONString: ''
      },
      error1Msg: '',
      error2Msg: ''
    }
  },
  computed: {
    repositoryName() {
      return this.repository ? this.repository.repositoryName : ''
    },
  },
  watch: {
    async targetJSONString() {
      const targetData = await this.fetchJSONFileContent(this.selectedPath, this.breadcrumbs)
      this.isTargetJSONStringChanged = this.targetJSONString !== JSON.stringify(targetData, null, '\t')
    },
    async comparedJSONString() {
      const comparedData = await this.fetchJSONFileContent(this.comparedPath, this.comparedBreadcrumbs)
      this.isComparedJSONStringChanged = this.comparedJSONString !== JSON.stringify(comparedData, null, '\t')
    },
    'errorMsgMap.targetJSONString': function () {
      this.error1Msg = this.errorMsgMap.targetJSONString
    },
    'errorMsgMap.comparedJSONString': function () {
      this.error2Msg = this.errorMsgMap.comparedJSONString
    },
  },
  methods: {
    async handleNodeClick(item, node, component) {
      if (item.path) {
        lastSelectedTreeData = item
        this.selectedPath = item.path
        this.breadcrumbs = item.keys
        const _keys = item.fileName !== 'index' ? item.keys : item.keys.slice(0, -1)
        const targetData = await this.fetchJSONFileContent(item.path, _keys)
        this.targetJSONString = JSON.stringify(targetData, null, '\t')

        const lang = item.language
        const comparedLang = lang === 'en' ? 'zh-CN' : 'en'
        let comparedKeys = item.keys.map(item => item === lang ? comparedLang : item)
        const comparedPath = item.path.replace(`/${lang}/`, `/${comparedLang}/`)
        this.comparedPath = comparedPath
        this.comparedBreadcrumbs = comparedKeys
        comparedKeys = item.fileName !== 'index' ? comparedKeys : comparedKeys.slice(0, -1)
        const comparedData = await this.fetchJSONFileContent(comparedPath, comparedKeys)
        this.comparedJSONString = JSON.stringify(comparedData, null, '\t')
      
      }
      console.log('item -', item)
    },
    async saveJSONString(type) {
      let _path, _JSONString, _keys
      switch(type) {
        case 'targetJSONString': {
          if (this.error1Msg !== '') return 
          _path = this.selectedPath
          _JSONString = this.targetJSONString
          _keys = this.breadcrumbs
          break
        }
        case 'comparedJSONString': {
          if (this.error2Msg !== '') return 
          _path = this.comparedPath
          _JSONString = this.comparedJSONString
          _keys = this.comparedBreadcrumbs
          break
        }
        default: return
      }
      const res = await this.$axios.put('//i18n.testfreelog.com/v1/i18n/trackedRepository/data', {
        repositoryName: this.repositoryName,
        changedFiles: [{
          targetPath: _path, 
          targetJSONString: _JSONString,
        }]
      }).then(res => res.data)
      if (res.errcode === 0) {
        this.$emit('update-repository-changes', res.data)
        this.$message.success(`保存成功！`)
        this.$emit('update-cache-JSONString', {
          path: _path, 
          value: JSON.parse(_JSONString)
        })
      } else {
        this.$message.error(`保存失败！`)
      }
    },
    onTargetCodeChange(val) {
      this.changeJSONString('targetJSONString', val)
    },
    onComparedCodeChange(val) {
      this.changeJSONString('comparedJSONString', val)
    },
    changeJSONString(key, val) {
      this[key] = val

      const fn = this.validator[key]
      if (!fn) {
        this.validator[key] = throttle(() => {
          this.validateJSON(key)
        }, 2e3)
      } else {
        fn()
      }
      this.$emit('input', this[key])
    },
    validateJSON(key) {
      try {
        JSON.parse(this[key])
        this.clearErrorMsg(key)
      } catch (err) {
        this.errorMsgMap[key] = `${this.$t('metaInput.metaJSONError')}！${err}`
      }
      this.$emit('validate', this.errorMsgMap[key])
    },
    clearErrorMsg(key) {
      this.errorMsgMap[key] = ''
    }
  },
  async mounted() {
    console.log('lastSelectedTreeData --', lastSelectedTreeData)
    if (lastSelectedTreeData != null) {
      await this.handleNodeClick(lastSelectedTreeData)
    }
  },
}
</script>

<style lang="less" scoped>
  aside {
    overflow: auto;
    position: fixed; top: 131px; left: 0; bottom: 0; z-index: 100;
    width: 300px; padding: 10px 0; border-right: 1px solid #e6e6e6; 
    .el-tree {
      overflow: auto; 
      background-color: #FAFBFB; 
    }
  }
  .i-m-main-content {
    margin-left: 300px; padding: 15px;
    .i-m-mc-header { 
      position: relative;
      margin-bottom: 10px; padding: 10px 0; 
      .save-json {
        position: absolute; top: 3px; right: 0;
      }
    }
    &.comparing { 
      display: flex; 
      .i-m-mc-left-box { padding-right: 8px; }
      .i-m-mc-right-box { padding-left: 8px; }
      .i-m-mc-left-box, .i-m-mc-right-box {
        flex: 1; min-width: 450px;
      }
    }
    .i-m-mc-empty-box {
      flex: 1;
      padding-top: 80px; font-size: 14px; text-align: center;
    }
  }
</style>

<style lang="less">
.i18n-management-file-edit-mode {
  aside {
    .el-tree-node {
      &.is-current {
        & > .el-tree-node__content { background-color: #409EFF; color: #fff; }
      }
      .el-tree-node__content {
        line-height: 32px; 
      }
    }
    
  }
}
.i-m-main-content {
  .CodeMirror { min-height: 300px; height: auto; }
}
</style>
