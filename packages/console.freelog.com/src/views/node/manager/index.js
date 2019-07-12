let searchInputDelay = null;

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
            allTypes: ['全部类型', 'json', 'widget', 'image', 'audio', 'markdown', 'page_build', 'reveal_slide', 'license', 'video', 'catalog'],
            // 已选类型
            selectedType: '全部类型',
            // 状态可以选项
            allState: ['全部状态', '已上线', '未上线', '合约异常'],
            // 已选状态
            selectedState: '全部状态',

            // 当前页码
            currentPage: 1,
            // 当前页面条数
            pageSize: 10,
            // 表格总数量
            totalQuantity: 0,
        }
    },
    mounted() {
        this.handleTableData();
    },

    methods: {
        /**
         * 处理表格数据
         */
        async handleTableData() {
            console.log(this.selectedState, this.stateTextToValue(this.selectedState), 'selectedState');
            const params = {
                nodeId: this.$route.params.nodeId,
                page: this.currentPage,
                pageSize: this.pageSize,
                resourceType: this.selectedType === '全部类型' ? undefined : this.selectedType,
                isOnline: this.stateTextToValue(this.selectedState),
                keywords: this.filterSearch || undefined,
            };

            const res = await this.$axios.get(`/v1/presentables`, {
                params,
            });

            this.totalQuantity = res.data.data.totalItem;
            // console.log(res.data.data.dataList, 'resresres');
            this.tableData = res.data.data.dataList.map(i => ({
                presentableId: i.presentableId,
                presentableName: i.presentableName,
                releaseInfo: i.releaseInfo,
                policies: i.policies,
                updateDate: i.updateDate,
                createDate: i.createDate,
                isOnline: i.isOnline,
                isAuth: true,
            }));

            const params1 = {
                presentableIds: this.tableData.map(i => (i.presentableId)).join(','),
            };
            const res1 = await this.$axios.get('/v1/auths/presentables/batchNodeAndReleaseSideAuth', {
                params: params1,
            });

            // const authResult = res1.data.data.authResult.isAuth;

            // console.log(res1, 'res1res1res1');

            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].isAuth = res1.data.data[i].authResult.isAuth;
            }
        },

        /**
         * 格式化策略
         * @param str
         */
        spaceReplaceNbsp(str) {
            return str.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        },
        /**
         * 将 Date 字符串转换为标准格式
         */
        dateStringToFormat(dataStr) {
            // console.log(dataStr, 'dataStrdataStrdataStr');
            const data = new Date(dataStr);
            // console.log(data.getFullYear(), data.getMonth(), data.getDate(), '@!%@#$!@#$@#$');
            return [data.getFullYear(), data.getMonth() + 1, data.getDate()].join('.');
        },
        /**
         * 文字转换为对应数字
         */
        stateTextToValue(text) {
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

        /**
         * 节点类型发生变化
         */
        onChangeType(value) {
            // console.log(value, 'valuevaluevaluevaluevalue');
            this.selectedType = value;
        }
        ,

        /**
         * 节点状态发生变化
         */
        onChangeState(value) {
            this.selectedState = value;
        }
        ,

        /**
         * 当前page发生变化时
         * @param currentPage
         */
        onChangeCurrentPage(currentPage) {
            this.currentPage = currentPage;
        }
        ,
        /**
         * 页面条数发生变化时
         * @param pageSize
         */
        onChangePageSize(pageSize) {
            this.pageSize = pageSize;
        },
    },

    watch: {
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
        currentPage(){
            this.handleTableData();
        },
    },
}
