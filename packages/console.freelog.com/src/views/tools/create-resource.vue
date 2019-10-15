<template>
  <div>
    <div class="fo-upload-wrapper">
        <div class="upload-operation-box">
          <el-select class="fo-upload-select" allow-create filterable v-model="selectType" placeholder="请选择资源类型">
            <el-option v-for="type in resourceTypes" :key="type" :label="type" :value="type"></el-option>
          </el-select>
          <el-button type="primary" @click="createResources">上传并创建资源</el-button>
          <el-button type="danger" @click="clearFileList">清空</el-button>
        </div>
        <el-upload class="upload-box" ref="foUpload"
          drag multiple with-credentials
          :action="uploadActionUrl"
          :data="uploadData"
          :file-list="fileList"
          :on-change="fileChangeHandler"
          :on-success="fileSuccessHandler"
          :on-error="fileErrorHandler"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
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
    }
  },
  computed: {
    uploadActionUrl() {
      return `${window.window.FreelogApp.Env.qiOrigin}/v1/resources/temporaryFiles/uploadResourceFile`
    },
    resourceTypes() {
      var types = Object.values(RESOURCE_TYPES)
      return types
    }
  },
  watch: {
    selectType() {
      this.uploadData.resourceType = this.selectType
    }
  },
  methods: {
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
  
</style>

<style lang="less">
  #f-operation {
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
