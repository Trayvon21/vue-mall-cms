<template>
  <div>
    <el-menu :default-active="active" class="el-menu-vertical-demo" unique-opened>
      <div v-for="item in menus" :key="item.id">
        <el-submenu :index="item.path" v-if="item.authName">
          <template slot="title">
            <div class="flex a-center">
              <i :class="item.icon"></i>
              <span>{{item.authName}}</span>
            </div>
          </template>
          <el-menu-item-group v-for="i in item.children" :key="i.id">
            <el-menu-item :index="i.index" @click="handleSelect(`/${item.name}/${i.name}`)">
              <i :class="i.icon"></i>
              <span>{{i.authName}}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <div v-else>
          <el-menu-item-group v-for="i in item.children" :key="i.path">
            <el-menu-item :index="i.index" @click="handleSelect(`/${i.path}`)">
              <i :class="i.icon"></i>
              <span>首页</span>
            </el-menu-item>
          </el-menu-item-group>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import vuex from "vuex";
const userModule = createNamespacedHelpers("user");
const { mapState: userState, mapActions: userActions } = userModule;
export default {
  name: "HomeAside",
  methods: {
    ...userActions(["getMenus"]),
    handleSelect(path) {
      if (this.$route.path !== path) this.$router.push(path);
    }
  },
  mounted() {
    this.getMenus();
  },
  computed: {
    ...userState(["menus"]),
    active() {
      return this.$route.meta.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
}
.iconfont {
  margin: 2px 5px;
}
</style>