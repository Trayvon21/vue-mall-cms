<template>
  <div>
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
      <div class="cascader flex a-center">
        <span>选择商品分类:</span>
        <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="first">
            <el-button size="mini" type="primary">添加参数</el-button>
            <el-table>
              <el-table-column type="index" label="#" align="center"></el-table-column>
              <el-table-column type="expand" align="center">
                <template slot-scope="props"></template>
              </el-table-column>
              <el-table-column label="参数名称" align="center"></el-table-column>
              <el-table-column label="操作" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="second">
            <el-button size="mini" type="primary">添加属性</el-button>
            <el-table>
              <el-table-column type="index" label="#" align="center"></el-table-column>
              <el-table-column type="expand" align="center">
                <template slot-scope="props"></template>
              </el-table-column>
              <el-table-column label="参数名称" align="center"></el-table-column>
              <el-table-column label="操作" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      activeName: "first"
    };
  }
};
</script>

<style lang="scss" scoped>
.cascader {
  height: 40px;
  margin: 20px 0;
  span{
      font-size: 18px;
      margin-right: 10px;
  }
}
</style>