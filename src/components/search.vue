/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-21 17:43:47 
 * @Last Modified by:   coldlike 531595924@qq.com 
 * @Last Modified time: 2019-06-21 17:43:47 
 */
<template>
  <div class="search">
    <el-popover
      placement="top-start"
      trigger="click"
    >
      <el-input
        slot="reference"
        v-model.trim="searchInput"
        class="searchInput"
        placeholder="搜索音乐，视频，歌词，电台"
        size="mini"
        @keyup.enter.native="searchPost"
      >
        <i
          slot="suffix"
          class="iconfont icon-search"
          @click="searchPost"
        />
      </el-input>
      <div class="search_tips_box flex">
        <div class="search_box_item">
          <div class="item_title">
            热门搜索
          </div>
          <div class="item_box">
            <div
              v-for="(i, index) in hot"
              :key="index"
              class="item_li"
            >
              {{ i.first }}
            </div>
          </div>
        </div>
        <div class="search_box_item">
          <div class="item_title">
            搜索历史
          </div>
          <div
            v-if="historyReverse.length != 0"
            class="item_box"
          >
            <div
              v-for="(i, index) in historyReverse"
              :key="index"
              class="item_li"
            >
              {{ i }}
            </div>
          </div>
          <div
            v-else
            class="no_history"
          >
            暂无搜索历史
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      searchInput: "",
      loading: false,
      lock: false,
      hot: [],
      history: []
    };
  },
  computed: {
    historyReverse() {
      var metaArr = JSON.parse(JSON.stringify(this.history));
      return metaArr.reverse();
    }
  },
  watch: {
    history(val) {
      localStorage.searchHistory = JSON.stringify(val);
    }
  },
  mounted() {
    this.getHotSearch();
    const arr = localStorage.searchHistory;
    this.history = arr ? JSON.parse(arr) : [];
  },
  methods: {
    // 获取热点搜索
    getHotSearch() {
      this.loading = true;
      axios
        .get("/search/hot")
        .then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.hot = res.result.hots;
          } else {
            this.$message({
              offset: 70,
              type: "error",
              message: "获取热门搜索失败，" + res.msg
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "获取热门搜索失败，" + err.msg
          });
        });
    },
    // 提交搜索
    searchPost() {
      if (this.searchInput == "") {
        this.$message({
          offset: 70,
          type: "error",
          message: "请输入搜索关键词"
        });
        return false;
      }
      if (!this.lock) {
        this.lock = true;
        // 添加历史记录
        let repeat = this.history.indexOf(this.searchInput);
        if (repeat === -1) {
          this.history.push(this.searchInput);
        } else {
          this.history.splice(repeat, 1);
          this.history.push(this.searchInput);
        }
        axios
          .get(`/search/multimatch?keywords=${this.searchInput}`)
          .then(res => {
            if (res.code == 200) {
              this.lock = false;
            } else {
              this.$message({
                offset: 70,
                type: "error",
                message: "获取热门搜索失败，" + res.msg
              });
            }
          })
          .catch(err => {
            this.lock = false;
            this.$message({
              offset: 70,
              type: "error",
              message: "获取热门搜索失败，" + err.msg
            });
          });
      }
    }
  }
};
</script>

<style lang="scss">
.searchInput {
  width: 300px;
}

.icon-search {
  margin-top: 3px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: $colorRed;
  }
}
</style>

