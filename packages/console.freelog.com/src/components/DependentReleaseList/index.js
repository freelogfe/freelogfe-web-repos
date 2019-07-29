import Item from './Item.vue';
import DepDialog from './DepDialog/index.vue';

export default {
    name: 'DependentReleaseList',
    components: {
        Item,
        DepDialog,
    },
    props: {
        dataSource: {
            type: Array,
            default() {
                return [
                    // {
                    // id: '',
                    // name: '',
                    // isOnline: true,
                    // isLock: false,
                    // version?: '',
                    // }
                ];
            },
        },
        isLock: {
            type: Boolean,
            default: false,
        },
        onChange: {
            type: Function,
            default(dataSource) {

            },
        },
    },
    data() {
        return {
            dialogVisible: false,
        };
    },
    methods: {
        onRemove(index) {
            console.log(index, '1234aaaaa');
            this.$emit('onChange',
                this.dataSource.filter((i, j) => j !== index),
            );
        },
        addARelease(item) {
            // console.log(item, 'ASDFASDCDSARFW');
            this.$emit('onChange', [
                ...this.dataSource,
                item,
            ]);
        }
    },
    computed: {
        exists() {
            return this.dataSource.map(i => i.id);
        }
    }
}
