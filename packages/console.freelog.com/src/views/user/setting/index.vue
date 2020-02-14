<!--<template>-->
<!--  <div class="user-setting-view">-->
<!--    <el-form label-width="120px" label-position="left" class="small-el-form" :rules="rules">-->
<!--      <el-form-item class="flex-grid" :label="$t('settingView.avatar')">-->
<!--        <el-button @click="showImageCropUploader=true" type="text">-->
<!--          <img :src="userInfo.headImage" class="user-avatar" alt="">-->
<!--        </el-button>-->
<!--        <CropImage v-model="showImageCropUploader"-->
<!--                   :avatarUrl="avatarUrl"-->
<!--                   :upload-success="uploadSuccessHandler"></CropImage>-->
<!--      </el-form-item>-->
<!--      <el-form-item class="flex-grid" :label="$t('settingView.username')">-->
<!--        <el-input v-model="userInfo.userName" disabled class="input-area"-->
<!--                  :placeholder="$t('settingView.usernameTip')"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item class="flex-grid" :label="$t('settingView.nickname')">-->
<!--        <el-input v-model="userInfo.nickname" disabled class="input-area"-->
<!--                  :placeholder="$t('settingView.nicknameTip')"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item class="flex-grid" :label="$t('settingView.email')">-->
<!--        <el-input v-model="userInfo.email" disabled class="input-area"-->
<!--                  placeholder="未设置邮箱"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item class="flex-grid" :label="$t('settingView.mobilePhone')">-->
<!--        <el-input v-model="userInfo.mobile" disabled class="input-area"-->
<!--                  :placeholder="$t('settingView.mobilePhoneTip')"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item class="form-footer">-->
<!--        &lt;!&ndash;<el-button type="primary" plain @click="saveHandler">{{$t('common.save')}}</el-button>&ndash;&gt;-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import CropImage from '@/components/CropImage/index.vue'-->
<!--  import {mapGetters} from 'vuex'-->

<!--  export default {-->
<!--    name: 'user-setting-view',-->

<!--    data() {-->
<!--      return {-->
<!--        rules: {},-->
<!--        userInfo: {},-->
<!--        avatarUrl: '',-->
<!--        showImageCropUploader: false-->
<!--      }-->
<!--    },-->
<!--    components: {CropImage},-->

<!--    computed: mapGetters({-->
<!--      session: 'session'-->
<!--    }),-->

<!--    mounted() {-->
<!--      this.userInfo = this.session.user-->
<!--      this.avatarUrl = this.userInfo.headImage-->
<!--    },-->

<!--    methods: {-->
<!--      saveHandler() {-->

<!--      },-->
<!--      uploadSuccessHandler() {-->
<!--        this.showImageCropUploader = false-->
<!--        this.$store.dispatch('changeAvatar')-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--  .user-setting-view {-->
<!--    padding-top: 50px;-->
<!--    width: 860px;-->
<!--    margin: auto;-->
<!--    .user-avatar {-->
<!--      border-radius: 50%;-->
<!--      width: 140px;-->
<!--      height: 140px;-->
<!--    }-->

<!--    .input-area {-->
<!--      width: 680px;-->
<!--    }-->

<!--    .form-footer {-->
<!--      text-align: center;-->
<!--    }-->
<!--  }-->
<!--</style>-->

<!--<style lang="less">-->
<!--  .user-setting-view {-->
<!--    .small-el-form {-->
<!--      .el-form-item {-->
<!--        margin-bottom: 50px;-->
<!--        .el-form-item__label {-->
<!--          &:before {-->
<!--            content: ' ';-->
<!--            display: inline-block;-->
<!--            width: 3px;-->
<!--            background-color: #666666;-->
<!--            height: 14px;-->
<!--            margin-right: 5px;-->
<!--            vertical-align: middle;-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .el-input__inner {-->
<!--      border: none;-->
<!--      border-bottom: 1px solid #E0E0E0;-->
<!--      border-radius: 0;-->
<!--    }-->
<!--  }-->
<!--</style>-->
