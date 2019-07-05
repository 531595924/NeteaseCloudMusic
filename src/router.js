/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:18:19 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-07-05 16:19:37
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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
                  component: () => import('./views/Music/DiscoverMusic/Recommend.vue')
                },
                {
                  path: 'SongSheet',
                  name: '歌单',
                  component: () => import('./views/Music/DiscoverMusic/SongSheet.vue')
                },
                {
                  path: 'Ranking',
                  name: '排行榜',
                  component: () => import('./views/Music/DiscoverMusic/Ranking.vue')
                },
                {
                  path: 'Singer',
                  name: '歌手',
                  component: () => import('./views/Music/DiscoverMusic/Singer.vue')
                },
                {
                  path: 'newMusic',
                  name: '最新音乐',
                  component: () => import('./views/Music/DiscoverMusic/newMusic.vue')
                },
              ]
            },
            {
              path: 'MusicListPage/:musicListId',
              name: '歌单页',
              component: () => import('./views/Music/MusicListPage')
            },
            {
              path: 'searchResult',
              name: '搜索结果页',
              redirect: { name: '搜索单曲' }, 
              component: () => import('./views/Music/searchResult'),
              children: [
                {
                  path: 'searchSong',
                  name: '搜索单曲',
                  component: () => import('./views/Music/searchResult/song')
                },
                {

                  path: 'searchAlbum',
                  name: '搜索专辑',
                  component: () => import('./views/Music/searchResult/album')
                },
                {
                  path: 'searchSinger',
                  name: '搜索歌手',
                  component: () => import('./views/Music/searchResult/singer')
                },
                {
                  path: 'searchSongList',
                  name: '搜索歌单',
                  component: () => import('./views/Music/searchResult/songList')
                },
                {
                  path: 'searchUsers',
                  name: '搜索用户',
                  component: () => import('./views/Music/searchResult/users')
                },
                {
                  path: 'searchMV',
                  name: '搜索MV',
                  component: () => import('./views/Music/searchResult/mv')
                },
                {
                  path: 'searchLyric',
                  name: '搜索歌词',
                  component: () => import('./views/Music/searchResult/lyric')
                },
                {
                  path: 'searchVideo',
                  name: '搜索视频',
                  component: () => import('./views/Music/searchResult/video')
                }
              ]
            },
          ]
        },
        {
          path: 'Video',
          name: '视频',
          component: () => import('./views/Video')
        },
        {
          path: 'MusicPlay',
          name: '音乐播放',
          component: () => import('./views/MusicPlay.vue')
        },
        {
          path: '*',
          name: 'error',
          redirect: { name: '发现音乐' },
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    next({ name: "发现音乐" }); // 未发现路由返回首页
  } else {
    next()
  }
});

export default router;