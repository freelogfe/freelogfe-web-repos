<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">选择替换资源</div>
        <div style="height: 5px;"></div>
        <div style="border: 1px solid #c8c8c8; border-radius: 2px; overflow: hidden;">
            <div
                style="border-radius: 2px 2px 0 0; background-color: #fafbfb; font-size: 14px; overflow: hidden; display: flex; color: #333;">
                <a
                    style=" padding: 10px 0; margin-left: 15px;"
                    :style="{fontWeight: 600, color: '#409eff', borderBottom: '2px solid #378fea'}"
                >我的发行</a>
                <a style="padding: 10px 0; margin-left: 20px;">我的mock</a>
                <a style="padding: 10px 0; margin-left: 20px;">发行市场</a>
            </div>
            <div style="height: 380px;">

                <div style="padding: 15px 15px 10px;">
                    <el-input
                        size="small"
                        v-model="filterSearch"
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        <i
                            style="cursor: pointer"
                            @click="filterSearch = ''"
                            v-show="filterSearch && filterSearch.length > 0"
                            slot="suffix"
                            class="el-input__icon el-icon-circle-close"
                        ></i>
                    </el-input>
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
                filterSearch: ''
            };
        }
    }
</script>

<style scoped>

</style>
