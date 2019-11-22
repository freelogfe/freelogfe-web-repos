<template>

    <a
        @click="$emit('click')"
        style="padding: 12px 20px; display: block; cursor: pointer;"
        :style="{'background-color': activated ? '#fff': 'transparent'}"
    >
        <el-badge :is-dot="tags.length === 0" style="display: block;">
            <div style="color: #333; font-size: 14px; font-weight: 600;">{{title}}</div>
        </el-badge>
        <!--        <div style="height: 10px;"></div>-->
        <div style="font-size: 12px; color: #999;">{{type}} | {{version}} | {{date}}</div>
        <div style="overflow: hidden;">
            <label v-for="item in tags"
                   style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff; margin-right: 10px; margin-top: 5px; display: inline-block;">
                {{item.policyName}}
                <i v-if="item.status === 2"
                   style="width: 8px; height: 8px; border-radius: 50%; background-color: #fbb726; display: inline-block;"></i>
                <i v-if="item.status === 4"
                   style="width: 8px; height: 8px; border-radius: 50%; background-color: #39c500; display: inline-block;"></i>
            </label>
        </div>
    </a>

</template>

<script>
    export default {
        name: "NavItem",
        props: {
            activated: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '默认标题',
            },
            type: {
                type: String,
                default: 'image',
            },
            version: {
                type: String,
                default: '1.0.0',
            },
            date: {
                type: String,
                default: '2019-12-10'
            },
            tags: {
                type: Array,
                default
                    () {
                    return [
                        // {
                        //     policyName: '',
                        //     status: 4
                        // }
                    ];
                }
            },
            // isTip: {
            //     type: Boolean,
            //     default: false,
            // }
        }
    }
</script>

<style scoped>

</style>
