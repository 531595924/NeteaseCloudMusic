/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:18:47 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-21 17:44:40
 */
<template>
  <div class="commentItem flex">
    <div
      class="portrait"
      :style="{backgroundImage: `url(${propsdata.user.avatarUrl})`}"
    />
    <div class="comment_right">
      <div class="comment_right_top">
        <span class="user">{{ propsdata.user.nickname }}：</span>
        {{ propsdata.content }}
      </div>
      <div
        v-for="i in propsdata.beReplied"
        :key="i.beRepliedCommentId"
        class="comment_release"
      >
        <span class="user">@{{ i.user.nickname }}：</span>
        {{ i.content }}
      </div>
      <div class="comment_right_bottom flex">
        <div class="comment_time">
          {{ $specificdateTransformation(propsdata.time, true) }}
        </div>
        <div class="comment_btn_box">
          <span
            :class="propsdata.liked ? 'colorRed' : ''"
            @click="fabulous()"
          >
            <i
              class="iconfont"
              :class="propsdata.liked ? 'icon-zan1' : 'icon-zan'"
            />
            {{ propsdata.likedCount == 0 ? '' : `(${propsdata.likedCount})` }}
          </span>
          <span>分享</span>
          <span @click="$emit('reply')">回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItem",
  props: {
    propsdata: {
      type: Object,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    },
    type: {
      type: Number, //0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
      required: true
    }
  },
  methods: {
    fabulous() {
      let likeType = this.propsdata.liked ? 0 : 1;
      axios
        .get(
          `/comment/like?id=${this.itemId}&cid=${
            this.propsdata.commentId
          }&t=${likeType}&type=${this.type}&timestamp=${new Date().getTime()}`
        )
        .then(res => {
          if (res.code == 200) {
            this.$emit("liked", likeType == 0 ? false : true);
          }
        })
        .catch(err => {
          this.$message({
            offset: 70,
            type: "error",
            message: "点赞失败，请重试" + err.msg
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.portrait {
  min-height: 35px;
  max-height: 35px;
  min-width: 35px;
  max-width: 35px;
  margin-right: 15px;
  background: no-repeat center / 100%;
  border: 1px #ddd solid;
  border-radius: 50px;
  overflow: hidden;
}

.comment_right {
  font-size: 12px;
  line-height: 18px;
  flex: 1;
}

.comment_right_top {
  padding-bottom: 10px;
}

.user {
  color: rgb(12, 178, 230);
  cursor: pointer;
}

.commentItem {
  border-top: solid 1px #eee;
  padding: 15px 0;
  &:nth-last-child(1) {
    border-bottom: solid 1px #eee;
  }
}

.comment_right_bottom {
  justify-content: space-between;
  color: #aaa;
}

.comment_release {
  padding: 8px;
  color: #666;
  background-color: #f1f1f4;
  margin-bottom: 10px;
}

.comment_btn_box {
  span {
    border-right: #aaa solid 1px;
    padding: 0 15px;
    cursor: pointer;
    transition: color 0.3s;
    &:nth-last-child(1) {
      border: none;
    }
    &:hover {
      color: $colorRed;
    }
    i {
      font-size: 14px;
    }
    .icon-zan1 {
      font-size: 16px;
    }
  }
}

.colorRed {
  color: $colorRed;
}
</style>
