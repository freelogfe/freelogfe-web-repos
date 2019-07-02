const mockDisplay = resolve => require.ensure([], () => resolve(require('./display/index.vue')), 'resource');
// const mockReEdit = resolve => require.ensure([], () => resolve(require('./re-edit/index.vue')), 'resource');


const mockDetail = resolve => require.ensure([], () => resolve(require('./detail-V4.0/index.vue')), 'mock-detail')
// // const mockDetail = resolve => require.ensure([], () => resolve(require('./detail/index.vue')), 'mock-detail')
const mockList = resolve => require.ensure([], () => resolve(require('./list/index.vue')), 'mock-list')
const mockEditor = resolve => require.ensure([], () => resolve(require('./edit/index.vue')), 'mock-editor')
const mockCreator = resolve => require.ensure([], () => resolve(require('./create/index.vue')), 'resource')


export default {
    mockCreator,
    mockEditor,
    mockDetail,
    mockList,

    mockDisplay,
    // mockReEdit,
}
