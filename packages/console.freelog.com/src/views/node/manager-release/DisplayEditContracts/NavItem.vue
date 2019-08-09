<template>
    <a
        @click="$emit('click')"
        style="padding: 12px 20px; display: block;"
        :style="{'background-color': activated ? '#fff': 'transparent'}"
    >
        <div style="color: #333; font-size: 14px; font-weight: 600;">{{title}}
        </div>
        <div style="height: 10px;"></div>
        <span
            v-for="item in tags"
            style="background-color: #e9f4ff; border-radius: 2px; color: #409eff; padding: 3px 10px; border: 1px solid #a5d1ff; margin-right: 10px;"
        >{{item}}</span>
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
            tags: {
                type: Array,
                default() {
                    return [];
                }
            }
        }
    }
</script>

<style scoped>

</style>
