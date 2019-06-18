<template>
  <div class="DiscoverMusic flex column">
    <el-tabs
      v-model="nowTab"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="i in tabsData"
        :key="i.name"
        :label="i.label"
        :name="i.name"
      />
    </el-tabs>
    <transition
      name="el-fade-in-linear"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "DiscoverMusic",
  data() {
    return {
      tabsData: [
        {
          label: "个性推荐",
          name: "Recommend"
        },
        {
          label: "歌单",
          name: "SongSheet"
        },
        {
          label: "排行榜",
          name: "Ranking"
        },
        {
          label: "歌手",
          name: "Singer"
        },
        {
          label: "最新音乐",
          name: "newMusic"
        },
      ],
      nowTab: "Recommend"
    };
  },
  mounted() {
    this.tabsData.forEach(i => {
      if(i.label == this.$route.name){
        this.nowTab = i.name;
      }
    });
  },
  methods: {
    handleClick(el) {
      this.$router.push({name: el.label})
    }
  }
};
</script>

<style scoped>
.DiscoverMusic {
  padding: 0 30px;
  height: 100%;
}

.el-tabs >>> .el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
}
</style>
