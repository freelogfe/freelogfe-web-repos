import LazyListView from '@/components/LazyListView/index.vue'
import {loadAuthSchemes} from '@/data/scheme/loader'
import ListItem from './release.vue'

export default {
    name: 'index-main-view',
    data() {
        return {
            resourceList: [],
            query: ''
        }
    },
    components: {
        ListItem,
        LazyListView
    },

    watch: {
        '$route.query': function () {
            this.query = this.$route.query.q || ''
            this.queryHandler()
        }
    },

    mounted() {
        const qs = this.$route.query
        if (qs.q) {
            this.query = qs.q
        }
    },
    methods: {
        autoQueryHandler() {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.queryHandler()
            }, 8e2)
        },
        queryHandler() {
            if (this.timer) {
                clearTimeout(this.timer)
            }

            this.$refs.resourceList.$emit('reload', {
                keyWords: encodeURIComponent(this.query)
            })
        },
        fetchReleaseData(page) {
            const query = {
                page,
                pageSize: 30
            }
            if (this.query) {
                query.keyWords = this.query
            }
            return this.loader(query).then((data) => {
                data.canLoadMore = !(data.dataList < data.pageSize)
                data.dataList = data.dataList.filter(r => r.policies.length > 0)
                const releases = data.dataList

                if (releases && releases.length) {
                    const releasesMap = {}
                    const rids = releases.map((r) => {
                        releasesMap[r.resourceId] = r
                        return r.resourceId
                    })

                    // return loadAuthSchemes({ resourceIds: rids, authSchemeStatus: 1 }).then((schemes) => {
                    //   schemes.forEach((scheme) => {
                    //     const rid = scheme.resourceId
                    //     releasesMap[rid].schemes = releasesMap[rid].schemes || []
                    //     releasesMap[rid].schemes.push(scheme)
                    //   })
                    //   data.dataList = Object.values(releasesMap)
                    //   return data
                    // })
                }

                return data
            })
        },
        loader(param) {
            if (typeof param === 'object') {
                if (param.keyWords) {
                    this.query = param.keyWords
                }
                param = {
                    params: param
                }
            }
            return this.$services.ReleaseService.get(param || {}).then(res => res.getData())
            // return this.$services.allResources.get(param || {}).then(res => res.getData())
        }
    }
}
