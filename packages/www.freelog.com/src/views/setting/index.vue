<template>
  <div class="my-profile-view" v-if="session">
    <h2>账号安全</h2>
    <div class="my-profile-account">
      <div class="my-profile-row">
        <label>{{$t('profile.email')}}</label>
        <div class="my-profile-row__content">
          <span>{{session.email ? session.email : $t('profile.noMail')}}</span>
          <el-tooltip effect="dark" content="功能稍后开放" placement="left">
            <el-button type="primary" disabled>{{session.email === '' ? '绑定邮箱' : '更换邮箱'}}</el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="my-profile-row">
        <label>{{$t('profile.phoneNumber')}}</label>
        <div class="my-profile-row__content">
          <span>{{session.mobile ? session.mobile : $t('profile.noPhoneNumber')}}</span>
          <el-tooltip effect="dark" content="功能稍后开放" placement="left">
            <el-button type="primary" disabled>{{session.mobile === '' ? '绑定手机' : '更换手机'}}</el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="my-profile-row">
        <label>{{$t('profile.password')}}</label>
        <div class="my-profile-row__content">
          <span>*****</span>
          <el-tooltip effect="dark" content="功能稍后开放" placement="left">
            <el-button type="primary" disabled>更换密码</el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <h2>{{$t('privacity')}}</h2>
    <h3>{{$t('node_data')}}</h3>
    <div class="my-profile-privacy">
      <div class="my-profile-row">
        <label>{{$t('userdata_used_storage')}}</label>
        <div class="my-profile-row__content">
          <el-button type="primary" @click="dialogVisible = true">{{$t('manage_data')}}</el-button>
        </div>
      </div>
      <div class="my-profile-row">
        <label>{{$t('display_userdata_in_storage')}}</label>
        <div class="my-profile-row__content">
          <div class="my-p-nodeData-switch-box">
            <el-switch v-model="showNodeData"></el-switch>
            <span>{{$t('enter_nodedata')}}</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      center
      :title="$t('manage_data')"
      :visible.sync="dialogVisible"
      width="760px">
      <el-table :data="nodeData" class="my-p-manage-data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column :label="$t('node')" >
          <template slot-scope="scope">
            <div class="my-p-md-nodeName">{{scope.row.nodeName}}</div>
            <div class="my-p-md-nodeDomain">{{scope.row.nodeDomain}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('used_storage')" width="120">
          <template slot-scope="scope">
            <div class="my-p-md-size">{{Math.floor(scope.row.totalFileSize / 1024)}}KB</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('last_used')" width="160">
          <template slot-scope="scope">
            <div class="my-p-md-lastused">{{scope.row.updateDate | fmtDate}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible = false">{{$t('common.cancelBtnText')}}</el-button>
        <el-button type="danger" :disabled="canRemove" @click="dialogVisible = false">{{$t('remove')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CropImage from '@/components/CropImage/index.vue'

export default {
  name: 'my-profile',

  data() {
    return {
      showNodeData: false,
      dialogVisible: true,
      nodeData: [
        { nodeName: '节点111', nodeDomain: 'x123.freelog.com', totalFileSize: 0, updateDate: '2020-05-13T08:32:46.323Z' },
        { nodeName: '节点111', nodeDomain: 'x123.freelog.com', totalFileSize: 0, updateDate: '2020-05-13T08:32:46.323Z' },
      ],
      mSelections: []
    }
  },

  components: { CropImage },

  computed: {
    ...mapGetters({
      session: 'session'
    }),
    canRemove() {
      return !this.mSelections.length
    },
  },

  mounted() {
  },

  watch: {
    
  },
  methods: {
    handleSelectionChange(rows) {
      console.log('rows -', rows)
      this.mSelections = rows
    },
  }
}
</script>

<style lang="less" scoped type="text/less">
  .my-profile-view {
    // display: flex; justify-content: center; align-items: center;
    min-width: 480px; max-width: 900px; margin: auto;
    padding-right: 60px;

    h2 { 
      padding: 5px 0; 
      font-size: 16px; font-weight: 600; color: #000; }

    h3 {
      width: 72px; height: 17px; margin-top: 15px; margin-bottom: 20px; padding-left: 10px; 
      line-height: 17px; font-size: 12px; font-weight: 600; color: #7A869A;
    }

    .my-profile-info {
      padding: 20px 0 80px 0;
    }

    .my-profile-account {
      padding: 20px 0;
      .my-profile-row__content {
        .el-button--primary { float: right; }
      }
    }

    .my-profile-account, .my-profile-info, .my-profile-privacy {
      padding-left: 30px;
      .my-profile-row {
        display: flex; align-items: center;
        padding: 18px 0;
        label { margin-right: 70px; line-height: 20px; font-size: 14px; font-weight: 400; color: #222; }
        .my-profile-row__content {
          flex: 1;
          line-height: 40px; font-size: 14px; font-weight: 600; color: #333;
        }
      }
    }

    .my-profile-privacy {
      .my-profile-row__content {
        text-align: right;
      }
      .my-p-nodeData-switch-box {
        display: inline-block; white-space: nowrap;
        width: 98px;
        span { 
          margin-left: 30px; cursor: pointer;
          font-size: 14px; font-weight: 600; color: #6555C0; line-height: 20px;
        }
      }
    }

    .not-found-img {
      .user-avatar-btn span {
        display: inline-block;
        width: 80px; height: 80px; border: 1px solid #EEEEEE; border-radius: 50%;
        line-height: 80px;
      }
    }
    .user-avatar-btn {
      position: relative; padding: 0;

      .edit-avatar-part {
        position: absolute; top: 1px; left: 1px;
        width: 81px; height: 81px; border-radius: 50%;
        line-height: 81px; background-color: #333333; color: white;
        transition: all .3s; transform: scale(0); opacity: 0;
      }

      &:hover .edit-avatar-part{
        transform: scale(1); opacity: .8;
      }
    }
    .user-avatar {
      width: 81px; height: 81px; margin-right: 20px;
      border: 1px solid #EEEEEE; border-radius: 50%;
    }
    .profile-info-item {
      display: flex; align-items: center;
      width: 400px; margin-bottom: 5px; padding: 0 20px; border-bottom: 1px solid #ededed;
      color: #999;
    }

    .el-dialog {
      .dialog-footer { padding-right: 20px; text-align: right; }
      .el-button--text { margin-right: 25px; color: #999; }
    }
  }
</style>


<style lang="less" type="text/less">
  .my-profile-view {
    .profile-info-item .el-form-item__label {
      width: 110px !important;
    }
  }
  .el-dialog .el-dialog__body {
    padding: 25px 40px 30px;
}
  .el-table.my-p-manage-data {
    @colorVal: #222;
    thead {
      color: @colorVal;
    }
    color: @colorVal;
  }
</style>
