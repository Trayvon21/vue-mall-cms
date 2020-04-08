<template>
  <div>
    <el-card>
      <div>
        <el-input class="good-search" placeholder="请输入搜索内容" v-model="search" clearable>
          <el-button slot="append" icon="el-icon-search" @click="gotoSearch()"></el-button>
        </el-input>
        <el-button type="primary" @click="gotoAdd">添加商品</el-button>
      </div>
      <div>
        <el-table :data="goodsList" style="width: 100%" border>
          <el-table-column type="index" label="#" align="center"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="120" align="center"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" align="center" width="120"></el-table-column>
          <el-table-column label="创建时间" align="center" width="200">
            <template slot-scope="scope">{{ scope.row.add_time | dateFormat }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="primary" size="mini" icon="el-icon-edit-outline"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.pagenum"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const goodsModel = createNamespacedHelpers("goods");
const { mapState: goodsState, mapActions: goodsActions } = goodsModel;
export default {
  name: "Goods",
  data() {
    return {
      search: ""
    };
  },
  methods: {
    ...goodsActions(["getGoods"]),
    gotoAdd() {
      this.$router.push("/goods/addGoods");
    },
    handleSizeChange(e) {
      this.$store.state.goods.pages.pagesize = e;
      this.$store.state.goods.pages.pagenum = 1;
      this.getGoods("");
    },
    handleCurrentChange(e) {
      this.$store.state.goods.pages.pagenum = e;
      this.getGoods("");
    }
  },
  mounted() {
    this.getGoods("");
  },
  computed: {
    ...goodsState(["goodsList", "pages"])
  }
};
</script>

<style lang="scss" scoped>
.good-search {
  width: 700px;
  margin-right: 20px;
}
.el-table {
  margin: 20px 0;
}
</style>