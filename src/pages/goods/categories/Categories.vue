<template>
  <div>
    <el-card>
      <div>
        <el-button type="primary">添加分类</el-button>
      </div>
      <zk-table
        class="zk-table"
        ref="table"
        index-text="#"
        :data="categoriesList"
        :columns="columns"
        border
        show-index
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="valid" slot-scope="scope">
          <i class="el-icon-success" @click="ss(scope)"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
        </template>
        <template slot="contorl" slot-scope="scope">
          <el-button size="mini" type="primary" @click="ss(scope)" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pagenum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pages.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const cateModel = createNamespacedHelpers("categories");
const { mapState: cateState, mapActions: cateActions } = cateModel;
export default {
  name: "Categories",
  data() {
    return {
      columns: [
        {
          label: "分类名称",
          headerAlign: "left",
          align: "left",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          headerAlign: "center",
          align: "center",
          type: "template",
          template: "valid"
        },
        {
          label: "排序",
          headerAlign: "center",
          align: "center",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          headerAlign: "center",
          align: "center",
          minWidth: "200px",
          type: "template",
          template: "contorl"
        }
      ]
    };
  },
  methods: {
    ...cateActions(["getCategories"]),
    handleSizeChange(e) {
      this.$store.state.categories.pages.pagesize = e;
      this.$store.state.categories.pages.pagenum = 1;
      this.getCategories(3);
    },
    handleCurrentChange(e) {
      this.$store.state.categories.pages.pagenum = e;
      this.getCategories(3);
    }
  },
  mounted() {
    this.getCategories(3);
  },
  computed: {
    ...cateState(["categoriesList", "pages"])
  }
};
</script>

<style lang="scss" scoped>
.zk-table {
  margin: 20px 0;
}
</style>