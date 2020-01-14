<template>
    <div>
        <div style="height: 50px;"></div>
        <div style="color: #333; font-size: 18px;">{{label}}</div>
        <div style="height: 20px;"></div>

        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ModuleBlock",
        props: {
            label: String,
        }
    }
</script>

<style scoped>

</style>
