<template>
  <el-container>
    <el-header>
      <h1
        class="logo"
        @click="$router.push({name: '发现音乐'})"
      >
        网易云音乐
      </h1>
      <div class="header_menu flex flex-center">
        <div class="header_left flex flex-center">
          <div class="backFront">
            <i
              class="header_btn iconfont icon-left"
              @click="$router.go(-1)"
            />
            <i
              class="header_btn iconfont icon-right"
              @click="$router.go(1)" 
            />
          </div>
          <el-input
            v-model="searchInput"
            class="searchInput"
            placeholder="搜索音乐，视频，歌词，电台"
            size="mini"
          >
            <i
              slot="suffix"
              class="iconfont icon-search"
            />
          </el-input>
        </div>
        <div class="header_right flex flex-center">
          <personalCenter />
        </div>
      </div>
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
import personalCenter from '../components/personalCenter'
export default {
  name: 'Home',
  components: {
    personalCenter
  },
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
    playMusic(row){
      axios
        .get("song/url", {
          params: {
            id: row.id,
            br: "999000"
          }
        })
        .then(res => {
          if(res.code == 200){
            this.url = res.data[0].url;
            setTimeout(() => {
              this.$refs.video.play();
            }, 50);
          }
        })
        .catch(err => {
          console.log(err)
        })
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
  cursor: pointer;
}

.backFront {
  margin-right: 30px;
}

.header_btn {
  font-size: 10px;
  width: 30px;
  height: 24px;
  line-height: 24px;
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

.header_menu {
  flex: 1;
  justify-content: space-between;
}
</style>