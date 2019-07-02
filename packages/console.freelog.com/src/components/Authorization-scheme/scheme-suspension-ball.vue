<template>
  <div @click.stop="function() {}" v-if="isShow">
    <div class="suspension-ball" @click="toggleSuspensionSchemeList">
      <span class="suspension-count" v-if="selectedAuthSchemes.length || unResolveAuthResources.length">{{selectedAuthSchemes.length + unResolveAuthResources.length}}</span>
      <span class="suspension-icon-list" v-else>
          <span></span>
          <span></span>
          <span></span>
        </span>
    </div>
    <div class="suspension-list-box" v-if="isShowSuspensionSchemeList">
      <div class="selected-authschemes-box" v-if="selectedAuthSchemes.length">
        <h3>{{$t('components.authScheme.selectedSchemesTitle')}}</h3>
        <ul>
          <li
                  v-for="(item, index) in selectedAuthSchemes"
                  :key="'selectedAuthScheme-'+index"
          >
            <div class="suspension-lb-row-1">{{item.resourceName}}</div>
            <div class="suspension-lb-row-2">
              <span>{{item.authSchemeName}}</span>
              <span>{{item.policyName}}</span>
            </div>
          </li>
        </ul>
      </div>
      <p v-if="selectedAuthSchemes.length === 0 && unResolveAuthResources.length === 0">{{$t('components.authScheme.selectTip')}}</p>
      <div class="unresolve-authschemes-box" v-if="unResolveAuthResources.length">
        <h3>{{$t('components.authScheme.unhandledListTitle')}}</h3>
        <ul>
          <li
                  v-for="(item, index) in unResolveAuthResources"
                  :key="'unResolveAuthResources-'+index"
          >
            <div class="suspension-lb-row-1">{{item.resourceName}}</div>
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
      unResolveAuthResources: Array,
    },
    data() {
      return {
        isShowSuspensionSchemeList: false,
        isRegisterGlobalClickEvent: false,
      }
    },
    methods: {
      toggleSuspensionSchemeList() {
        this.isShowSuspensionSchemeList = !this.isShowSuspensionSchemeList
        if(!this.isRegisterGlobalClickEvent) {
          this.isRegisterGlobalClickEvent = true
          document.addEventListener('click', this.hideSuspensionSchemeList)
        }
      },
      hideSuspensionSchemeList() {
        if(this.isShowSuspensionSchemeList) {
          this.isShowSuspensionSchemeList = false
        }
      },
    },
  }
</script>

<style type="text/less" lang="less" scoped>

  .suspension-ball {
    position: fixed; bottom: 65px; right: 50px; z-index: 20;
    width: 46px; height: 46px; border-radius: 50%;
    background-color: #FFFFFF; box-shadow: 0 2px 7px 0 rgba(68, 151, 236, .4); text-align: center; cursor: pointer;

    .suspension-count { line-height: 46px; font-size: 16px; color: #4497EC; }
    .suspension-icon-list {
      display: block;
      position: relative; top: 50%; transform: translateY(-50%);
      text-align: center;

      span { display: block; width: 20px; height: 2px; margin: auto; background-color: #666; }
      span:not(:first-child) {
        margin-top: 5px;
      }
    }
  }

  .suspension-list-box {
    overflow-y: auto;
    position: fixed; bottom: 85px; right: 75px; z-index: 5;
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

    li { margin-top: 10px; border-bottom: 1px solid #D8D8D8; }
    p { padding: 20px 0; font-size: 14px; color: #999; text-align: center; }

    .suspension-lb-row-1{ margin-bottom: 10px; font-size: 14px; color: #555; }
    .suspension-lb-row-2 {
      margin-bottom: 10px; color: #666;

      span {
        padding-right: 10px;
        &:not(:first-child) { padding-left: 10px; border-left: 1px solid #979797; }
      }
    }

    .selected-authschemes-box { margin-bottom: 20px; }
    .unresolve-authschemes-box {

    }
  }
</style>