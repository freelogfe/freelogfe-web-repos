<template>
  <section>
    <div class="node-top-sec">
      <router-link class="route-link" to="/node/create">
        <el-button type="primary">{{$t('node.createNode')}}</el-button>
      </router-link>
    </div>
    <table-view class="node-list" :loader="loader()">
      <el-table-column
        prop="nodeName"
        :label="$t('node.nodeName')">
      </el-table-column>
      <el-table-column
        :label="$t('node.nodeDomain')">
        <template slot-scope="scope">
          {{resolveDomain(scope.row)}}
          <clip-board
            style="display: inline-block"
            @copyDone="copyDoneHandler"
            :value="resolveDomain(scope.row)">
            <a href="javascript:;">
              <i class="el-icon-fa-clipboard"></i>
            </a>
          </clip-board>
        </template>
      </el-table-column>
      <el-table-column
        prop="nodeId"
        :label="$t('node.nodeId')">
      </el-table-column>
      <el-table-column
        :label="$t('node.nodeState')">
        <template slot-scope="scope">
          <el-tag :type="NODE_STATUS[scope.row.status].type">{{NODE_STATUS[scope.row.status].text}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="gotoNodeHandler(scope.row)">{{$t('common.gotoNodeDetail')}}
          </el-button>
          <el-button
            size="small"
            @click="handleEdit(scope.row)">{{$t('common.detail')}}
          </el-button>
        </template>
      </el-table-column>
    </table-view>
  </section>
</template>

<script>
import ResourceList from './index'

export default ResourceList
</script>

<style lang="less" scoped>
  .node-top-sec {
    margin-bottom: 15px;
  }

  .route-link {
    color: white
  }

  .node-list {
    width: 100%;
    min-height: 600px;
  }
</style>
