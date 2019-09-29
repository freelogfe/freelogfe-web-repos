<template>
    <div style="min-height: 40px; padding: 10px 0; display: flex;">
        <div style="font-size: 14px; color: #333; width: 110px; flex-shrink: 0; font-weight: 600; line-height: 40px;">
            {{label}}
        </div>
        <div style="flex-shrink: 1; width: 100%; display: flex; align-items: center;">
            <div>
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
