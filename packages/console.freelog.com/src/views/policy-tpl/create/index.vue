<template>
  <section>
    <el-form :model="data" label-width="120px" :rules="rules" class="input-form" ref="createForm">
      <el-form-item :label="$t('policy.tplName')" prop="name" required>
        <el-input v-model="data.name"/>
      </el-form-item>
      <el-form-item :label="$t('policy.tplDesc')" prop="template" required>
        <el-input type="textarea"
                  :rows="15"
                  :placeholder="$t('policy.inputTip')"
                  v-model="data.template">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="validatePolicy">{{ $t('policy.checkBtnText')}}</el-button>
        <el-button type="primary" @click="submitHandler">{{ $t('common.createText') }}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import PolicyTplCreator from './index'

export default PolicyTplCreator
</script>

<style lang="less" scoped>
  .input-form {
    width: 50%;
  }
</style>
