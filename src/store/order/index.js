import api from "../../http/api";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: {
    orderList: null,
    pages: {
      total: 0,
      pagenum: 1,
      pagesize: 10,
    },
    sendInfoData: null,
  },
  mutations: {
    getOrdersData(state, data) {
      state.orderList = data.goods;
      state.pages = {
        total: data.total,
        pagenum: Number(data.pagenum),
        pagesize: state.pages.pagesize,
      };
    },
    getSendInfo(state, data) {
      state.sendInfoData = data;
      console.log(data);
    },
  },
  actions: {
    //获取订单列表
    async getOrders({ commit, state }, query) {
      if (query) {
        state.pages.pagenum = 1;
      }
      let res = await api.getOrders({
        pagenum: state.pages.pagenum,
        pagesize: state.pages.pagesize,
        query,
      });
      if (res.meta.status === 200) {
        commit("getOrdersData", res.data);
      }
    },
    //编辑订单列表
    async editOrders({ dispatch }, params) {
      let res = await api.editOrders(params);
      if (res.meta.status === 201) {
        dispatch("getOrders");
      }
    },
    async getOrdersState({ dispatch }, params) {
      let res = await api.getOrdersState(params);
      if (res.meta.status === 200) {
        console.log(res);
      }
    },
    async findExpress({ commit }) {
      let res = await api.findExpress("804909574412544600");
      if (res.meta.status === 200) {
        commit("getSendInfo", res.data);
      }
    },
  },
};
