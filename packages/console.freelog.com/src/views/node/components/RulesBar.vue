<template>
    <div class="rules-bar">
        <i
            v-for="j in Array.from(new Set(rules.map(i => i.operation)))"
            :class="getIconClass(j)"
        ></i>
        <div v-if="rules.length === 0"></div>
    </div>
</template>

<script>
    export default {
        name: "RulesBar",
        props: {
            rules: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        methods: {
            /**
             * 获取图标 class
             * @param operation
             * @returns {string}
             */
            getIconClass(operation) {
                switch (operation) {
                    case 'add':
                        return 'el-icon-plus';
                    case 'replace':
                        return 'el-icon-refresh';
                    case 'offline':
                        return 'el-icon-bottom';
                    case 'online':
                        return 'el-icon-top';
                    case 'set':
                        return 'el-icon-tickets';
                    default:
                        return '';
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .rules-bar {
        color: #333;
        font-size: 16px;

        i {
            font-weight: 600;
        }

        div {
            border-top: 1px solid #b5b5b5;
            width: 16px;
        }
    }
</style>
