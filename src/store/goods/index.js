import api from "../../http/api";
import router from "../../router/";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: {
    pages: {
      pagenum: 1,
      pagesize: 10,
      total: 0,
    },
    goodsList: [],
    categoriesList: [],
    attributesList: [],
    attributesListOnly: [],
  },
  mutations: {
    //获取商品列表
    getGoodsList(state, data) {
      state.goodsList = data.goods;
      state.pages.pagenum = Number(data.pagenum);
      state.pages.total = data.total;
      console.log(state.pages);
    },
    //获取分类列表
    getCategoriesList(state, data) {
      console.log(data);
      state.categoriesList = data;
    },
    getAttributesList(state, { data, sel }) {
      if (sel === "only") {
        data.map((item) => {
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(" ");
          } else {
            item.attr_vals = [];
          }
        });
        state.attributesListOnly = data;
      } else {
        data.map((item) => {
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(",");
          } else {
            item.attr_vals = [];
          }
        });
        state.attributesList = data;
        console.log(data);
      }
    },
    editAttributes(state, { data, sel }) {
      console.log(state, data);
      let arr = [];
      if (sel === "many") {
        state.attributesList.map((item) => {
          if (item.attr_id === data.attr_id) {
            item = data;
            item.attr_name = data.attr_name;
            if (item.attr_vals !== "") {
              item.attr_vals = data.attr_vals.split(",");
            } else {
              item.attr_vals = [];
            }
          }
        });
      } else {
        state.attributesListOnly.map((item) => {
          if (item.attr_id === data.attr_id) {
            item = data;
            item.attr_name = data.attr_name;
            if (item.attr_vals !== "") {
              item.attr_vals = data.attr_vals.split(" ");
            } else {
              item.attr_vals = [];
            }
          }
        });
      }
    },
  },
  actions: {
    //获取商品列表
    async getGoods({ commit, state }, query) {
      let res = await api.getGoods({
        pagenum: state.pages.pagenum,
        pagesize: state.pages.pagesize,
        query,
      });
      if (res.meta.status === 200) {
        commit("getGoodsList", res.data);
      }
    },
    //获取分类
    async getCategories({ commit }) {
      let res = await api.getCategories({ type: 3 });
      if (res.meta.status === 200) {
        commit("getCategoriesList", res.data);
      }
    },
    //获取参数
    async getAttributes({ commit }, params) {
      let res = await api.getAttributes(params);
      if (res.meta.status === 200) {
        commit("getAttributesList", { data: res.data, sel: params.sel });
      }
    },
    //添加动态参数或者静态属性
    async addAttributes({ dispatch }, params) {
      let res = await api.addAttributes(params);
      if (res.meta.status === 201) {
        Message.success(res.meta.msg);
        await dispatch("getAttributes", {
          id: params.id,
          sel: params.attr_sel,
        });
      }
    },
    //编辑参数
    async editAttributes({ commit, dispatch }, params) {
      let res = await api.editAttributes(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        commit("editAttributes", { data: res.data, sel: params.attr_sel });
        if (params.type) {
          dispatch("getAttributes", { id: params.id, sel: params.attr_sel });
        }
      }
    },
    //删除参数
    async delAttributes({ dispatch }, params) {
      let res = await api.delAttributes(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getAttributes", params);
      }
    },
    //添加商品
    async addGoods({ dispatch }, params) {
      let res = await api.addGoods(params);
      if (res.meta.status) {
        dispatch("getGoods", "");
        router.push("/goods/goods");
      }
    },
    //删除商品
    async delGood({ dispatch }, gid) {
      let res = await api.delGood(gid);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getGoods", "");
      }
    },
    async editGood({ dispatch }, params) {
      let res = await api.editGood(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getGoods", "");
      }
    },
  },
};
