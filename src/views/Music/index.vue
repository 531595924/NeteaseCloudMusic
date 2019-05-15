<template>
  <el-container>
    <el-container>
      <el-aside width="200px">
        <template
          v-for="i in asideList"
        >
          <h3 :key="i.title">
            {{ i.title }}
          </h3>
          <div
            v-for="h in i.children"
            :key="h.title"
          >
            <i
              class="iconfont"
              :class="h.icon"
            />
            {{ h.title }}
          </div>
        </template>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
    <el-footer>footer</el-footer>
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
              icon: "music",
              title: "发现音乐",
              link: ""
            },
            {
              icon: "radio",
              title: "私人FM",
              link: ""
            },
            {
              icon: "video",
              title: "视频",
              link: ""
            },
            {
              icon: "pengyou",
              title: "朋友",
              link: ""
            }
          ]
        }, {
          title: "我的音乐",
          children: [
            {
              icon: "yun",
              title: "音乐云盘",
              link: ""
            },
            {
              icon: "shoucang",
              title: "我的收藏",
              link: ""
            }
          ]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    search() {
      axios
        .get("search", {
          params: {
            keywords: this.searchInput
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.searchList = res.result.songs;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    duration(time) {
      var m = parseInt(time / 1000 / 60);
      var s = parseInt((time / 1000) % 60);
      m = m > 10 ? m : "0" + m;
      s = s > 10 ? s : "0" + s;
      return `${m}:${s}`;
    },
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

.el-aside {
  text-align: left;
}
</style>