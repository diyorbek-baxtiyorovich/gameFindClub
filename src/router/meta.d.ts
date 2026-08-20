import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    showBottomNav: boolean
    showBackButton?: boolean
    hideHeader?: boolean
    requiresAuth?: boolean
    ownerOnly?: boolean
    standaloneLayout?: boolean
    ownerShowBottomNav?: boolean
    hideOwnerHeader?: boolean
    ownerTitleKey?: string
  }
}
