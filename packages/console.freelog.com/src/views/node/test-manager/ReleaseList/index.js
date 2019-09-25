import AddAndReplace from '../AddAndReplace/index.vue';

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
            allState: ['全部状态', '已上线', '未上线', '异常'],
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
        this.handleData();
    },
    methods: {
        async matchTestResources() {
            const {nodeId} = this.$route.params;
            await this.$axios.post(`/v1/testNodes/${nodeId}/matchTestResources`)
        },
        async handleData() {
            await this.matchTestResources();
            const {nodeId} = this.$route.params;
            const params = {
                pageIndex: 1,
                pageSize: 100,
                // resourceType: '',
                // omitResourceType: '',
                // isOnline: 1,
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
            // console.log(data.dataList, 'ddddddddddddDDDDDD');
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
        }
    }
}
