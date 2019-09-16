<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">选择替换资源</div>
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
                >我的发行</a>
                <a
                    style="padding: 10px 0; margin-left: 20px; cursor: pointer;"
                    :style="{
                    // fontWeight: activeTab==='mock' ? 600 : 400,
                     color: activeTab==='mock' ? '#409eff': '#333', borderBottom: activeTab==='mock' ? '2px solid #378fea': 'none'}"
                    @click="activeTab = 'mock'"
                >我的mock</a>
                <a
                    style="padding: 10px 0; margin-left: 20px; cursor: pointer;"
                    :style="{
                    // fontWeight: activeTab==='release' ? 600 : 400,
                    color: activeTab==='release' ? '#409eff': '#333', borderBottom: activeTab==='release' ? '2px solid #378fea': 'none'}"
                    @click="activeTab = 'release'"
                >发行市场</a>
            </div>
            <div style="height: 380px;">

                <div style="padding: 15px 15px 10px;">
                    <el-autocomplete
                        size="small"
                        style="display: block;"
                        v-model="filterSearch"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        :trigger-on-focus="false"
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        <!--                        <i-->
                        <!--                            style="cursor: pointer"-->
                        <!--                            @click="filterSearch = ''"-->
                        <!--                            v-show="filterSearch && filterSearch.length > 0"-->
                        <!--                            slot="suffix"-->
                        <!--                            class="el-input__icon el-icon-circle-close"-->
                        <!--                        ></i>-->
                    </el-autocomplete>
                </div>

                <Item/>

            </div>
        </div>
    </div>
</template>

<script>
    import Item from './Item.vue';

    export default {
        name: "index",
        components: {
            Item,
        },
        data() {
            return {
                filterSearch: '',
                activeTab: 'myRelease',
            };
        },
        methods: {
            querySearchAsync(queryString, cb) {

                setTimeout(() => {
                    cb([
                        {"value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号"},
                        {"value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号"},
                    ])
                }, 1200);
            },
        }
    }
</script>

<style scoped>

</style>
