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
            <el-button
              size="mini"
              type="primary"
              @click="addManyFlag=true"
              :disabled="value===''"
            >添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button
              size="mini"
              type="primary"
              @click="addManyFlag=true"
              :disabled="value===''"
            >添加属性</el-button>
          </el-tab-pane>
          <paramsTable :tableData="tableData" @inputEditTag="inputEditTag" @todelTag="todelTag"></paramsTable>
        </el-tabs>
      </div>
    </el-card>
    <el-dialog title="添加参数" :visible.sync="addManyFlag" width="750px">
      <el-form :model="manyForm" ref="manyForm" label-width="100px" :rules="rules">
        <el-form-item :label="manyForm.attr_sel==='many'?'动态参数':'静态属性'" prop="attr_name" required>
          <el-input v-model="manyForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="info">取消</el-button>
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
      activeName: "first",
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
      rules: {
        name: [{ required: true, message: "不能为空", target: "blur" }]
      },
      addManyFlag: false,
      tableData: []
    };
  },
  methods: {
    ...goodsActions([
      "getCategories",
      "getAttributes",
      "addAttributes",
      "editAttributes"
    ]),
    handleChange(e) {
      this.manyForm.id = e[e.length - 1];
      this.getAttributes({ id: this.manyForm.id, sel: "many" }).then(() => {
        this.tableData = this.attributesList;
      });
    },
    handleClick(e) {
      this.tableData = [];
      this.manyForm.attr_sel = e.name;
      this.getAttributes({ id: this.manyForm.id, sel: e.name }).then(() => {
        e.name === "many"
          ? (this.tableData = this.attributesList)
          : (this.tableData = this.attributesListOnly);
      });
    },
    todelTag({ row, tag }) {
      console.log(row, tag);
      let space = this.manyForm.attr_sel === "many" ? "," : " ";
      let attr_vals = row.attr_vals.filter(item => item !== tag);
      this.manyForm.attr_vals = attr_vals.join(space);
      this.manyForm.attr_name = row.attr_name;
      this.manyForm.attrid = row.attr_id;
      this.editAttributes(this.manyForm);
    },

    inputEditTag({ row, tagValue }) {
      console.log(row, tagValue);
      if (tagValue !== "") {
        let attr_vals = row.attr_vals;
        attr_vals.push(tagValue);
        let space = this.manyForm.attr_sel === "many" ? "," : " ";
        this.manyForm.attr_vals = attr_vals.join(space);
        this.manyForm.attr_name = row.attr_name;
        this.manyForm.attrid = row.attr_id;
        this.editAttributes(this.manyForm);
      }
    },
    addMany(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addAttributes(this.manyForm);
        }
      });
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