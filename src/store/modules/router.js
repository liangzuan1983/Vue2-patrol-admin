const router = {
  state: {
    path: null,
    from: null
  },
  mutations: {
    SETPATH: (state, currentPath) => {
      state.path = currentPath
    },
    SETFROM: (state) => {
      state.from = state.path
    }
  },
  actions: {
    href_variation({ commit }, currentPath) {
      if (currentPath) {
        commit('SETFROM')
        commit('SETPATH', currentPath)
      }
    }
  }
}
export default router
