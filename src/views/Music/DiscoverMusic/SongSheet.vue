<template>
  <div class="SongSheet">
    <div class="screen_box">
      <el-popover
        placement="bottom-start"
        title="全部标签"
        width="540"
        trigger="click"
      >
        <el-button
          slot="reference"
          size="mini"
        >
          {{ screenClass }}
          <i class="el-icon-arrow-down" />
        </el-button>
        <div class="screen_main_box">
          <div
            class="allClassBtn"
            :class="allClass.all && (allClass.all.name == screenClass) ? 'activeClass' : ''"
            @click="screenClass = allClass.all.name"
          >
            {{ allClass.all ? allClass.all.name : '' }}
          </div>
          <div
            v-for="i in allClassFormat"
            :key="i.name"
            class="classBtn_box flex flex-center"
          >
            <p class="classBtn_box_left">
              {{ i.name }}
            </p>
            <div class="classBtn_box_right flex flex-center">
              <div
                v-for="(o, index) in i.children"
                :key="o.name"
                class="classBtn_box_right_item"
                :class="o.name == screenClass ? 'activeClass' : ''"
                :style="index > 4 ? {'borderTop': 'none'} : ''"
                @click="screenClass = o.name"
              >
                {{ o.name }}
                <span v-if="o.hot">HOT</span>
              </div>
            </div>
          </div>
        </div>
      </el-popover>
      <div class="hotClass_box">
        热门标签：
        <span
          v-for="i in hotClass"
          :key="i.name"
          :class="screenClass == i.name ? 'activeHotClass': ''"
          @click="screenClass = i.name"
        >{{ i.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongSheet",
  data() {
    return {
      screenClass: "全部歌单",
      allClass: {},
      hotClass: []
    }
  },
  computed: {
    // 分类格式化
    allClassFormat() {
      var all = this.allClass;
      var format = []
      for(var key in all.categories) {
        var item = []
        all.sub.forEach(o => {
          if(key == o.category) {
            item.push(o)
          }
        });
        format.push({name: all.categories[key], children: item})
      }
      return format
    }
  },
  mounted() {
    this.getAllClass();
    this.getHotClass();
  },

  methods: {
    getAllClass() {
      axios
        .get("/playlist/catlist")
        .then(res => {
          if(res.code == 200) {
            this.allClass = res;
          } else {
            this.$message({
              message: "获取歌单分类" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取歌单分类" + err.msg,
            type: "error"
          });

        })
    },
    getHotClass() {
      axios
        .get("/playlist/hot")
        .then(res => {
          if(res.code == 200) {
            this.hotClass = res.tags;
          } else {
            this.$message({
              message: "获取热门歌单分类" + res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取热门歌单分类" + err.msg,
            type: "error"
          });

        })
    }
  }
}
</script>

<style lang="scss" scoped>

.screen_box {
  text-align: left;
}

.classBtn_box {
  margin-bottom: 10px;
}

.classBtn_box_left {
  font-size: 16px;
  color: $colorRed;
  min-width: 60px;
  text-align: left;
}

.classBtn_box_right {
  flex-wrap: wrap;
  flex: 1;
}

.classBtn_box_right_item {
  width: calc((100% - 6px) / 5) ;
  text-align: center;
  line-height: 35px;
  border: 1px solid #ddd;
  border-right: none;
  position: relative;
  font-size: 12px;
  cursor: pointer;
  transition: all .3s;
  span {
    font-size: 8px;
    position: absolute;
    color: $colorRed;
    top: 0;
    right: 0;
    line-height: 10px;
    font-weight: 900;
  }
  &:hover {
    background-color: #f5f5f7;
  }
  &:nth-child(5n) {
    border-right: 1px solid #ddd;
  }

  &:nth-last-child(1) {
    border-right: 1px solid #ddd;
  }
}

.allClassBtn {
  border: 1px solid #ddd;
  text-align: center;
  line-height: 35px;
  margin-bottom: 10px;
  font-size: 12px;
  cursor: pointer;
}

.activeClass {
  background-color: #f8e3e5;
  color: $colorRed;
}

.screen_main_box {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
}

.hotClass_box {
  margin: 10px 0;
  font-size: 12px;
  span {
    padding: 0 20px;
    color: #666;
    cursor: pointer;
    border-right: 1px solid #ddd;
    &:hover {
      color: #333;
    }
    &:nth-last-child(1) {
      border: none;
    }
  }
}

.activeHotClass {
  color: $colorRed !important;
}
</style>
