const releaseCreator = resolve => require.ensure([], () => resolve(require('./create/index.vue')), 'release-creator')
const releaseEditor = resolve => require.ensure([], () => resolve(require('./edit/index.vue')), 'release-editor')
const releaseAdd = resolve => require.ensure([], () => resolve(require('./add/index.vue')), 'release-add')
const releaseDetail = resolve => require.ensure([], () => resolve(require('./detail/index.vue')), 'release-detail')
const releaseList = resolve => require.ensure([], () => resolve(require('./list/index.vue')), 'release-list')
const releaseCollections = resolve => require.ensure([], () => resolve(require('./list/collections.vue')), 'release-collections')

export default {
  releaseCreator,
  releaseDetail,
  releaseEditor,
  releaseAdd,
  releaseList,
  releaseCollections
}
