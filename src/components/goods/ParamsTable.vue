<template>
  <div>
    <el-table :data="tableData">
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <paramsTags @editTag="inputEditTag" @delTag="todelTag" :row="props.row"></paramsTags>
        </template>
      </el-table-column>
      <el-table-column label="参数名称" prop="attr_name" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit-outline"
            @click="toChange(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="todelAttr(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import paramsTags from "./ParamsTags";
export default {
  name: "paramsTable",
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    paramsTags
  },
  data() {
    return {
      addManyFlag: false
    };
  },
  methods: {
    inputEditTag(data) {
      console.log(data);
      this.$emit("inputEditTag", data);
    },
    todelTag(data) {
      console.log(data);
      this.$emit("todelTag", data);
    },
    todelGood(id) {
      this.$emit("todelGood", id);
    },
    todelAttr(row) {
      this.$emit("delAttr", {
        id: row.cat_id,
        attrid: row.attr_id,
        sel: row.attr_sel
      });
    },
    toChange(row) {
      this.$emit("changeAttr", row);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>