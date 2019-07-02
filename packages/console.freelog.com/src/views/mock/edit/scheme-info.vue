<template>
  <div class="resource-scheme-info-wrap">
    <el-form label-position="left" label-width="140px">
      <el-form-item :label="$t('scheme.schemeName')" class="scheme-input-item">
        <el-input v-model="form.authSchemeName" size="medium" style="width: 500px;" :placeholder="$t('scheme.schemeNameInputPlaceholder')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('scheme.schemeStatus')" class="scheme-input-item">
        <div class="res-scheme-status-switch" :class="[form.isOnline? 'on-active': 'off-active']">
          <div class="scheme-switch-state on-state" @click="toggleStateHandler(1)">
            <i class="el-icon-circle-check-outline"></i>{{$t('resourceEditView.enableText')}}
          </div>
          <div class="scheme-switch-state off-state" @click="toggleStateHandler(0)">
            <i class="el-icon-remove-outline"></i>{{$t('resourceEditView.disableText')}}
          </div>
        </div>
      </el-form-item>
      <el-form-item class="ft-wrap">
        <el-button @click="updateSchemeDetail" class="ft-btn" round type="primary">{{$t('common.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import FreelogSwitch from '@/components/Switch/index.vue'

  export default {
    name: 'resource-scheme-info',

    data() {
      return {
        form: {
          authSchemeName: '',
          isOnline: 0
        },
        loading: false
      }
    },

    components: {FreelogSwitch},
    props: {
      scheme: {
        type: Object,
        default() {
          return {}
        }
      }
    },

    watch: {
      scheme() {
        this.setData(this.scheme)
      }
    },

    mounted() {
      this.setData(this.scheme)
      // this.$on('show', this.showHandler)
    },

    methods: {
      showHandler(){
        // this.resetSchemeDetail()
      },
      setData(scheme) {
        this.form.isOnline = (scheme.status === 1) ? 1 : 0
        this.form.authSchemeName = scheme.authSchemeName
      },
      toggleStateHandler(isOnline) {
        this.form.isOnline = isOnline
      },
      updateSchemeDetail() {
        if (this.loading) return

        this.loading = true

        this.$services.authSchemes.put(this.scheme.authSchemeId, this.form)
          .then(res => {
            const {errcode, ret, msg, data} = res.data
            if (errcode === 0 && ret === 0) {
              Object.assign(this.scheme, data)
              this.setData(this.scheme)
              this.$message.success(this.$t('common.saveSuccess'))
            } else {
              this.$error.showErrorMessage(msg)
            }
          }).catch(this.$error.showErrorMessage)
          .finally(() => {
            this.loading = false
          })
      },
      resetSchemeDetail() {
        this.setData(this.scheme)
      }
    }
  }
</script>

<style lang="less" scoped>
  .resource-scheme-info-wrap {
    padding-top: 30px;

    .ft-wrap {
      .ft-btn {
        padding: 12px 40px;
        margin-right: 10px;
      }
    }

    .scheme-input-item {
      margin-bottom: 50px;
    }

    .res-scheme-status-switch {
      &.on-active {
        .on-state {
          background-color: #84CCA8;
        }
      }

      &.off-active {
        .off-state {
          background-color: #E27C80;
        }
      }
      display: inline-block;
      border-radius: 20px;
      background: #dddddd;
    }

    .scheme-switch-state {
      display: inline-block;
      padding: 0 40px;
      border-radius: 20px;
      color: white;
      cursor: pointer;
      transition: background-color .3s;
      i {
        font-size: 20px;
        margin-right: 3px;
        vertical-align: middle;
      }
    }
  }
</style>


<style lang="less">
  .resource-scheme-info-wrap {
    .scheme-input-item {
      .el-form-item__label {
        &:before {
          content: '';
          display: inline-block;
          width: 3px;
          background: #666666;
          height: 14px;
          margin-right: 5px;
          vertical-align: middle;
          margin-top: -2px;
        }
      }
    }
  }
</style>