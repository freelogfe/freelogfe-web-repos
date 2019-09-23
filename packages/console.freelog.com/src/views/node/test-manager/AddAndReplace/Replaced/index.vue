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
                    :load="loadNode1"
                    lazy
                    show-checkbox
                    @check-change="treeCheckChange"
                    node-key="id"
                    ref="tree"
                    :default-expand-all="false"
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
                data2: [],
                filterSearch: '',
                popoverShow: false,
                timeout: null,
                version: '',
                scope: [],
            };
        },
        mounted() {
            this.searchTestResource('12345123451234/资源H');
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
                        {id: i.testResourceId, value: i.testResourceName}
                    ));
                    // console.log(list, 'listlist');
                    cb([]);
                }, 1200);
            },
            closePopover() {

            },
            onVersionChange(data) {
                // console.log(data, '123412341234231423434234');
                // this.$emit('onChange', data);
                this.version = data.custom ? data.inputVersion : data.selectedVersion;
            },
            async handleSelect(item) {
                console.log(item);
                // await this.$axios.get(`/v1/testNodes/testResources/${item.id}/dependencyTree`);
                // this.searchTestResource(item.value)
            },
            /**
             * 获取 树根 列表
             * @param queryString
             * @returns {Promise<void>}
             */
            async searchTestResource(queryString) {
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
                // console.log(dataList, 'dataListdataListdataListdataListdataList');
                this.data2 = dataList.map(i => ({
                    id: i.testResourceName,
                    label: i.testResourceName,
                    testResourceId: i.testResourceId,
                    children: [],
                }));
            },
            loadNode1(node, resolve) {
                console.log(node, 'nodenodenodenodenodenode');
                if (node.level === 0) {
                    return resolve([]);
                }

                if (node.level > 1) {
                    return resolve(node.data.children || []);
                }
                // if (node.level > 1) return resolve([]);

                setTimeout(async () => {
                    const res = await this.$axios.get(`/v1/testNodes/testResources/${node.data.testResourceId}/dependencyTree`);
                    console.log(res, 'resresresresresresresresresres');
                    const data = [{
                        id: 'leaf',
                        label: 'leaf',
                        leaf: true
                    }, {
                        id: 'zone',
                        label: 'zone',
                        leaf: true,
                        children: undefined,
                    }];

                    resolve(data);
                }, 500);
            }
        }
    }
</script>

<style scoped>

</style>
