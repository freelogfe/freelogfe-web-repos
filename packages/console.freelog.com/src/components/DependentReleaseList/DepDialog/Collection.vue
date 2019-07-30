<template>
    <div style="margin: 0 90px; height: 100%; overflow-y: auto;">
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
    </div>
</template>

<script>

    import DepItem from './DepItem.vue';

    export default {
        name: "Collection",
        components: {
            DepItem,
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
                // input: '',
                data: [],
            };
        },
        methods: {
            async search() {
                const params = {
                    pageSize: 30,
                };
                const res = await this.$axios.get('/v1/collections/releases', {
                    params,
                });
                // console.log(res, 'resresresresres');
                this.data = res.data.data.dataList.map(i => ({
                    id: i.releaseId,
                    name: i.releaseName,
                    // isOnline: i.status === 1,
                    isOnline: i.releaseStatus === 1,
                    type: i.resourceType,
                    version: i.latestVersion.version,
                    date: i.releaseUpdateDate.split('T')[0],
                    // disabled: false,
                }));
            },
        },

        // watch: {
        //     input() {
        //         this.search();
        //     },
        // },
    }
</script>

<style scoped>

</style>
