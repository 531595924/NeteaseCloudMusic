/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:18:28 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-21 17:44:23
 */
<template>
  <div
    ref="lyricBox"
    class="lyric"
  >
    <div
      v-if="error && error !=''"
      class="error"
    >
      {{ error }}
    </div>
    <div
      v-else-if="reaLrcData.length == 0"
      class="error"
    >
      纯音乐，请您欣赏...
    </div>
    <div v-else>
      <div
        v-for="(i, index) in reaLrcData"
        :key="index"
        ref="lyricItem"
        class="lyricArr"
        :class="index == activeIndex ? 'active' : ''"
      >
        <template v-if="i.lrc[0] != '['">
          <p>{{ (i.lrc && i.lrc != '') ? i.lrc : '&#160;' }}</p>
          <p v-if="i.tlyric">
            {{ i.tlyric }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lyric",
  data() {
    return {
      lyricData: {},
      error: "",
      activeIndex: 0
    };
  },
  computed: {
    nowMusic() {
      return this.$store.state.nowPlayMusic;
    },
    lrcArr() {
      if (this.lyricData.code == 200) {
        if (this.lyricData.nolyric || this.lyricData.uncollected) {
          return [];
        } else {
          return this.lyricFormat(this.lyricData.lrc.lyric);
        }
      } else {
        return [];
      }
    },
    tlyricArr() {
      if (this.lyricData.code == 200) {
        if (
          this.lyricData.nolyric ||
          this.lyricData.uncollected ||
          !this.lyricData.tlyric ||
          !this.lyricData.tlyric.lyric
        ) {
          return [];
        } else {
          return this.lyricFormat(this.lyricData.tlyric.lyric);
        }
      } else {
        return [];
      }
    },
    reaLrcData() {
      var _this = this;
      if (_this.tlyricArr.length != 0) {
        var arr = [];
        _this.lrcArr.forEach(i => {
          _this.tlyricArr.forEach(o => {
            if (i.time.substr(0, 8) == o.time.substr(0, 8)) {
              arr.push({
                time: i.time,
                lrc: i.lrc,
                tlyric: o.lrc
              });
            }
          });
        });
        return arr;
      } else {
        return this.lrcArr;
      }
    },
    playedTime() {
      return this.$store.state.playedTime;
    }
  },
  watch: {
    nowMusic(val) {
      this.lyricData = {};
      this.getLyric(val.id);
    },
    reaLrcData(val) {
      if (val.length != 0) {
        this.$nextTick(() => {
          this.roll();
        });
      }
    },
    playedTime() {
      this.reaLrcData.forEach((i, index) => {
        this.lrcType(i, index);
      });
    },
    activeIndex(val) {
      this.$nextTick(() => {
        let elArr = this.$refs.lyricItem;
        let el = elArr[val];
        let h = el.offsetTop - 115;
        this.$scrollTo(".lyric", h);
      });
    }
  },
  mounted() {
    if (this.nowMusic.id && this.nowMusic.id != "") {
      this.getLyric(this.nowMusic.id);
    }
  },
  methods: {
    getLyric(id) {
      this.error = "正在加载歌词。。。";
      axios
        .get(`/lyric?id=${id}`)
        .then(r => {
          if (r.code == 200) {
            this.error = "";
            this.lyricData = r;
          } else {
            this.error = "歌词加载错误" + r.msg;
            this.$message({
              message: "歌词获取失败" + r.msg,
              offset: 70,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.error = "歌词加载错误" + err.msg;
          this.$message({
            message: "歌词获取失败" + err.msg,
            offset: 70,
            type: "error"
          });
        });
    },
    // 歌词格式化
    lyricFormat(data) {
      var arr = data.split("\n");
      var newArr = [];
      arr.forEach(i => {
        let start = i.indexOf("[");
        let end = i.indexOf("]");
        let time = i.substring(start + 1, end);
        if (time && time != "" && time.split(".").length >= 2) {
          newArr.push({
            time: time,
            lrc: i.substr(end + 1)
          });
        }
      });
      return newArr;
    },
    // 歌词状态切换
    lrcType(item, index) {
      var lrcTime = this.lrcTimeCompute(item.time);
      if (this.reaLrcData[index + 1]) {
        var nextLrcTime = this.lrcTimeCompute(this.reaLrcData[index + 1].time);
        if (this.playedTime >= lrcTime && this.playedTime < nextLrcTime) {
          this.activeIndex = index;
        }
      } else {
        if (this.playedTime >= lrcTime) {
          this.activeIndex = index;
        }
      }
    },
    lrcTimeCompute(time) {
      let timeArr = time.split(":");
      return (Number(timeArr[0]) * 60 + Number(timeArr[1])) * 1000;
    },
    roll() {
      const _this = this;
      const id = this.nowMusic.id;
      (function fn() {
        const tempId = _this.nowMusic.id;
        let item = _this.$refs.lyricItem.find(i => i.classList.length == 2);
        if (item) {
          // item.scrollIntoView({behavior: "smooth", block: "center"}); // scrollIntoView 滚动到可视区域 https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView
        }
        if (id == tempId) {
          // 防止切歌后存留残余进程
          setTimeout(() => {
            fn();
          }, 200);
        }
      })();
    }
  }
};
</script>

<style lang="scss" scoped>
.lyric {
  overflow-y: auto;
  height: 100%;
  position: relative;
}

.lyricArr {
  transition: color 0.3s;
  text-align: left;
  font-size: 14px;
  margin-bottom: 20px;
  color: #333;
}

.error {
  text-align: center;
  color: $colorRed;
  margin: 120px 0;
}

.active {
  color: $colorRed;
}
</style>
