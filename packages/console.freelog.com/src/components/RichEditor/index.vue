<template>
  <div class="rich-editor-wrapper" :class="{'full-screen': isFullscreen}">
    <quill-rich-editor v-model="content"
                       class="rich-text-editor"
                       ref="richEditor"
                       :options="editorOption"
                       @change="onEditorChange($event)">
    </quill-rich-editor>

    <el-dialog
      :visible.sync="showImgUploader"
      center
      width="500px">
      <el-upload
        class="rich-editor-upload-img"
        drag
        :with-credentials="true"
        :action="qiHostname"
        ref="imgUploader"
        :on-success="uploadImageSuccessHandler"
        :on-error="uploadImageErrorHandler"
        :auto-upload="true">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('components.richEditor.uploadTip')}}</div>
      </el-upload>
    </el-dialog>

  </div>

</template>

<script>
import RichEditor from './index'

export default RichEditor
</script>

<style lang="less">
  @import "index.less";
</style>
