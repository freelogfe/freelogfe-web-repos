<template>
    <div
        style="height: 40px; display: flex; align-items: center; padding-left: 5px;"
    >
        <a
            style="height: 20px; width: 20px; align-items: center; justify-content: center; display: flex;"
            :style="{cursor: !this.isLock ? 'pointer' : 'not-allowed'}"
            @click="onRemoveBtnClick"
        >
            <i
                style="font-size: 18px;"
                :style="{color: !this.isLock ? '#f02323': '#666'}"
                :class="this.isLock ? 'el-icon-goods': 'el-icon-remove'"
            ></i>
        </a>
        <span style="padding-left: 15px; font-size: 14px; color: #333; font-weight: 500;">{{this.name}}</span>
        <span
            v-if="!isOnline"
            style="background-color: #cdcdcd; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 12px; width: 50px; height: 22px; margin-left: 20px;"
        >未上线</span>
    </div>
</template>

<script>
    export default {
        name: 'Item',
        props: {
            isLock: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String,
                default: '',
            },
            isOnline: {
                type: Boolean,
                default: true,
            },
            // onRemove: {
            //     type: Function,
            //     default() {
            //
            //     },
            // }
        },
        data() {
            return {
                // iconClass: {
                //     'el-icon-goods': this.isLock,
                //     'el-icon-remove': !this.isLock,
                // },
            };
        },
        methods: {
            onRemoveBtnClick() {
                if (this.isLock) {
                    return;
                }
                this.$emit('onRemove');
            },
        },

    }
</script>

<style scoped>

</style>
