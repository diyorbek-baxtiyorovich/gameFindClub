import { createRouter, createWebHistory } from 'vue-router'

import { useOwnerSessionStore } from '@/stores'

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
      meta: { title: 'Profile', showBottomNav: true, hideHeader: true },
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('@/pages/reviews/ReviewsPage.vue'),
      meta: { title: 'Reviews', showBottomNav: false, showBackButton: true, requiresAuth: true },
    },
    {
      path: '/owner',
      component: () => import('@/layouts/OwnerLayout.vue'),
      meta: {
        title: 'Owner',
        showBottomNav: false,
        ownerOnly: true,
        standaloneLayout: true,
      },
      children: [
        { path: '', redirect: { name: 'owner-dashboard' } },
        {
          path: 'dashboard',
          name: 'owner-dashboard',
          component: () => import('@/pages/owner/OwnerDashboardView.vue'),
          meta: { title: 'Owner dashboard', showBottomNav: false, ownerTitleKey: 'owner.nav.dashboard' },
        },
        {
          path: 'venues',
          name: 'owner-venues',
          component: () => import('@/pages/owner/OwnerVenuesView.vue'),
          meta: { title: 'Owner venues', showBottomNav: false, ownerTitleKey: 'owner.nav.venues' },
        },
        {
          path: 'venues/new',
          name: 'owner-venue-new',
          component: () => import('@/pages/owner/OwnerVenueEditorView.vue'),
          props: { mode: 'create' },
          meta: { title: 'Create venue', showBottomNav: false, ownerShowBottomNav: false, hideOwnerHeader: true, ownerTitleKey: 'owner.action.add_venue' },
        },
        {
          path: 'venues/:id/edit',
          name: 'owner-venue-edit',
          component: () => import('@/pages/owner/OwnerVenueEditorView.vue'),
          props: (route) => ({ mode: 'edit', venueId: String(route.params.id) }),
          meta: { title: 'Edit venue', showBottomNav: false, ownerShowBottomNav: false, hideOwnerHeader: true, ownerTitleKey: 'owner.venue.edit' },
        },
        {
          path: 'reviews',
          name: 'owner-reviews',
          component: () => import('@/pages/owner/OwnerReviewsView.vue'),
          meta: { title: 'Owner reviews', showBottomNav: false, ownerTitleKey: 'owner.nav.reviews' },
        },
        {
          path: 'analytics',
          name: 'owner-analytics',
          component: () => import('@/pages/owner/OwnerAnalyticsView.vue'),
          meta: { title: 'Owner analytics', showBottomNav: false, ownerTitleKey: 'owner.nav.analytics' },
        },
      ],
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

router.beforeEach((to) => {
  if (!to.matched.some((record) => record.meta.ownerOnly)) return true
  const ownerSession = useOwnerSessionStore()
  if (ownerSession.canAccessOwnerWorkspace) return true
  return { name: 'profile' }
})

export default router
