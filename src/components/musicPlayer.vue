/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:19:12 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-19 10:19:34
 */
<template>
  <div class="musicPlayer flex flex-center">
    <div class="playcontrol flex flex-center">
      <div
        class="playBtn"
        @click="previousMusic"
      >
        <i class="playBtnIcon iconfont icon-previous" />
      </div>
      <div
        v-loading="playLoading && storeNowPlay.id"
        element-loading-spinner="el-icon-loading"
        class="playBtn"
        @click="playState ? suspendMusic() : startPlay()"
      >
        <i
          class="playBtnIcon iconfont"
          :class="playState ? 'icon-suspend' : 'icon-play'"
        />
      </div>
      <div
        class="playBtn"
        @click="nextMusic"
      >
        <i class="playBtnIcon iconfont icon-next" />
      </div>
    </div>
    <div class="progressGroup flex">
      <p>{{ playedTime ? $duration(playedTime) : "00:00" }}</p>
      <div class="progress_line">
        <el-slider
          v-model="playProgress"
          :format-tooltip="formatTooltip"
          @change="setProgress"
          @drag="lineDrag = true"
        />
      </div>
      <p>{{ storeNowPlay.dt ? $duration(storeNowPlay.dt) : '00:00' }}</p>
    </div>
    <div class="right_control flex flex-center">
      <i class="iconfont icon-volume" />
      <div class="progress_line">
        <el-slider v-model="volume" />
      </div>
      <el-popover
        placement="top-end"
        width="580"
        trigger="click"
      >
        <div class="flex flex-center musciListTtooltipTop">
          <p>总{{ storeNowPlayList.length }}首</p>
          <p class="el-icon-delete">
            清空
          </p>
        </div>
        <el-table
          :data="storeNowPlayList"
          :show-header="false"
          max-height="400px"
          size="mini"
          @row-dblclick="tooltipPlay"
        >
          <el-table-column
            align="center"
            width="50"
          >
            <template slot-scope="scope">
              <i
                v-if="scope.row.id == $store.state.nowPlayMusic.id"
                class="nowMusicList_play iconfont icon-play"
              />
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="音乐标题"
            min-width="100"
            show-overflow-tooltip
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
              <span
                v-for="i in scope.row.alia"
                :key="i"
                class="musicAlias"
              >{{ i }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="歌手"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <a
                v-for="(i, index) in scope.row.ar"
                :key="i.id"
              >
                {{ i.name }}
                <span v-if="(index + 1) != scope.row.ar.length">/</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="时长"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a>{{ $duration(scope.row.dt) }}</a>
            </template>
          </el-table-column>
        </el-table>
        <div
          slot="reference"
          class="currentPlayList flex flex-center"
        >
          <i class="iconfont icon-songsheet" />
          {{ storeNowPlayList.length }}
        </div>
      </el-popover>
    </div>
    <video
      ref="video"
      class="video"
      :src="playUrl"
      @ended="playState = false; nextMusic()"
      @loadstart="playLoading = true"
      @canplay="playLoading = false; startPlay()"
      @canplaythrough="playLoading = false"
    />
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  data() {
    return {
      volume: 100,
      playUrl: "",
      playState: false,
      lineDrag: false,
      playedTime: 0,
      playLoading: false
    };
  },
  computed: {
    storeNowPlay() {
      return this.$store.state.nowPlayMusic;
    },
    storeNowPlayList() {
      return this.$store.state.nowMusicList;
    },
    playProgress: {
      get() {
        return (this.playedTime / this.storeNowPlay.dt) * 100;
      },
      set(val) {
        this.playedTime = (val / 100) * this.storeNowPlay.dt;
      }
    }
  },
  watch: {
    storeNowPlay(data) {
      this.playMusic(data.id);
    },
    volume(val) {
      this.$refs.video.volume = val / 100;
    },
    playedTime(val) {
      this.$store.commit("playedTime", val);
    },
    playState(type) {
      this.$store.commit("playState", type);
    }
  },
  mounted() {
    const nowPlayMusic = localStorage.nowPlayMusic
      ? JSON.parse(localStorage.nowPlayMusic)
      : false;
    const nowPlayMusicIndex = localStorage.nowPlayMusicIndex
      ? JSON.parse(localStorage.nowPlayMusicIndex)
      : false;
    if (nowPlayMusic && nowPlayMusic.id) {
      this.$store.commit("switchMusic", {music: nowPlayMusic, index: nowPlayMusicIndex});
    }
    const nowMusicList = localStorage.nowMusicList
      ? JSON.parse(localStorage.nowMusicList)
      : false;
    if (nowMusicList && nowMusicList.length != 0) {
      this.$store.commit("switchMusicList", nowMusicList);
    }
  },
  methods: {
    playMusic(id) {
      this.playLoading = true;
      axios
        .get("song/url", {
          params: {
            id: id,
            br: "999000"
          }
        })
        .then(res => {
          if (res.code == 200) {
            if(res.data[0].url){
              this.playUrl = res.data[0].url;
              this.$store.commit("musicUrl", res.data[0].url);
            } else {
              this.$message({
                message: "歌曲资源失效",
                type: "error"
              });
              this.nextMusic();
            }
          } else {
            this.$message({
              message: "获取歌曲时发生错误" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: err.msg,
            type: "error"
          });
        });
    },
    tooltipPlay(row) {
      this.$store.commit("switchMusic", {music: row, index: this.storeNowPlayList.indexOf(row)});
    },
    startPlay() {
      if( !this.playLoading ) {
        this.playState = true;
        this.$refs.video.play();
        this.getPlayedTime();
      }
    },
    getPlayedTime() {
      this.lineDrag = false;
      var _this = this;
      var nowId = this.storeNowPlay.id;

      (function fn() {
        var fnID = _this.storeNowPlay.id;
        _this.playedTime = _this.$refs.video.currentTime * 1000;
        setTimeout(() => {
          if (_this.playState && !_this.lineDrag && (nowId == fnID)) {
            fn();
          }
        }, 500); // 进度更新速率，影响 歌词进度更新效率
      })();
    },
    suspendMusic() {
      if( !this.playLoading ) {
        this.$refs.video.pause();
        this.playState = false;
      }
    },
    formatTooltip(val) {
      return this.$duration((val / 100) * this.storeNowPlay.dt);
    },
    setProgress(val) {
      this.playLoading = true;
      this.$refs.video.currentTime =
        ((val / 100) * this.storeNowPlay.dt) / 1000;
      this.getPlayedTime();
    },
    playError() {
      this.$message({
        message: "播放错误，请重试",
        type: "error"
      });
      this.playState = false;
      this.playLoading = false;
    },
    nextMusic() {
      let index = this.$store.state.nowPlayMusicIndex;
      index = (index + 1) >= this.storeNowPlayList.length ? 0 : index + 1;
      const nextMusic = this.storeNowPlayList[index];
      this.$store.commit("switchMusic", {music: nextMusic, index: index});
    },
    previousMusic() {
      let index = this.$store.state.nowPlayMusicIndex;
      index = (index - 1) < 0 ? this.storeNowPlayList.length - 1 : index - 1;
      const nextMusic = this.storeNowPlayList[index];
      this.$store.commit("switchMusic", {music: nextMusic, index: index});
    }
  }
};
</script>

<style lang="scss" scoped>
.flex {
  flex: 1;
}

.musicPlayer {
  max-height: 56px;
  min-height: 56px;
  border-top: 1px solid #ddd;
}

.playcontrol {
  max-width: 180px;
  padding: 10px;
  justify-content: space-around;
}

.playBtn {
  width: 32px;
  height: 32px;
  border-radius: 500px;
  background-color: $colorRed;
  color: white;
  text-align: center;
  line-height: 32px;
  transition: 0.3s all;
  cursor: pointer;
  overflow: hidden;
}

.playBtn:nth-child(2) {
  width: 36px;
  height: 36px;
  line-height: 36px;
}

.playBtn:hover {
  background-color: $colorRedHover;
}

.playBtnIcon {
  font-size: 14px;
}

.progress_line {
  flex: 1;
  margin: 0 15px;
}

.progressGroup > p {
  align-items: center;
  display: flex;
}

.right_control {
  max-width: 220px;
  margin: 0 20px 0 30px;
}

.volume {
  display: flex;
  align-items: center;
  text-align: center;
}

.currentPlayList {
  max-width: 50px;
  border-radius: 10px;
  background-color: #dedede;
  height: 20px;
  padding: 0 5px;
  font-size: 12px;
}

.songsheet {
  font-size: 14px;
}

.right_control > .progress_line {
  margin-left: 0;
}

.video {
  position: fixed;
  top: 150vh;
  left: 150vw;
}

.musciListTtooltipTop {
  justify-content: space-between;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  padding: 0 10px 10px;
}

.el-icon-delete {
  cursor: pointer;
}

.el-icon-delete:hover {
  color: $colorRedHover;
}

.nowMusicList_play {
  font-size: 12px;
  color: $colorRedHover;
}

</style>

<style scoped>
.playBtn >>> .el-icon-loading {
  font-size: 20px;
  transform: translateY(2px)
}

.playBtn >>> .el-loading-spinner {
  margin-top: -16px;
}
</style>
