const groupCreator = resolve => require.ensure([], () => resolve(require('./create/index.vue')), 'group')
const groupDetail = resolve => require.ensure([], () => resolve(require('./detail/index.vue')), 'group')
const groupList = resolve => require.ensure([], () => resolve(require('./list/index.vue')), 'group')

export default { groupCreator, groupDetail, groupList }
