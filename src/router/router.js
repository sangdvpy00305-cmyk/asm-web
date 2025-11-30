import { createRouter, createWebHistory } from "vue-router";
import trangchu from "../components/trangchu.component.vue";
import dangnhap from "../components/dangnhap.component.vue";
import dangky from "../components/dangky.component.vue";
import trangcanhan from "../components/trangcanhan.component.vue";
import quanlybaiviet from "../components/quanlybaiviet.component.vue";
import chitietbaiviet from "../components/chitietbaiviet.component.vue";





const routes = [
  { path: "/", component: trangchu },
  { path: "/login", component: dangnhap },
  { path: "/register", component: dangky },
  { path: "/profile", component: trangcanhan },
  { path: "/managerBlog", component: quanlybaiviet },
  { path: "/blogDetail/:id", component: chitietbaiviet },
];
const router = createRouter({
  linkActiveClass: "active",
  history: createWebHistory(),
  routes,
});
export default router;
