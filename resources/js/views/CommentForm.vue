<template>
    <div class="comment-container">
        <div class="comment-output">
            <h3>Комментарий</h3>
            <select v-model="sortType">
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
            </select>
            <button @click="sortComments('id')">Сортировать по ID</button>
            <button @click="sortComments('date')">Сортировать по дате</button>
            <div v-if="listLoading" class="loading">
                <img src="/images/spinner.svg" />
            </div>
            <div
                v-else
                v-for="comment in comments.slice(
                    (page - 1) * 3,
                    (page - 1) * 3 + 3
                )"
                :key="comment.id"
                class="comment"
            >
                <div class="comment-author">
                    <strong>Id комментария:</strong> {{ comment.id }}
                </div>
                <div class="comment-author">
                    <strong>Автор комментария:</strong> {{ comment.author }}
                </div>
                <div class="comment-author">
                    <strong>Дата комментария:</strong> {{ comment.date }}
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <button @click="deleteComment(comment.id)">Удалить</button>
            </div>
            <div>
                <span v-for="p in pages" :key="p">
                    <button
                        @click="changePage(p)"
                        :class="{ active: p === page }"
                    >
                        {{ p }}
                    </button>
                </span>
            </div>
        </div>
        <form @submit.prevent="submitComment" class="comment-form">
            <div class="form-group">
                <h3>Оставить Комментарий</h3>
                <label for="name">Имя:</label>
                <input type="text" id="name" v-model="name" required />
                <!-- <input type="date" id="date" v-model="date" required /> -->
                <date-picker
                    v-model="date"
                    valueType="format"
                    aria-required="true"
                ></date-picker>
            </div>
            <div class="form-group">
                <label for="comment">Комментарий:</label>
                <textarea id="text" v-model="comment" required></textarea>
            </div>
            <button
                type="submit"
                :disabled="!name || !comment || loading || !date"
            >
                Комментировать
            </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
    components: {
        DatePicker,
    },
    data() {
        return {
            name: "",
            comment: "",
            date: "",
            comments: [],
            loading: false,
            listLoading: false,
            page: 1,
            pages: [1],
            sortType: "asc",
        };
    },
    methods: {
        sortComments(type) {
            if (type === "id") {
                this.comments.sort((a, b) => {
                    if (this.sortType === "asc") {
                        return a.id - b.id;
                    } else {
                        return b.id - a.id;
                    }
                });
            } else if (type === "date") {
                this.comments.sort((a, b) => {
                    if (this.sortType === "asc") {
                        return new Date(a.date) - new Date(b.date);
                    } else {
                        return new Date(b.date) - new Date(a.date);
                    }
                });
            }
        },
        changePage(p) {
            this.page = p;
        },
        submitComment() {
            this.comments.push({
                author: this.name,
                content: this.comment,
                date: this.date,
                id: this.comments.length
                    ? Math.max(...this.comments.map((item) => item.id)) + 1
                    : 1,
            });
            let pageAdded = false;
            if ((this.comments.length - 1) % 3 === 0) {
                this.pages.push(this.pages.at(-1) + 1);
                pageAdded = true;
            }
            // Очищаем поля ввода
            const name = this.name;
            const text = this.comment;
            const date = this.date;
            this.name = "";
            this.comment = "";
            this.loading = true;
            axios // XMLHttpRequest
                .post("/api/comments", {
                    name,
                    date,
                    text,
                })
                .then((response) => {
                    // console.log(response.data);
                    this.loading = false;
                    this.comments[this.comments.length - 1] = response.data;
                    // if (
                    //     this.page === this.pages.at(-1) &&
                    //     (this.comments.length - 1) % this.pages.length < 2
                    // ) {
                    //     this.pages.push(this.page + 1);
                    // }
                    // Добавляем новый комментарий в список
                })
                .catch((error) => {
                    console.error(error);
                    this.loading = false;
                    this.comments.pop();
                    if (pageAdded) {
                        this.pages.pop();
                    }
                    // Обработка ошибок
                });
        },
        deleteComment(id) {
            if ((this.comments.length - 1) % 3 === 0) {
                if (this.page === this.pages.at(-1)) {
                    this.page -= 1;
                }
                this.pages.pop();
            }
            let i = this.comments.map((item) => item.id).indexOf(id);
            this.comments.splice(i, 1);
            axios
                .delete("/comments/" + id, {})
                .then((response) => {
                    // let i = this.comments.map((item) => item.id).indexOf(id); // find index of your object
                    // this.comments.splice(i, 1); // remove it from array
                })
                .catch((error) => {
                    console.error(error);
                    // Обработка ошибок
                });
        },
        fetchComments() {
            this.listLoading = true;
            axios
                .get("/api/comments")
                .then((response) => {
                    // Загружаем комментарии при загрузке компонента
                    this.comments = response.data;
                    this.pages = Array.from({
                        length: Math.ceil(this.comments.length / 3),
                    }).map((_, i) => i + 1);
                    this.listLoading = false;
                })
                .catch((error) => {
                    console.error(error);
                    this.listLoading = false;
                    // Обработка ошибок
                });
        },
    },
    created() {
        // Выполняем загрузку комментариев при создании компонента
        this.fetchComments();
    },
};
</script>

<style>
.comment-container {
    display: grid;
    grid-template-columns: 2fr;
    grid-gap: 50px;
}

.active {
    background-color: red;
}

.comment-output {
    background-color: #f9f9f9;
    padding: 70px;
    border-radius: 5px;
}

.comment {
    margin-bottom: 10px;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.comment-author {
    font-weight: bold;
}

.comment-content {
    padding-bottom: 3px;
}

.comment-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 70px;
}

.form-group {
    margin-bottom: 10px;
    border-color: #bfbbbb;
}

label {
    display: block;
    font-weight: bold;
}

input[type="text"],
textarea {
    width: 300px;
    padding: 5px;
}

button {
    padding: 10px 20px;
    background-color: #333;
    border-radius: 8px;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
}
button:hover {
    background-color: #bfbbbb;
}

/* Медиазапрос для адаптации под мобильные устройства */
@media (max-width: 480px) {
    .comment-output {
        padding: 30px;
    }

    .comment-form {
        margin-left: 30px;
    }

    input[type="text"],
    textarea {
        width: 100%;
    }
}

.comment-container,
.comment,
.comment-author,
.comment-content,
.comment-form,
.form-group,
label,
input[type="text"],
textarea,
button {
    line-height: 1.5;
}
</style>
