import AddAndReplace from '../AddAndReplace/index.vue';

let searchInputDelay = null;

export default {
    name: "index",
    components: {
        AddAndReplace,
    },
    data() {
        return {
            tableData: [],
            // 筛选搜索框
            filterSearch: '',
            // 类型可选项
            allTypes: [
                // this.$t('allType'),
                '全部类型',
                'json', 'widget', 'image', 'audio', 'markdown', 'reveal_slide', 'license', 'video', 'catalog'],
            // 已选类型
            selectedType: '全部类型',
            // 状态可以选项
            allState: ['全部状态', '已上线', '未上线',
                // '异常'
            ],
            // 已选状态
            selectedState: '全部状态',
            // 当前页码
            currentPage: 1,
            // 当前页面条数
            pageSize: 10,
            // 表格总数量
            totalQuantity: 0,
        };
    },
    mounted() {
        // console.log(this.$route.params.nodeId, 'this.$router');
        // const {nodeId} = this.$route.params;
        // const nodeId = this.$router
        // this.$axios(`/v1/testNodes/${nodeId}/testResources`);
        this.handleTableData(true);
    },
    methods: {
        async matchTestResources() {
            const {nodeId} = this.$route.params;
            await this.$axios.post(`/v1/testNodes/${nodeId}/matchTestResources`)
        },
        async handleTableData(init = false) {
            if (init) {
                await this.matchTestResources();
            }

            const {nodeId} = this.$route.params;
            const params = {
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                resourceType: this.selectedType === '全部类型' ? undefined : this.selectedType,
                omitResourceType: 'page_build',
                isOnline: this.stateTextToValue(this.selectedState),
            };
            const res = await this.$axios(`/v1/testNodes/${nodeId}/testResources`, {
                params,
            });
            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(res.data.msg);
            }
            const data = res.data.data;
            // console.log(data, 'datadatadatadatadata');
            this.tableData = data.dataList;
            this.totalQuantity = data.totalItem;
            // console.log(data.dataList, 'ddddddddddddDDDDDD');
        },
        /**
         * 当前page发生变化时
         * @param currentPage
         */
        onChangeCurrentPage(currentPage) {
            this.currentPage = currentPage;
        },
        /**
         * 页面条数发生变化时
         * @param pageSize
         */
        onChangePageSize(pageSize) {
            this.pageSize = pageSize;
        },
        /**
         * 节点类型发生变化
         */
        onChangeType(value) {
            // console.log(value, 'valuevaluevaluevaluevalue');
            this.selectedType = value;
        },
        /**
         * 节点状态发生变化
         */
        onChangeState(value) {
            this.selectedState = value;
        },
        getIconClass(operation) {
            switch (operation) {
                case 'add':
                    return 'el-icon-plus';
                case 'replace':
                    return 'el-icon-refresh';
                case 'offline':
                    return 'el-icon-sort-down';
                case 'online':
                    return 'el-icon-sort-up';
                case 'set':
                    return 'el-icon-tickets';
                default:
                    return '';
            }
        },
        /**
         * 文字转换为对应数字
         */
        stateTextToValue(text) {
            //this.$t('allState'), this.$t('online'), this.$t('noOnline'), this.$t('contractException')
            //'全部状态', '已上线', '未上线', '合约异常'
            switch (text) {
                case '全部状态':
                    return 2;
                case '已上线':
                    return 1;
                case '未上线':
                    return 0;
                default:
                    return 2;
            }
        },
    },
    watch: {
        isPageStyle() {
            this.filterSearch = '';
            this.selectedType = this.$t('allType');
            this.selectedState = this.$t('allState');
            this.currentPage = 1;
            this.pageSize = 10;
            this.handleTableData();
        },
        selectedType() {
            this.currentPage = 1;
            this.pageSize = 10;
            this.handleTableData();
        },
        selectedState() {
            this.currentPage = 1;
            this.pageSize = 10;
            this.handleTableData();
        },
        filterSearch() {
            if (searchInputDelay) {
                clearTimeout(searchInputDelay);
            }
            searchInputDelay = setTimeout(() => {
                this.currentPage = 1;
                this.pageSize = 10;
                this.handleTableData();
            }, 300);

        },
        pageSize() {
            this.currentPage = 1;
            this.handleTableData();
        },
        currentPage() {
            this.handleTableData();
        },
    },
}
