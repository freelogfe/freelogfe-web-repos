<template>
  <div>
    <div
            class="user-defined-tag"
            :key="tag"
            v-for="tag in tags"
    >
      <el-tag
              :closable="isCanCURD"
              size="small"
              :disable-transitions="false"
              @close="handleClose(tag)">
        {{tag}}
      </el-tag>
    </div>

    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button v-if="inputVisible || isCanCURD" class="button-new-tag" round size="mini" @click="showInput"><i class="el-icon-plus"></i> {{actionText}}</el-button>
  </div>
</template>

<script>
import FreelogTags from './index'

export default FreelogTags
</script>

<style lang="less" scoped>
  .user-defined-tag,
  .input-new-tag{
    display: inline-block;
    margin-bottom: 10px;
  }

  .user-defined-tag {
    position: relative; padding-left: 10px;

    &:before {
      content: '';
      display: block;
      position: absolute; top: 3px; left: 2px; z-index: 0;
      width: 19px; height: 20px; border-radius: 4px; border: 1px solid #B1D1F6;
      transform: rotate(45deg);
      background-color: #E4EEFA;
    }

    &:after {
      content: ''; display: block;
      position: absolute; top: 50%; left: 6px; z-index: 1;
      width: 4px; height: 4px; margin-top: -2px; border-radius: 50%;
      background-color: #FFF;
    }
  }

  .el-tag {
    position: relative;
    z-index: 10;
    margin-right: 20px; padding: 0 10px; border: 1px solid #B1D1F6; border-radius: 4px; border-left-width: 0;
    height: 28px; line-height: 24px;
    background-color: #E4EEFA;

  }
  .button-new-tag {
    margin-bottom: 10px;
    background-color: white;
    vertical-align: top;
  }
  .input-new-tag {
    width: 90px; margin-right: 20px;
    vertical-align: bottom;
  }

</style>
