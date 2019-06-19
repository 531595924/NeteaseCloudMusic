/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:20:54 
 * @Last Modified by:   coldlike 531595924@qq.com 
 * @Last Modified time: 2019-06-19 10:20:54 
 */
<template>
  <div
    v-loading="loading"
    element-loading-text="歌单加载中。。。"
    class="musicListPage flex column"
  >
    <div
      v-if="data.playlist"
      class="page_top flex"
    >
      <div class="page_top_left">
        <img :src="data.playlist.coverImgUrl">
      </div>
      <div class="page_top_right">
        <div class="title_box flex flex-center">
          <div class="title_box_left flex flex-center">
            <span class="musicList_icon">歌单</span>
            <h5 class="list_title">
              {{ data.playlist.name }}
            </h5>
          </div>
          <div class="number_box flex">
            <div><p>歌曲数</p><p>{{ data.playlist.trackCount }}</p></div>
            <div><p>播放数</p><p>{{ data.playlist.playCount }}</p></div>
          </div>
        </div>
        <div class="list_user flex flex-center">
          <span class="user_portrait">
            <img :src="data.playlist.creator.avatarUrl">
          </span>
          <span class="user_name">{{ data.playlist.creator.nickname }}</span>
          <span class="list_time">{{ $timeTransformation(data.playlist.createTime) }}创建</span>
        </div>
        <div class="btn_box">
          <el-button
            type="primary"
            size="mini"
            @click="playMusic(data.playlist.tracks[0])"
          >
            播放全部
          </el-button>
          <el-button size="mini">
            {{ data.playlist.subscribed ? "已收藏" : "收藏" }} ({{ data.playlist.subscribedCount }})
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      v-if="data.playlist"
      class="page_list"
      :data="data.playlist.tracks"
      style="width: 100%"
      show-overflow-tooltip
      stripe
      size="small"
      @row-dblclick="playMusic"
    >
      <el-table-column
        align="center"
        width="30"
      >
        <template slot-scope="scope">
          <i
            v-if="scope.row.id == $store.state.nowPlayMusic.id"
            class="iconfont icon-volume"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="50"
      >
        <template slot-scope="scope">
          <i
            v-if="$store.state.likeList.includes(scope.row.id)"
            class="iconfont icon-heart"
            @click="like(false, scope.row.id)"
          />
          <i
            v-else
            class="iconfont icon-heartline"
            @click="like(true, scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        align="center"
        width="50"
      />
      <el-table-column
        label="操作"
        align="center"
        width="80"
      />
      <el-table-column
        prop="name"
        label="音乐标题"
        min-width="100"
        show-overflow-tooltip
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
          <span
            v-for="i in scope.row.alia"
            :key="i"
            class="musicAlias"
          >{{ i }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="歌手"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a
            v-for="(i, index) in scope.row.ar"
            :key="i.id"
          >
            {{ i.name }}
            <span v-if="(index + 1) != scope.row.ar.length">/</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="专辑"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <a>{{ scope.row.al.name }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="时长"
        width="100"
      >
        <template slot-scope="scope">
          <a>{{ $duration(scope.row.dt) }}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "MusicListPage",
  data() {
    return {
      loading: false,
      data: {}
    };
  },
  watch: {
    '$route' () {
      this.getListInfo();
    }
  },
  mounted() {
    this.getListInfo();
  },
  methods: {
    getListInfo(){
      this.loading = true;
      axios
        .get("/playlist/detail", {
          params: {
            id: this.$route.params.musicListId
          }
        })
        .then(res => {
          this.loading = false;
          if(res.code == 200) {
            this.data = res;
          } else {
            this.$message({
              message: "获取歌曲时发生错误" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            message: err.msg,
            type: "error"
          });
        })
    },
    playMusic(row){
      var index = this.data.playlist.tracks.indexOf(row);
      this.$store.commit("switchMusic", {music: row, index: index});
      this.$store.commit("switchMusicList", this.data.playlist.tracks);
    },
    like(type, id) {
      this.loading = true;
      axios
        .get(`/like?id=${id}&like=${type}`)
        .then(res => {
          this.loading = false;
          if(res.code == 200) {
            if(type) {
              this.$store.commit("likeList", {type: "add", arr: [id]})
            } else {
              this.$store.commit("likeList", {type: "del", arr: [id]})
            }
          } else {
            this.$message({
              type: "error",
              message: "喜欢失败，请重新点击"
            })
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: "error",
            message: "喜欢失败，请重新点击"
          })
        })
    }

  }
};
</script>

<style lang="scss" scoped>

.musicListPage {
  flex: 1;
  min-height: calc(100vh - 120px);
}

.page_top {
  padding: 30px;
  text-align: left;
}

.page_top_left {
  width: 200px;
  height: 200px;
  margin-right: 20px;
}

.page_top_left > img {
  width: 100%;
  height: 100%;
}

.page_top_right {
  flex: 1;
}

.musicList_icon {
  width: 40px;
  height: 20px;
  border: 1px $colorRed solid;
  border-radius: 3px;
  font-size: 12px;
  line-height: 20px;
  color: $colorRed;
  text-align: center;
}

.title_box {
  justify-content: space-between;
}

.list_title {
  margin: 0 10px;
  font-weight: 500;
  font-size: 22px;
}

.musicAlias {
  color: #bfbfbf;
}

.number_box {
  color: #999;
  text-align: center;
}

.number_box > div {
  padding: 0 10px;
  font-size: 12px;
}

.number_box > div:nth-child(1){
  border-right: 1px solid #ccc;
}

.user_portrait {
  width: 30px;
  height: 30px;
  margin: 15px 0;
  border-radius: 100px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

.user_name {
  margin: 0 10px;
}

.icon-volume {
  color: $colorRed;
  font-size: 15px;
  display: flex;
  align-items: center;
  text-align: center;
}


.icon-heart {
  color: $colorRed;
}
.icon-heart, .icon-heartline {
  cursor: pointer;
}
</style>
