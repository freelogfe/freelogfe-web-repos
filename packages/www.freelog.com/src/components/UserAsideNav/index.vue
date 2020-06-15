<template>
  <div style="width: 0;">
    <el-aside width="280px" class="user-aside-nav-wrap" v-if="user">
      <div class="user-portrait">
        <div class="center">
          <a href="javascript:;" @click="gotoMyProfile">
            <div class="portrait-img">
              <el-button type="text" class="user-avatar-btn" @click="showImageCropUploader=true">
              <img v-show="avatarUrl" class="user-avatar" :src="avatarUrl" @error="imgErrorHandler"
                  :alt="$t('profile.userAvatar')">
              <span v-if="!avatarUrl">{{$t('common.avatarPlaceholder')}}</span>
              <div class="edit-avatar-part">{{$t('profile.editAvatar')}}</div>
            </el-button>
            </div>
          </a>
          <p class="user-name">{{user.username}}</p>
          <p class="user-mobile">{{user.mobile || user.email}}</p>
        </div>
      </div>

      <ul class="user-nav-tabs">
        <li class="user-nav-item"
            @click="switchNavHandler(navItem)"
            :class="{active: navItem.name=== activeNavName}"
            :nav-name="navItem.name"
            :key="navItem.name"
            v-for="(navItem, index) in navs">
          {{$t(`userAsideNav.title[${index}]`)}}
        </li>
      </ul>
    </el-aside>
    <crop-image v-model="showImageCropUploader"
                :avatarUrl="avatarUrl"
                :upload-success="uploadSuccessHandler"></crop-image>
  </div>
</template>

<script>
import UserAsideNav from './index'

export default UserAsideNav
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
