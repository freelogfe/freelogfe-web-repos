<template>
  <div class="my-profile-view" v-if="session">
    <el-form label-width="0"
             label-position="left">
      <el-form-item class="profile-info-item" :class="[avatarCls]" :label="$t('profile.userAvatar')">
        <el-button type="text" class="user-avatar-btn" @click="showImageCropUploader=true">
          <img v-show="session.avatarUrl" class="user-avatar" :src="session.avatarUrl" @error="imgErrorHandler"
               :alt="$t('profile.userAvatar')">
          <span v-if="!session.avatarUrl">{{$t('profile.editAvatar')}}</span>
          <div class="edit-avatar-part">{{$t('profile.editAvatar')}}</div>
        </el-button>
        <crop-image v-model="showImageCropUploader"
                    :avatarUrl="session.avatarUrl"
                    :upload-success="uploadSuccessHandler"></crop-image>
      </el-form-item>
      <el-form-item class="profile-info-item" :label="$t('profile.userName')">
        {{session.userName?session.userName: $t('profile.noUserAvatar')}}
      </el-form-item>
      <el-form-item class="profile-info-item" :label="$t('profile.userNickname')">
        {{session.nickname}}
        <!--<el-input size="small" type="password" v-model="password" style="width: 200px;"></el-input>-->
      </el-form-item>
      <el-form-item class="profile-info-item" :label="$t('profile.email')">
        {{session.email}}
      </el-form-item>
      <el-form-item class="profile-info-item" :label="$t('profile.phoneNumber')">
        {{session.mobile?session.mobile: $t('profile.noPhoneNumber')}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CropImage from '@/components/CropImage/index.vue'

export default {
  name: 'my-profile',

  data() {
    return {
      showImageCropUploader: false,
      avatarCls: ''
    }
  },

  components: { CropImage },

  computed: {
    ...mapGetters({
      session: 'session'
    })
  },

  mounted() {
  },

  watch: {
    'session.avatarUrl': function avatarUrl() {
      if (this.session.avatarUrl) {
        this.avatarCls = ''
      }
    }
  },
  methods: {
    imgErrorHandler() {
      this.avatarCls = 'not-found-img'
      this.$store.dispatch('changeAvatar', '')
    },
    uploadSuccessHandler() {
      this.$store.dispatch('changeAvatar')
      this.showImageCropUploader = false
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
  .my-profile-view {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    .not-found-img {
      .user-avatar-btn span {
        width: 82px;
        height: 82px;
        line-height: 82px;
        display: inline-block;
        border: 1px solid #EEEEEE;
        border-radius: 50%;
      }
    }
    .user-avatar-btn {
      position: relative;

      .edit-avatar-part {
        position: absolute; top: 13px; left: 0;
        width: 83px; height: 83px; border-radius: 50%;
        line-height: 83px; background-color: #333333; color: white;
        transition: all .3s; transform: scale(0); opacity: 0;
      }

      &:hover .edit-avatar-part{
        transform: scale(1); opacity: .8;
      }
    }
    .user-avatar {
      border-radius: 50%;
      width: 83px;
      height: 83px;
      margin-right: 20px;
      border: 1px solid #EEEEEE;
    }
    .profile-info-item {
      border-bottom: 1px solid #ededed;
      width: 400px;
      color: #999;
      margin-bottom: 5px;
      padding: 0 20px;
      display: flex;
      align-items: center;
    }
  }
</style>


<style lang="less" type="text/less">
  .my-profile-view {
    .profile-info-item .el-form-item__label {
      width: 110px !important;
    }
  }
</style>
