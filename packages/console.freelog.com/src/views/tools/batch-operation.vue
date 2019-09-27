<template>
  <div id="f-operation">
    <div class="fo-main-content">
      <div class="fo-upload-wrapper">
        <div class="upload-operation-box">
          <el-select class="fo-upload-select" v-model="selectType" placeholder="请选择资源类型">
            <el-option v-for="type in resourceTypes" :key="type" :label="type" :value="type"></el-option>
          </el-select>
          <el-button type="primary" @click="createResources">上传并创建资源</el-button>
          <el-button type="danger" @click="clearFileList">清空</el-button>
        </div>
        <el-upload class="upload-box" ref="foUpload"
          drag
          multiple
          action="/v1/resources/temporaryFiles/uploadResourceFile"
          :data="uploadData"
          :file-list="fileList"
          :on-change="fileChangeHandler"
          :on-success="fileSuccessHandler"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div class="fo-list-box">
        <tool-resource-list></tool-resource-list>
      </div>
    </div>
  </div>
</template>

<script>
import { RESOURCE_TYPES } from '@/config/resource.js'
import toolResourceList from './resource-list.vue'
export default {
  name: "batch-operation",
  components: {
    toolResourceList, 
  },
  data() {
    return {
      selectType: '',
      fileList: [],
      existedFilesSet: new Set(),
      errorFilesSet: new Set(),
      uploadData: {
        resourceType: "image"
      }
    }
  },
  computed: {
    resourceTypes() {
      var types = Object.values(RESOURCE_TYPES)
      return types
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
      .upload-operation-box {
        width: 500px; margin: 20px auto;
        .fo-upload-select {
          margin-right: 10px;
        }
      }
      
      .fo-upload-wrapper {
        text-align: center;
        .upload-box {
          display: inline-block;
        }
      }
      .fo-list-box {
        margin-top: 30px;
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
