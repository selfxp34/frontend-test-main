<template>
    <div class="comment-container">
        <div class="comment-output">
            <h3>Комментарий</h3>
            <div v-for="comment in comments" :key="comment.id" class="comment">
                <div class="comment-author">
                    <strong>Автор комментария:</strong> {{ comment.author }}
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                  <button @click="deleteComment(comment.id)">Удалить</button>
            </div>
        </div>
        <form @submit.prevent="submitComment" class="comment-form">
            <div class="form-group">
                <h3>Оставить Комментарий</h3>
                <label for="name">Имя:</label>
                <input type="text" id="name" v-model="name" required />
                <input type='date' id="date" v-model="date" required/>
            </div>
            <div class="form-group">
                <label for="comment">Комментарий:</label>
                <textarea id="text" v-model="text" required></textarea>
            </div>
            <button type="submit">Комментировать</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: "",
            comment: "",
            comments: []
        };
    },
    methods: {
        submitComment() {
            axios.post('/api/comments', {
                name: this.name,
                date: this.date,
                text: this.text
            })
            .then(response => {
                console.log(response.data);
                // Добавляем новый комментарий в список
                this.comments.push(response.data);
                // Очищаем поля ввода
                this.name = "";
                this.comment = "";
            })
            .catch(error => {
                console.error(error);
                // Обработка ошибок
            });
        },
          deleteComment(id) {
            axios.delete('/comments/'+id, {
           
            })
            .then(response => {
               
            let i = this.comments.map(item => item.id).indexOf(id) // find index of your object
this.comments.splice(i, 1) // remove it from array
          
            
            })
            .catch(error => {
                console.error(error);
                // Обработка ошибок
            });
        },
        fetchComments() {
            axios.get('/api/comments')
            .then(response => {
                console.log(response.data);
                // Загружаем комментарии при загрузке компонента
                this.comments = response.data;
            })
            .catch(error => {
                console.error(error);
                // Обработка ошибок
            });
        }
    },
    created() {
        // Выполняем загрузку комментариев при создании компонента
        this.fetchComments();
    }
};
</script>
</script>

<style>
.comment-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 30px;
}

.comment-output {
    background-color: #f9f9f9;
    padding: 70px;
    border-radius: 5px;
}

.comment {
    margin-bottom: 10px;
}

.comment-author {
    font-weight: bold;
}

.comment-content {
    margin-top: 5px;
}

.comment-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 70px;
}

.form-group {
    margin-bottom: 10px;
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
    color: #fff;
    border: none;
    cursor: pointer;
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
</style>
