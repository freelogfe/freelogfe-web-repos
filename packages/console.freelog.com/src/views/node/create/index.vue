<template>
  <section class="node-creator-container">
    <el-form :model="dataForm" :rules="formRules" ref="dataForm" label-width="0" class="node-form">
      <el-form-item prop="nodeDomain" class="node-creator-input-item">
        <input type="text" v-model="dataForm.nodeDomain"
               class="node-creator-input"
               :placeholder="$t('node.createPlaceholders.domain')">
        <span class="node-domain-postfix">{{domainPostfix}}</span>
      </el-form-item>
      <el-form-item prop="nodeName" class="node-creator-input-item">
        <input type="text" v-model="dataForm.nodeName"
               class="node-creator-input"
               :placeholder="$t('node.createPlaceholders.name')">
      </el-form-item>
      <el-form-item class="ft-btns">
        <el-button class="ft-btn" round @click="goBackHandler">{{$t('common.cancel')}}</el-button>
        <el-button class="ft-btn" round type="primary" @click="submitForm('dataForm')">{{$t('node.createNode')}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import NodeCreator from './index'

export default NodeCreator
</script>

<style lang="less" scoped>
  @import "../../../styles/footer.less";
  @import "index.less";
</style>

<style>
  .node-creator-container .node-form .node-creator-input-item > .el-form-item__content {
    display: flex;
    height: 30px;
    line-height: 30px;
    padding-bottom: 10px;
  }
</style>
