import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js';
import EntryView from '../views/EntryView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue';
import CollectionsView from '../views/CollectionsView.vue';
import CollectionView from '../views/CollectionView.vue';
import StudyView from '../views/StudyView.vue';
import CheckEmailView from '../views/CheckEmailView.vue'
import VerifyEmail from '../views/VerifyEmail.vue';
import DashsboardView from '../views/DashboardView.vue';
import EditFlashcardView from '../views/EditFlashcardView.vue';

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/register',
    component: RegisterView
  },
  {
    path: '/collection/:id/entry',
    component: EntryView,
    props: true,
    meta: { requiresAuth: true, requiresVerify: true }  
  },
  {
    path: '/collections',
    component: CollectionsView,
    meta: { requiresAuth: true, requiresVerify: true }  
  },
  {
    path: '/dashboard',
    component: DashsboardView,
    meta: { requiresAuth: true, requiresVerify: true }
  },
  {
    path: '/collection/:colId',
    component: CollectionView,
    props: true,
    meta: { requiresAuth: true, requiresVerify: true }  
  },
  {
    path: '/card/:cardId',
    component: EditFlashcardView,
    props: true,
    meta: { requiresAuth: true, requiresVerify: true }
  },
  {
    path: '/review',
    component: StudyView,
    meta: { requiresAuth: true, requiresVerify: true }
  },
  {
    path: '/check-email',
    component: CheckEmailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/verify-email',
    component: VerifyEmail,
    meta: { requiresAuth: true }
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const { user } = useAuthStore()
  const loggedIn = !!user
  const verified = user?.emailVerified;

  if (to.meta.requiresAuth && !loggedIn) {
    return next('/login')
  }

  if(to.meta.requiresVerify && loggedIn && !verified){
    return next('/check-email')
  }

  if((to.path === '/verify-email' || to.path === '/check-email') && verified){
    return next('/collections')
  }

  if ((to.path === '/login' || to.path === '/register') && loggedIn) {
    return next('/collections')
  }
  next()
})

export default router

