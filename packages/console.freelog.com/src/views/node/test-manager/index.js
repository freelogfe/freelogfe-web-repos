import clipboard from '@/components/clipboard/index.vue';
import ReleaseList from './ReleaseList/index.vue';
import StylePage from './StylePage/index.vue';
import MappingRules from './MappingRules/index.vue';
import NodeHeader from "../components/NodeHeader";

export default {
    name: 'test-management',
    components: {
        NodeHeader,
        clipboard,
        ReleaseList,
        StylePage,
        MappingRules,
    },
    data() {
        return {
            styleObject: {
                minHeight: (window.innerHeight - 60) + 'px',
            },
            selectedTab: this.$route.query.tab || 'ReleaseList',
            nodeInfo: {
                origin: '',
                name: '',
            },
            tabList: [
                { name: '节点发行列表', tab: 'ReleaseList' },
                { name: '节点页面样式', tab: 'StylePage' },
                { name: '节点发行列表', tab: 'MappingRules' },
            ]
        };
    },
    mounted() {
        this.handleNodeInfo();
    },
    methods: {
        /**
         * 处理节点信息
         */
        async handleNodeInfo() {
            const res = await this.$axios.get(`/v1/nodes/${this.$route.params.nodeId}`);
            // console.log(res, 'nodeInfonodeInfo');
            const origin = [
                res.data.data.nodeDomain,
                ...window.location.origin.split('.').filter((i, j, k) => j >= k.length - 2)
            ].join('.');
            // console.log(origin, 'originoriginorigin');
            this.nodeInfo = {
                origin,
                name: res.data.data.nodeName,
                testOrigin: 't.' + origin,
            };
        },
        exchangeTab(tab) {
            this.selectedTab = tab.tab
            this.$router.replace({ 
                path: this.$route.path, 
                query: {
                    tab: tab.tab
                } 
            })
        }
    }
}
