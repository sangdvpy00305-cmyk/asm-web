<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const email = ref('');
const hoTen = ref('');
const matKhau = ref('');
const avatarUrl = ref('');
const errorMessage = ref('');
const loading = ref(false);
const avatarFile = ref(null);

// Lấy dữ liệu người dùng từ localStorage
const data = localStorage.getItem('userInfo');

if (data) {
  const parsedData = JSON.parse(data);
  const savedEmail = parsedData?.email;
  if (savedEmail) {
    email.value = savedEmail;
    onMounted(async () => {
      loading.value = true;
      console.log('Đang lấy thông tin người dùng từ API với email:', savedEmail);
      
      const apiUrl = `http://localhost:8080/api/user/${savedEmail}`;
      try {
        const response = await axios.get(apiUrl);
        console.log('Thông tin người dùng nhận được:', response.data);
        const user = response.data;
        hoTen.value = user.hoTen || '';
        
        avatarUrl.value = user.anh ? `http://localhost:8080/api/image/uploads/${user.anh}` : avatarUrl.value;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        errorMessage.value = 'Không thể lấy thông tin người dùng!';
      } finally {
        loading.value = false;
      }
    });
  } else {
    console.log('Không tìm thấy email trong localStorage!');
    errorMessage.value = 'Không tìm thấy email trong localStorage!';
  }
} else {
  console.log('Không có dữ liệu người dùng trong localStorage!');
  errorMessage.value = 'Không có dữ liệu người dùng trong localStorage!';
}

const logout = () => {
  console.log('Đăng xuất người dùng');
  localStorage.removeItem('data');
  window.location.href = '/login';
};

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log('Đã chọn tệp avatar mới:', file);
    avatarFile.value = file;
  }
};

const updateUser = async () => {
  loading.value = true;
  const updatedData = new FormData();
  updatedData.append('email', email.value);
  updatedData.append('hoTen', hoTen.value);
  updatedData.append('matKhau', matKhau.value);

  if (avatarFile.value) {
    console.log('Đang thêm avatar vào FormData:', avatarFile.value);
    updatedData.append('file', avatarFile.value);
  }

  console.log('Dữ liệu gửi đi:');
  for (let pair of updatedData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

  try {
    const apiUrl = `http://localhost:8080/api/user/${email.value}`;
    console.log('Gửi PUT request tới API:', apiUrl);
    
    const response = await axios.put(apiUrl, updatedData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Cập nhật thành công, thông tin nhận được từ API:', response.data);
    errorMessage.value = 'Cập nhật thành công!';
    avatarUrl.value = `http://localhost:8080/api/image/uploads/${response.data.anh}` || avatarUrl.value;
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    errorMessage.value = 'Cập nhật thất bại!';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <header class="py-5 bg-light border-bottom mb-4">
    <div class="container">
      <div class="text-center my-5">
        <h1 class="fw-bolder">Trang Cá Nhân</h1>
      </div>
    </div>
  </header>

  <div class="container">
    <div class="row">
      <div class="container">
        <div class="row align-items-start p-5">
          <div class="col-xl-4 col-lg-5 col-md-6">
            <div class="d-flex align-items-center p-3 border">
              <img :src="avatarUrl || 'https://via.placeholder.com/150'" class="pr-2" style="width: 150px; height: 150px;" alt="avatar">
              <h3>{{ hoTen }}</h3>
            </div>
            <div class="sidebar-categories p-3 border">
              <a href="#" class="btn btn-danger" @click="logout">Đăng xuất</a>
            </div>
          </div>

          <div class="col-xl-8 col-lg-7 col-md-6">
            <form @submit.prevent="updateUser" class="row login_form" id="contactForm">
              <div class="col-md-12 mb-2">
                <label for="email">Email</label>
                <input v-model="email" type="email" class="form-control" id="email" required>
              </div>
              <div class="col-md-12 mb-2">
                <label for="hoTen">Họ Tên</label>
                <input v-model="hoTen" type="text" class="form-control" id="hoTen" required>
              </div>
              <div class="col-md-12 mb-2">
                <label for="matKhau">Mật Khẩu</label>
                <input v-model="matKhau" type="password" class="form-control" id="matKhau" required>
              </div>
              <div class="col-md-12 mb-2">
                <label for="avatar">Avatar</label>
                <input type="file" @change="handleAvatarChange" class="form-control" id="avatar">
              </div>
              <div class="col-md-12 mb-2">
                <button type="submit" class="btn btn-warning" :disabled="loading">{{ loading ? 'Đang cập nhật...' : 'Cập nhật' }}</button>
              </div>
            </form>
            <div v-if="errorMessage" class="text-danger mt-3">
              <small>{{ errorMessage }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
