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
          children: [
            {
              path: 'MusicListPage/:musicListId',
              name: '歌单页',
              component: () => import('./views/Music/MusicListPage')
            }
          ]
        },
        {
          path: 'Video',
          name: '视频',
          component: () => import('./views/Video')
        }
      ]
    }
  ]
})
