import {onloadNodeList, onloadNodeDetail} from '@/data/node/loader'
import {createLoader} from "../../lib/utils"


function createLazyLoader(userId) {
  return createLoader((callback) => {
    onloadNodeList({
      ownerUserId: userId,
      pageSize: 1e2
    }).then(callback)
  })
}

const types = {
  CHECK_NODE: 'checkNode',
  CHANGE_NODE: 'changeNode',
  ADD_NODE: 'addNode',
  LOAD_NODES: 'loadNodes',
  LOAD_NODE_DETAIL: 'loadNodeDetail',
}

const nodeMod = {
  state: {
    nodes: []
  },

  lazyLoader: null,

  mutations: {
    [types.CHANGE_NODE]() {
    },
    [types.ADD_NODE](state, data) {
      state.nodes.push(data)
    },
    [types.LOAD_NODES](state, data) {
      state.nodes = data
    },
  },

  actions: {
    [types.CHECK_NODE]() {
      return new Promise((resolve) => {
        resolve(null)
      })
    },
    [types.LOAD_NODES]({commit, getters}) {
      return new Promise((resolve) => {
        const userId = getters.session.user && getters.session.user.userId
        if (userId) {
          if (!this.lazyLoader) {
            this.lazyLoader = createLazyLoader(userId)
          }
          this.lazyLoader((data) => {
            const nodes = data.dataList
            commit(types.LOAD_NODES, nodes)
            resolve(nodes)
          })
        } else {
          resolve(null)
        }
      })
    },
    [types.ADD_NODE]({commit}, node) {
      commit(types.ADD_NODE, node)
    },
    [types.CHANGE_NODE]({commit}, data) {
      commit(types.CHANGE_NODE, data)
      return new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    },
    [types.LOAD_NODE_DETAIL]({commit, dispatch}, nodeId) {
      return new Promise((resolve) => {
        dispatch(types.LOAD_NODES)
          .then(nodes => {
            var nodeDetail = null
            nodes.some(node => {
              if (node.nodeId.toString() === nodeId) {
                nodeDetail = node
                return true
              }
            })
            if (nodeDetail) {
              resolve(nodeDetail)
            } else {
              onloadNodeDetail(nodeId).then(resolve)
            }
          })
      })
    },
  }
}

export default nodeMod
