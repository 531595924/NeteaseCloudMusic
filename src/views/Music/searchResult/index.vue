<template>
  <div
    class="searchResult"
    :loading="loading"
  >
    <div class="searchTips">
      搜索<span>"{{ keyword }}"</span>，找到 {{ totalText }}
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="i in activeList"
        :key="i.name"
        :label="i.label"
        :name="i.name"
      />
    </el-tabs>
    <router-view
      :porpdata="searchData"
      @totaltext="totalText = $event"
    />
  </div>
</template>

<script>
export default {
  name: "SearchResult",
  data() {
    return {
      activeName: "song",
      activeList: [
        { name: "song", label: "搜索单曲", type: 1 },
        { name: "album", label: "搜索专辑", type: 10 },
        { name: "singer", label: "搜索歌手", type: 100 },
        { name: "songList", label: "搜索歌单", type: 1000 },
        { name: "users", label: "搜索用户", type: 1002 },
        { name: "mv", label: "搜索MV", type: 1004 },
        { name: "lyric", label: "搜索歌词", type: 1006 },
        { name: "video", label: "搜索视频", type: 1014 }
      ],
      loading: false,
      totalText: "",
      searchData: {}
    };
  },
  computed: {
    keyword() {
      return this.$route.query.keyword;
    }
  },
  watch: {
    $route() {
      this.activeState();
    }
  },
  mounted() {
    this.activeState();
    this.searchPost();
  },
  methods: {
    handleClick(tab) {
      this.$router.push({
        name: tab.label,
        query: { keyword: this.keyword }
      });
    },
    activeState() {
      this.activeName = this.activeList.find(
        i => i.label == this.$route.name
      ).name;
    },
    searchPost(limit) {
      this.loading = true;
      axios.get(`/search`, {
        params: {
          keywords: this.keyword,
          limit: limit,
          type: this.activeList.find(i => i.label == this.$route.name).type
        }
      })
      .then(res => {
        if(res.code == 200) {
          this.searchData = res.result;
        } else {
          this.$message({
            type: "error",
            text: "搜索出错，请重试"
          })
        }
      })
      .catch(() => {
        this.$message({
          type: "error",
          text: "搜索出错，请重试"
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.searchTips {
  padding: 20px 30px;
}
</style>
