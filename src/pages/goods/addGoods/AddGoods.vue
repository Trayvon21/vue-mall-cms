<template>
  <div>
    <el-card>
      <el-alert title="添加用户信息" center type="info" show-icon :closable="false"></el-alert>
      <div class="step-box">
        <el-steps :active="active" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <div class="flex">
        <el-tabs tab-position="left" @tab-click="changeAction" :value="String(active)">
          <el-tab-pane name="0" label="基本信息">
            <el-form ref="form" :model="infoForm" label-width="80px">
              <el-form-item label="商品名称" required>
                <el-input v-model="infoForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" required>
                <el-input v-model="infoForm.goods_price" :disabled="!infoForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" required>
                <el-input v-model="infoForm.goods_weight" :disabled="!infoForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" required>
                <el-input v-model="infoForm.goods_number" :disabled="!infoForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-cascader
                  :disabled="!infoForm.goods_number"
                  v-model="infoForm.goods_cat"
                  :options="categoriesList"
                  @change="handleChange"
                  :props="props"
                ></el-cascader>
              </el-form-item>
            </el-form>
            <el-button
              class="bottom-"
              v-if="infoForm.goods_cat"
              size="mini"
              type="success"
              @click="active++"
            >下一步</el-button>
          </el-tab-pane>
          <el-tab-pane :disabled="disabledFlag.tab1" name="1" label="商品参数">
            <div v-if="attributesList.length>0">
              <div v-for="item in attributesList" :key="item.attr_id">
                <div>{{item.attr_name}}</div>
                <div>
                  <el-radio
                    v-model="radio"
                    :label="i"
                    v-for="i in item.attr_vals"
                    :key="i.id"
                    @change="changeAttrs(i,item.attr_id)"
                  >
                    <el-tag>{{i}}</el-tag>
                  </el-radio>
                </div>
              </div>
            </div>
            <div v-else>暂无参数</div>
            <el-button v-if="infoForm.goods_cat" size="mini" type="success" @click="active++">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane :disabled="disabledFlag.tab2" name="2" label="商品属性">
            <div class="attr-box" v-if="attributesListOnly.length>0">
              <div v-for="item in attributesListOnly" :key="item.attr_id">
                <div>{{item.attr_name}}</div>
                <el-input v-model="item.attr_vals"></el-input>
              </div>
            </div>
            <div v-else>暂无属性</div>
            <el-button v-if="infoForm.goods_cat" size="mini" type="success" @click="active++">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane :disabled="disabledFlag.tab3" name="3" label="商品图片">
            <el-upload
              class="upload-demo"
              drag
              action="/api/upload"
              multiple
              :headers="headers"
              :on-success="onSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-button v-if="infoForm.goods_cat" size="mini" type="success" @click="active++">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane :disabled="disabledFlag.tab4" name="4" label="商品内容">
            <mavon-editor v-model="infoForm.goods_introduce" />
            <el-button type="primary" @click="submit">提交</el-button>
          </el-tab-pane>
        </el-tabs>
        <div></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const goodsModel = createNamespacedHelpers("goods");
const { mapState: goodsState, mapActions: goodsActions } = goodsModel;
export default {
  name: "AddGoods",
  data() {
    return {
      active: 0,
      tabsIndex: "tab1",
      radio: "",
      infoForm: {
        goods_name: null,
        goods_cat: null,
        goods_price: null,
        goods_number: null,
        pics: null,
        goods_weight: null,
        goods_introduce: "",
        attrs: [
          {
            attr_id: null,
            attr_value: null
          },
          {
            attr_id: null,
            attr_value: null
          }
        ]
      },
      props: {
        label: "cat_name",
        value: "cat_id"
      },
      disabledFlag: {
        tab1: true,
        tab2: true,
        tab3: true,
        tab4: true
      },
      headers: {}
    };
  },
  methods: {
    ...goodsActions(["getCategories", "getAttributes", "addGoods"]),
    changeAction(e) {
      this.active = Number(e.name);
    },
    handleChange(e) {},
    changeAttrs(i, id) {
      this.infoForm.attrs[0] = {
        attr_id: id,
        attr_value: i
      };
      this.radio = i;
      console.log(this.infoForm.attrs[0].attr_value, i);
      console.log(this.infoForm.attrs);
    },
    onSuccess(e) {
      this.infoForm.pics = [{ pic: e.data.tmp_path }];
    },
    submit() {
      if (this.infoForm.goods_cat instanceof Array) {
        this.infoForm.goods_cat = this.infoForm.goods_cat.join(",");
      }
      this.addGoods(this.infoForm);
    }
  },
  mounted() {
    this.headers = { Authorization: localStorage.getItem("adminToken") };
    this.getCategories();
    console.log(this.categoriesList);
  },
  watch: {
    active(val) {
      this.disabledFlag[`tab${val}`] = false;
      if (val === 1) {
        let cat = this.infoForm.goods_cat;
        this.getAttributes({ id: cat[cat.length - 1] });
      }
    }
  },
  computed: {
    ...goodsState(["categoriesList", "attributesList", "attributesListOnly"])
  }
};
</script>

<style lang="scss" scoped>
.step-box {
  margin: 20px;
  height: 50px;
}
.el-tag {
  margin: 5px;
}
.el-tabs {
  height: 400px;
  width: 100%;
  position: relative;
  .el-tab-pane {
    height: 400px;
    width: 100%;
  }
  .el-button {
    position: absolute;
    bottom: 0px;
    left: 10px;
  }
}
.attr-box {
  height: 360px;
  overflow: hidden;
  overflow-y: scroll;
}
</style>