import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: '音乐' }, 
      component: () => import('./views/Home.vue'),
      children: [
        {
          path: 'Music',
          name: '音乐',
          component: () => import('./views/Music'),
        },
        {
          path: 'Video',
          name: '视频',
          component: () => import('./views/Video'),
        }
      ]
    }
  ]
})
