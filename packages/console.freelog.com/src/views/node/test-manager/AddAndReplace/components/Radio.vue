<template>
    <div
        style="width: 14px; height: 14px; border-radius: 50%; border: 1px solid #c8c8c8; display: flex; align-items: center; justify-content: center;">
        <div v-show="selected" style="width: 8px; height: 8px; background-color: #409eff; border-radius: 50%;"></div>
    </div>
</template>

<script>
    export default {
        name: "Radio",
        props: {
            selected: {
                type: Boolean,
                default: false,
            },
        }
    }
</script>

<style scoped>

</style>
