<template>
  <div id="f-operation">
    <div class="fo-main-content">
      <el-steps :active="activeIndex" finish-status="finish" simple style="margin-bottom: 50px;">
        <el-step
          class="fo-step-item"
          v-for="(step, index) in stepList"
          :key="'step' + index"
          :icon="step.icon">
          <div slot="title" @click="tapStep(step, index)">{{step.title}}</div>
        </el-step>
      </el-steps>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { RESOURCE_TYPES } from '@/config/resource.js'
export default {
  name: "batch-operation",
  data() {
    return {
      selectType: '',
      fileList: [],
      existedFilesSet: new Set(),
      errorFilesSet: new Set(),
      uploadData: {
        resourceType: ""
      },
      stepList: [
        { title: '创建资源', icon: 'el-icon-edit', path: '/tools/batch-operation/create-resource' },
        { title: '资源列表', icon: 'el-icon-upload', path: '/tools/batch-operation/resources-list' },
        { title: '发行列表', icon: 'el-icon-picture', path: '/tools/batch-operation/releases-list' },
        { title: '节点发行列表', icon: 'el-icon-files', path: '/tools/batch-operation/presentables-list' },
      ],
      activeIndex: 0
    }
  },
  computed: {
    uploadActionUrl() {
      return `${window.window.FreelogApp.Env.qiOrigin}/v1/resources/temporaryFiles/uploadResourceFile`
    },
    resourceTypes() {
      var types = Object.values(RESOURCE_TYPES)
      return types
    },
    stepPaths() {
      return this.stepList.map(s => s.path)
    }
  },
  watch: {
    selectType() {
      this.uploadData.resourceType = this.selectType
    }
  },
  mounted() {
    this.activeIndex = this.stepPaths.indexOf(this.$route.path)
  },
  methods: {
    tapStep(step, index) {
      this.$router.push(step.path)
      this.activeStep = index
    },
    fileChangeHandler(file, fileList) {
      this.fileList = fileList
    },
    fileSuccessHandler(response, file, fileList) {
      const fileName = file.name
      const { errcode, data, msg } = response
      if(errcode === 0) {
        const { uploadFileId, isExistResource } = data
        if(isExistResource) {
          this.$message.warning(`“${fileName}”已存在！`)
          this.existedFilesSet.add(fileName)
        }else {
          this.$services.resource.post({
            uploadFileId,
            aliasName: fileName,
            description: "",
            dependencies: []
          })
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.$message.success(`“${fileName}创建成功！`)
            }else {
              this.$message.error(`“${fileName}”:${res.msg}`)
              this.errorFilesSet.add(fileName)
              this.fileList = fileList.map(file => {
                const { name } = file
                if(this.errorFilesSet.has(name)) {
                  file.name = `${name} (出错喇！！！)`
                }
                return file
              })
            }
          })
        }
      }else {
        this.$message.error(`${fileName}: ${msg}`)
        this.errorFilesSet.add(fileName)
      }
      this.fileList = fileList.map(file => {
        const { name } = file
        if(this.existedFilesSet.has(name)) {
          file.name = `${name} (已存在！！！)`
        }
        return file
      })
    },
    fileErrorHandler(response, file, fileList) {
      this.errorFilesSet.add(file.name)
      this.fileList = fileList.map(_f => {
        const { name } = _f
        if(this.errorFilesSet.has(name)) {
          file.name = `${name} (出错喇！！！)`
        }
        return _f
      })
    },
    createResources() {
      const resourceType = this.selectType
      if(resourceType === '') {
        this.$message.error('请先选择资源类型！！！')
        return
      }

      if(this.fileList.length === 0) {
        console.log(JSON.parse(JSON.stringify(this.fileList)))
        this.$message.error('请先添加文件')
        return
      }

      this.$confirm(`资源类型为${resourceType}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.$refs.foUpload.submit()
        })
    },
    clearFileList() {
      this.$refs.foUpload.clearFiles()
      this.fileList = []
    }
  },
}
</script>

<style lang="less" scoped>
  @import '../../styles/variables.less';
  #f-operation {
    padding-top: 20px;

    .fo-main-content{
      width: @main-content-width-1190;
      margin: auto;

      .fo-resource-list-box, .fo-release-list-box, .fo-presentables-list-box {
        display: none; padding: 0 0 30px;
        &.visible {
          display: block;
        }
      }
      .upload-operation-box {
        width: 500px; margin: 0 auto 20px;
        .fo-upload-select {
          margin-right: 10px;
        }
      }

      .fo-upload-wrapper {
        padding: 20px 0; text-align: center;
        .upload-box {
          display: inline-block;
        }
      }
    }
  }


  @media screen and (max-width: 1250px) {
    .fo-main-content{
      width: @main-content-width-990;
    }
  }
</style>

<style lang="less">
  #f-operation {
    .fo-step-item {
      .el-step__title { cursor: pointer; }
    }

    .upload-box {
      .el-upload-dragger {
        width: 500px; height: 210px;
      }
      .el-upload-list {
        text-align: left;
        .el-upload-list__item {
          &:first-child { margin-top: 5px; }
        }
      }
    }
  }
</style>
