<template>
    <div
        style="border-bottom: 1px solid #e1e1e1; height: 68px; display: flex; justify-content: space-between; align-items: center;">
        <div>
            <div style="display: flex; align-items: center;">
                <span style="padding-right: 20px; font-size: 20px; color: #333;">{{name}}</span>
                <span
                    v-if="!isOnline"
                    style="background-color: #cdcdcd; border-radius: 2px; color: #fff; font-size: 12px; padding: 2px 9px;">未上线</span>
            </div>
            <div style="font-size: 14px; color: #999;">
                <span>{{type}}</span>
                <span v-if="!!version"> | v{{version}}</span>
                <span> | {{date}}</span>
            </div>
        </div>
        <!--        <el-button type="primary" round size="small" style="width: 70px;">加入</el-button>-->
        <el-button
            v-if="!showRemove"
            type="primary"
            round
            size="small"
            style="width: 70px;"
            :disabled="disabled"
            @click="$emit('click')"
        >{{disabled ? '已添加': '加入'}}
        </el-button>
        <el-button
            v-else
            type="danger"
            round
            size="small"
            style="width: 70px;"
            :disabled="disabled"
            @click="$emit('remove')"
        >移除
        </el-button>
    </div>
</template>

<script>
    export default {
        name: 'DepItem',
        props: {
            name: {
                type: String,
                default: '',
            },
            isOnline: {
                type: Boolean,
                default: true,
            },
            type: {
                type: String,
                default: '',
            },
            version: {
                type: String,
                default: '',
            },
            date: {
                type: String,
                default: '',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            showRemove: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>

<style scoped>

</style>
