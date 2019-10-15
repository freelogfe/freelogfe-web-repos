const batchOperation = resolve => require.ensure([], () => resolve(require('./batch-operation.vue')), 'batch-oparation')
const toolsCreateResource = resolve => require.ensure([], () => resolve(require('./create-resource.vue')), 't-create-resource')
const toolsResourcesList = resolve => require.ensure([], () => resolve(require('./resources-list.vue')), 't-resources-list')
const toolsReleasesList = resolve => require.ensure([], () => resolve(require('./releases-list.vue')), 't-releases-list')
const toolsPresentablesList = resolve => require.ensure([], () => resolve(require('./presentables-list.vue')), 't-presentables-list')

export default {
  batchOperation,
  toolsCreateResource,
  toolsResourcesList,
  toolsReleasesList,
  toolsPresentablesList,
}
