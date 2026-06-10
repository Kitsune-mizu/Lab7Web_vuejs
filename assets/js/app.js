const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Lokasi API REST End Point disesuaikan dengan port php spark serve Anda (UPDATE)
const apiUrl = 'http://localhost:8080';

// =========================================================================
// IMPLEMENTASI AXIOS INTERCEPTORS (Penyuntik Token Otomatis)
// =========================================================================

// 1. Interceptor untuk REQUEST (Menyuntikkan token ke Header)
axios.interceptors.request.use(
    (config) => {
        // Ambil token dari local storage browser
        const token = localStorage.getItem('userToken');
        
        // Jika token tersedia, masukkan ke dalam HTTP Header Authorization Bearer
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Interceptor untuk RESPONSE (Menangkap error 401 secara global)
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Jika server mengembalikan status 401 (Unauthorized / Token Ditolak)
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah berakhir atau Token tidak sah. Silakan login kembali.');
            localStorage.removeItem('isLoggedIn'); // Bersihkan status login
            localStorage.removeItem('userToken');  // Bersihkan token
            window.location.href = '#/login'; // Tendang paksa ke halaman login
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
// =========================================================================

// 1. Definisikan pemetaan rute URL ke Komponen beserta properti Meta-Auth
const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { 
        path: '/artikel', 
        component: Artikel, 
        meta: { requiresAuth: true } // Hanya boleh diakses jika user sudah login
    },
    { 
        path: '/about', 
        component: About, 
        meta: { requiresAuth: true } // Proteksi halaman About tetap dipertahankan
    }
];

// 2. Buat instance router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 3. Implementasi Navigation Guards (Pencegat Akses Rute Sisi Klien)
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    
    // Jika rute tujuan membutuhkan autentikasi dan user belum login
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        alert('Akses Ditolak! Anda harus login terlebih dahulu.');
        next('/login'); // Belokkan paksa ke halaman login
    } else {
        next(); // Izinkan akses menuju rute tujuan
    }
});

// 4. Inisialisasi Root Instance dengan State Navigasi Global
const app = createApp({
    data() {
        return {
            isLoggedIn: false
        }
    },
    mounted() {
        // Cek status login saat aplikasi pertama kali dimuat oleh browser
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    },
    methods: {
        logout() {
            if (confirm('Apakah Anda yakin ingin keluar aplikasi?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userToken');
                this.isLoggedIn = false;
                this.$router.push('/');
            }
        }
    }
});

app.use(router);
app.mount('#app');