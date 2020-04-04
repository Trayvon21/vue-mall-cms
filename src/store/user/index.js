import api from "../../http/api";
import { Message } from "element-ui";
import router from "../../router";
export default {
  namespaced: true,
  state: {
    user: null,
    weather: null,
    menus: null,
  },
  mutations: {
    getUser(state, data) {
      state.user = data;
    },
    setWeather(state, data) {
      state.weather = data;
    },
    setMenus(state, data) {
      console.log(data);
      state.menus = data;
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
  },
};
