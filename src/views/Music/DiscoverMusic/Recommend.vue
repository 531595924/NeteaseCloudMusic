<template>
  <div class="Recommend">
    <el-carousel
      :interval="4000"
      type="card"
      height="15.5vw"
    >
      <el-carousel-item
        v-for="(item, index) in bannerList"
        :key="index"
      >
        <el-image
          :src="item.imageUrl"
          fit="scale-down"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "Recommend",
  data() {
    return {
      bannerList: []
    }
  },
  mounted() {
    this.getBanner();
  },
  methods: {
    getBanner() {
       axios
        .get("/banner")
        .then(res => {
          if (res.code == 200) {
            this.bannerList = res.banners;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    
  }
}
</script>

<style lang="scss" scoped>
.banner {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
