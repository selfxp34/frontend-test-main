import Vue from "vue";

//Main pages
import App from "./views/app.vue";

const app = new Vue({
    el: "#app",
    components: { App },
    // methods: {
    //     deleteComment(commentId) {
    //         axios
    //             .delete(`/api/comments/${commentId}`)
    //             .then((response) => {
    //                 // Успешное удаление комментария
    //                 // Обновите список комментариев или выполните другие необходимые действия
    //             })
    //             .catch((error) => {
    //                 // Обработка ошибки удаления комментария
    //                 console.error(error);
    //             });
    //     },
    // },
});
