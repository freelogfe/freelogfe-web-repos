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
                    @select="handleSelect"
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
    import Version from './Version';

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
                timeout: null,
                version: '',
                scope: [],
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
                // console.log(scope);
                this.scope = scope;
                this.$emit('onChange', {
                    release: this.filterSearch,
                    version: this.version,
                    scope: this.scope,
                });
                // console.log(this.$refs.tree.getCheckedNodes(), 'getCheckedNodes');
            },
            querySearchAsync(queryString, cb) {
                setTimeout(async () => {

                    const {nodeId} = this.$route.params;
                    const params = {
                        dependentEntityName: queryString,
                    };
                    const res = await this.$axios.get(`/v1/testNodes/${nodeId}/searchTestResource`, {
                        params,
                    });
                    // if (res.errcode !== 0 || res.ret !== 0) {
                    //     return this.$message.error(res.msg);
                    // }
                    // console.log(res, 'RERRRRRRR');
                    const dataList = res.data.data.dataList;
                    // console.log(dataList, 'dataListdataList');
                    const list = dataList.map(i => (
                        {value: i.testResourceName}
                    ));
                    // console.log(list, 'listlist');
                    cb(list);
                }, 1200);
            },
            closePopover() {

            },
            onVersionChange(data) {
                // console.log(data, '123412341234231423434234');
                // this.$emit('onChange', data);
                this.version = data.custom ? data.inputVersion : data.selectedVersion;
            },
            handleSelect(item) {
                console.log(item);
            }
        }
    }
</script>

<style scoped>

</style>
