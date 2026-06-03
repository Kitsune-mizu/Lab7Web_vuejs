const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Lokasi API REST End Point disesuaikan dengan port php spark serve Anda
const apiUrl = 'http://localhost:8080';

// 1. Definisikan pemetaan rute URL ke Komponen (Termasuk halaman About)
const routes = [
    { path: '/', component: Home },
    { path: '/artikel', component: Artikel },
    { path: '/about', component: About } // Ditambahkan untuk menyelesaikan tugas modul
];

// 2. Buat instance router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 3. Inisialisasi Aplikasi Vue dan gunakan Router
const app = createApp({});
app.use(router);
app.mount('#app');