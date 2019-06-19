/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:18:47 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-19 10:19:46
 */
<template>
  <div class="commentItem flex">
    <div
      class="portrait"
      :style="{backgroundImage: `url(${propsData.user.avatarUrl})`}"
    />
    <div class="comment_right">
      <div class="comment_right_top">
        <span class="user">{{ propsData.user.nickname }}：</span>
        {{ propsData.content }}
      </div>
      <div
        v-for="i in propsData.beReplied"
        :key="i.beRepliedCommentId"
        class="comment_release"
      >
        <span class="user">@{{ i.user.nickname }}：</span>
        {{ i.content }}
      </div>
      <div class="comment_right_bottom flex">
        <div class="comment_time">
          {{ $specificdateTransformation(propsData.time, true) }}
        </div>
        <div class="comment_btn_box">
          <span :class="propsData.liked ? 'colorRed' : ''">
            <i
              class="iconfont"
              :class="propsData.liked ? 'icon-zan1' : 'icon-zan'"
            />{{ propsData.likedCount == 0 ? '' : `(${propsData.likedCount})` }}</span>
          <span>分享</span>
          <span>回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItem",
  props:{
    propsData: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {}
  },
}
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
    transition: color .3s;
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
