<template>
  <div>
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
      <div class="cascader flex a-center">
        <span>选择商品分类:</span>
        <el-cascader
          v-model="value"
          :options="categoriesList"
          @change="handleChange"
          :props="props"
        ></el-cascader>
      </div>
      <div>
        <el-tabs v-model="manyForm.attr_sel" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button size="mini" type="primary" @click="showDialog" :disabled="value===''">添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button size="mini" type="primary" @click="showDialog" :disabled="value===''">添加属性</el-button>
          </el-tab-pane>
          <paramsTable
            :tableData="tableData"
            @inputEditTag="inputEditTag"
            @todelTag="todelTag"
            @delAttr="delAttr"
            @changeAttr="changeAttr"
          ></paramsTable>
        </el-tabs>
      </div>
    </el-card>
    <el-dialog :title="editArrt?'修改参数':'添加参数'" :visible.sync="addManyFlag" width="750px">
      <el-form :model="manyForm" ref="manyForm" label-width="100px">
        <el-form-item :label="manyForm.attr_sel==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="manyForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="info" @click="addManyFlag=false">取消</el-button>
          <el-button type="primary" @click="addMany('manyForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import paramsTable from "../../../components/goods/ParamsTable";
import { createNamespacedHelpers } from "vuex";
const goodsModel = createNamespacedHelpers("goods");
const { mapState: goodsState, mapActions: goodsActions } = goodsModel;
export default {
  name: "Params",
  components: {
    paramsTable
  },
  data() {
    return {
      value: "",
      props: {
        label: "cat_name",
        value: "cat_id"
      },
      manyForm: {
        attr_name: "",
        attrid: "",
        id: "",
        attr_sel: "many",
        attr_vals: ""
      },
      addManyFlag: false,
      editArrt: false,
      tableData: [],
      space: ","
    };
  },
  methods: {
    ...goodsActions([
      "getCategories",
      "getAttributes",
      "addAttributes",
      "editAttributes",
      "delAttributes"
    ]),
    handleChange(e) {
      this.manyForm.id = e[e.length - 1];
      this.manyForm.attr_sel = "many";
      this.getAttributes({ id: this.manyForm.id, sel: "many" });
    },
    handleClick(e) {
      this.tableData = [];
      this.manyForm.attr_sel = e.name;
      this.getAttributes({ id: this.manyForm.id, sel: e.name });
    },
    showDialog() {
      this.manyForm.attr_name = "";
      this.addManyFlag = true;
      this.addManyFlag = true;
    },
    todelTag({ row, tag }) {
      console.log(row, tag);
      let attr_vals = row.attr_vals.filter(item => item !== tag);
      this.manyForm.attr_vals = attr_vals.join(this.space);
      this.manyForm.attr_name = row.attr_name;
      this.manyForm.attrid = row.attr_id;
      this.editAttributes(this.manyForm);
    },
    inputEditTag({ row, tagValue }) {
      console.log(row, tagValue);
      if (tagValue !== "") {
        let attr_vals = row.attr_vals;
        attr_vals.push(tagValue);
        this.manyForm.attr_vals = attr_vals.join(this.space);
        this.manyForm.attr_name = row.attr_name;
        this.manyForm.attrid = row.attr_id;
        this.editAttributes(this.manyForm);
      }
    },
    addMany(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editArrt) {
            this.manyForm.type = true;
            this.editAttributes(this.manyForm);
          } else {
            this.addAttributes(this.manyForm);
          }
        } else {
          this.$message.error("内容错误");
        }
        this.addManyFlag = false;
      });
    },
    delAttr(data) {
      this.$confirm("此操作将永远删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delAttributes(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    changeAttr(row) {
      this.addManyFlag = true;
      this.editArrt = true;
      this.manyForm = {
        id: row.cat_id,
        attrid: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(this.space)
      };
    }
  },
  watch: {
    attributesList(val) {
      if (this.manyForm.attr_sel === "many") {
        this.tableData = val;
      }
    },
    attributesListOnly(val) {
      if (this.manyForm.attr_sel === "only") {
        this.tableData = val;
      }
    },
    manyForm(val) {
      if (val.attr_sel === "many") {
        this.space = ",";
      } else {
        this.space = " ";
      }
    }
  },
  mounted() {
    this.getCategories();
  },
  computed: {
    ...goodsState(["categoriesList", "attributesList", "attributesListOnly"])
  }
};
</script>

<style lang="scss" scoped>
.cascader {
  height: 40px;
  margin: 20px 0;
  span {
    font-size: 18px;
    margin-right: 10px;
  }
}
</style>