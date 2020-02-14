<!--<i18n src="../../i18n-locales/contractSigning.json"></i18n>-->
<template>
  <div class="rcb-remark" >
    <div class="rcb-r-left">
      <template v-if="!isEditRemark">
        <span
                v-if="currentRemark === ''"
                class="rcb-add-remark"
                id="rcb-remak"
                @click="toggleEditRemark('add')"
        >{{$t('contractSigning.addRemark')}}<i class="el-icon-plus"></i></span>
        <span v-else  @click="toggleEditRemark('update')"> {{$t('contractSigning.editRemark')}} <i class="el-icon-edit-outline"></i></span>
      </template>
      <span v-else  @click="saveRemark('update')"> {{$t('contractSigning.saveRemark')}}</span>
    </div>
    <div class="rcb-r-right">
        <textarea
                v-if="isEditRemark"
                name="rcb-remak"
                v-model="targetRemark"
                rows="2"
                @blur.native="updateRemark">
        </textarea>
      <div v-else>{{targetRemark}}</div>
    </div>
  </div>
</template>

<script>
  import en from '@freelog/freelog-i18n/ui-contract/en';
  import zhCN from '@freelog/freelog-i18n/ui-contract/zh-CN';

  export default {
    name: 'contract-remark',
    i18n: {
      messages: {
        en,
        'zh-CN': zhCN,
      }
    },
    props: {
      contract: {
        type: Object
      }
    },
    components: {},
    data() {
      return {
        isEditRemark: false,
        targetRemark: '',
        currentRemark: '',
        editType: ''
      }
    },
    computed: {},
    methods: {
      toggleEditRemark(type) {
        this.isEditRemark = !this.isEditRemark
        this.editType = type
        this.currentRemark = this.targetRemark
      },
      saveRemark() {
        var self = this
        var remark = this.targetRemark
        self.$axios.put(`/v1/contracts/${self.contract.contractId}`, {
          remark
        })
          .then(res => res.data)
          .then(res => {
            if (res.errcode === 0) {
              self.contract.remark = self.currentRemark = self.targetRemark = remark
              self.isEditRemark = false

              this.$message.success(self.editType === 'add' ? self.$i18n.t('contractSigning.addRemarkSuccessText') : self.$i18n.t('contractSigning.editRemarkSuccessText'))
            } else {
              return Promise.reject(res.msg)
            }
          })
          .catch(this.$message.error)
      },
    },
    watch: {
      contract (){
        this.currentRemark = this.targetRemark = this.contract.remark
      }
    },
    beforeMount() {
      this.currentRemark = this.targetRemark = this.contract.remark
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .rcb-remark {
    display: flex;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #cecece;
    font-size: 14px;
    color: #222;
    font-weight: bold;

    .rcb-add-remark {

      i{ font-weight: bold; }
    }
    .rcb-r-left {
      color: #3C99FC;
      margin-right: 20px;

      span {
        display: inline-block;
        cursor: pointer;
      }
    }
    .rcb-r-right {
      flex: 1;

      textarea {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        outline: none;
        resize: none;
        border-color: #cecece;
      }
    }
  }
</style>
