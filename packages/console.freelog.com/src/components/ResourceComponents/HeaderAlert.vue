<template>
    <div>
        <div style="height: 35px;"></div>
        <el-alert
            style="height: 60px;"
            :title="$t('components.mockCanOnlyBeUsedWithinMock')"
            type="info"
            center
            :closable="false"
            show-icon>
        </el-alert>
    </div>
</template>

<script>
    export default {
        name: "HeaderAlert",
        // i18n: {
        //     messages: {
        //         en: {
        //
        //         },
        //         'zh-CN': {
        //
        //         }
        //     },
        // }
    }
</script>

<style scoped>

</style>
