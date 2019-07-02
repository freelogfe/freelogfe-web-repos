const resourceCreator = resolve => require.ensure([], () => resolve(require('./create/index.vue')), 'resource')
const resourceReEditor = resolve => require.ensure([], () => resolve(require('./re-edit/index.vue')), 'resource')
// const resourceDetail = resolve => require.ensure([], () => resolve(require('./detail-V4.0/index.vue')), 'resource-detail')
const resourceDetail = resolve => require.ensure([], () => resolve(require('./detail-V4.0/index-v4-1.vue')), 'resource-detail')
const resourceList = resolve => require.ensure([], () => resolve(require('./list/index.vue')), 'resource-list')
const resourceEditor = resolve => require.ensure([], () => resolve(require('./edit/index.vue')), 'resource-editor')


export default {
    resourceCreator,
    resourceReEditor,


    resourceEditor,
    resourceDetail,
    resourceList,
}
