<template>
  <div class="account-layout-view">
    <header>
      <span>{{title}}</span>
      <nav @click="cancelHandler"><i class="el-icon-arrow-left"></i> {{$t('common.backText')}}</nav>
    </header>

    <div class="account-sub-view-wrap">
      <slot></slot>
      <div class="form-ft" v-if="showFooter">
        <el-button class="ft-btn" @click="cancelHandler">{{$t('common.cancelText')}}</el-button>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'account-action-layout-view',

  data() {
    return {}
  },

  props: {
    title: String,
    showFooter: {
      type: Boolean,
      default: true
    },
    returnName: {
      type: String,
      default: '/user/accounts'
    },
    goBackFn: Function
  },

  mounted() {
  },

  methods: {
    cancelHandler() {
      this.goBack()
    },
    goBack() {
      if (typeof this.goBackFn === 'function') {
        this.goBackFn()
      } else {
        this.$router.push(this.returnName)
      }
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
  .account-layout-view {
    .account-sub-view-wrap {
      margin-top: 30px;
      padding-bottom: 30px;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
    }
    header {
      font-size: 16px;
      padding: 20px;

      span {
        font-weight: bold;
        color: #000000;
      }

      i {
        font-style: normal;
        font-size: 25px;
        vertical-align: top;
        line-height: 23px;
        font-weight: 200;
      }

      nav {
        float: right;
        cursor: pointer;
        color: #666666;
      }
    }

    .form-ft {
      text-align: center;
      margin-top: 50px;
      padding-bottom: 30px;
      .ft-btn {
        padding-right: 35px;
        padding-left: 35px;
      }

      .ft-btn + .ft-btn {
        margin-left: 30px;
      }
    }
  }
</style>
