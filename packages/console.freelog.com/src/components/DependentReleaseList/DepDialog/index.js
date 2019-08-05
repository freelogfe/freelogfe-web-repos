import Search from './Search.vue';
import Release from './Release.vue';
import Collection from './Collection.vue';
import Mock from './Mock.vue';

export default {
    name: 'DepDialog',
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
