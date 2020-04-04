<template>
  <div>
    <el-menu :default-active="active" class="el-menu-vertical-demo" unique-opened>
      <el-menu-item-group>
        <el-menu-item index="/" @click="handleSelect(`/`)">
          <i class="iconfont" :class="`icon-home`"></i>
          <span>首页</span>
        </el-menu-item>
      </el-menu-item-group>
      <el-submenu :index="item.path" v-for="item in menus" :key="item.id">
        <template slot="title">
          <div class="flex a-center">
            <i class="iconfont" :class="`icon-${item.path}`"></i>
            <span>{{item.authName}}</span>
          </div>
        </template>
        <el-menu-item-group v-for="i in item.children" :key="i.id">
          <el-menu-item
            :index="`/${item.path}/${i.path}`"
            @click="handleSelect(`/${item.path}/${i.path}`)"
          >
            <i class="iconfont" :class="`icon-${item.path}-${i.path}`"></i>
            <span>{{i.authName}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapActions } from "vuex";
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
      return this.$route.path;
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