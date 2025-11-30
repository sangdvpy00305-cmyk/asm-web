<script setup>
import trangchu from './components/trangchu.component.vue';
import navbar from './components/layout/header.component.vue';
import footerClient from './components/layout/footer.component.vue';
</script>

<template>
   <navbar/>
   <router-view></router-view>
   <footerClient/>
</template>

