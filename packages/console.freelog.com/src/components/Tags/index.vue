<template>
    <div class="custom-tags" style="display: flex; align-items: center; flex-wrap: wrap;">
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
                <span style="color: #666;">{{tag}}</span>
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

        <!--    <el-button-->
        <!--        v-if="inputVisible || isCanCURD"-->
        <!--        class="button-new-tag"-->
        <!--        round-->
        <!--        size="mini"-->
        <!--        @click="showInput"-->
        <!--    >-->

        <!--      <span style="background-color: #666; border-radius: 50%; border: none; display: inline-block; width: 20px; height: 20px;">-->
        <i
            v-if="inputVisible || isCanCURD"
            style="font-size: 12px; color: #666; background-color: #f1f1f1; border-radius: 50%; padding: 5px; cursor: pointer; margin-bottom: 10px;"
            class="el-icon-plus"
            @click="showInput"
        ></i>
        <!--      </span>-->
        <!--    </el-button>-->
    </div>
</template>

<script>
    import FreelogTags from './index'

    export default FreelogTags
</script>

<style lang="less">
    .custom-tags {
        .el-icon-close {
            color: #666;

            &:hover {
                color: #fff;
                background-color: #bcbcbc;
            }
        }
    }
</style>

<style lang="less" scoped>
    .user-defined-tag,
    .input-new-tag {
        display: inline-block;
        margin-bottom: 10px;
    }

    .user-defined-tag {
        position: relative;
        padding-left: 11px;

        &:before {
            content: '';
            display: block;
            position: absolute;
            top: 3px;
            left: 3px;
            z-index: 0;
            width: 19px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            transform: rotate(45deg);
            background-color: #fff;
        }

        &:after {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 6px;
            z-index: 1;
            width: 4px;
            height: 4px;
            margin-top: -2px;
            border-radius: 50%;
            background-color: #bcbcbc;
        }
    }

    .el-tag {
        position: relative;
        z-index: 9;
        margin-right: 20px;
        padding: 0 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        border-left-width: 0;
        height: 28px;
        line-height: 24px;
        background-color: #fff;
    }

    .button-new-tag {
        margin-bottom: 10px;
        background-color: white;
        vertical-align: top;
    }

    .input-new-tag {
        width: 90px;
        margin-right: 20px;
        vertical-align: bottom;
    }

</style>
