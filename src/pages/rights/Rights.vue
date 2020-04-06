<template>
  <div>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
        <el-table-column prop="authName" label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const rightModel = createNamespacedHelpers("right");
const { mapState: rightState, mapActions: rightActions } = rightModel;
export default {
  name: "Rights",
  data() {
    return {};
  },
  methods: {
    ...rightActions(["getRightsList"])
  },
  mounted() {
    this.getRightsList("list");
  },
  computed: {
    ...rightState(["rightsList"])
  }
};
</script>

<style lang="scss" scoped>
</style>