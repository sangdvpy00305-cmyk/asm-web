<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
import { computed } from 'vue'; 

const store = useStore();

const isLoggedIn = computed(() => store.getters.getLoginStatus);
    const userInfo = computed(() => store.getters.getUserInfo);

const route = useRoute();
const blog = ref(null);
const comments = ref([]);
const newComment = ref('');
const loading = ref(true);
const loadingComments = ref(false); 
const errorMessage = ref('');

const getBlog = async (blogId) => {
    try {
        const blogResponse = await axios.get(`http://localhost:8080/api/blogs/${blogId}`);
        blog.value = blogResponse.data;
        console.log(blogResponse)
    } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
        errorMessage.value = 'Không thể tải bài viết!';
    }
};

const getComments = async (blogId) => {
    try {
        const commentsResponse = await axios.get(`http://localhost:8080/api/comments/blog/${blogId}`);
        comments.value = commentsResponse.data;
    } catch (error) {
        console.error('Lỗi khi tải bình luận:', error);
        errorMessage.value = 'Không thể tải bình luận!';
    } finally {
        loadingComments.value = false; 
    }
};
const submitComment = async () => {
    try {
        const blogId = route.params.id;
        const data = localStorage.getItem('userInfo');
        const parsedData = JSON.parse(data);
        const email = parsedData?.email || 'Người dùng chưa đăng nhập';

        const newCommentData = {
            email: email,
            blogId: blogId,
            noiDung: newComment.value,
        };

        await axios.post(`http://localhost:8080/api/comments/add`, newCommentData);
        
        await getComments(blogId);

        newComment.value = ''; 
    } catch (error) {
        console.error('Lỗi khi gửi bình luận:', error);
    }
};


onMounted(async () => {
    const blogId = route.params.id;
    console.log(blogId);
    
    await getBlog(blogId);
    loading.value = false; 
});

const showComments = () => {
    const blogId = route.params.id;
    getComments(blogId);
};
</script>

<template>
    <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Đang tải...</span>
        </div>
    </div>

    <div v-else-if="errorMessage" class="text-center text-danger mb-3">
        <strong>{{ errorMessage }}</strong>
    </div>

    <div v-else v-if="blog" class="container my-5">
        <div class="row">
            <div class="col-lg-8 offset-lg-2">
                <h1 class="display-4 mb-4">{{ blog.tieuDe }}</h1>
                <img :src="`http://localhost:8080/api/image/uploads/${blog.anh}`" alt="Blog Image"
                    class="img-fluid rounded mb-4" />
                <div class="mb-4">
                    <p>{{ blog.noiDung }}</p>
                </div>

                <div class="mb-4">
                    <h4>Bình luận</h4>
                    <div v-if="comments.length === 0" class="text-muted">
                        <button class="btn btn-link" @click="showComments">Hiển thị bình luận</button>
                    </div>
                    <div v-if="loadingComments" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Đang tải bình luận...</span>
                        </div>
                    </div>
                    <div v-for="comment in comments" :key="comment.id" class="card mb-2">
                        <div class="card-body">
                            <p><strong>{{ comment.hoTenNguoiComment }}:</strong> {{ comment.noiDung }}</p>
                        </div>
                    </div>
                    
                    <div v-if="isLoggedIn">
                        <h5>Thêm bình luận</h5>
                    <form @submit.prevent="submitComment">
                        <div class="form-group">
                            <textarea id="commentText" class="form-control" v-model="newComment"
                                placeholder="Viết bình luận của bạn" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Gửi bình luận</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}


.display-4 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    line-height: 1.3;
}


.img-fluid {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.text-center {
    text-align: center;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}


.card-body {
    font-size: 1rem;
    line-height: 1.6;
}


textarea {
    resize: vertical;
}

button[type='submit'] {
    background-color: #007bff;
    border: none;
    padding: 10px 20px;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button[type='submit']:hover {
    background-color: #0056b3;
}
</style>
