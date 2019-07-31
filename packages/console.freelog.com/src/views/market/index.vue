<template>
    <div style="display: flex; justify-content: center;">
        <div style="padding: 0 50px; display: flex; justify-content: center; flex-wrap: wrap; padding-top: 20px;">
            <Card
                v-for="item in sourceData"
                :imgSrc="item.previewImages[0]"
                :title="item.releaseName"
                :user="item.username"
                :type="item.resourceType"
            />
            <div
                v-if="!this.dataEnd"
                ref="loadingRef"
                v-loading="true"
                style="width: 220px; height: 234px; background: #fff; margin: 0 10px 20px;"
            ></div>
            <div v-for="item in Array(20)" style="width: 220px; margin: 0 10px;"></div>
        </div>
    </div>
</template>

<script>
    import Card from './Card.vue';

    export default {
        name: "index",
        components: {
            Card,
        },
        data() {
            return {
                page: 1,
                sourceData: [],
                dataEnd: false,
                isLoading: false,
            };
        },
        mounted() {
            //.$el.getBoundingClientRect()
            // console.log(this.$refs.loadingRef.getBoundingClientRect(), '1234');
            window.onscroll = this.loadingControl;

            this.loadingControl();
        },
        methods: {
            async handleData() {
                const res = await this.$axios.get('/v1/releases', {
                    params: {
                        page: this.page,
                        pageSize: 1,
                    }
                });
                const data = res.data.data;
                console.log(res, 'resresres');
                this.sourceData = [
                    ...this.sourceData,
                    ...data.dataList,
                ];
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
            },
            async loadingControl() {
                if (this.isLoading) {
                    return;
                }
                let top = this.$refs.loadingRef.getBoundingClientRect().top;
                while (top < window.innerHeight && !this.dataEnd) {
                    this.isLoading = true;
                    this.page++;
                    await this.handleData();
                    top = this.$refs.loadingRef.getBoundingClientRect().top;
                }
                this.isLoading = false;
            }

        },
    }
</script>

<style scoped>

</style>
