<template>
  <div class="container my-5">
    <h1 class="text-center mb-5 text-primary">Danh Sách Bài Viết</h1>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-if="errorMessage" class="text-center text-danger mb-3">
      <strong>{{ errorMessage }}</strong>
    </div>

    <div v-if="blogs.length  > 0" class="row">
      <div v-for="blog in blogs" :key="blog.ma" class="col-md-6 col-lg-4 mb-4">
        <div class="card shadow-sm rounded border-0 overflow-hidden">
          <router-link :to="`/blogDetail/${blog.ma}`">
            <img
              :src="`http://localhost:8080/api/image/uploads/${blog.anh}`"
              alt="Blog Image"
              class="card-img-top"
            />
          </router-link>
          <div class="card-body p-4">
            <div class="small text-muted mb-3">{{ blog.thoiGian }}</div>
            <h5 class="card-title">{{ blog.tieuDe }}</h5>
            <p class="card-text mb-3">
              {{ blog.noiDung.substring(0, 100) }}...
            </p>
            <router-link :to="`/blogDetail/${blog.ma}`" class="btn btn-primary">Đọc tiếp</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- Nút điều hướng trang -->
<div class="text-center mt-4">
  <button @click="prevPage" class="btn btn-secondary" :disabled="currentPage === 0">Trang trước</button>
  <span class="mx-3">Trang {{ currentPage + 1 }} / {{ totalPages }}</span>
  <button @click="nextPage" class="btn btn-secondary" :disabled="currentPage === totalPages - 1">Trang sau</button>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const blogs = ref([]);
const loading = ref(true);
const errorMessage = ref('');

const currentPage = ref(0); 
const totalPages = ref(0);  


onMounted(async () => {
  await loadBlogs(currentPage.value);
});

const loadBlogs = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:8080/api/blogs?page=${currentPage.value}`);
    const responses  = await axios.get(`http://localhost:8080/api/blogs/size-page`);

    console.log(response,'232ssss131')

    console.log(responses,'232131')

    blogs.value = response.data;

    console.log(response)
    totalPages.value = responses.data;
  } catch (error) {
    errorMessage.value = 'Không thể tải dữ liệu bài viết!';
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    console.log(currentPage);
    currentPage.value++;

    loadBlogs(currentPage.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadBlogs(currentPage.value);
  }
};

</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #004c8c;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 50px;
}

.card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 230px;
  object-fit: cover;
  width: 100%;
  transition: transform 0.3s ease;
}

.card-img-top:hover {
  transform: scale(1.05);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-top: 15px;
  margin-bottom: 10px;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.card-text {
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn {
  background-color: #007bff;
  border: none;
  padding: 12px 20px;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.3);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-center {
  text-align: center;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.col-md-6 {
  flex: 1 0 48%;
}

.col-lg-4 {
  flex: 1 0 31%;
}

.text-danger {
  font-size: 1.2rem;
  color: #dc3545;
  font-weight: 500;
  text-transform: uppercase;
}

.small {
  font-size: 0.875rem;
  color: #888;
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 1 0 100%;
  }
}
</style>
