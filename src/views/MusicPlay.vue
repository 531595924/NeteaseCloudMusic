/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:18:45 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-26 09:28:43
 */
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
          听友评论
          <span>（已有{{ comment.total }}条评论）</span>
        </h5>
        <div
          class="editComment"
          @click="reply('music')"
        >
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
            :type="0"
            :item-id="nowMusic.id"
            :propsdata="i"
            @reply="reply('comment', i)"
            @liked="liked(i, $event)"
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
            :type="0"
            :item-id="nowMusic.id"
            :propsdata="i"
            @reply="reply('comment', i)"
            @liked="liked(i, $event)"
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
            :type="0"
            :item-id="nowMusic.id"
            :propsdata="i"
            @reply="reply('comment', i)"
            @liked="liked(i, $event)"
          />
          <el-pagination
            background
            layout="prev, pager, next"
            :total="comment.total"
            :current-page.sync="comment.currentPage"
            :page-size="20"
            @current-change="getComment(true)"
          />
        </div>
      </div>
      <div class="right_box">
        <div
          v-if="simiList.data.length != 0"
          v-loading="simiList.loading"
          class="simiSong"
        >
          <h5 class="comment_title">
            包含这首歌的歌单
          </h5>
          <div class="simiSong_box">
            <div
              v-for="i in simiList.data"
              :key="i.id"
              class="simi_item flex"
              @click="$router.push({name: '歌单页', params: { musicListId: i.id }})"
            >
              <div
                class="simi_img_box"
                :style="{backgroundImage: `url(${i.coverImgUrl})`}"
              />
              <div class="simi_right_box">
                <p class="simi_item_title">
                  {{ i.name }}
                </p>
                <p class="simi_item_subtitle">
                  播放：{{ parseInt(i.playCount / 10000) }}万
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="simiSong.data.length != 0"
          v-loading="simiSong.loading"
          class="simiSong"
        >
          <h5 class="comment_title">
            相似歌曲
          </h5>
          <div class="simiSong_box">
            <div
              v-for="i in simiSong.data"
              :key="i.id"
              class="simi_item flex"
            >
              <div
                class="simi_img_box"
                :style="{backgroundImage: `url(${i.album.blurPicUrl})`}"
              >
                <div
                  class="musicList_item_play"
                  @click.stop="playSongList(i.id)"
                >
                  <i class="iconfont icon-play" />
                </div>
              </div>
              <div class="simi_right_box">
                <p class="simi_item_title">
                  {{ i.name }}
                </p>
                <p class="simi_item_subtitle">
                  <span
                    v-for="o in i.artists"
                    :key="o.id"
                  >{{ o.name }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="simiUser.data.length != 0"
          v-loading="simiUser.loading"
          class="simiUser"
        >
          <h5 class="comment_title">
            喜欢这首歌的人
          </h5>
          <div class="simiUser_box">
            <div
              v-for="i in simiUser.data"
              :key="i.id"
              class="simi_item flex"
            >
              <div class="flex user_box_left">
                <div
                  class="simi_img_box"
                  :style="{backgroundImage: `url(${i.avatarUrl})`}"
                />
                <p class="user_name">
                  {{ i.nickname }}
                </p>
                <i
                  v-if="i.gender == 1"
                  class="iconfont icon-sex_man"
                />
                <i
                  v-if="i.gender == 2"
                  class="iconfont icon-sex_woman"
                />
              </div>
              <p class="user_time">
                {{ i.recommendReason }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <el-backtop
        target=".el-main"
        :bottom="80"
      />
    </div>
    <el-dialog
      :title="editComment.title"
      :visible.sync="editComment.visible"
      width="30%"
      top="300px"
      @closed="editComment.id = ''; editComment.input= ''"
    >
      <el-input
        v-model="editComment.input"
        type="textarea"
        :rows="3"
        placeholder="请输入评论..."
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="small"
          :loading="editComment.loading"
          @click="toComment"
        >评 论</el-button>
      </span>
    </el-dialog>
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
        currentPage: 1,
        data: {},
        offset: ""
      },
      simiList: {
        loading: false,
        data: []
      },
      simiSong: {
        loading: false,
        data: []
      },
      simiUser: {
        loading: false,
        data: []
      },
      editComment: {
        visible: false,
        loading: false,
        id: "",
        title: "评论歌曲",
        type: "music",
        input: ""
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
      this.$scrollTo(".el-main");
      this.$nextTick(() => {
        this.classAnimation = "recordAnimation";
        this.comment.currentPage = 1;
        this.getComment();
        this.getSimiList();
        this.getSimiSong();
        this.getSimiUser();
      });
    },
    playState(val) {
      this.classPause = val ? "" : "pause";
    }
  },
  mounted() {
    if (this.nowMusic.id && this.nowMusic.id != "") {
      this.getComment();
      this.getSimiList();
      this.getSimiSong();
      this.getSimiUser();
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
              offset: 70,
              type: "error",
              message: "喜欢失败，请重新点击"
            });
          }
        })
        .catch(err => {
          this.likeLoading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "喜欢失败，请重新点击" + err.msg
          });
        });
    },
    // 获取评论
    getComment(roll) {
      this.comment.loading = true;
      axios
        .get(
          `/comment/music?id=${this.nowMusic.id}&offset=${(this.comment.currentPage - 1) * 20}&timestamp=${new Date().getTime()}`
        )
        .then(res => {
          this.comment.loading = false;
          if (res.code == 200) {
            this.comment.data = res;
            this.comment.total = res.total;
            if(roll) {
              this.$nextTick(() => {
                this.$scrollTo(".el-main", 480);
              });
            }
          } else {
            this.$message({
              offset: 70,
              type: "error",
              message: "获取评论失败，请重试"
            });
          }
        })
        .catch(err => {
          this.comment.loading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "获取评论失败，请重试" + err.msg
          });
        });
    },
    // 获取相似歌单
    getSimiList() {
      this.simiList.loading = true;
      axios
        .get(`/simi/playlist?id=${this.nowMusic.id}`)
        .then(res => {
          this.simiList.loading = false;
          if (res.code == 200) {
            this.simiList.data = res.playlists;
          } else {
            this.$message({
              offset: 70,
              type: "error",
              message: "获取相似歌单失败，请重试"
            });
          }
        })
        .catch(err => {
          this.simiList.loading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "获取相似歌单失败，请重试" + err.msg
          });
        });
    },
    // 获取相似歌曲
    getSimiSong() {
      this.simiSong.loading = true;
      axios
        .get(`/simi/song?id=${this.nowMusic.id}`)
        .then(res => {
          this.simiSong.loading = false;
          if (res.code == 200) {
            this.simiSong.data = res.songs;
          } else {
            this.$message({
              offset: 70,
              type: "error",
              message: "获取相似歌曲失败，请重试"
            });
          }
        })
        .catch(err => {
          this.simiSong.loading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "获取相似歌曲失败，请重试" + err.msg
          });
        });
    },
    // 获取最近听歌用户
    getSimiUser() {
      this.simiUser.loading = true;
      axios
        .get(`/simi/user?id=${this.nowMusic.id}`)
        .then(res => {
          this.simiUser.loading = false;
          if (res.code == 200) {
            this.simiUser.data = res.userprofiles;
          } else {
            this.$message({
              offset: 70,
              type: "error",
              message: "获取最近用户失败，请重试"
            });
          }
        })
        .catch(err => {
          this.simiUser.loading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "获取最近用户失败，请重试" + err.msg
          });
        });
    },
    // 点赞
    liked(item, state) {
      item.liked = state;
      if (state) {
        item.likedCount += 1;
      } else {
        item.likedCount -= 1;
      }
    },
    // 回复
    reply(type, item) {
      this.editComment.visible = true;
      this.editComment.type = type;
      if (type == "music") {
        this.editComment.title = `歌曲 ${this.nowMusic.name}`;
        this.editComment.id = this.nowMusic.id;
      } else if (type == "comment") {
        this.editComment.title = `回复 ${item.user.nickname}`;
        this.editComment.id = item.commentId;
      }
    },
    // 发表评论
    toComment() {
      this.editComment.loading = true;
      axios
        .get("/comment", {
          params: {
            t: 1,
            type: 0,
            id: this.editComment.id,
            content: this.editComment.input
          }
        })
        .then(res => {
          this.editComment.loading = false;
          this.editComment.visible = false;
          let arr = this.comment.data.comments;
          res.comment.likedCount = 0;
          arr.reverse();
          arr.push(res.comment);
          arr.reverse();
          this.$message({
            type: "success",
            message: "发表成功"
          });
        })
        .catch(err => {
          this.editComment.loading = false;
          this.$message({
            offset: 70,
            type: "error",
            message: "发表失败" + err.msg
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
  padding-bottom: 20px;
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
  filter: blur(50px) opacity(40%);
}

.phonograph_box,
.musicInfo {
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
  font-size: 18px;
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
  cursor: pointer;
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

.el-pagination {
  text-align: center;
}

.right_box {
  min-width: 245px;
  max-width: 245px;
  margin-left: 80px;
}

.simiSong {
  margin-bottom: 40px;
}

.simi_img_box {
  max-width: 40px;
  min-width: 40px;
  max-height: 40px;
  min-height: 40px;
  border: 1px solid #eee;
  background: no-repeat center / 100%;
  margin-right: 8px;
  position: relative;
}

.simi_item {
  margin-top: 10px;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    color: $colorRed;
  }
}

.simi_right_box {
  font-size: 12px;
  flex: 1;
  p {
    max-width: 195px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.simi_item_subtitle {
  margin-top: 5px;
  color: #aaa;
}

.musicList_item_play {
  width: 26px;
  height: 26px;
  border-radius: 100px;
  border: 1px white solid;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transition: all 0.3s;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .icon-play {
    color: white;
    font-size: 10px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.user_box_left {
  align-items: center;
}

.simiUser {
  .simi_img_box {
    min-width: 30px;
    max-width: 30px;
    min-height: 30px;
    max-height: 30px;
    border-radius: 50px;
  }
  .simi_item {
    justify-content: space-between;
  }
}

.icon-sex_man {
  color: #66c2ff;
}

.icon-sex_woman {
  color: #ff66de;
}
</style>
