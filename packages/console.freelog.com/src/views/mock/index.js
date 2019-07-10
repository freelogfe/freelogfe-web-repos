const mockDisplay = resolve => require.ensure([], () => resolve(require('./display/index.vue')), 'resource');
const mockEditor = resolve => require.ensure([], () => resolve(require('./editor/index.vue')), 'resource');

export default {
    mockDisplay,
    mockEditor,
}
