import api from "../../http/api";
import { Message } from "element-ui";
import router from "../../router";
export default {
  namespaced: true,
  state: {
    user: null,
    weather: null,
    menus: null,
    userData: null,
    userTotal: null,
    userPagesize: 5,
    userPagenum: 1,
    rolesData: null,
  },
  mutations: {
    getUser(state, data) {
      state.user = data;
    },
    setWeather(state, data) {
      state.weather = data;
    },
    setMenus(state, data) {
      state.menus = data;
    },
    setUserData(state, data) {
      state.userData = data.users;
      state.userTotal = data.total;
      state.userPagenum = data.pagenum;
    },
    getRolesData(state, data) {
      console.log(data);
      state.rolesData = data;
    },
  },
  actions: {
    //登录
    async login({ commit }, params) {
      let res = await api.login(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        commit("getUser", res.data);
        router.push("/");
      }
    },
    //获取天气
    async getWeather({ commit }) {
      let res = await api.getWeather();
      if (res.status === "success") {
        commit("setWeather", res.results[0].weather_data[0]);
      }
    },
    //获取目录
    async getMenus({ commit }) {
      let res = await api.getMenus();
      if (res.meta.status === 200) {
        commit("setMenus", res.data);
      }
    },
    //获取用户信息
    async getUserData({ commit, state }, params) {
      let res = await api.userData({
        pagenum: state.userPagenum,
        pagesize: state.userPagesize,
        query: params,
      });
      if (res.meta.status === 200) {
        commit("setUserData", res.data);
      }
    },
    //添加用户信息
    async addUser({ dispatch }, params) {
      let res = await api.addUser(params);
      if (res.meta.status === 201) {
        Message.success(res.meta.msg);
        dispatch("getUserData", "");
      }
    },
    //改变用户状态
    async stateChange({ commit }, params) {
      let res = await api.stateChange(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
      }
    },
    //编辑用户
    async editUser({ dispatch }, params) {
      let res = await api.editUser(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getUserData", "");
      }
    },
    //删除用户
    async delUser({ dispatch }, params) {
      let res = await api.delUser(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getUserData", "");
      }
    },
    //分配角色
    async userRole({ dispatch }, params) {
      let res = await api.userRole(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getUserData", "");
      }
    },
    //获取角色列表
    async getRoles({ commit }, params) {
      let res = await api.getRoles(params);
      if (res.meta.status === 200) {
        commit("getRolesData", res.data);
      }
    },
  },
};
