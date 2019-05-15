<template>
  <el-container>
    <el-header>
      <h1
        class="logo"
        href="#"
      >
        网易云音乐
      </h1>
      <div class="backFront">
        <i class="header_btn iconfont left" />
        <i class="header_btn iconfont right" />
      </div>
      <el-input
        class="searchInput"
        placeholder="搜索音乐，视频，歌词，电台"
        v-model="searchInput"
        size="mini"
      >
        <i
          slot="suffix"
          class="iconfont search"
        />
      </el-input>
    </el-header>
    <el-main>
      <transition 
        name="el-fade-in-linear" 
        mode="out-in"
      >
        <router-view />
      </transition>
    </el-main>
  </el-container>
</template> 

<script>
export default {
  name: 'Home',
  data(){
    return {
      searchInput: ""
    }
  },
  mounted() {
  },
  methods: {
    search(){
      axios
        .get("search", {
          params: {
            keywords: this.searchInput
          }
        })
        .then(res => {
          if(res.code == 200) {
            this.searchList = res.result.songs
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    duration(time){
      var m = parseInt(time / 1000 / 60);
      var s = parseInt(time / 1000 % 60);
      m = m > 10 ? m : "0" + m;
      s = s > 10 ? s : "0" + s;
      return `${m}:${s}`
    }
  },
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: $colorRed;
  display: flex;
  color: white;
  align-items: center;
}

.el-main {
  margin: 0;
  padding: 0;
}

.logo {
  color: white;
  font-size: 20px;
  text-align: left;
  font-weight: 500;
  width: 200px;
}

.backFront {
  margin-right: 30px;
}

.header_btn {
  font-size: 12px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #a82828;
  cursor: pointer;
}

.header_btn:nth-last-child(1) {
  border-left: none;
}

.searchInput {
  width: 300px;
}

.search {
  margin-top: 3px;
}
</style>