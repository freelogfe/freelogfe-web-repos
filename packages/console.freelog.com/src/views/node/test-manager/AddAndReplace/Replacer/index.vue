<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">{{$t('node.selectReplacingResource')}}</div>
        <div style="height: 5px;"></div>
        <div style="border: 1px solid #c8c8c8; border-radius: 2px; overflow: hidden;">
            <div
                style="border-radius: 2px 2px 0 0; background-color: #fafbfb; font-size: 14px; overflow: hidden; display: flex; color: #333;">
                <a
                    style=" padding: 10px 0; margin-left: 15px; cursor: pointer;"
                    :style="{
                    // fontWeight: activeTab==='myRelease' ? 600 : 400,
                    color: activeTab==='myRelease' ? '#409eff': '#333', borderBottom: activeTab==='myRelease' ? '2px solid #378fea': 'none'}"
                    @click="activeTab = 'myRelease'"
                >{{$t('node.myRelease')}}</a>
                <a
                    style="padding: 10px 0; margin-left: 20px; cursor: pointer;"
                    :style="{
                    // fontWeight: activeTab==='mock' ? 600 : 400,
                     color: activeTab==='mock' ? '#409eff': '#333', borderBottom: activeTab==='mock' ? '2px solid #378fea': 'none'}"
                    @click="activeTab = 'mock'"
                >{{$t('node.myMock')}}</a>
                <a
                    style="padding: 10px 0; margin-left: 20px; cursor: pointer;"
                    :style="{
                    // fontWeight: activeTab==='release' ? 600 : 400,
                    color: activeTab==='release' ? '#409eff': '#333', borderBottom: activeTab==='release' ? '2px solid #378fea': 'none'}"
                    @click="activeTab = 'release'"
                >{{$t('node.releaseMarket')}}</a>
            </div>
            <div style="height: 380px;">

                <MyRelease
                    :activatedRelease="activatedRelease"
                    v-if="activeTab === 'myRelease'"
                    @onDataChange="onDataChange"
                />
                <Release
                    :activatedRelease="activatedRelease"
                    v-if="activeTab === 'release'"
                    @onDataChange="onDataChange"
                />
                <Mock
                    :activatedRelease="activatedRelease"
                    v-show="activeTab === 'mock'"
                    @onDataChange="onDataChange"
                />

            </div>
        </div>
    </div>
</template>

<script>
    // import Item from './Item.vue';
    import MyRelease from './MyRelease.vue';
    import Release from './Release.vue';
    import Mock from './Mock.vue';

    export default {
        name: "index",
        components: {
            Mock,
            Release,
            MyRelease,
        },
        data() {
            return {
                filterSearch: '',
                activeTab: 'myRelease',
                activatedRelease: null,
            };
        },
        methods: {
            // querySearchAsync(queryString, cb) {
            //
            //     setTimeout(() => {
            //         cb([
            //             {"value": "三全鲜食（北新泾店）"},
            //             {"value": "Hot honey 首尔炸鸡（仙霞路）"},
            //         ]);
            //     }, 1200);
            // },
            onDataChange(data) {
                // console.log(data, 'AAAAAAAAAA');
                this.activatedRelease = data;
                this.$emit('onChange', data);
                // console.log(data, 'hhhhhhhhhhh');
            }
        }
    }
</script>

<style scoped>

</style>
