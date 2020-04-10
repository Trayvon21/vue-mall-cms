import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: Home,
    children: [
      {
        path: "",
        name: "index",
        component: () => import("../pages/index/Index"),
        meta: {
          title: "主页",
          isMeta: true,
          name: "index",
          icon: "el-icon-s-home",
          path: "/",
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
          name: "users",
          icon: "el-icon-user",
          path: "/users/users",
        },
      },
    ],
    meta: {
      icon: "el-icon-phone-outline",
      name: "users",
    },
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
          icon: "el-icon-lock",
          name: "rights",
          path: "/rights/rights",
        },
      },
      {
        path: "roles",
        name: "roles",
        component: () => import("../pages/rights/roles/Roles"),
        meta: {
          title: "角色列表",
          isMeta: true,
          icon: "el-icon-notebook-2",
          name: "roles",
          path: "/rights/roles",
        },
      },
    ],
    meta: {
      icon: "el-icon-key",
      name: "rights",
    },
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
          icon: "el-icon-shopping-bag-1",
          name: "goods",
          path: "/goods/goods",
        },
      },
      {
        path: "params",
        name: "params",
        component: () => import("../pages/goods/params/Params"),
        meta: {
          title: "分类参数",
          isMeta: true,
          icon: "el-icon-suitcase",
          name: "params",
          path: "/goods/params",
        },
      },
      {
        path: "categories",
        name: "categories",
        component: () => import("../pages/goods/categories/Categories"),
        meta: {
          title: "商品分类",
          isMeta: true,
          icon: "el-icon-shopping-cart-full",
          name: "categories",
          path: "/goods/categories",
        },
      },
      {
        path: "addGoods",
        name: "addGoods",
        component: () => import("../pages/goods/addGoods/AddGoods"),
        meta: {
          title: "添加商品",
          isMeta: true,
          icon: "el-icon-shopping-bag-1",
          name: "addGoods",
          path: "/goods/goods",
        },
      },
    ],
    meta: {
      icon: "el-icon-goods",
      name: "goods",
    },
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
          icon: "el-icon-wallet",
          name: "orders",
          path: "/orders/orders",
        },
      },
    ],
    meta: {
      name: "orders",
      icon: "el-icon-data-analysis",
    },
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
          icon: "el-icon-position",
          name: "reports",
          path: "/reports/reports",
        },
      },
    ],
    meta: {
      icon: "el-icon-data-analysis",
      name: "reports",
    },
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
  mode: "hash",
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
