<template>
  <div>
    <el-card>
      <div>
        <el-input class="order-search" placeholder="请输入搜索内容" v-model="search" clearable>
          <el-button slot="append" icon="el-icon-search" @click="gotoSearch()"></el-button>
        </el-input>
      </div>
      <div>
        <el-table :data="orderList" style="width: 100%" border>
          <el-table-column type="index" label="#" align="center"></el-table-column>
          <el-table-column label="订单编号" width="200" prop="order_number" align="center"></el-table-column>
          <el-table-column label="订单价格" prop="order_price" align="center"></el-table-column>
          <el-table-column label="是否付款" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_pay==='1'" type="success">已付款</el-tag>
              <el-tag v-else type="warning">未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send" align="center"></el-table-column>
          <el-table-column type="time" label="下单时间" align="center">
            <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改订单" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit-outline"
                  @click="showEdit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-location"
                  @click="editAddress(scope.row.consignee_addr)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看物流" placement="top">
                <el-button
                  @click="sendInfo()"
                  :type="scope.row.order_pay==='0'?'danger':'success'"
                  size="mini"
                  icon="el-icon-s-promotion"
                ></el-button>
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
    <!-- 编辑订单 -->
    <el-dialog title="编辑订单" :visible.sync="editOrdersFlag" width="750px">
      <el-form :model="orderForm" ref="orderForm" label-width="100px">
        <el-form-item label="订单ID" prop="oid">
          <el-input v-model="orderForm.oid" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model="orderForm.order_price" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-select v-model="orderForm.is_send" placeholder="请选择">
            <el-option
              v-for="item in sendOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="order_pay">
          <el-select v-model="orderForm.order_pay" placeholder="请选择">
            <el-option
              v-for="item in payTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('orderForm')">取 消</el-button>
        <el-button type="primary" @click="toEdite('orderForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑地址 -->
    <el-dialog title="编辑地址" :visible.sync="editAddressFlag" width="750px">
      <el-cascader style="width:100%" :options="cityOptions" :value="city"></el-cascader>
    </el-dialog>
    <!-- 查看物流 -->
    <el-dialog title="查看物流" :visible.sync="sendInfoFlag" width="500px">
      <el-timeline reverse v-if="sendInfoData">
        <el-timeline-item
          v-for="(item, index) in sendInfoData"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityOptions from "../../utils/provinces-china/city_data2017_element.js";
import { createNamespacedHelpers } from "vuex";
const orderModule = createNamespacedHelpers("order");
const { mapState: orderState, mapActions: orderActions } = orderModule;

export default {
  name: "Orders",
  data() {
    return {
      city: "",
      cityOptions: cityOptions,
      editAddressFlag: false,
      editOrdersFlag: false,
      sendInfoFlag: false,
      search: "",
      orderForm: {},
      payTypeOption: [
        {
          value: "0",
          label: "未付款"
        },
        {
          value: "1",
          label: "支付宝"
        },
        {
          value: "2",
          label: "微信"
        },
        {
          value: "3",
          label: "银行卡"
        }
      ],
      sendOptions: [
        {
          value: "否",
          label: "未发货"
        },
        {
          value: "是",
          label: "已发货"
        }
      ],
      payOptions: [
        {
          value: "0",
          label: "未付款"
        },
        {
          value: "1",
          label: "已付款"
        }
      ]
    };
  },
  methods: {
    ...orderActions([
      "getOrders",
      "editOrders",
      "getOrdersState",
      "findExpress"
    ]),
    gotoSearch() {
      if (this.search !== "") {
        this.getOrders(this.search);
      }
    },
    showEdit(row) {
      console.log(row);
      this.orderForm = {
        oid: row.order_id,
        is_send: row.is_send,
        order_pay: row.order_pay,
        order_price: row.order_price
      };
      this.editOrdersFlag = true;
    },
    toEdite(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editOrders(this.orderForm);
          this.editOrdersFlag = false;
        } else {
          this.$message.error("内容错误");
        }
      });
    },
    cancelEdit(formName) {
      this.editOrdersFlag = false;
      this.$refs[formName].resetFields();
    },
    editAddress(address) {
      this.city = address;
      this.editAddressFlag = true;
    },
    sendInfo() {
      this.findExpress();
      this.sendInfoFlag = true;
    },
    handleSizeChange(e) {
      this.$store.state.order.pages.pagesize = e;
      this.$store.state.order.pages.pagenum = 1;
      this.getOrders();
    },
    handleCurrentChange(e) {
      this.$store.state.order.pages.pagenum = e;
      this.getOrders();
    }
  },
  mounted() {
    this.getOrders();
  },
  computed: {
    ...orderState(["orderList", "pages", "sendInfoData"])
  }
};
</script>

<style lang="scss" scoped>
.order-search {
  width: 300px;
}
.el-table {
  margin: 20px 0;
}
</style>