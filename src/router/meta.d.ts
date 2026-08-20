import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    showBottomNav: boolean
    showBackButton?: boolean
    hideHeader?: boolean
    requiresAuth?: boolean
  }
}
