<template>
    <div style="padding-top: 20px; padding-bottom: 6px;">
        <span
            style="display: inline-block; width: 30px; padding-left: 10px; text-align: center; color: #f15e5e;"> {{dot ? '•' : ''}}</span>
        <div style="display: inline-block; font-size: 13px; color: #666;">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SmallTitle",
        props: {
            dot: {
                type: Boolean,
                default: true,
            }
        }
    }
</script>

<style scoped>

</style>
