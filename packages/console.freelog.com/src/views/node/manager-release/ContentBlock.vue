<template>
    <div>
        <div>
            <div style="height: 40px;"></div>
            <div
                style="display: flex; align-items: center; justify-content: space-between;">
                <span
                    style="font-size: 14px; line-height: 1; color: #333; font-weight: 600; border-left: 3px solid #333; padding-left: 5px;">{{title}}</span>
                <div>
                    <slot name="right"></slot>
                </div>
            </div>
            <div style="height: 25px;"></div>
        </div>

        <slot></slot>

        <div style="height: 10px;"></div>
    </div>
</template>

<script>
    export default {
        name: 'ContentBlock',
        props: {
            title: {
                type: String,
                default: '标题',
            }
        },
    }
</script>

<style scoped>

</style>
