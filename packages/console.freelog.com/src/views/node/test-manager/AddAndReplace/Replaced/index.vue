<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">选择被替换资源</div>
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

                <Version
                    :versions="['1.1.2', '1.1.1', '1.0.0']"
                    @change="onVersionChange"
                />

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
                >
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script>

    import Radio from '../components/Radio.vue';
    import Version from "./Version";

    export default {
        name: "index",
        components: {
            Version,
            Radio,
        },
        data() {
            return {
                data2: [
                    {
                        id: 'presentation1',
                        label: 'presentation1',
                        children: [
                            {
                                id: 'presentation1->release1',
                                label: 'release1',
                                children: [
                                    {
                                        id: 'presentation1->release1->release2',
                                        label: 'release2'
                                    },
                                    {
                                        id: 'presentation1->release1->release3',
                                        label: 'release3',
                                        children: [
                                            {
                                                id: 'presentation1->release1->release3->release2',
                                                label: 'release2'
                                            },
                                        ]
                                    }

                                ]
                            }]
                    },
                    {
                        id: 'presentation2',
                        label: 'presentation2',
                        children: [
                            {
                                id: 'presentation2->release2',
                                label: 'release2'
                            }
                        ]
                    },
                ],
                filterSearch: '',
                popoverShow: false,
                scope: [],
                timeout: null,
            };
        },
        methods: {
            treeCheckChange() {
                if (this.timeout) {
                    return;
                }
                this.timeout = setTimeout(() => {
                    // console.log(this.$refs.tree.getCheckedKeys(), 'getCheckedKeys');
                    this.timeout = null;
                }, 10);

                const scope = [];
                let tempScope = [...this.$refs.tree.getCheckedKeys()];
                while (tempScope.length > 0) {
                    const temp = tempScope.shift();
                    scope.push(temp);
                    tempScope = tempScope.filter(i => !i.startsWith(temp + '->'));
                }
                console.log(scope);
                this.scope = scope;
                // console.log(this.$refs.tree.getCheckedNodes(), 'getCheckedNodes');
            },
            querySearchAsync(queryString, cb) {

                setTimeout(() => {
                    cb([
                        {"value": "release2"},
                        {"value": "release21"},
                    ])
                }, 1200);
            },
            closePopover() {

            },
            onVersionChange(data) {
                console.log(data, 'datadata');
            }
        }
    }
</script>

<style scoped>

</style>
