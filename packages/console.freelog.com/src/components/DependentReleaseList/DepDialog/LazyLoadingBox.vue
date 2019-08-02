<template>
    <div ref="boxRef" style="margin: 0 90px; height: 100%; overflow-y: auto;">
        <slot></slot>
        <div
            ref="loadingRef"
            style="font-size: 14px; color: #999; text-align: center; line-height: 40px; padding-top: 10px;"
        >
            <span v-show="!end">加载中......</span>
            <span v-show="end">加载完毕</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LazyLoadingBox',
        props: {
            end: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                pause: false,
                func: null,
            };
        },
        mounted() {
            this.$refs.boxRef.onscroll = () => {
                if (this.end || this.pause) {
                    return;
                }
                if (this.$refs.boxRef.getBoundingClientRect().bottom >= this.$refs.loadingRef.getBoundingClientRect().top) {
                    this.func = this.handleEvent;
                    setTimeout(() => {
                        if (this.func) {
                            this.func();
                            this.func = null;
                        }
                    }, 1000);

                }
            };
        },
        methods: {
            handleEvent() {
                this.$emit('toBottom');
            },
        }
    }
</script>

<style scoped>

</style>
