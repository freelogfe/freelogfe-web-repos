<template>
    <LazyLoadingBox
        style="margin: 0;"
        :end="dataEnd"
        @toBottom="toBottom"
    >
        <div style="padding: 15px 15px 10px;">
            <el-input
                size="small"
                style="display: block;"
                v-model="input"
                :placeholder="$t('node.content')"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"/>
                <!--                        <i-->
                <!--                            style="cursor: pointer"-->
                <!--                            @click="filterSearch = ''"-->
                <!--                            v-show="filterSearch && filterSearch.length > 0"-->
                <!--                            slot="suffix"-->
                <!--                            class="el-input__icon el-icon-circle-close"-->
                <!--                        ></i>-->
            </el-input>
        </div>

<!--        {{activatedRelease}}-->
        <Item
            v-for="i in this.data"
            :active="activatedRelease && (i.name === activatedRelease.name)"
            :state="activatedRelease && (i.name === activatedRelease.name) ? activatedRelease: undefined"
            :title="i.name"
            :type="i.type"
            :date="i.date"
            :versions="i.versions"
            @onDataChange="onDataChange"
        />
    </LazyLoadingBox>
</template>

<script>
    import LazyLoadingBox from '@/components/LazyLoadingBox/index.vue';
    import Item from './Item.vue';

    export default {
        name: 'MyRelease',
        components: {
            LazyLoadingBox,
            Item,
        },
        props: {
            activatedRelease: {
                default: null,
            },
        },
        data() {
            return {
                page: 1,
                input: '',
                dataEnd: false,
                data: [],
                // activatedRelease: null,
            };
        },
        mounted() {
            this.search();
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
                        name: i.fullName,
                        // isOnline: i.status === 1,
                        type: i.resourceType,
                        // version: i.latestVersion.version,
                        date: i.updateDate.split('T')[0],
                        // disabled: false,
                    }))
                ];
                // console.log(this.data, 'this.datathis.datathis.data');
            },
            toBottom() {
                this.page++;
                this.search();
            },
            onDataChange(data) {
                // console.log(data, 'dataaaa');
                // this.activatedRelease = data;
                this.$emit('onDataChange', data);
            }
        },
        watch: {
            input() {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                this.searchTimeout = setTimeout(() => {
                    this.page = 1;
                    this.data = [];
                    this.search();
                }, 1000);

            },
            // activatedRelease() {
            //     // console.log(this.activatedRelease, 'this.activatedRelease');
            //     this.$emit('onDataChange', this.activatedRelease);
            // },
        },
    }
</script>

<style scoped lang="less">
    .overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

</style>
