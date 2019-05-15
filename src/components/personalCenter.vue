<template>
  <div class="personalCenter">
    <div
      class="personalCenter_box flex flex-center"
      @click="clickLogin"
    >
      <div class="portrait">
        <img
          class="portrait_img"
          v-if="loginType"
          :src="userInfo.profile.avatarUrl"
        >
      </div>
      <p class="userName flex flex-center">
        {{ loginType ? userInfo.profile.nickname : '未登录' }}
      </p>
    </div>
    <loginDialog :dialog-visible.sync="loginDialogVisible" />
  </div>
</template>

<script>
export default {
  name: "PersonalCenter",
  data() {
    return {
      loginDialogVisible: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    loginType() {
      return this.userInfo.code && this.userInfo.code == 200;
    }

  },
  mounted() {
    const userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : false;
    if(userInfo.code && userInfo.code == 200) {
      this.$store.commit("userInfo", userInfo);
    }
  },
  methods: {
    clickLogin(){
      if(this.loginType){
        console.log("已登录")
      } else {
        this.loginDialogVisible = true
      }
    }
  },
};
</script>

<style lang="scss" scoped>

.personalCenter {
  cursor: pointer;
}

.portrait {
  width: 40px;
  height: 40px;
  background-color: white;
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;
}

.portrait_img {
  width: 100%;
  height: 100%;
}
</style>
