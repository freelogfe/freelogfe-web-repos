import AddAndReplace from '../AddAndReplace/index.vue';
import RulesBar from '../../components/RulesBar';

let searchInputDelay = null;

export default {
    name: "index",
    components: {
        AddAndReplace,
        RulesBar,
    },
    data() {
        return {
            matchTestResult: [],
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
        this.handleTableData(true);

        // const {nodeId} = this.$route.params;
        // this.$axios.post(`/v1/testNodes`, {
        //     nodeId,
        //     testRuleText: Buffer.from('').toString('base64'),
        // });
    },
    methods: {
        async matchTestResources() {
            const {nodeId} = this.$route.params;
            const res = await this.$axios.post(`/v1/testNodes/${nodeId}/matchTestResources`);
            const result = res.data.data;
            this.matchTestResult = {
                ruleText: result.ruleText,
                testRules: result.testRules.map(i => ({text: i.text, ...i.ruleInfo}))
            };
            console.log(this.matchTestResult, 'this.matchTestResult');
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
                keywords: this.filterSearch || undefined,
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
         * 追加新加规则成功
         */
        pushRuleSuccess() {
            this.handleTableData();
        },
        /**
         * 去来源编辑页
         */
        goToOrigin(originInfo) {
            // console.log(originInfo, 'originInfooriginInfo');
            let url = '';
            if (originInfo.type === 'presentable') {
                url = `/node/manager-release/${originInfo.id}`;
            }

            if (originInfo.type === 'mock') {
                url = `/mock/update/${originInfo.id}`;
            }

            if (originInfo.type === 'release') {
                url = `/release/detail/${originInfo.id}?version=${originInfo.version}`;
            }

            window.open(url);
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
                    return 'el-icon-bottom';
                case 'online':
                    return 'el-icon-top';
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

        /**
         * 操作命令
         * @param mark
         * @param row
         * @returns {*|Promise<void>|Window}
         */
        operationCommand(mark, row) {
            // console.log(mark, row, 'R$RRRRRRRR');
            if (mark === '编辑') {
                return window.open('/node/test-manager-resource/' + row.testResourceId);
            }

            if (mark === 'isOnline') {
                return this.onLineAndOffLine(row);
            }
        },
        /**
         * 上下线
         * @param row
         */
        async onLineAndOffLine(row) {
            const {nodeId} = this.$route.params;
            const res = await this.$axios.get(`/v1/testNodes/${nodeId}`);
            const testResourceName = row.testResourceName;
            const isOnline = row.differenceInfo.onlineStatusInfo.isOnline === 1;
            const ruleText = res.data.data ? res.data.data.ruleText : '';
            if (isOnline) {
                // 需要下线
                const testRuleText = ruleText.replace(`^ ${testResourceName}`, `- ${testResourceName}`);
                const response = await this.$axios.post(`/v1/testNodes`, {
                    nodeId,
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                this.$message.success('下线成功');
            } else {
                // 需要上线
                if (ruleText.includes(`- ${testResourceName}`)) {
                    const testRuleText = ruleText.replace(`- ${testResourceName}`, `^ ${testResourceName}`);
                    const response = await this.$axios.post(`/v1/testNodes`, {
                        nodeId,
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    });
                } else {
                    const testRuleText = `^ ${testResourceName}`;
                    const params = {
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    };
                    const response = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, params);
                }
                this.$message.success('上线成功');
            }
            this.handleTableData();
        }
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
