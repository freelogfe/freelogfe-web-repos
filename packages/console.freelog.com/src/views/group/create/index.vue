<!--<template>-->
<!--  <section class="group-form-container">-->
<!--    <el-form :model="detail" :rules="formRules" ref="dataForm" label-width="100px" class="group-form">-->
<!--      <el-form-item label="分组描述" prop="groupName" required>-->
<!--        <el-input v-model="detail.groupName"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="分组类型" prop="groupType" required>-->
<!--        <el-select v-model="detail.groupType" @change="changeGroupType" placeholder="请选择">-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="分组成员" prop="members" required>-->
<!--        <group-member-selector v-model="detail.members" :group-type="detail.groupType"></group-member-selector>-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="submitForm('dataForm')">创建分组</el-button>-->
<!--        <el-button @click="goBackHandler">取消</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--  </section>-->
<!--</template>-->

<!--<script>-->
<!--import GroupCreator from './index'-->

<!--export default GroupCreator-->
<!--</script>-->

<!--<style lang="less" scoped>-->
<!--.group-form {-->
<!--  max-width: 800px;-->
<!--}-->
<!--</style>-->
