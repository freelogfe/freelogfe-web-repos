<template>
    <div class="node-data">
        <div class="node-data__header"
             style="">
            <span style="font-size: 14px; color: #222;">对象 0</span>
            <el-button type="primary" style="height: 38px;">上传</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NodeData"
    }
</script>

<style scoped lang="less">
    .node-data {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .node-data__header {
            margin: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 0;
        }
    }
</style>
