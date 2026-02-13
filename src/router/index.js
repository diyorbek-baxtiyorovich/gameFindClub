import { createRouter, createWebHistory } from 'vue-router'

const pages = import.meta.glob('../pages/**/*.vue')

const routes = Object.keys(pages).map((file) => {
  let path = file
    .replace('../pages', '')
    .replace('.vue', '')
    .replace('/index', '')
    .replace(/\[(.+?)\]/g, ':$1')

  if (path === '') path = '/'

  const name = path.replace('/', '').replace(/\/:/g, '-').replace(/\//g, '-')

  return {
    path,
    name,
    component: pages[file],
  }
})
const notFoundPage = pages['../pages/404.vue']

if (notFoundPage) {
  routes.push({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: notFoundPage,
  })
}

export default createRouter({
  history: createWebHistory(),
  routes,
})
