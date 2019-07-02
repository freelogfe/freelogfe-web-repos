<template>
  <div @click.stop="function() {}" v-if="isShow">
    <div class="float-ball" @click="toggleSchemeList">
      <span class="float-count" v-if="selectedAuthSchemes.length || upcastReleases.length">{{selectedAuthSchemes.length + upcastReleases.length}}</span>
      <span class="float-icon-list" v-else>
          <span></span>
          <span></span>
          <span></span>
        </span>
    </div>
    <div class="float-list-box" v-if="isShowSchemeList">
      <div class="selected-authschemes-box" v-if="selectedAuthSchemes.length">
        <h3>{{$t('components.authScheme.selectedSchemesTitle')}}</h3>
        <ul>
          <li
                  v-for="(item, index) in selectedAuthSchemes"
                  :key="'selectedAuthScheme-'+index"
          >
            <div class="float-lb-row-1">
              <span class="s-a-b-name">{{item.releaseName}}</span>
              <span class="s-a-b-policy-name" v-for="p in item.selectedPolicies">{{p.policyName}}</span>
            </div>
          </li>
        </ul>
      </div>
      <p v-if="selectedAuthSchemes.length === 0 && upcastReleases.length === 0">{{$t('components.authScheme.selectTip')}}</p>
      <div class="upcast-releases-box" v-if="upcastReleases.length">
        <h3>{{$t('components.authScheme.unhandledListTitle')}}</h3>
        <ul>
          <li
                  v-for="(item, index) in upcastReleases"
                  :key="'upcastReleases-'+index"
          >
            <div class="float-lb-row-1"><i class="el-icon-top"></i>{{item.releaseName}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      selectedAuthSchemes: Array,
      upcastReleases: Array,
    },
    data() {
      return {
        isShowSchemeList: false,
        isRegisterGlobalClickEvent: false,
      }
    },
    methods: {
      toggleSchemeList() {
        this.isShowSchemeList = !this.isShowSchemeList
        if(!this.isRegisterGlobalClickEvent) {
          this.isRegisterGlobalClickEvent = true
          document.addEventListener('click', this.hideSchemeList)
        }
      },
      hideSchemeList() {
        if(this.isShowSchemeList) {
          this.isShowSchemeList = false
        }
      },
    },
  }
</script>

<style type="text/less" lang="less" scoped>

  .float-ball {
    width: 46px; height: 46px; border-radius: 50%;
    background-color: #FFFFFF; box-shadow: 0 2px 7px 0 rgba(68, 151, 236, .4); text-align: center; cursor: pointer;

    .float-count { line-height: 46px; font-size: 16px; color: #4497EC; }
    .float-icon-list {
      display: block;
      position: relative; top: 50%; transform: translateY(-50%);
      text-align: center;

      span { display: block; width: 20px; height: 2px; margin: auto; background-color: #666; }
      span:not(:first-child) {
        margin-top: 5px;
      }
    }
  }

  .float-list-box {
    overflow-y: auto;
    position: absolute; bottom: 25px; right: 25px; z-index: -1;
    width: 390px; max-height: 420px; padding: 20px;
    border: 1px solid #DADADA; border-radius: 4px;
    background-color: #FFF;

    h3 {
      position: relative;
      padding-left: 8px;
      font-size: 14px;
      color: #666;

      &:before{
        position: absolute; left: 0; top: 50%; z-index: 1; transform: translateY(-50%);
        content: '';
        display: block;
        width: 3px; height: 14px;
        background-color: #666;
      }
    }

    li { margin-top: 15px; }
    p { padding: 20px 0; font-size: 14px; color: #999; text-align: center; }

    .float-lb-row-1{
      margin-bottom: 10px; font-size: 14px; color: #333;
      .el-icon-top {
        position: relative; top: 1px;
        margin-right: 5px; font-weight: bold; color: #EA7171;
      }
      .s-a-b-name {
        position: relative;
        padding-left: 20px; margin-right: 30px; color: #333333;
        &:before {
          content: '';
          position: absolute; top: 50%; left: 0; z-index: 1;
          width: 12px; height: 12px; margin-top: -6px; border-radius: 50%;
          background-color: #84CCA8;
        }
      }
      .s-a-b-policy-name {
        padding: 4px 10px; margin-right: 8px; border:1px solid #A5D1FF; border-radius:2px;
        font-size: 14px; background-color: #E9F4FF; color: #409EFF;
      }
    }
    .float-lb-row-2 {
      margin-bottom: 10px; color: #666;

      span {
        padding-right: 10px;
        &:not(:first-child) { padding-left: 10px; border-left: 1px solid #979797; }
      }
    }

    .selected-authschemes-box { margin-bottom: 40px; }
    .upcast-releases-box {

    }
  }
</style>
