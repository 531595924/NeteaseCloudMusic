<template>
  <div class="searchSong">
    {{ porpdata }}
  </div>
</template>

<script>
export default {
  name: "SearchSong",
  props: ["porpdata"],
  data(){
    return {}
  },
  watch: {
    porpdata(val) {
      this.$emit("totaltext", `${val.songCount} 首单曲`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
