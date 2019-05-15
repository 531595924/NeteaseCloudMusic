<template>
  <div class="musicPlayer flex flex-center">
    <div class="playcontrol flex flex-center">
      <div class="playBtn">
        <i class="playBtnIcon iconfont previous" />
      </div>
      <div class="playBtn">
        <i class="playBtnIcon iconfont play" />
      </div>
      <div class="playBtn">
        <i class="playBtnIcon iconfont next" />
      </div>
    </div>
    <div class="progressGroup flex">
      <p>03:15</p>
      <div class="progress_line">
        <el-slider v-model="value1" />
      </div>
      <p>03:25</p>
    </div>
    <div class="right_control flex flex-center">
      <i class="iconfont volume" />
      <div class="progress_line">
        <el-slider v-model="value2" />
      </div>
      <div class="currentPlayList flex flex-center">
        <i class="iconfont songsheet" />
        {{ 120 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MusicPlayer",
  data() {
    return {
      value1: 50,
      value2: 40
    };
  },
  mounted() {},
  methods: {
    playMusic(row) {
      axios
        .get("song/url", {
          params: {
            id: row.id,
            br: "999000"
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.url = res.data[0].url;
            setTimeout(() => {
              this.$refs.video.play();
            }, 50);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
  transition: .3s all;
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
</style>