const batchOperation = resolve => require.ensure([], () => resolve(require('./batch-operation.vue')), 'batch-oparation')

export default {
  batchOperation,
}
