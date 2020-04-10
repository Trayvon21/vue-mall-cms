import api from "../../http/api";
import { Message } from "element-ui";
// function findChild(arr, id) {
//   console.log(arr);
//   arr.map((item, index) => {
//     if (item.cat_id === id) {
//       arr.splice(index, 1);
//     }
//     if (item.children && item.children.length > 0) {
//       findChild(item.children, id);
//     }
//   });
// }
export default {
  namespaced: true,
  state: {
    pages: {
      pagenum: 1,
      pagesize: 5,
      total: 0,
    },
    categoriesList: [],
    fatherCateList: [],
  },
  mutations: {
    getCategoriesList(state, data) {
      state.categoriesList = data.result;
      state.pages.pagenum = data.pagenum + 1;
      state.pages.total = data.total;
    },
    getFatherCateList(state, data) {
      state.fatherCateList = data;
    },
    // delCategories(state, data) {
    //   findChild(state.categoriesList, data);
    // },
  },
  actions: {
    async getCategories({ commit, state }, type) {
      if (type === 3) {
        let res = await api.getCategories({
          pagenum: state.pages.pagenum,
          pagesize: state.pages.pagesize,
          type,
        });
        if (res.meta.status === 200) {
          commit("getCategoriesList", res.data);
        }
      } else if (type === 2) {
        let res = await api.getCategories({ type });
        if (res.meta.status === 200) {
          commit("getFatherCateList", res.data);
        }
      }
    },
    async addCategories({ dispatch }, params) {
      let res = await api.addCategories(params);
      if (res.meta.status === 201) {
        Message.success(res.meta.msg);
        dispatch("getCategories", 3);
      }
    },
    async delCategories({ dispatch }, id) {
      let res = await api.delCategories(id);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getCategories", 3);
      }
    },
    async editCategories({dispatch},params){
      let res = await api.editCategories(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getCategories", 3);
      }
    }
  },
};
