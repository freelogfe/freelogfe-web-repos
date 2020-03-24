<template>
    <a
        :class="{disabled: disabled}"
        @click="!disabled && $emit('click')"
    >{{$t('update')}}</a>
</template>

<script>
    export default {
        name: "AddButton",
        props: {
            disabled: {
                type: Boolean,
                default: false,
            },
        }
    }
</script>

<style scoped lang="less">
    a {
        width: 58px;
        line-height: 32px;
        background-color: rgba(39, 132, 255, .1);
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        color: #2784FF;

        &:hover {
            background-color: #2784FF;
            color: #fff;
        }

        &.disabled {
            opacity: .4;
            cursor: not-allowed;

            &:hover {
                background-color: rgba(39, 132, 255, .1);
                color: #2784FF;
            }
        }
    }
</style>
