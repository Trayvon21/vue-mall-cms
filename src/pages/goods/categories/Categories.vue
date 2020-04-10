<template>
  <div>
    <el-card>
      <div>
        <el-button type="primary" @click="addCate">添加分类</el-button>
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
          <el-button size="mini" type="primary" @click="editCate(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delCate(scope.row)">删除</el-button>
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
    <el-dialog :title="editCateFlag?'修改分类':'添加分类'" :visible.sync="addCateFlag" width="750px">
      <el-form :model="cateForm" ref="cateForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name" required>
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" v-if="!editCateFlag">
          <el-cascader
            :disabled="cateForm.cat_name===''"
            v-model="select"
            :options="fatherCateList"
            @change="handleChange"
            :props="props"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="submitAdd('cateForm')">确 定</el-button>
      </span>
    </el-dialog>
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
      ],
      addCateFlag: false,
      editCateFlag: false,
      cateForm: {
        cat_pid: "",
        cat_name: "",
        cat_level: ""
      },
      props: {
        label: "cat_name",
        value: "cat_id",
        checkStrictly: true
      },
      select: []
    };
  },
  methods: {
    ...cateActions([
      "getCategories",
      "addCategories",
      "delCategories",
      "editCategories"
    ]),
    handleSizeChange(e) {
      this.$store.state.categories.pages.pagesize = e;
      this.$store.state.categories.pages.pagenum = 1;
      this.getCategories(3);
    },
    handleCurrentChange(e) {
      this.$store.state.categories.pages.pagenum = e;
      this.getCategories(3);
    },
    handleChange(e) {
      this.cateForm.cat_pid = e[e.length - 1];
      this.cateForm.cat_level = e.length;
      console.log(this.cateForm);
    },
    submitAdd() {
      if (this.editCateFlag) {
        this.editCategories(this.cateForm);
        this.addCateFlag = false;
        this.editCateFlag = false;
        return;
      }
      if (this.cateForm.cat_level) {
        this.addCategories(this.cateForm);
        this.addCateFlag = false;
      } else {
        this.$message.error("内容不全");
      }
    },
    cancelAdd() {
      this.addCateFlag = false;
      this.editCateFlag = false;
    },
    addCate() {
      this.addCateFlag = true;
      for (let i in this.cateForm) {
        this.cateForm[i] = "";
      }
      this.getCategories(2);
    },
    editCate(row) {
      this.addCateFlag = true;
      this.editCateFlag = true;
      this.cateForm.cat_id = row.cat_id;
      this.cateForm.cat_name = row.cat_name;
    },
    delCate(row) {
      this.$confirm("此操作将永远删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delCategories(row.cat_id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.getCategories(3);
  },
  computed: {
    ...cateState(["categoriesList", "fatherCateList", "pages"])
  }
};
</script>

<style lang="scss" scoped>
.zk-table {
  margin: 20px 0;
}
</style>