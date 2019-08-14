<template>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; font-size: 14px; font-weight: 600;">
            <a
                style="padding-bottom: 8px; width: 100px; text-align: center;"
                :style="{color: value === 'contract' ? '#409eff' : '#333', 'border-bottom':  value === 'contract' ? '2px solid #409eff': 'none'}"
                @click="$emit('input' ,'contract')"
            >授权管理</a>
            <a
                style="padding-bottom: 8px; width: 100px; text-align: center;"
                :style="{color: value === 'authorize' ? '#409eff' : '#333', 'border-bottom':  value === 'authorize' ? '2px solid #409eff': 'none'}"
                @click="$emit('input' ,'authorize')"
            >授权链</a>
        </div>
        <div style="display: flex; font-size: 12px; color: #333; padding-right: 10px;">
            <div style="display: flex; padding-left: 30px; align-items: center;">
                <i style="width: 8px; height: 8px; border-radius: 50%; background-color: #fbb726;"></i>
                <span style="padding-left: 5px;">待执行</span>
            </div>
            <div style="display: flex; padding-left: 30px; align-items: center;">
                <i style="width: 8px; height: 8px; border-radius: 50%; background-color: #39c500;"></i>
                <span style="padding-left: 5px;">生效中</span>
            </div>
            <div style="display: flex; padding-left: 30px; align-items: center;">
                <i style="width: 8px; height: 8px; border-radius: 50%; background-color: #e35a5f;"></i>
                <span style="padding-left: 5px;">合约终止</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabsHeader",
        props: {
            value: {
                type: String,
                default: '',
            }
        },
    }
</script>

<style scoped>

</style>
