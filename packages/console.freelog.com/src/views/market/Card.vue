<template>
    <div
        @click="$emit('click')"
        class="wrapItem"
        style="width: 220px; background: #fff; margin: 0 10px 20px; cursor: pointer;"
    >
        <img
            :src="imgSrc"
            style="display: block; width: 100%; height: 165px;"
        />
        <div style="padding: 10px;">
            <div
                style="color: #222; font-size: 14px;"
                class="ellipsis"
            >{{title}}
            </div>
            <div style="height: 10px;"></div>
            <div style="color: #333; display: flex; justify-content: space-between; font-size: 12px;">
                <span
                    style="display: inline-block; width: 45%;"
                    class="ellipsis">{{user}}</span>
                <span
                    style="display: inline-block; width: 45%; text-align: right;"
                    class="ellipsis">{{type}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            imgSrc: {
                type: String,
                default: undefined,
            },
            title: {
                type: String,
                default: '',
            },
            user: {
                type: String,
                default: '',
            },
            type: {
                type: String,
                default: '',
            }
        },
    }
</script>

<style scoped>
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
