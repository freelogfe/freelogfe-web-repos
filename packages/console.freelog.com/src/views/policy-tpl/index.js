const policyTplCreator = resolve => require.ensure([], () => resolve(require('./create/index.vue')), 'policy-tpl')
const policyTplDetail = resolve => require.ensure([], () => resolve(require('./detail/index.vue')), 'policy-tpl')
const policyTplList = resolve => require.ensure([], () => resolve(require('./list/index.vue')), 'policy-tpl')


export default { policyTplCreator, policyTplDetail, policyTplList }
