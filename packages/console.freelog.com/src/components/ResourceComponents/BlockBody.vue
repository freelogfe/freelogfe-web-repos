<template>
    <div>
        <div style="height: 35px;"></div>
        <div style="color: #666; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
            <span>{{tilte}}</span>
            <div style="padding-left: 10px;">
                <slot name="title2"/>
            </div>
        </div>
        <div style="height: 6px;"></div>
        <div style="background-color: #fff;">
            <slot/>
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
