/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:20:38 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-21 17:44:48
 */
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

html,
body {
  height: 100%;
  min-width: 1000px;
  background-color: #fafafa;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
