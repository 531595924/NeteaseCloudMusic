import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    userInfo: {},
    nowPlayMusic: {},
    nowPlayMusicIndex: 0,
    nowMusicList: [],
    playState: false
  },
  mutations: {
    userInfo(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.userInfo = JSON.stringify(userInfo);
    },
    switchMusic(state, data) {
      state.nowPlayMusic = data.music;
      localStorage.nowPlayMusic = JSON.stringify(data.music);
      state.nowPlayMusicIndex = data.index;
      localStorage.nowPlayMusicIndex = JSON.stringify(data.index);
    },
    switchMusicList(state, musicList) {
      state.nowMusicList = musicList;
      localStorage.nowMusicList = JSON.stringify(musicList);
    }
  },
  actions: {

  }
})
