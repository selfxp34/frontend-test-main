const state = {
    comments: [],
};

const getters = {
    getComments: (state) => state.comments,
};

const mutations = {
    addComment(state, comment) {
        state.comments.push(comment);
    },
};

const actions = {
    addComment({ commit }, comment) {
        commit("addComment", comment);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
