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
        // dataSource: {
        //     type: Array,
        //     default() {
        //         return [];
        //     },
        // },
        exists: {
            type: Array,
            default() {
                return [];
            },
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
        // addARelease(item) {
        //     console.log(item, 'itemitem');
        //     this.$emit('addARelease', [
        //         ...dataSource,
        //         item,
        //     ])
        // },
    }

}
