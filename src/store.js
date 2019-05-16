import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    userInfo: {},
    nowPlayMusic: {},
    nowMusicList: [],
    playState: false
  },
  mutations: {
    userInfo(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.userInfo = JSON.stringify(userInfo);
    },
    switchMusic(state, music) {
      state.nowPlayMusic = music;
      localStorage.nowPlayMusic = JSON.stringify(music);
    },
    switchMusicList(state, musicList) {
      state.nowMusicList = musicList;
      localStorage.nowMusicList = JSON.stringify(musicList);
    }
  },
  actions: {

  }
})
