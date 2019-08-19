<template>
    <div>
        <div style="height: 35px;"></div>
        <el-alert
            style="height: 60px;"
            :title="$t('mockCanOnlyBeUsedWithinMock')"
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
        i18n: {
            messages: {
                en: {
                    mockCanOnlyBeUsedWithinMock: 'Mock resources can only be used within the simulation resource pool, to mock the resource issue, need to create successful, the first mock resources to official resources',
                },
                'zh-CN': {
                    mockCanOnlyBeUsedWithinMock: 'mock资源只可在模拟资源池内使用，若要将mock资源发行，需在创建成功后，先将mock资源转为正式资源',
                }
            },
        }
    }
</script>

<style scoped>

</style>
