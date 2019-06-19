/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:20:57 
 * @Last Modified by:   coldlike 531595924@qq.com 
 * @Last Modified time: 2019-06-19 10:20:57 
 */
<template>
  <el-container>
    <el-container>
      <el-aside
        v-loading="asideLoading"
        class="flex column"
        width="220px"
      >
        <div class="aside_top">
          <template v-for="i in asideList">
            <h3 :key="i.title">
              {{ i.title }}
            </h3>
            <div
              v-for="h in i.children"
              :key="h.title"
              class="aside_item"
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
              v-for="i in myMusicList"
              :key="i.id"
              class="aside_item"
              :class="$route.params.musicListId == i.id ? 'active' : ''"
              @click="$router.push({name: '歌单页', params: { musicListId: i.id }})"
            >
              <i class="asideIcon iconfont icon-songsheet" />
              {{ i.name }}
            </div>
            <h3>收藏的歌单</h3>
            <div
              v-for="i in collectionList"
              :key="i.id"
              class="aside_item"
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
            v-if="nowPlayMusic.id"
            class="nowMusicInfo flex"
          >
            <div
              class="nowMusicInfo_img"
              @click="$router.push({name: '音乐播放'})"
            >
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
  </el-container>
</template>

<script>
export default {
  name: "Music",
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
      asideLoading: false
    };
  },
  computed: {
    nowPlayMusic() {
      return this.$store.state.nowPlayMusic;
    },
    musicList() {
      return this.$store.state.musicList;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    myMusicList() {
      console.log(this.$store.state.musicList)
      return this.musicList.filter(i => !i.subscribed);
    },
    collectionList() {
      return this.musicList.filter(i => i.subscribed);
    }
  },
  watch: {
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-aside {
  text-align: left;
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
  cursor: pointer;
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