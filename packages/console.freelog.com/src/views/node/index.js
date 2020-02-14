const nodeCreator = resolve => require.ensure([], () => resolve(require('./create/index.vue')), 'node')

const nodeManager = resolve => require.ensure([], () => resolve(require('./manager/index.vue')), 'node');
const nodeManagerRelease = resolve => require.ensure([], () => resolve(require('./manager-release/index.vue')), 'node');
const testNodeManager = resolve => require.ensure([], () => resolve(require('./test-manager/index.vue')), 'node');
const testManagerResource = resolve => require.ensure([], () => resolve(require('./test-manager-resource/index.vue')), 'node');

export default {
    // nodeList,
    // nodeDetail,
    // presentableList,
    // nodePreview,
    // presentableDetail,

    nodeCreator,
    nodeManager,
    nodeManagerRelease,
    testNodeManager,
    testManagerResource,
}
