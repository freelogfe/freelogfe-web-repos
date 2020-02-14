<template>
    <div style="min-height: 40px; padding: 10px 0; display: flex; width: 100%;">
        <div style="font-size: 14px; color: #333; width: 110px; flex-shrink: 0; font-weight: 600; line-height: 40px;">
            {{label}}
        </div>
        <div style="flex-shrink: 1; width: 100%; display: flex; align-items: center; overflow: hidden;">
            <div style="width: 100%;">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BlockItem',
        props: {
            label: String,
        }
    }
</script>

<style scoped>

</style>
