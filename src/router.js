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
          redirect: { name: '发现音乐' }, 
          component: () => import('./views/Music'),
          children: [
            {
              path: 'DiscoverMusic',
              name: '发现音乐',
              redirect: { name: '个性推荐' }, 
              component: () => import('./views/Music/DiscoverMusic'),
              children: [
                {
                  path: 'Recommend',
                  name: '个性推荐',
                  component: () => import('./views/Music/DiscoverMusic/Recommend.vue'),
                },
                {
                  path: 'SongSheet',
                  name: '歌单',
                  component: () => import('./views/Music/DiscoverMusic/SongSheet.vue'),
                },
                {
                  path: 'RadioStation',
                  name: '主播电台',
                  component: () => import('./views/Music/DiscoverMusic/RadioStation.vue'),
                },
                {
                  path: 'Ranking',
                  name: '排行榜',
                  component: () => import('./views/Music/DiscoverMusic/Ranking.vue'),
                },
                {
                  path: 'Singer',
                  name: '歌手',
                  component: () => import('./views/Music/DiscoverMusic/Singer.vue'),
                },
                {
                  path: 'newMusic',
                  name: '最新音乐',
                  component: () => import('./views/Music/DiscoverMusic/newMusic.vue'),
                },
              ]
            },
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
