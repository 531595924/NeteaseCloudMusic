<template>
  <el-container>
    <el-container>
      <el-aside
        class="flex column"
        width="220px"
        v-loading="asideLoading"
      >
        <div class="aside_top">
          <template v-for="i in asideList">
            <h3 :key="i.title">
              {{ i.title }}
            </h3>
            <div
              class="aside_item"
              v-for="h in i.children"
              :key="h.title"
              @click="$router.push({name: h.title})"
            >
              <i
                class="iconfont asideIcon"
                :class="h.icon"
              />
              {{ h.title }}
            </div>
          </template>
          <template v-if="userInfo.code && userInfo.code == 200">
            <h3>创建的歌单</h3>
            <div
              class="aside_item"
              v-for="i in myMusicList"
              :key="i.id"
              :class="$route.params.musicListId == i.id ? 'active' : ''"
              @click="$router.push({name: '歌单页', params: { musicListId: i.id }})"
            >
              <i class="asideIcon iconfont icon-songsheet" />
              {{ i.name }}
            </div>
            <h3>收藏的歌单</h3>
            <div
              class="aside_item"
              v-for="i in collectionList"
              :key="i.id"
              :class="$route.params.musicListId == i.id ? 'active' : ''"
              @click="$router.push({name: '歌单页', params: { musicListId: i.id }})"
            >
              <i class="asideIcon iconfont icon-songsheet" />
              {{ i.name }}
            </div>
          </template>
        </div>
        <transition name="el-zoom-in-bottom">
          <div
            class="nowMusicInfo flex"
            v-if="nowPlayMusic.id"
          >
            <div class="nowMusicInfo_img">
              <img :src="nowPlayMusic.al.picUrl">
            </div>
            <div class="nowMusicInfo_text">
              <p class="nowMusicInfo_title">
                {{ nowPlayMusic.name }}
              </p>
              <p class="nowMusicInfo_user">
                <a
                  v-for="(i, index) in nowPlayMusic.ar"
                  :key="i.id"
                >
                  {{ i.name }}
                  <span v-if="(index + 1) != nowPlayMusic.ar.length">/</span>
                </a>
              </p>
            </div>
          </div>
        </transition>
      </el-aside>
      <el-main>
        <transition
          name="el-fade-in-linear"
          mode="out-in"
        >
          <router-view />
        </transition>
      </el-main>
    </el-container>
    <el-footer>
      <musicPlayer />
    </el-footer>
  </el-container>
</template>

<script>
import musicPlayer from "../../components/musicPlayer";
export default {
  name: "Music",
  components: {
    musicPlayer
  },
  data() {
    return {
      asideList: [
        {
          title: "推荐",
          children: [
            {
              icon: "icon-music",
              title: "发现音乐"
            },
            {
              icon: "icon-radio",
              title: "私人FM",
            },
            {
              icon: "icon-video",
              title: "视频"
            },
            {
              icon: "icon-pengyou",
              title: "朋友"
            }
          ]
        },
        {
          title: "我的音乐",
          children: [
            {
              icon: "icon-yun",
              title: "音乐云盘"
            },
            {
              icon: "icon-shoucang",
              title: "我的收藏"
            }
          ]
        }
      ],
      asideLoading: false,
      musicList: []
    };
  },
  computed: {
    nowPlayMusic() {
      return this.$store.state.nowPlayMusic;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    myMusicList() {
      return this.musicList.filter(i => !i.subscribed);
    },
    collectionList() {
      return this.musicList.filter(i => i.subscribed);
    }
  },
  watch: {
    userInfo(data) {
      if (data.code == 200) {
        this.getMusicList();
      }
    }
  },
  methods: {
    getMusicList() {
      this.asideLoading = true;
      axios
        .get("/user/playlist", {
          params: {
            uid: this.userInfo.profile.userId
          }
        })
        .then(res => {
          this.asideLoading = false;
          this.musicList = res.playlist;
        })
        .catch(err => {
          this.asideLoading = false;
          this.$message({
            message: err.msg,
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-aside {
  text-align: left;
  background-color: #fafafa;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.aside_top {
  flex: 1;
  overflow: auto;
}

.el-main {
  padding: 0;
  max-height: calc(100vh - 120px);
}

.el-footer {
  padding: 0;
  background-color: #fafafa;
  border-top: 1px solid #ddd;
}

h3 {
  font-size: 14px;
  font-weight: 100;
  color: #aaa;
  line-height: 30px;
  padding-left: 10px;
}

.aside_item {
  font-size: 12px;
  padding-left: 15px;
  line-height: 36px;
  cursor: pointer;
  color: #777;
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}

.aside_item:hover {
  color: #333;
}

.active {
  padding-left: 12px;
  background-color: #e6e7ea;
  border-left: 3px solid $colorRed;
}

.asideIcon {
  font-size: 16px;
}

.nowMusicInfo {
  border-top: 1px solid #ddd;
  padding: 5px;
  max-width: 220px;
}

.nowMusicInfo_img {
  min-height: 50px;
  min-width: 50px;
  max-height: 50px;
  max-width: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}

.nowMusicInfo_text {
  margin-left: 10px;
}

.nowMusicInfo_title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0;
  max-width: 140px;
}

.nowMusicInfo_user {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}
</style>