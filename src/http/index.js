import axios from "axios";
import NProgress from "nprogress";
import { Message } from "element-ui";

// 判断当前环境是生产环境还是开发环境
// process.env.NODE_ENV的值决定当前环境
// production为生产环境 development为开发环境
const isProduction = process.env.NODE_ENV === "production";

// 创建axios配置对象
const service = axios.create();

// 接口基础路径
service.defaults.baseURL = isProduction ? "" : "/api";

// 超时时间
service.defaults.timeout = 10000;

// 请求拦截器
service.interceptors.request.use(
  config => {
    NProgress.start();
    let token = localStorage.getItem("adminToken");
    // 每次请求 都在请求头带上token
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  err => {
    NProgress.done();
    return Promise.reject(err);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    NProgress.done();
    return response.data;
  },
  err => {
    if (err.response.status === 401) {
      Message.error(err.response.data.msg);
    }
  }
);

export default service;
