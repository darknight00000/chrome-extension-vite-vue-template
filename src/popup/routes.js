import Home from './pages/Home.vue'

export default [
  {
    path: '/src/popup/index.html',
    redirect: '/'
  },
  {
    path: '/',
    name: 'home',
    component: Home
  }
]
