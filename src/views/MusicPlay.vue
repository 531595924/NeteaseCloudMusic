<template>
  <div
    v-if="nowMusic.name && nowMusic.name != ''"
    class="MusciPlay"
  >
    <div class="top_box flex">
      <div class="phonograph_box">
        <div class="stylus" />
        <div
          class="record"
          :class="`${classAnimation} ${classPause}`"
        >
          <img :src="nowMusic.al.picUrl">
        </div>
        <div class="btn_box">
          <el-button
            size="mini"
            :loading="likeLoading"
            :type="isLike ? 'primary' : ''"
            :icon="isLike ? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="like"
          >
            {{ isLike ? '已喜欢' : '喜欢' }}
          </el-button>
          <el-tooltip
            content="暂无收藏单曲接口"
            placement="bottom"
          >
            <el-button
              size="mini"
              icon="el-icon-folder-add"
            >
              收藏
            </el-button>
          </el-tooltip>
          <el-popover
            class="downloadBtn"
            placement="bottom"
            title="请复制链接下载"
            width="300"
            trigger="click"
            :content="$store.state.nowPlayMusicUrl"
          >
            <el-button
              slot="reference"
              size="mini"
              icon="el-icon-download"
            >
              下载
            </el-button>
          </el-popover>
          <el-button
            size="mini"
            disabled
            icon="el-icon-position"
          >
            分享
          </el-button>
        </div>
      </div>
      <div class="musicInfo flex column">
        <h3>{{ nowMusic.name }}</h3>
        <h5 v-if="nowMusic.alia.length != 0">
          {{ nowMusic.alia.join(" ") }}
        </h5>
        <div class="music_sourceInfo flex">
          <span>
            专辑:
            <span class="link">{{ nowMusic.al.name }}</span>
          </span>
          <span>
            歌手:
            <span>
              <template v-for="(i, index) in nowMusic.ar">
                <span
                  :key="i.id"
                  class="link"
                >{{ i.name }}</span>
                <template v-if="(index + 1) < nowMusic.ar.length">/</template>
              </template>
            </span>
          </span>
          <span>
            来源:
            <span />
          </span>
        </div>
        <lyric />
      </div>
      <div
        class="top_bg"
        :style="{backgroundImage: `url(${nowMusic.al.picUrl})`}"
      />
    </div>
    <div class="bottom_box flex">
      <div
        v-loading="comment.loading"
        class="comment_box"
      >
        <h5 class="comment_title">
          听友评论<span>（已有{{ comment.total }}条评论）</span>
        </h5>
        <div class="editComment">
          <div class="editComment_box">
            <i class="el-icon-edit" />&#160;&#160;发表评论
          </div>
        </div>
        <div
          v-if="comment.data.topComments && comment.data.topComments.length != 0"
          class="comment_itemBox topComment"
        >
          <h6>置顶评论</h6>
          <commentItem
            v-for="i in comment.data.topComments"
            :key="i.commentId"
            :props-data="i"
          />
        </div>
        <div
          v-if="comment.data.hotComments && comment.data.hotComments.length != 0"
          class="comment_itemBox hotComment"
        >
          <h6>精彩评论</h6>
          <commentItem
            v-for="i in comment.data.hotComments"
            :key="i.commentId"
            :props-data="i"
          />
        </div>
        <div
          v-if="comment.data.comments && comment.data.comments.length != 0"
          class="comment_itemBox allComment"
        >
          <h6>最新评论（{{ comment.total }}）</h6>
          <commentItem
            v-for="i in comment.data.comments"
            :key="i.commentId"
            :props-data="i"
          />
        </div>
      </div>
    </div>
    <el-backtop
      target=".el-main"
      :bottom="80"
    />
  </div>
</template>

<script>
import lyric from "../components/lyric";
import commentItem from "../components/commentItem";
export default {
  name: "MusciPlay",
  components: {
    lyric,
    commentItem
  },
  data() {
    return {
      imgRecord: 0,
      classAnimation: "recordAnimation",
      classPause: "pause",
      likeLoading: false,
      comment: {
        loading: false,
        total: 0,
        data: {},
        offset: ""
      }
    };
  },
  computed: {
    nowMusic() {
      return this.$store.state.nowPlayMusic;
    },
    playState() {
      return this.$store.state.playState;
    },
    isLike() {
      return this.$store.state.likeList.includes(this.nowMusic.id);
    }
  },
  watch: {
    nowMusic() {
      this.classAnimation = "";
      this.$nextTick(() => {
        this.classAnimation = "recordAnimation";
        this.getComment();
      });
    },
    playState(val) {
      this.classPause = val ? "" : "pause";
    }
  },
  mounted() {
    if(this.nowMusic.id && this.nowMusic.id != ''){
      this.getComment();
    }
  },
  methods: {
    like() {
      this.likeLoading = true;
      axios
        .get(`/like?id=${this.nowMusic.id}&like=${!this.isLike}`)
        .then(res => {
          this.likeLoading = false;
          if (res.code == 200) {
            if (!this.isLike) {
              this.$store.commit("likeList", {
                type: "add",
                arr: [this.nowMusic.id]
              });
            } else {
              this.$store.commit("likeList", {
                type: "del",
                arr: [this.nowMusic.id]
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "喜欢失败，请重新点击"
            });
          }
        })
        .catch(err => {
          this.likeLoading = false;
          this.$message({
            type: "error",
            message: "喜欢失败，请重新点击" + err
          });
        });
    },
    getComment() {
      this.comment.loading = true;
      axios
        .get(`/comment/music?id=${this.nowMusic.id}&offset=${0}`)
        .then(res => {
          this.comment.loading = false;
          if (res.code == 200) {
            this.comment.data = res;
            this.comment.total = res.total;
          } else {
            this.$message({
              type: "error",
              message: "获取评论失败，请重试"
            });
          }
        })
        .catch(err => {
          this.comment.loading = false;
          this.$message({
            type: "error",
            message: "获取评论失败，请重试" + err
          });
        });

    }
  }
};
</script>

<style lang="scss" scoped>
.MusciPlay {
  background: rgba(250, 250, 250, 1);
  margin: 0 auto;
  max-width: 900px;
}

.top_box {
  position: relative;
  padding-top: 36px;
  max-height: 400px;
  min-height: 400px;
}

.top_bg {
  height: 100%;
  width: 100%;
  background: no-repeat center / 120%;
  position: absolute;
  z-index: 1;
  filter: blur(50px) opacity(30%);
}

.phonograph_box, .musicInfo {
  position: relative;
  z-index: 10;
}

.record {
  height: 230px;
  width: 230px;
  background: url("../../public/changpian.png") no-repeat center / 100%;
  padding: 70px;
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}

.recordAnimation {
  animation: record 30s infinite linear;
}

.pause {
  animation-play-state: paused;
}

@keyframes record {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.musicInfo {
  margin-left: 140px;
  text-align: left;
  flex: 1;
  h3 {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  h5 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 15px;
  }
}

.music_sourceInfo {
  justify-content: space-between;
  margin-bottom: 20px;
  span {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .link {
    cursor: pointer;
    color: #0070ff;
  }
}

.downloadBtn {
  margin: 0 10px;
}

.btn_box {
  position: relative;
  z-index: 99;
}

.bottom_box {
  text-align: left;
  margin-top: 50px;
}

.comment_title {
  font-size: 20px;
  font-weight: 500;
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  span {
    font-size: 12px;
    color: #666;
    margin-left: 10px;
  }
}

.editComment {
  background-color: #f0f0f2;
  padding: 10px;
  margin-top: 20px;
}

.editComment_box {
  background-color: white;
  padding: 5px 10px;
  border: 1px solid #ddd;
  color: #999;
  font-size: 12px;
  .el-icon-edit {
    font-size: 16px;
  }
}

.comment_itemBox {
  margin-top: 40px;
  h6 {
    font-size: 12px;
    font-weight: 500;
    padding-bottom: 10px;
  }
}

.comment_box {
  width: 100%;
}
</style>
