<template>
  <section class="presentables-wrapper">
    <PageBuild style="margin-bottom: 40px" ref="pagebuildRef" @search="searchHandler"></PageBuild>

    <div>
      <div class="presentables-header-wrap">
        <span class="title">{{ $t('presentable.listTitle') }}</span>
        <!--<el-tooltip class="item" effect="dark" content="添加节点资源" placement="right">-->
          <!--<span class="add-presentable-btn" @click="showSearchResourceHandler">-->
            <!--<i class="el-icon-plus"></i>-->
          <!--</span>-->
        <!--</el-tooltip>-->
        <span class="add-presentable-btn" @click="showSearchResourceHandler">
          <i class="el-icon-plus"></i>
          <span>{{ $t('presentable.addPresentable') }}</span>
        </span>
        <ul class="list-actions">
          <li>
            <el-select v-model="searchData.resourceType"
                       @change="searchHandler(searchData)"
                       size="mini" :placeholder="$t('resource.resourceType')">
              <el-option :label="$t('resource.resourceType')" value=""></el-option>
              <el-option
                      v-for="item in resourceTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-select v-model="searchData.isSignContract"
                       @change="searchHandler(searchData)"
                       popper-class="opt-cls" size="mini" :placeholder="$t('contract.state')">
              <el-option :label="$t('contract.state')" value=""></el-option>
              <el-option
                      v-for="item in contractStateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-select v-model="searchData.isOnline"
                       @change="searchHandler(searchData)"
                       size="mini" :placeholder="$t('presentable.onlineState')">
              <el-option
                      v-for="item in onlineStateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
              <el-option :label="$t('presentable.allState')" :value=2></el-option>
            </el-select>
          </li>
          <li style="max-width: none;">
            <el-input v-if="isEntering"
                      size="mini"
                      style="width: 200px;"
                      @blur="showSeachInputHandler(false)"
                      @keyup.enter.native="searchHandler(searchData)"
                      v-model="searchData.keywords">
              <i class="el-icon-search el-input__icon"
                 slot="suffix"
                 @click="searchHandler(searchData)"></i>
            </el-input>
            <el-button type="text"
                       v-else
                       class="search-btn"
                       size="mini"
                       @click="showSeachInputHandler(true)"><i class="el-icon-search"></i></el-button>
          </li>
        </ul>
      </div>

      <div class="presentable-list-container">
        <PresentableList @delete="deletePresentableHandler"
                         :params="params"
                         :showFooter="true"
                         ref="presentableList"
                         class="node-presentable-list">
          <template slot="append">
            <el-table-column
                    width="140"
                    :label="$t('presentable.onlineState')">
              <template slot-scope="{row}">
                <div class="status-item-wrap">
                  <freelog-switch class="node-res-status-switch"
                                  v-model="row.isOnlineChecked"
                                  @change="changePresentableOnlineHandler(row)"
                                  :active-text="$t('presentable.onlineText')"
                                  :disabled="!!row.warningTip"
                                  :inactive-text="$t('presentable.offlineText')"></freelog-switch>
                  <el-tooltip class="warning-tooltip"
                              popper-class="status-item-tip"
                              v-if="row.warningTip"
                              placement="top">
                    <div slot="content">
                      {{row.warningTip}}
                    </div>
                    <i class="fl-icon fl-icon-warning"></i>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </template>
          <div class="no-present-list-wrap" slot="empty">
            {{ $t('node.noPresentableTip') }}
          </div>
        </PresentableList>
      </div>
    </div>

    <el-dialog
            :visible.sync="showSearchResource"
            width="840px"
            :close-on-click-modal="false"
            :before-close="beforeCloseDialogHandler"
            top="10vh"
            center>
      <p slot="title" class="dialog-title">{{ $t('presentable.addPresentable') }}</p>
      <search-resource class="add-resource-input" @add="addResourceHandler"></search-resource>
    </el-dialog>
  </section>
</template>

<script>
  import Presentables from './index'

  export default Presentables
</script>

<style lang="less" scoped>
  @import "index.less";
</style>


<style lang="less">
  @backColor: #999999;

  .presentables-wrapper {
    ::placeholder {
      color: #333333;
      font-size: 14px;
    }

    .el-table .cell {
      height: 55px;
      display: flex;
      align-items: center;
      flex-flow: wrap;
    }

    .el-select .el-input__inner {
      border: none;
      color: #333333;
      font-size: 14px;
    }
  }

  .status-item-tip {
    background-color: @backColor !important;
    color: white;
    font-size: 14px;
    &.el-tooltip__popper {
      &[x-placement^=left] {
        .popper__arrow {
          border-left-color: @backColor !important;
          &:after {
            border-left-color: @backColor !important;

          }
        }
      }

      &[x-placement^=top] {
        .popper__arrow {
          border-top-color: @backColor !important;
          &:after {
            border-top-color: @backColor !important;
          }
        }
      }
    }

  }
</style>