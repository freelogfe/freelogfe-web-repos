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
            selectedTab: 'ReleaseList',
            nodeInfo: {
                origin: '',
                name: '',
            },
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
    }
}
