import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    userInfo: {},
    likeList: [],
    nowPlayMusic: {},
    nowPlayMusicUrl: "",
    nowPlayMusicIndex: 0,
    nowMusicList: [],
    playState: false,
    playedTime: 0,
    musicList: []
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
    musicUrl(state, url) {
      state.nowPlayMusicUrl = url;
    },
    playedTime(state, time) {
      state.playedTime = time;
    },
    playState(state, type){
      state.playState = type;
    },
    switchMusicList(state, musicList) {
      state.nowMusicList = musicList;
      localStorage.nowMusicList = JSON.stringify(musicList);
    },
    likeList(state, data) {
      if(data.type == "add") {
        state.likeList = state.likeList.concat(data.arr);
      } else if(data.type == "del") {
        state.likeList = state.likeList.filter(i => {
          return !data.arr.includes(i);
        })
      }
    },
    musicList(state, data) {
      state.musicList = data;
    }
  },
  actions: {

  }
})
