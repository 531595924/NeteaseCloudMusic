<template>
  <div class="Recommend">
    <el-carousel
      v-loading="bannerLoading"
      :interval="4000"
      type="card"
      height="200px"
    >
      <el-carousel-item
        v-for="(item, index) in bannerList"
        :key="index"
      >
        <el-image
          :src="item.imageUrl"
          fit="scale-down"
        />
      </el-carousel-item>
    </el-carousel>
    <div class="item_box">
      <div class="item_title">
        <h4>推荐歌单</h4>
        <p>更多 ></p>
      </div>
      <div
        v-loading="SongListLoading"
        class="musicList"
      >
        <div class="musicList_item">
          <div class="musicList_item_top">
            <div class="musicList_item_img">
              <div class="day_box">
                <p class="weekRecommend">
                  {{ nowDay.weekday }}
                </p>
                <p class="dayRecommend">
                  {{ nowDay.day }}
                </p>
              </div>
              <div class="musicList_item_tootip">
                根据您的音乐口味生成每日更新
              </div>
            </div>
          </div>
          <div class="musicList_item_title">
            每日歌曲推荐
          </div>
        </div>
        <div
          v-for="i in recommendMusic"
          :key="i.id"
          class="musicList_item"
          @click="$router.push({name: '歌单页', params: { musicListId: i.id }})"
        >
          <div class="musicList_item_top">
            <div
              class="musicList_item_img"
              :style="{ backgroundImage: `url(${i.picUrl})` }"
            >
              <div class="musicList_item_tootip">
                <p>{{ i.copywriter }}</p>
              </div>
              <div class="musicList_item_num el-icon-headset">
                {{ parseInt(i.playCount / 10000) }}万
              </div>
            </div>
            <div class="musicList_item_title">
              {{ i.name }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-loading="newSongLoading"
        class="item_box"
      >
        <div class="item_title">
          <h4>最新音乐</h4>
          <p>更多 ></p>
        </div>
      </div>

      <div class="item_box">
        <div class="item_title">
          <h4>独家放送</h4>
          <p>更多 ></p>
        </div>
      </div>
      <div class="item_box">
        <div class="item_title">
          <h4>推荐MV</h4>
          <p>更多 ></p>
        </div>
      </div>
      <div class="item_box">
        <div class="item_title">
          <h4>主播电台</h4>
          <p>更多 ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recommend",
  data() {
    return {
      bannerLoading: false,
      SongListLoading: false,
      newSongLoading: false,
      bannerList: [],
      recommendMusic: [],
      newSong: []
    };
  },
  computed: {
    nowDay() {
      var nowDay = new Date();
      var day = nowDay.getDate();
      var weekIndex = nowDay.getDay();
      var weekday = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      return { day: day, weekday: weekday[weekIndex] };
    }
  },
  mounted() {
    this.getBanner();
    this.getSongList();
    this.getNewSong();
  },
  methods: {
    getBanner() {
      this.bannerLoading = true;
      axios
        .get("/banner")
        .then(res => {
          this.bannerLoading = false;
          if (res.code == 200) {
            this.bannerList = res.banners;
          } else {
            this.$message({
              message: "获取错误" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.bannerLoading = false;
          this.$message({
            message: "获取错误" + err.msg,
            type: "error"
          });
        });
    },
    getSongList() {
      this.SongListLoading = true;
      axios
        .get("/personalized?limit=9")
        .then(res => {
          this.SongListLoading = false;
          if (res.code == 200) {
            this.recommendMusic = res.result;
          } else {
            this.$message({
              message: "获取错误" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.SongListLoading = false;
          this.$message({
            message: "获取错误" + err.msg,
            type: "error"
          });
        });
    },
    getNewSong() {
      this.newSongLoading = true;
      axios
        .get("/personalized/newsong")
        .then(res => {
          this.newSongLoading = false;
          if (res.code == 200) {
            this.newSong = res.result;
          } else {
            this.$message({
              message: "获取错误" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.newSongLoading = false;
          this.$message({
            message: "获取错误" + err.msg,
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.Recommend {
  max-width: 1080px;
  margin: 0 auto;
}

.banner {
  img {
    width: 100%;
    height: 100%;
  }
}

.item_box {
  margin-bottom: 50px;
}

.item_title {
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px #ccc solid;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 18px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    color: #999;
    cursor: pointer;
  }

  p:hover {
    color: #666;
  }
}

.musicList {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
}

.musicList_item {
  width: 18%;
  cursor: pointer;
  margin-bottom: 35px;
}

.musicList_item_img {
  padding-top: calc(100% - 2px);
  border: #ccc solid 1px;
  position: relative;
  background: center no-repeat / 100% 100%;
  overflow: hidden;
  background-color: white;
}

.weekRecommend {
  font-size: 14px;
  color: #888;
}

.dayRecommend {
  font-size: 6vw;
  color: $colorRed;
  font-weight: 500;
}

.musicList_item_tootip {
  position: absolute;
  top: 0;
  text-align: left;
  padding: 5px 8px;
  height: 20%;
  min-height: 38px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  transition: all .3s;
  transform: translateY(-100%);

  p {
    font-size: 12px;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 18px;
  }
}

.musicList_item_img:hover .musicList_item_tootip {
  transform: translateY(0);
}

.musicList_item_title {
  text-align: left;
  margin-top: 5px;
  font-size: 14px;
  letter-spacing: .5px;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.day_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}

.musicList_item_num {
  position: absolute;
  padding: 5px;
  width: 40%;
  text-align: right;
  font-size: 12px;
  color: white;
  right: 0;
  top: 0;
  background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,.5));
  transition: all .3s;
}

.musicList_item_img:hover .musicList_item_num {
  transform: translateY(-100%);
}
</style>
