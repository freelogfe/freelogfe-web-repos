<template>
    <div
        class="tool__search"
        style="background-color: #fff;"
    >
        <input/>
        <i class="freelog fl-icon-content"/>
    </div>
</template>

<script>
    export default {
        name: "ToolSearch",

    }
</script>

<style scoped lang="less">
    .tool__search {
        width: 200px;
        height: 34px;
        background: rgba(142, 142, 147, 0.2);
        border-radius: 2px;
        display: flex;
        align-items: center;
        cursor: pointer;
        box-sizing: border-box;
        padding: 0 12px;
        justify-content: space-between;

        &:hover {
            background: rgba(142, 142, 147, 0.4);
        }

        & > i {
            font-size: 14px;
            color: #8e8e93;
            flex-shrink: 0;
        }

        & > input {
            display: block;
            font-size: 14px;
            line-height: 20px;
            width: 150px;
            border: none;
            outline: none;
        }
    }
</style>
