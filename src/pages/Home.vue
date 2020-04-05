<template>
  <div @click="close">
    <el-container>
      <el-header class="header">
        <homeHeader></homeHeader>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <homeAside></homeAside>
        </el-aside>
        <el-main>
          <homeTags class="home-tags"></homeTags>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import homeHeader from "../components/home/HomeHeader";
import homeAside from "../components/home/HomeAside";
import homeTags from "../components/home/HomeTags";
export default {
  name: "Home",
  components: { homeHeader, homeAside, homeTags },
  methods: {
    close() {
      this.$bus.$emit("closeRightClick");
    }
  }
};
</script>

<style scoped lang="scss">
.el-container {
  height: 100vh;
  min-width: 1024px;
}
.el-aside {
  border-right: 1px solid #ebeef5;
}
.header {
  border-bottom: 1px solid #ebeef5;
}
.home-tags {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
</style>
