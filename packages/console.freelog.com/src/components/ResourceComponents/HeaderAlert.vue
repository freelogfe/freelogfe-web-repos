<template>
    <div>
        <div style="height: 35px;"></div>
        <el-alert
            style="height: 60px;"
            title="mock资源只可在模拟资源池内使用，若要将mock资源发行，需在创建成功后，先将mock资源转为正式资源"
            type="info"
            center
            :closable="false"
            show-icon>
        </el-alert>
    </div>
</template>

<script>
    export default {
        name: "HeaderAlert"
    }
</script>

<style scoped>

</style>
