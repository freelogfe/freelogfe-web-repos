<template>
  <div class="crop-image-wrap">
    <slot></slot>
    <el-dialog :visible.sync="show"
               width="550px"
               :before-close="handleClose">
      <div class="crop-image-bd">
        <div class="crop-img-container">
          <div v-show="imageUrl" class="crop-img-selection">
            <img :src="imageUrl" crossOrigin="anonymous" class="avatar" ref="avatarRef" alt="">
          </div>
          <el-upload
                  :action="updateAction"
                  class="avatar-uploader"
                  :with-credentials="true"
                  ref="uploader"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="changeImageHandler"
                  :on-success="handleAvatarSuccess">
            <el-button v-if="imageUrl">{{$t('cropImage.imageReupload')}}</el-button>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button class="save-crop-img-btn" v-if="imageUrl" type="primary" @click="saveCropImageHandler">{{$t('cropImage.save')}}
          </el-button>
        </div>
        <div v-if="imageUrl" class="crop-img-preview"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cropper from 'cropperjs'

require('cropperjs/dist/cropper.css')

export default {
  name: 'crop-image',
  data() {
    return {
      imageUrl: '',
      show: false
    }
  },

  props: {
    value: {
      type: Boolean,
      default: true
    },
    uploadSuccess: Function,
    avatarUrl: String
  },

  mounted() {
    this.show = this.value
    this.imageUrl = this.avatarUrl || ''
    if (this.imageUrl) {
      this.initCropper()
    }
  },

  watch: {
    value() {
      this.show = this.value
      if (this.imageUrl) {
        setTimeout(() => {
          this.initCropper()
        })
      }
    },
    avatarUrl() {
      this.imageUrl = this.avatarUrl || ''
    }
  },

  methods: {
    initCropper() {
      if (!this.$refs.avatarRef) return

      if (this.cropper) {
        this.cropper.replace(this.imageUrl)
      } else {
        this.cropper = new Cropper(this.$refs.avatarRef, {
          aspectRatio: 1,
          viewMode: 1,
          center: true,
          highlight: true,
          cropBoxMovable: true,
          cropBoxResizable: true,
          ready() {
          },
          preview: '.crop-img-preview'
        })
      }
    },
    handleClose() {
      this.show = false
      this.$emit('input', false)
    },
    changeImageHandler(file) {
      this.imageUrl = file.url || URL.createObjectURL(file.raw)
      setTimeout(() => {
        this.initCropper()
      })
    },
    handleAvatarSuccess(res) {
      if (!res.ret && !res.errcode) {
        if (typeof this.uploadSuccess === 'function') {
          this.uploadSuccess(res.data)
        }
        this.$emit('success', res.data)
      } else {
        this.$error.showErrorMessage(res.msg)
      }
    },
    saveCropImageHandler() {
      const canvas = this.cropper.getCroppedCanvas({
        width: 160,
        height: 160
      })

      canvas.toBlob((blob) => {
        const file = new File([blob], 'avatar.png')
        const { uploader } = this.$refs
        uploader.clearFiles()
        uploader.handleStart(file)
        uploader.submit()
      })
    }
  },

  computed: {
    updateAction() {
      return `${window.FreelogApp.Env.qiOrigin}/v1/userinfos/uploadHeadImg`
    }
  }
}
</script>

<style lang="less" type="text/less">
  @ImgContainerHeight: 300px;
  .crop-image-wrap {
    .crop-image-bd {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .crop-img-container {
      text-align: center;

      .crop-img-selection {
        height: @ImgContainerHeight;
        width: @ImgContainerHeight;
        margin-bottom: 15px;
      }
    }

    .save-crop-img-btn {
      vertical-align: top;
      margin-left: 20px;
    }

    .crop-img-preview {
      width: 83px;
      height: 83px;
      overflow: hidden;
      border-radius: 50%;
      border: 1px solid #999;
      margin-left: 50px;
      margin-top: -50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .avatar-uploader {
      /*.el-upload {*/
      /*border-radius: 6px;*/
      /*cursor: pointer;*/
      /*position: relative;*/
      /*overflow: hidden;*/
      /*}*/
      display: inline-block;
      .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: @ImgContainerHeight;
        height: @ImgContainerHeight;
        line-height: @ImgContainerHeight;
        text-align: center;
        border: 1px dashed #d9d9d9;
      }
    }
  }
</style>
