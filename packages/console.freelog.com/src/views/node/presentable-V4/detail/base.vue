<template>
  <div class="presentable-detail-base-wrap">
    <div class="p-d-b-w-row">
      <label>{{$t('presentable.id')}}</label>
      {{presentable.presentableId}}
    </div>
    <div class="p-d-b-w-row">
      <label>{{$t('presentable.name')}}</label>
      <el-input v-model="presentableName" size="medium"></el-input>
    </div>
    <div class="p-d-b-w-row">
      <label>{{$t('presentable.label')}}</label>
      <div style="padding-left: 150px;">
        <FreelogTags v-model="userDefinedTags"
                     class="p-user-tags"
                     :actionText="$t('presentable.addLabel')"
                     @input="changeTagsHandler">
        </FreelogTags>
      </div>
    </div>
    <div class="p-d-b-w-row save-box">
      <el-button type="primary" @click="onSubmit">{{$t('common.save')}}</el-button>
    </div>
  </div>
</template>

<script>
  import FreelogTags from '@/components/Tags/index.vue'

  export default {
    name: 'presentable-detail-base',
    data() {
      return {
        presentableName: '',
        userDefinedTags: []
      }
    },
    props: {
      presentable: Object
    },
    components: {
      FreelogTags,
    },
    methods: {
      changeTagsHandler(userDefinedTags) {
        this.userDefinedTags = userDefinedTags
      },
      onSubmit() {
        this.savePresentableHandler({
          userDefinedTags: this.userDefinedTags,
          presentableName: this.presentableName
        })
      },
      savePresentableHandler(payload) {
        this.$services.presentables.put(this.$route.params.presentableId, payload)
          .then(res => {
            const {errcode, ret, msg} = res.data
            if (errcode === 0 && ret === 0) {
              this.presentable.presentableName = this.presentableName
              this.presentable.userDefinedTags = this.userDefinedTags.slice(0)
            } else {
              this.$error.showErrorMessage(msg)
            }
          }).catch(this.$error.showErrorMessage)
      },
      setData(presentable) {
        if (!presentable.presentableId) return
        this.presentableName = presentable.presentableName
        this.userDefinedTags = presentable.userDefinedTags.slice(0)
      }
    },

    watch: {
      presentable(){
        this.setData(this.presentable)
      }
    },
    mounted() {
      this.setData(this.presentable)
    },
  }
</script>
<style scoped lang="less" type="text/less">
  .presentable-detail-base-wrap {
    label {
      float: left;
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      width: 150px;
      padding-left: 8px;
      font-size: 14px;
      color: #666;

      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        z-index: 1;
        transform: translateY(-50%);
        content: '';
        display: block;
        width: 3px;
        height: 14px;
        background-color: #666;
      }
    }

    .el-input {
      width: 400px;
    }

    .p-d-b-w-row {
      position: relative;
      margin-top: 50px;

      &.save-box {
        padding-left: 150px;
      }
      .el-button {
        width: 90px;
        margin-right: 20px;
        border-radius: 20px;
      }
    }
  }
</style>
