<template>
    <div>
        <el-tabs v-if="policies.length > 0">
            <el-tab-pane
                v-for="item in policies"
                :label="item.policyName"
            >
                <div
                    style="height: 200px; overflow-y: auto;"
                >
                    <pre style="white-space: pre-wrap;">{{item.policyText}}</pre>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div v-if="policies.length === 0"
             style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
            <span>暂无策略......</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PolicyTabs',
        props: {
            policies: {
                type: Array,
                validator: function (value) {
                    return value.every(i => i.hasOwnProperty('hasOwnProperty') && i.hasOwnProperty('policyName'));
                },
                default: [
                    // {
                    //     policyName: String,
                    //     policyText: String,
                    // }
                ],
            }
        },
        methods: {
            /**
             * 格式化策略
             * @param str
             */
            // spaceReplaceNbsp(str) {
            //     return str.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
            // },
        },
    }
</script>

<style scoped>

</style>
