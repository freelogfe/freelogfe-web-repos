<template>
    <div style="border: 1px solid #ccc; border-radius: 4px;">
        <div
            style="display: flex; align-items: center; justify-content: space-between; height: 45px; background-color: #fafbfb; padding: 0 15px; border-bottom: 1px solid #ccc; border-radius: 4px;">
            <span style="font-size: 16px; color: #333; font-weight: 600; padding-right: 20px;">{{policyName}}</span>
            <el-button
                type="primary"
                size="mini"
                round
            >获取授权</el-button>
        </div>
        <div style="height: 5px;"></div>
        <div style="">
            <pre style="font-size: 14px; color: #333; padding: 20px;">{{policyText}}</pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UnsignedContract",
        props: {
            policyName: {
                type: String,
                default: '标题',
            },
            policyText: {
                type: String,
                default: '',
            },
        },
    }
</script>

<style scoped>

</style>
