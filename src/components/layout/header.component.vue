<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue'; 

// const isLoggedIn = ref(false); 
const router = useRouter();
const store = useStore();

const isLoggedIn = computed(() => store.getters.getLoginStatus);
    const userInfo = computed(() => store.getters.getUserInfo);


const logout = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('isLoggedIn');
  isLoggedIn.value = false; 
  window.location.reload(); 
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary position-sticky sticky-top mb-3">
    <div class="container">
      <router-link to="/" class="navbar-brand">Blog</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><router-link class="nav-link" to="/">Trang chủ</router-link></li>
          <!-- Hiển thị liên kết "Quản lý bài viết" và "Trang cá nhân" nếu đã đăng nhập -->
          <li v-if="isLoggedIn" class="nav-item"><router-link class="nav-link" to="/managerBlog">Quản lý bài viết</router-link></li>
          <li v-if="isLoggedIn" class="nav-item"><router-link class="nav-link" to="/profile">Trang cá nhân</router-link></li>
          <!-- Hiển thị "Đăng nhập" nếu chưa đăng nhập -->
          <li v-if="!isLoggedIn" class="nav-item"><router-link class="nav-link" to="/login">Đăng nhập</router-link></li>
          <!-- Hiển thị "Đăng xuất" nếu đã đăng nhập -->
          <li v-if="isLoggedIn" class="nav-item">
            <a class="nav-link" href="#!" @click.prevent="logout">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
