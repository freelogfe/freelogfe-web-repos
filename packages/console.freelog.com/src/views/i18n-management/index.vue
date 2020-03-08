<template>
  <div class="i18n-management-container">
    <div class="aside-header">
      <div class="repos-select-box">
        <label for="repos-select">仓库名称：</label>
        <el-select id="repos-select" v-model="selectedReposName" @change="selectRepository">
          <el-option 
            v-for="item in trackedRepositories" 
            :key="item.repositoryName" 
            :label="item.repositoryName" 
            :value="item.repositoryName"></el-option>
        </el-select>
      </div>
      <el-button-group>
        <el-button 
          :type="item.mode === mode ? 'primary' : 'default'" 
          v-for="item in modes" 
          :key="item.mode"
          @click="mode = item.mode">
          {{item.label}}
          <i :class="[item.icon]"></i>
        </el-button>
      </el-button-group>
      <el-popover placement="bottom" width="480" trigger="hover" :disabled="!selectedReposChanges.length" v-model="showUpdatePopover">
        <el-badge  
          class="item"
          slot="reference" 
          v-loading="isPushing"
          element-loading-background="rgba(255, 255, 255, .5)"
          :value="selectedReposChanges.length" 
          :hidden="selectedReposChanges.length === 0">
          <el-button :disabled="selectedReposChanges.length === 0">
            {{isPushing ? '提交中' : targetReposChangesText}}
            <i class="el-icon-circle-plus-outline" v-show="!isPushing"></i>
          </el-button>
        </el-badge>
        <div class="imc-github-user" v-if="githubUser != null">
          Signed in as <a :href="githubUser.html_url">{{githubUser.login}}</a> 
        </div>
        <div class="imc-repos-commit-box">
          <p>Commit Message: <span style="color: #F56C6C;" v-if="commitMsg === ''">不能为空</span></p>
          <el-input type="textarea" :rows="2" v-model="commitMsg"></el-input>
        </div>
        <div class="imc-repos-changes-box">
          <h4>共{{selectedReposChanges.length}}个文件变更：</h4>
          <p class="imc-repos-change-item" v-for="(change, index) in selectedReposChanges" :key="'change'+index">
            <span :class="[change.type]">{{change.type}}: </span>{{change.path}}
          </p>
        </div>
        <div style="text-align: right;">
          <el-button type="text" size="mini" @click="showUpdatePopover = false">取消</el-button>
          <el-button type="primary" size="mini" :disabled="commitMsg === ''" @click="commitAndPushChanges">提交</el-button>
        </div>
      </el-popover>
      <!-- <el-button type="primary" v-if="showGithubOAuthBtn">
        <a :href="githubOAuthUrl">GitHub oAuth</a>
      </el-button> -->
    </div>
    <div class="i-m-main-content" v-if="selectedRepository != null">
      <component 
        :is="targetComponentId"
        :repository="selectedRepository"
        :fetchJSONFileContent="fetchJSONFileContent"
        @update-repository-changes="updateRepositoryChanges"
        @update-cache-JSONString="updateCacheJSONString"></component>
    </div>
  </div>
</template>

<script>
import FileEditView from './file-edit.vue'
import ModuleEditView from './module-edit.vue'
import NamespaceEditView from './namespace-edit.vue'
import { codemirror, codeMirrorOptions } from '@/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
import objectPath from 'object-path'
require('codemirror/theme/idea.css')
const throttle = require('lodash/throttle')
const cacheJSONString = {}
export default {
  name: 'i18n-manament-home',
	components: { codemirror, FileEditView, ModuleEditView, NamespaceEditView },
  data() {
    return {
      trackedRepositories: [],
      selectedRepository: null, 
      selectedReposName: '',
      selectedReposChanges: [],
      targetReposChangesText: '提交变更',
      modes: [
        { id: 'FileEditView', mode: 'file-edit', label: '文件编辑模式', icon: 'el-icon-files' }, 
        { id: 'ModuleEditView', mode: 'module-edit', label: '模块编辑模式', icon: 'el-icon-edit-outline' }, 
        { id: 'NamespaceEditView', mode: 'namespace-edit', label: 'Key Edit Mode', icon: 'el-icon-edit-outline' }
      ],
      mode: 'namespace-edit',
      showUpdatePopover: false,
      showEmptyCommitError: false,
      commitMsg: '',
      isPushing: false,
      showGithubOAuthBtn: false,
      githubUser: null
    }
  },
  computed: {
    targetComponentId() {
      const leng = this.modes.length
      for (let i = 0; i < leng; i++) {
        if (this.mode === this.modes[i].mode) {
          return this.modes[i].id
        }
      }
      return ''
    },
    githubOAuthUrl() {
      return `https://github.com/login/oauth/authorize?client_id=874c97335a3e4df726af&redirect_uri=${encodeURIComponent(window.location.href)}`
    },
  },
  methods: {
    async fetchTrackedRepositories() {
      const res = await this.$axios.get('//i18n.testfreelog.com/v1/i18n/trackedRepositories/list').then(res => res.data)
      if(res.errcode === 0 && res.data.length) {
        this.trackedRepositories = res.data
        this.selectedRepository = this.trackedRepositories[0]
        this.selectedReposName = this.selectedRepository.repositoryName
        this.selectedReposChanges = this.selectedRepository.repositoryChanges
      }
    },
    async fetchJSONFileContent(path, keys) {
      if (cacheJSONString[path]) {
        return cacheJSONString[path]
      } else {
        const res = await this.$axios.get(`//i18n.testfreelog.com/v1/i18n/trackedRepository/data?targetPath=${encodeURIComponent(path)}&pathType=1`).then(res => res.data)
        if(res.errcode === 0) {
          const targetData = objectPath.get(res.data, keys)
          cacheJSONString[path] = targetData
          return targetData
        } else {
          return null
        }
      }
    },
    selectRepository(reposName) {
      this.selectedReposName = reposName
      for (const repository of this.trackedRepositories) {
        if (repository.repositoryName === reposName) {
          this.selectedRepository = repository
        }
      }
    },
    updateRepositoryChanges(changes) {
      this.selectedReposChanges = changes
    },
    updateCacheJSONString(data) {
      const { path, value } = data
      cacheJSONString[path] = value
    },
    async commitAndPushChanges() {
      const changes = this.selectedReposChanges
      if (changes.length === 0) return
      if (this.commitMsg === '') return 
      console.log(this.commitMsg, changes)
      try {
        this.isPushing = true
        const accessToken = localStorage.getItem('github_access_toekn')
        const result = await this.$axios.post('//i18n.testfreelog.com/v1/i18n/trackedRepository/changes/push', {
          repositoryName: this.selectedReposName,
          commitMsg: this.commitMsg,
          accessToken: accessToken,
        }, { timeout: 30e3 }).then(res => res.data)
        if (result.errcode === 0) {
          this.showUpdatePopover = false
          this.selectedReposChanges = []
          this.$message.success('提交成功！')
        } else {
          this.$message.error(result.msg)
        }
      } catch(e) {
        this.$message.error(e.toString())
        console.log('commitAndPushChanges - e', e)
      } finally {
        this.isPushing = false
      }  
    },
    async getGithubUserInfo () {
      const accessToken = localStorage.getItem('github_access_toekn')
      if (accessToken != null) {
        const result = await this.$axios.get(`/v1/i18n/getGithubUserInfo?accessToken=${accessToken}`).then(res => res.data)
        if (result.errcode === 0) {
          this.githubUser = result.data
          return 
        }
      }
      this.showGithubOAuthBtn = true
    },
    async refreshGithubAccessToken() {
      if (this.$route.query.code) {
        const result = await this.$axios.post('/v1/i18n/getGithubAccessToken', {
          client_id: '874c97335a3e4df726af',
          client_secret: '3009d76fc4b7ed4914cfa57019166e8d764625fe',
          code: this.$route.query.code
        }).then(res => res.data)
        if (result.errcode === 0) {
          localStorage.setItem('github_access_toekn', result.data.access_token) 
          return result.data.access_token
        }
      }
    }
  },
  async mounted() {
    this.fetchTrackedRepositories()
    await this.refreshGithubAccessToken()
    await this.getGithubUserInfo()
  },
}
</script>

<style lang="less" scoped>
.i18n-management-container {
  .aside-header {
    display: flex; align-items: center;
    position: fixed; z-index: 100;
    width: 100%; padding: 15px 0; border-bottom: 1px solid #e6e6e6; 
    background-color: #fff;
    .repos-select-box { width: 300px; text-align: center; }
    .el-button-group { margin-left: 20px; }
    .el-badge { margin-left: 20px; }
    
  }
  .i-m-main-content { padding-top: 71px; }
}

</style>

<style lang="less">
.imc-repos-changes-box {
  overflow: auto;
  max-height: 150px; margin-bottom: 15px;
  h4 { line-height: 20px; font-weight: 500; }
  .imc-repos-change-item { 
    line-height: 20px; color: #555;
    span {
      &.modified { color: #E6A23C; }
      &.deleted { color: #F56C6C; }
      &.added { color: #67C23A; }
    }
  }
}
.imc-github-user {
  margin-bottom: 10px;
  a { text-decoration: underline; }
}
.imc-repos-commit-box { 
  margin-bottom: 15px;
  p { margin-bottom: 10px; }
}
</style>
