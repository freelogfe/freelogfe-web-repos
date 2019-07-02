<template>
  <section class="meta-editor-wrap">
    <el-alert
      :title="errorMsg"
      show-icon
      v-show="errorMsg"
      @close="clearErrorMsg"
      style="margin-bottom: 15px"
      type="error">
    </el-alert>
    <codemirror :code="data"
                :options="editorOptions"
                ref="codeMirror"
                :placeholder="$t('metaInput.metaJSONError')"
                @input="onCodeChange">
    </codemirror>
  </section>
</template>

<script>
import ResourceMetaInfo from './index'

export default ResourceMetaInfo
</script>

<style lang="less">
  /*@import "index.less";*/

</style>

