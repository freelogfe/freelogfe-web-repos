import clipboard from '@/components/clipboard/index.vue';
import ReleaseList from './ReleaseList/index.vue';
import StylePage from './StylePage/index.vue';
import MappingRules from './MappingRules/index.vue';

export default {
    name: 'test-management',
    components: {
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
        };
    },
}
