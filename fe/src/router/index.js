import { createRouter, createWebHistory } from 'vue-router';
import PackagesPage from '@/views/PackagesView.vue';
import PackageDetailView from '@/views/PackageDetailView.vue';
import CartView from '@/views/CartView.vue';

const routes = [
  {
    path: '/',
    name: 'Packages',
    component: PackagesPage,
  },
  { path: '/package/:id', name: 'PackageDetails', component: PackageDetailView },
  { path: '/cart/', name: 'CartView', component: CartView },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;