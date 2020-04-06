import api from "../../http/api";
import router from "../../router";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: {
    rolesData: null,
    roleTreeList: null,
    rightsList: null,
  },
  mutations: {
    getRolesData(state, data) {
      state.rolesData = data;
      console.log(data);
    },
    todelRoleAuth(state, data) {
      state.rolesData.map((item) => {
        if ((item.id = data.roleId)) {
          item.children = data.data;
        }
      });
    },
    getRoleTreeList(state, data) {
      state.roleTreeList = data;
      console.log(data);
    },
    getRightsList(state, data) {
      state.rightsList = data;
      console.log(data);
    },
  },
  actions: {
    //获取权限列表
    async getRoles({ commit }) {
      let res = await api.getRoles();
      if (res.meta.status === 200) {
        commit("getRolesData", res.data);
      }
    },
    //添加角色
    async addRole({ dispatch }, params) {
      let res = await api.addRole(params);
      if (res.meta.status === 201) {
        Message.success(res.meta.msg);
        dispatch("getRoles");
      }
    },
    //编辑角色
    async editRole({ dispatch }, params) {
      let res = await api.editRole(params);
      if (res.meta.status === 200) {
        Message.success("修改成功");
        dispatch("getRoles");
      }
    },
    //删除角色
    async delRole({ dispatch }, params) {
      let res = await api.delRole(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        dispatch("getRoles");
      }
    },
    //获取角色权限列表
    async getRightsList({ commit }, params) {
      let res = await api.rightsList(params);
      if (params === "tree") {
        if (res.meta.status === 200) {
          commit("getRoleTreeList", res.data);
        }
      } else {
        if (res.meta.status === 200) {
          commit("getRightsList", res.data);
        }
      }
    },
    //角色授权
    async roleAuth({ dispatch }, params) {
      let res = await api.roleAuth(params);
      if (res.meta.status === 200) {
        Message.success("修改成功");
        dispatch("getRoles");
      }
    },
    //删除角色指定授权
    async delRoleAuth({ commit }, params) {
      let res = await api.delRoleAuth(params);
      if (res.meta.status === 200) {
        Message.success(res.meta.msg);
        commit("todelRoleAuth", { roleId: params.roleId, data: res.data });
      }
    },
  },
};
