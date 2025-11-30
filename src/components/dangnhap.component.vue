<template>
  <header class="py-5 bg-light border-bottom mb-4">
    <div class="container">
      <div class="text-center my-5">
        <h1 class="fw-bolder">Trang Đăng Nhập</h1>
      </div>
    </div>
  </header>

  <div class="container">
    <div class="row">
      <div class="col-lg-10 offset-lg-1">
        <div class="bg-white shadow rounded mb-3">
          <div class="row">
            <div class="col-md-7 pe-0">
              <div class="form-left h-100 py-5 px-5">
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success" role="alert">
                  {{ successMessage }}
                </div>

                <form @submit.prevent="login" class="row g-4">
                  <div class="col-12">
                    <label>Email<span class="text-danger">*</span></label>
                    <div class="input-group">
                      <div class="input-group-text"><i class="bi bi-person-fill"></i></div>
                      <input v-model="email" type="email" class="form-control" placeholder="Enter Email">
                    </div>
                  </div>

                  <div class="col-12">
                    <label>Mật khẩu<span class="text-danger">*</span></label>
                    <div class="input-group">
                      <div class="input-group-text"><i class="bi bi-lock-fill"></i></div>
                      <input v-model="password" type="password" class="form-control" placeholder="Enter Mật khẩu">
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <div class="form-check">
                      <input v-model="rememberMe" class="form-check-input" type="checkbox" id="inlineFormCheck">
                      <label class="form-check-label" for="inlineFormCheck">Ghi nhớ tôi</label>
                    </div>
                  </div>

                  <div class="col-sm-6">
                    <router-link to="/register" class="float-end text-primary">Tạo tài khoản</router-link>
                  </div>

                  <div class="col-12">
                    <button type="submit" class="btn btn-primary px-4 float-end mt-4">Đăng nhập</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-md-5 ps-0 d-none d-md-block">
              <div class="form-right h-100 bg-primary text-white text-center pt-5">
                <i class="bi bi-substack"></i>
                <h2 class="fs-1">Chào mừng đến với Blog!!!</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { useStore } from 'vuex';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const router = useRouter();
    const store = useStore(); 

    onMounted(() => {
      // Kiểm tra xem cookie có tồn tại hay không
      const storedEmail = Cookies.get('email');
      const storedPassword = Cookies.get('password');

      if (storedEmail && storedPassword) {
        email.value = storedEmail;
        password.value = storedPassword;
        rememberMe.value = true; // Nếu có email và password trong cookie, tự động check "Ghi nhớ tôi"
      }
    });

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/user/login', {
          email: email.value,
          matKhau: password.value,
        });

        localStorage.setItem('userInfo', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', true);
        store.dispatch('login', { isLoggedIn: true, userInfo: response.data });
        if (rememberMe.value) {
          Cookies.set('email', email.value, { expires:  7});
          Cookies.set('password', password.value, { expires: 7});
        } else {
          Cookies.remove('email');
          Cookies.remove('password');
        }

        successMessage.value = 'Đăng nhập thành công!';
        setTimeout(() => {
          router.push('/');
        }, 1000);

      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại';
        successMessage.value = '';
      }
    };

    return {
      email,
      password,
      rememberMe,
      errorMessage,
      successMessage,
      login,
    };
  },
};
</script>
