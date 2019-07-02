<template>
  <section>
    <el-table :data="tplList"
              stripe
              border>
      <el-table-column
        prop="name"
        :label="$t('components.policyTplSelector.name')">
      </el-table-column>
      <el-table-column
        label=""
        align="center"
        width="200px">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            plain
            @click="handleSelect(scope.row)">{{$t('components.policyTplSelector.operation')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import PolicyTplSelector from './index'

export default PolicyTplSelector
</script>
