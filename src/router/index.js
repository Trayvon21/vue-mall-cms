import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "",
        name: "index",
        component: () => import("../pages/index/Index"),
        meta: {
          title: "主页",
          isMeta: true,
        },
      },
    ],
  },
  //用户管理
  {
    path: "/users",
    component: Home,
    children: [
      {
        path: "users",
        name: "users",
        component: () => import("../pages/users/Users"),
        meta: {
          title: "用户列表",
          isMeta: true,
        },
      },
    ],
  },
  //权限管理
  {
    path: "/rights",
    component: Home,
    children: [
      {
        path: "rights",
        name: "rights",
        component: () => import("../pages/rights/Rights"),
        meta: {
          title: "权限列表",
          isMeta: true,
        },
      },
      {
        path: "roles",
        name: "roles",
        component: () => import("../pages/rights/roles/Roles"),
        meta: {
          title: "角色列表",
          isMeta: true,
        },
      },
    ],
  },
  //商品管理
  {
    path: "/goods",
    component: Home,
    children: [
      {
        path: "goods",
        name: "goods",
        component: () => import("../pages/goods/Goods"),
        meta: {
          title: "商品列表",
          isMeta: true,
        },
      },
      {
        path: "params",
        name: "params",
        component: () => import("../pages/goods/params/Params"),
        meta: {
          title: "分类参数",
          isMeta: true,
        },
      },
      {
        path: "categories",
        name: "categories",
        component: () => import("../pages/goods/categories/Categories"),
        meta: {
          title: "商品分类",
          isMeta: true,
        },
      },
    ],
  },

  //订单管理
  {
    path: "/orders",
    component: Home,
    children: [
      {
        path: "orders",
        name: "orders",
        component: () => import("../pages/orders/Orders"),
        meta: {
          title: "订单列表",
          isMeta: true,
        },
      },
    ],
  },
  //数据统计
  {
    path: "/reports",
    component: Home,
    children: [
      {
        path: "reports",
        name: "reports",
        component: () => import("../pages/reports/Reports"),
        meta: {
          title: "数据报表",
          isMeta: true,
        },
      },
    ],
  },
  //登录
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/login/Login"),
    meta: {
      title: "登录",
      isMeta: true,
    },
  },
  {
    path: "*",
    name: "404",
    component: () => import("../pages/err/404"),
    meta: {
      title: "404",
      isMeta: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (!localStorage.getItem("adminToken") && to.path !== "/login") {
    next("/login");
  } else next();
});

export default router;
