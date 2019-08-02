<template>
    <LazyLoadingBox
        :end="dataEnd"
        @toBottom="toBottom"
    >
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
        name: "Collection",
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
                page: 1,
                data: [],
                dataEnd: false,
            };
        },
        methods: {
            async search() {
                const params = {
                    page: this.page,
                    pageSize: 10,
                };
                const res = await this.$axios.get('/v1/collections/releases', {
                    params,
                });
                const data = res.data.data;
                // console.log(res, 'resresresresres');
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
                this.data = [
                    ...this.data,
                    ...data.dataList.map(i => ({
                        id: i.releaseId,
                        name: i.releaseName,
                        // isOnline: i.status === 1,
                        isOnline: i.releaseStatus === 1,
                        type: i.resourceType,
                        version: i.latestVersion.version,
                        date: i.releaseUpdateDate.split('T')[0],
                        // disabled: false,
                    }))
                ];
            },
            toBottom() {
                this.page++;
                this.search();
            },
        },
    }
</script>

<style scoped>

</style>
