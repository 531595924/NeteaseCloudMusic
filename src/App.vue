<template>
  <div id="app">
    <transition 
      name="el-fade-in-linear" 
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

/*阿里iconfont*/
.iconfont {
  width: 24px;
  text-align: center;
  font-size: 18px;
  display: inline-block;
}

/*滚动条样式*/
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: rgba(138, 138, 138, 0.6);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 129, 129, 0.8);
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

ul li {
  list-style-type: none;
}

input:-webkit-autofill {
  box-shadow: 0 0 0 1000px white inset;
}


html,body {
  height: 100%;
  min-width: 1000px;
  background-color: #fafafa;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  height: 100%;
}

.flex {
  display: flex;
}

.flex-center {
  align-items: center;
}

.column {
  flex-direction: column;
}
</style>
