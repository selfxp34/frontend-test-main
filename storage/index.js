import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        comments: [],
    },
    getters: {
        getComments: (state) => {
            return state.comments;
        },
    },
    actions: {
        fetchComments: async (context) => {
            try {
                const response = await axios.get("/api/comments");
                context.commit("setComments", response.data);
            } catch (error) {
                console.error(error);
            }
        },
    },
});
export default store;
