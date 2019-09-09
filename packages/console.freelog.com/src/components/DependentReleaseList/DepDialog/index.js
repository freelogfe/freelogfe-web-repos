import Search from './Search.vue';
import Release from './Release.vue';
import Collection from './Collection.vue';
import Mock from './Mock.vue';

export default {
    name: 'DepDialog',
    i18n: { // `i18n` 选项，为组件设置语言环境信息
        messages: {
            en: {
                globalSearching: 'Global Searching',
                myReleases: 'My Releases',
                myCollections: 'My Collections',
                myMocks: 'My Mocks',
            },
            'zh-CN': {
                globalSearching: '全局搜索',
                myReleases: '我的发行',
                myCollections: '我的收藏',
                myMocks: 'Mock资源',
            },
        }
    },
    components: {
        Search,
        Release,
        Collection,
        Mock,
    },
    props: {
        exists: {
            type: Array,
            default() {
                return [];
            },
        },
        existMocks: {
            type: Array,
            default() {
                return [];
            },
        },
        showMock: {
            type: Boolean,
            default: false,
        },
        currentID: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            visible: true,
            activeTab: 'search',  // 'search | 'release' | 'collection' | 'mock'
        };
    },
    methods: {
        onChangeTab(tabName) {
            this.activeTab = tabName;
        },
    }

}
