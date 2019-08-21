<template>
    <div style="padding: 10px 20px; font-size: 14px; display: flex;">
        <span style="color: #333;">{{name}}</span>
        <div style="color: #999; padding-left: 20px;">
            <span>v{{version}}</span>
            |
            <span>{{date}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ReleasedItem",
        props: {
            name: String,
            version: String,
            date: String,
        }
    }
</script>

<style scoped>

</style>
