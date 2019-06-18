<template>
  <el-container v-loading="loading">
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
    <musicPlayer />
  </el-container>
</template> 

<script>
import personalCenter from '../components/personalCenter';
import musicPlayer from '../components/musicPlayer';
export default {
  name: 'Home',
  components: {
    personalCenter,
    musicPlayer
  },
  data(){
    return {
      searchInput: "",
      loading: false
    }
  },

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  watch: {
    userInfo() {
      this.getMusicList();
      this.getLikeList();
    }
  },

  mounted() {
  },

  methods: {
    getMusicList() {
      if (this.userInfo.code == 200) {
        this.loading = true;
        axios
          .get("/user/playlist", {
            params: {
              uid: this.userInfo.profile.userId
            }
          })
          .then(res => {
            this.loading = false;
            this.$store.commit("musicList", res.playlist)
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              message: err.msg,
              type: "error"
            });
          });
      }
    },
    getLikeList() {
      if (this.userInfo.code == 200) {
        axios
          .get("/likelist", {
            params: {
              uid: this.userInfo.profile.userId
            }
          })
          .then(res => {
            if(res.code == 200) {
              this.$store.commit("likeList", {type: "add", arr: res.ids})
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: err.msg,
              type: "error"
            });
          });
      }
    }
  }
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