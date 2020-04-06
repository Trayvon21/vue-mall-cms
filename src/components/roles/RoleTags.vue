<template>
  <div>
    <div v-if="data.length>0">
      <div v-for="firsts in data" :key="firsts.id" class="flex a-center">
        <div class="tag-first">
          <el-tag closable @close="delRoleAuth(firsts.id)">{{firsts.authName}}</el-tag>
          <i class="el-icon-caret-right"></i>
        </div>
        <div style="flex:4">
          <div
            v-for="seconds in firsts.children"
            :key="seconds.id"
            class="flex a-center tag-seconds"
          >
            <div class="tag-second">
              <el-tag closable type="success" @close="delRoleAuth(seconds.id)">{{seconds.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </div>
            <div class="tag-thirds flex a-center flex-wrap">
              <div v-for="thirds in seconds.children" :key="thirds.id" class="tag-third">
                <el-tag closable type="warning" @close="delRoleAuth(thirds.id)">{{thirds.authName}}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>暂无权限</div>
  </div>
</template>

<script>
export default {
  name: "RoleTags",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    roleId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    delRoleAuth(ridAuth) {
      this.$confirm("此操作将删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("todelRoleAuth", {
            roleId: this.roleId,
            rightId: ridAuth
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-first,
.tag-second {
  flex: 1;
  margin: 20px;
  white-space: nowrap;
}
.tag-seconds {
  border-bottom: 1px solid #ededed;
}
.tag-thirds {
  flex: 4;
}
.tag-third {
  margin: 20px;
}
</style>