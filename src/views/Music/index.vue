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
};
</script>

<style lang="scss" scoped>

.el-aside {
  text-align: left;
}
</style>