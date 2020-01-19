<template>
  <section>
    <el-form label-position="right"
             class="small-el-form"
             ref="detailForm"
             :model="detail"
             :rules="rules"
             :inline-message="true"
             label-width="120px">
      <el-form-item label="ID" class="flex-grid">
        {{detail.id}}
      </el-form-item>
      <el-form-item :label="$t('policy.templateDescription')" prop="name" class="flex-grid" style="height: 40px" :required="isEditMode">
        <el-input v-model="detail.name" v-if="isEditMode" style="width:600px"/>
        <span v-else>{{detail.name}}</span>
      </el-form-item>
      <el-form-item :label="$t('policy.templateType')" class="flex-grid">
        {{resolveType(detail.templateType) | pageBuildFilter}}
      </el-form-item>
      <el-form-item :label="$t('policy.status')" class="flex-grid">
        {{resolveStatus(detail.status)}}
      </el-form-item>
      <el-form-item :label="$t('policy.createDate')" class="flex-grid">
        {{detail.createDate|fmtDate}}
      </el-form-item>
      <el-form-item :label="$t('policy.policy')" :required="isEditMode" prop="template">
        <el-input type="textarea"
                  :rows="10"
                  style="width:600px"
                  v-model="detail.template"
                  v-if="isEditMode"/>
        <pre v-else>{{detail.template}}</pre>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeModeHandler">{{(isEditMode ? $t('policy.save') : $t('policy.alter'))}}</el-button>
        <el-button type="primary" plain @click="cancelEditMode" v-show="isEditMode">{{$t('policy.cancel')}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import PolicyTplDetail from './index'

export default PolicyTplDetail
</script>

<style lang="less" scoped>

</style>
