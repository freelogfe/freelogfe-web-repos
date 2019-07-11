export default {
    name: "index",
    data() {
        return {
            // 根 div 样式对象
            styleObject: {
                // height: '100%',
                minHeight: (window.innerHeight - 60) + 'px',
            },
            // 筛选『全部』和『待处理』
            filterTodo: '全部',
            // 筛选搜索框
            filterSearch: '',
            // 表格数据
            tableData: [],
            // 类型可选项
            allTypes: ['全部类型', 'json', 'widget', 'image', 'audio', 'markdown', 'pageBuild', 'revealSlide', 'license', 'video', 'catalog'],
            // 已选类型
            selectedType: '全部类型',
            // 状态可以选项
            allState: ['全部状态', '已上线', '未上线', '合约异常'],
            // 已选状态
            selectedState: '全部状态',
        }
    },
    mounted() {
        this.handleTableData();
    },

    methods: {
        /**
         * 处理表格数据
         */
        handleTableData() {
            this.tableData = [
                {
                    title: '发行标题xxx',
                    type: 'image',
                    policy: '',
                    updateTime: '2019.04.14',
                    state: '已上线',
                }
            ];

        },
    }
}
