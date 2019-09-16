<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">选择替换资源</div>
        <div style="height: 5px;"></div>

        <div style="border: 1px solid #c8c8c8; border-radius: 2px; overflow: hidden;">
            <div
                style="border-radius: 2px 2px 0 0; display: flex; align-items: center; justify-content: space-between; padding: 15px 15px 10px;">
                <el-autocomplete
                    size="small"
                    v-model="filterSearch"
                    style="width: 80%;"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
<!--                    <i-->
<!--                        style="cursor: pointer"-->
<!--                        @click="filterSearch = ''"-->
<!--                        v-show="filterSearch && filterSearch.length > 0"-->
<!--                        slot="suffix"-->
<!--                        class="el-input__icon el-icon-circle-close"-->
<!--                    ></i>-->
                </el-autocomplete>

                <el-popover
                    placement="bottom-end"
                    width="325"
                    trigger="click"
                >
                    <!--                            <el-button slot="reference">focus 激活</el-button>-->
                    <a
                        style="font-size: 12px; display: flex; align-items: center;"
                        slot="reference"
                    >
                        <span>版本范围</span>
                        <i class="el-icon-d-arrow-right" style="transform: rotate(90deg); font-size: 12px;"></i>
                    </a>

                    <div style="width: 100%; overflow: hidden;">
                        <div style="display: flex; align-items: center;">
                            <Radio :selected="true"/>
                            <span style="padding: 0 10px; font-size: 14px; color: #333;">选定版本</span>
                            <el-select
                                placeholder="请选择"
                                size="mini"
                                style="width: 100px;"
                            >
                                <el-option
                                    :label="'黄金糕'"
                                    :value="'选项1'"
                                ></el-option>
                            </el-select>
                        </div>
                        <div style="height: 10px;"></div>
                        <div>
                            <div style="display: flex; align-items: center;">
                                <Radio :selected="true"/>
                                <span style="padding: 0 10px; font-size: 14px; color: #333;">自定义</span>
                            </div>
                            <div style="height: 5px;"></div>
                            <el-input
                                v-model="input"
                                placeholder="输入semver版本范围"
                                style="display: block;"
                            ></el-input>
                        </div>
                        <div style="height: 10px;"></div>
                        <div
                            style="align-items: center; display: flex; flex-direction: row-reverse; width: 100%;"
                        >
                            <el-button type="primary" size="mini" style="font-size: 12px;">确定</el-button>
                            <el-button type="text" size="mini" style="font-size: 12px; padding: 0 20px; color: #999;">取消
                            </el-button>
                        </div>
                    </div>
                </el-popover>

            </div>
            <div style="height: 365px;">
                <el-tree
                    :data="data2"
                    show-checkbox
                    @check-change="treeCheckChange"
                    node-key="id"
                    ref="tree"
                    :default-expand-all="true"
                    :default-checked-keys="[]"
                    :props="defaultProps">
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script>

    import Radio from '../components/Radio.vue';

    export default {
        name: "index",
        components: {
            Radio,
        },
        data() {
            return {
                data2: [
                    {
                        id: '1',
                        label: '一级 1',
                        children: [{
                            id: 4,
                            label: '二级 1-1',
                            children: [{
                                id: 9,
                                label: '三级 1-1-1'
                            }, {
                                id: 10,
                                label: '三级 1-1-2'
                            }]
                        }]
                    }, {
                        id: 2,
                        label: '一级 2',
                        children: [{
                            id: 5,
                            label: '二级 2-1'
                        }, {
                            id: 6,
                            label: '二级 2-2'
                        }]
                    }, {
                        id: 3,
                        label: '一级 3',
                        children: [{
                            id: 7,
                            label: '二级 3-1'
                        }, {
                            id: 8,
                            label: '二级 3-2'
                        }]
                    }],
                filterSearch: '',
            };
        },
        methods: {
            treeCheckChange() {
                console.log(this.$refs.tree.getCheckedKeys(), 'getCheckedKeys');
                console.log(this.$refs.tree.getCheckedNodes(), 'getCheckedNodes');
            },
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
