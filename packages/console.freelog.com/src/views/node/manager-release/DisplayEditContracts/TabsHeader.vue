<template>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; font-size: 14px; font-weight: 600;">
            <a
                style="padding-bottom: 8px; width: 100px; text-align: center; cursor: pointer;"
                :style="{color: value === 'contract' ? '#409eff' : '#333', 'border-bottom':  value === 'contract' ? '2px solid #409eff': 'none'}"
                @click="$emit('input' ,'contract')"
            >{{$t('authorization')}}</a>
            <a
                style="padding-bottom: 8px; width: 100px; text-align: center; cursor: pointer;"
                :style="{color: value === 'authorize' ? '#409eff' : '#333', 'border-bottom':  value === 'authorize' ? '2px solid #409eff': 'none'}"
                @click="$emit('input' ,'authorize')"
            >{{$t('authorizationChain')}}</a>
        </div>
        <div style="display: flex; font-size: 12px; color: #333; padding-right: 10px;">
            <div style="display: flex; padding-left: 30px; align-items: center;">
                <i style="width: 8px; height: 8px; border-radius: 50%; background-color: #fbb726;"/>
                <span style="padding-left: 5px;">{{$t('pending')}}</span>
            </div>
            <div style="display: flex; padding-left: 30px; align-items: center;">
                <i style="width: 8px; height: 8px; border-radius: 50%; background-color: #39c500;"/>
                <span style="padding-left: 5px;">{{$t('active')}}</span>
            </div>
            <div style="display: flex; padding-left: 30px; align-items: center;">
                <i style="width: 8px; height: 8px; border-radius: 50%; background-color: #e35a5f;"/>
                <span style="padding-left: 5px;">{{$t('termination')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabsHeader",
        i18n: {
            messages: {
                en: {
                    authorization: 'Authorization',
                    authorizationChain: 'Chain',
                    pending: 'Pending',
                    active: 'Active',
                    termination: 'Termination',
                },
                'zh-CN': {
                    authorization: '授权管理',
                    authorizationChain: '授权链',
                    pending: '待执行',
                    active: '生效中',
                    termination: '合约终止',
                }
            }
        },
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
