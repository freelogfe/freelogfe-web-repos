<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">选择替换资源</div>
        <div style="height: 5px;"></div>

        <div style="border: 1px solid #c8c8c8; border-radius: 2px; overflow: hidden;">
            <div
                style="border-radius: 2px 2px 0 0; background-color: #fafbfb; font-size: 14px; overflow: hidden; display: flex; color: #333; height: 40px; align-items: center; justify-content: space-between; padding: 0 15px;">
                <div style="display: flex; align-items: center;">

                    <div style="display: flex; align-items: center;">
                        <Radio/>
                        <span style="padding-left: 5px;">全选</span>
                    </div>
                    <div style="padding-left: 20px; display: flex; align-items: center;">
                        <Radio/>
                        <span style="padding-left: 5px;">反选</span>
                    </div>
                </div>
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
                        <span>筛选</span>
                        <i class="el-icon-d-arrow-right" style="transform: rotate(90deg); font-size: 12px;"></i>
                    </a>

                    <div style="width: 100%; overflow: hidden;">
                        <div>
                            <el-input
                                v-model="input"
                                placeholder="名称"
                                style="display: block;"
                            ></el-input>
                            <div style="height: 10px;"></div>
                            <el-input
                                v-model="input"
                                placeholder="版本范围"
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
            <div style="height: 380px;">
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
            };
        },
        methods: {
            treeCheckChange() {
                console.log(this.$refs.tree.getCheckedKeys(), 'getCheckedKeys');
                console.log(this.$refs.tree.getCheckedNodes(), 'getCheckedNodes');
            }
        }
    }
</script>

<style scoped>

</style>
