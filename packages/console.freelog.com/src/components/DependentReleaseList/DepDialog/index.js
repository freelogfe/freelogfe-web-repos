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
    data() {
        return {
            activeTab: 'search',  // 'search | 'release' | 'collection' | 'mock'
        };
    },
    methods: {
        onChangeTab(tabName) {
            this.activeTab = tabName;
        }
    }

}
