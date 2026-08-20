import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/HomePage.vue'),
      meta: { title: 'Home', showBottomNav: true, hideHeader: true },
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/pages/explore/ExplorePage.vue'),
      meta: { title: 'Explore', showBottomNav: true },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/pages/map/MapPage.vue'),
      meta: { title: 'Map', showBottomNav: true, hideHeader: true },
    },
    {
      path: '/venue/:slug',
      name: 'venue-detail',
      component: () => import('@/pages/venue-detail/VenueDetailPage.vue'),
      props: true,
      meta: { title: 'Venue', showBottomNav: false, showBackButton: true, hideHeader: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/favorites/FavoritesPage.vue'),
      meta: { title: 'Saved', showBottomNav: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/pages/history/HistoryPage.vue'),
      meta: { title: 'History', showBottomNav: false, showBackButton: true, requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/profile/ProfilePage.vue'),
      meta: { title: 'Profile', showBottomNav: true },
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('@/pages/reviews/ReviewsPage.vue'),
      meta: { title: 'Reviews', showBottomNav: false, showBackButton: true, requiresAuth: true },
    },
    {
      path: '/club/:id',
      redirect: (to) => ({ name: 'venue-detail', params: { slug: to.params.id } }),
    },
    {
      path: '/card/:id',
      redirect: (to) => ({ name: 'venue-detail', params: { slug: to.params.id } }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
