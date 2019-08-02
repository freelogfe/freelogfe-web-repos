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
            :type="i.type"
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
        name: "Mock",
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
        mounted() {
            this.search();
        },
        data() {
            return {
                input: '',
                page: 1,
                data: [],
                dataEnd: false,
            };
        },
        methods: {
            async search() {
                const params = {
                    page: this.page,
                    keywords: this.input,
                    pageSize: 10,
                };
                const res = await this.$axios.get('/v1/resources/mocks', {
                    params,
                });
                const data = res.data.data;
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
                // console.log(res, 'resresresresres');
                this.data = [
                    ...this.data,
                    ...data.dataList.map(i => ({
                        id: i.mockResourceId,
                        name: i.name,
                        // isOnline: i.status === 1,
                        type: i.resourceType,
                        // version: i.latestVersion.version,
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
