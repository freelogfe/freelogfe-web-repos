<template>
    <LazyLoadingBox
        :end="dataEnd"
        @toBottom="toBottom"
    >
        <div style="height: 40px;"></div>
        <el-input
            v-model="input"
            placeholder="请输入内容"
        ></el-input>
        <div style="height: 30px;"></div>

        <DepItem
            v-for="i in data"
            :name="i.name"
            :isOnline="i.isOnline"
            :type="i.type"
            :version="i.version"
            :date="i.date"
            :disabled="exists.includes(i.id)"
            @click="$emit('add', i)"
        />
    </LazyLoadingBox>
</template>

<script>
    import DepItem from './DepItem.vue';
    import LazyLoadingBox from './LazyLoadingBox.vue';

    export default {
        name: "Search",
        components: {
            DepItem,
            LazyLoadingBox,
        },
        props: {
            exists: {
                type: Array,
                default() {
                    return [];
                },
            }
        },
        data() {
            return {
                input: '',
                page: 1,
                data: [],
                dataEnd: false,
            };
        },
        mounted() {
            // this.$refs.boxRef.onscroll = () => {
            //     if (this.dataEnd) {
            //         return;
            //     }
            //
            // };
            this.search();
        },
        methods: {
            async search() {
                const params = {
                    page: this.page,
                    keywords: this.input,
                    pageSize: 10,
                };
                const res = await this.$axios.get('/v1/releases', {
                    params,
                });
                // console.log(res, 'resresresresres');
                const data = res.data.data;
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
                this.data = [
                    ...this.data,
                    ...data.dataList.map(i => ({
                        id: i.releaseId,
                        name: i.releaseName,
                        isOnline: i.status === 1,
                        type: i.latestVersion.resourceInfo.resourceType,
                        version: i.latestVersion.version,
                        date: i.updateDate.split('T')[0],
                        // disabled: false,
                    }))
                ];
            },
            toBottom() {
                this.page++;
                this.search();
            },
        },

        watch: {
            input() {
                this.page = 1;
                this.data = [];
                this.search();
            },
        },
    }
</script>

<style scoped>

</style>
