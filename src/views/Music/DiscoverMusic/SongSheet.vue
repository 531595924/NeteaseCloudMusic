<template>
  <div class="SongSheet flex column">
    <div class="screen_box">
      <el-popover
        placement="bottom-start"
        title="全部标签"
        width="540"
        trigger="click"
      >
        <el-button
          slot="reference"
          size="mini"
        >
          {{ screenClass }}
          <i class="el-icon-arrow-down" />
        </el-button>
        <div class="screen_main_box">
          <div
            class="allClassBtn"
            :class="allClass.all && (allClass.all.name == screenClass) ? 'activeClass' : ''"
            @click="screenClass = allClass.all.name"
          >
            {{ allClass.all ? allClass.all.name : '' }}
          </div>
          <div
            v-for="i in allClassFormat"
            :key="i.name"
            class="classBtn_box flex flex-center"
          >
            <p class="classBtn_box_left">
              {{ i.name }}
            </p>
            <div class="classBtn_box_right flex flex-center">
              <div
                v-for="(o, index) in i.children"
                :key="o.name"
                class="classBtn_box_right_item"
                :class="o.name == screenClass ? 'activeClass' : ''"
                :style="index > 4 ? {'borderTop': 'none'} : ''"
                @click="screenClass = o.name"
              >
                {{ o.name }}
                <span v-if="o.hot">HOT</span>
              </div>
            </div>
          </div>
        </div>
      </el-popover>
      <div class="hotClass_box">
        热门标签：
        <span
          v-for="i in hotClass"
          :key="i.name"
          :class="screenClass == i.name ? 'activeHotClass': ''"
          @click="screenClass = i.name"
        >{{ i.name }}</span>
      </div>
    </div>
    <div
      v-infinite-scroll="getPlayList"
      class="playlist"
      :infinite-scroll-delay="200"
    >
      <div class="musicList_box flex">
        <div
          v-for="i in playList"
          :key="i.id"
          class="musicList_item"
          @click="$router.push({name: '歌单页', params: { musicListId: i.id }})"
        >
          <div class="musicList_item_top">
            <div
              class="musicList_item_img"
              :style="{ backgroundImage: `url(${i.coverImgUrl})` }"
            >
              <div
                class="musicList_item_num el-icon-headset"
              >
                {{ i.playCount >= 100000 ? parseInt(i.playCount / 10000) + "万" : i.playCount }}
              </div>
              <div class="musicList_item_user el-icon-user">
                {{ i.creator.nickname }}
              </div>
              <div
                class="musicList_item_play"
                @click.stop="playSongList(i.id)"
              >
                <i class="iconfont icon-play" />
              </div>
            </div>
          </div>
          <div class="musicList_item_title">
            {{ i.name }}
          </div>
        </div>
      </div>
      <p
        v-if="loading"
        class="loading_text"
      >
        <i class="el-icon-loading" />
        加载中...
      </p>
      <el-backtop
        target=".SongSheet"
        :right="60"
        :bottom="80"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SongSheet",
  data() {
    return {
      screenClass: "全部歌单",
      allClass: {},
      hotClass: [],
      playList: [],
      playListOffset: 0,
      loading: false
    };
  },
  computed: {
    // 分类格式化
    allClassFormat() {
      var all = this.allClass;
      var format = [];
      for (var key in all.categories) {
        var item = [];
        all.sub.forEach(o => {
          if (key == o.category) {
            item.push(o);
          }
        });
        format.push({ name: all.categories[key], children: item });
      }
      return format;
    }
  },
  watch: {
    screenClass() {
      this.playListOffset = 0;
      this.playList = [];
      this.getPlayList();
    }
  },
  mounted() {
    this.getAllClass();
    this.getHotClass();
  },

  methods: {
    getAllClass() {
      axios
        .get("/playlist/catlist")
        .then(res => {
          if (res.code == 200) {
            this.allClass = res;
          } else {
            this.$message({
              message: "获取歌单分类失败，" + res.msg,
              offset: 70,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取歌单分类失败，" + err.msg,
            offset: 70,
            type: "error"
          });
        });
    },
    getHotClass() {
      axios
        .get("/playlist/hot")
        .then(res => {
          if (res.code == 200) {
            this.hotClass = res.tags;
          } else {
            this.$message({
              message: "获取热门歌单分类失败，" + res.msg,
              offset: 70,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取热门歌单分类失败，" + err.msg,
            offset: 70,
            type: "error"
          });
        });
    },
    getPlayList() {
      if (!this.loading) {
        this.loading = true;
        axios
          .get("/top/playlist", {
            params: {
              cat: this.screenClass,
              offset: this.playListOffset,
              limit: 20
            }
          })
          .then(res => {
            this.loading = false;
            if (res.code == 200) {
              this.playList = this.playList.concat(res.playlists);
              this.playListOffset += 20;
            } else {
              this.$message({
                message: "获取热门歌单列表失败，" + res.msg,
                offset: 70,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              message: "获取热门歌单列表失败，" + err.msg,
              offset: 70,
              type: "error"
            });
          });
      }
    },
    playSongList(id) {
      axios
        .get(`/playlist/detail?id=${id}`)
        .then(res => {
          if (res.code == 200) {
            this.$store.commit("switchMusic", {
              music: res.playlist.tracks[0],
              index: 0
            });
            this.$store.commit("switchMusicList", res.playlist.tracks);
          } else {
            this.$message({
              message: "获取错误" + res.msg,
              offset: 70,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取错误" + err.msg,
            offset: 70,
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.SongSheet {
  overflow-y: auto;
}

.screen_box {
  text-align: left;
}

.classBtn_box {
  margin-bottom: 10px;
}

.classBtn_box_left {
  font-size: 16px;
  color: $colorRed;
  min-width: 60px;
  text-align: left;
}

.classBtn_box_right {
  flex-wrap: wrap;
  flex: 1;
}

.classBtn_box_right_item {
  width: calc((100% - 6px) / 5);
  text-align: center;
  line-height: 35px;
  border: 1px solid #ddd;
  border-right: none;
  position: relative;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  span {
    font-size: 8px;
    position: absolute;
    color: $colorRed;
    top: 0;
    right: 0;
    line-height: 10px;
    font-weight: 900;
  }
  &:hover {
    background-color: #f5f5f7;
  }
  &:nth-child(5n) {
    border-right: 1px solid #ddd;
  }

  &:nth-last-child(1) {
    border-right: 1px solid #ddd;
  }
}

.allClassBtn {
  border: 1px solid #ddd;
  text-align: center;
  line-height: 35px;
  margin-bottom: 10px;
  font-size: 12px;
  cursor: pointer;
}

.activeClass {
  background-color: #f8e3e5;
  color: $colorRed;
}

.screen_main_box {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
}

.hotClass_box {
  margin: 10px 0;
  font-size: 12px;
  span {
    padding: 0 18px;
    color: #666;
    cursor: pointer;
    border-right: 1px solid #ddd;
    &:hover {
      color: #333;
    }
    &:nth-last-child(1) {
      border: none;
    }
  }
}

.activeHotClass {
  color: $colorRed !important;
}

.playlist {
  padding: 20px;
}

.loading_text {
  color: $colorRed;
  font-size: 15px;
}

.musicList_box {
  width: 100%;
  flex-wrap: wrap;
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
  width: calc(100% - 16px);
  position: absolute;
  top: 0;
  text-align: left;
  padding: 5px 8px;
  height: 20%;
  min-height: 38px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  transition: all 0.3s;
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

.musicList_item_img .musicList_item_play {
  right: 10px;
  bottom: 10px;
}

.newSong_item .musicList_item_play {
  right: 4px;
  bottom: 4px;
}

.musicList_item_play {
  width: 30px;
  height: 30px;
  border-radius: 100px;
  border: 1px white solid;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transform: translateY(200%);
  transition: all 0.3s;
  .icon-play {
    color: white;
    font-size: 12px;
  }
}

.musicList_item_img:hover .musicList_item_play,
.newSong_item:hover .musicList_item_play {
  transform: translateY(0);
}

.musicList_item_title {
  text-align: left;
  margin-top: 5px;
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}

.musicList_item_user {
  width: 100%;
  position: absolute;
  text-align: left;
  line-height: 20px;
  padding: 5px 10px;
  font-size: 12px;
  color: white;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
}
</style>
