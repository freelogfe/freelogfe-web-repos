const storageDisplay = resolve => require.ensure([], () => resolve(require('./display/index.vue')), 'resource');
const storageEditor = resolve => require.ensure([], () => resolve(require('./editor/index.vue')), 'resource');

export default {
    storageDisplay,
    storageEditor,
}
