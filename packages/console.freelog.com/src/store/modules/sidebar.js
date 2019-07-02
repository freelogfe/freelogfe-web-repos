const types = {
  TOGGLE_SIDEBAR: 'toggleSidebar',
  CLOSE_SIDEBAR: 'closeSidebar',
  HIDE_SIDEBAR: 'hideSidebar',
  OPEN_SIDEBAR: 'openSidebar'
}

const sidebar = {
  state: {
    showSidebar: true,
    openSidebar: true
  },

  mutations: {
    [types.HIDE_SIDEBAR](state) {
      state.showSidebar = false
    },
    [types.TOGGLE_SIDEBAR](state, shouldOpen) {
      if (shouldOpen === undefined) {
        state.openSidebar = !state.openSidebar
      } else {
        state.openSidebar = shouldOpen
      }
    }
  },

  actions: {
    [types.HIDE_SIDEBAR]({ commit }, shouldOpen) {
      commit(types.HIDE_SIDEBAR, shouldOpen)
    },
    [types.TOGGLE_SIDEBAR]({ commit }, shouldOpen) {
      commit(types.TOGGLE_SIDEBAR, shouldOpen)
    },
    [types.CLOSE_SIDEBAR]({ commit }) {
      commit(types.TOGGLE_SIDEBAR, false)
    },
    [types.OPEN_SIDEBAR]({ commit }) {
      commit(types.TOGGLE_SIDEBAR, true)
    }
  }
}

export default sidebar
