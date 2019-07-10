<template>
    <div>
        <div style="height: 35px;"></div>
        <div style="color: #666; font-size: 14px; font-weight: 600;">{{tilte}}</div>
        <div style="height: 6px;"></div>
        <div style="background-color: #fff;">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "BlockBody",
        props: {
            tilte: {
                type: String,
                required: true,
            },
        }
    }
</script>

<style scoped>

</style>
