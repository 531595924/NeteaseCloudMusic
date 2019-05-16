<template>
  <div class="musicPlayer flex flex-center">
    <div class="playcontrol flex flex-center">
      <div class="playBtn">
        <i class="playBtnIcon iconfont icon-previous" />
      </div>
      <div
        class="playBtn"
        @click="playState ? suspendMusic() : startPlay()"
      >
        <i
          class="playBtnIcon iconfont"
          :class="playState ? 'icon-suspend' : 'icon-play'"
        />
      </div>
      <div class="playBtn">
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
          <p>总{{ $store.state.nowMusicList.length }}首</p>
          <p class="el-icon-delete">
            清空
          </p>
        </div>
        <el-table
          :data="$store.state.nowMusicList"
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
                class="nowMusicList_play iconfont icon-play"
                v-if="scope.row.id == $store.state.nowPlayMusic.id"
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
                class="musicAlias"
                v-for="i in scope.row.alia"
                :key="i"
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
          {{ $store.state.nowMusicList.length }}
        </div>
      </el-popover>
    </div>
    <video
      class="video"
      ref="video"
      :src="playUrl"
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
      playedTime: ""
    };
  },
  computed: {
    storeNowPlay() {
      return this.$store.state.nowPlayMusic;
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
    }
  },
  mounted() {
    const nowPlayMusic = localStorage.nowPlayMusic
      ? JSON.parse(localStorage.nowPlayMusic)
      : false;
    if (nowPlayMusic && nowPlayMusic.id) {
      this.$store.commit("switchMusic", nowPlayMusic);
    }
    const nowMusicList = localStorage.nowMusicList
      ? JSON.parse(localStorage.nowMusicList)
      : false;
    if (nowMusicList.length != 0) {
      this.$store.commit("switchMusicList", nowMusicList);
    }
  },
  methods: {
    playMusic(id) {
      axios
        .get("song/url", {
          params: {
            id: id,
            br: "999000"
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.playUrl = res.data[0].url;
            setTimeout(() => {
              this.startPlay();
            }, 100);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    tooltipPlay(row) {
      this.$store.commit("switchMusic", row);
    },
    startPlay() {
      this.$refs.video.play();
      this.playState = true;
      this.getPlayedTime();
    },
    getPlayedTime() {
      this.lineDrag = false;
      var _this = this;
      (function fn() {
        _this.playedTime = _this.$refs.video.currentTime * 1000;
        setTimeout(() => {
          if (_this.playState && !_this.lineDrag) {
            fn();
          }
        }, 1000);
      })();
    },
    suspendMusic() {
      this.$refs.video.pause();
      this.playState = false;
    },
    formatTooltip(val) {
      return this.$duration((val / 100) * this.storeNowPlay.dt);
    },
    setProgress(val) {
      this.$refs.video.currentTime =
        ((val / 100) * this.storeNowPlay.dt) / 1000;
      this.getPlayedTime();
    }
  }
};
</script>

<style lang="scss" scoped>
.flex {
  flex: 1;
}

.musicPlayer {
  height: 100%;
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