import axios from "axios";
import NProgress from "nprogress";
import { Message } from "element-ui";
import "nprogress/nprogress.css";
// 判断当前环境是生产环境还是开发环境
// process.env.NODE_ENV的值决定当前环境
// production为生产环境 development为开发环境
const isProduction = process.env.NODE_ENV === "production";

// 创建axios配置对象
const service = axios.create();

// 接口基础路径
service.defaults.baseURL = isProduction
  ? "http://121.40.125.106:8888/api/private/v1/"
  : "/api";

// 超时时间
service.defaults.timeout = 10000;

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    NProgress.start();
    let token = localStorage.getItem("adminToken");
    // 每次请求 都在请求头带上token
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (err) => {
    NProgress.done();
    return Promise.reject(err);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    NProgress.done();
    console.log();
    if (response.data.meta.status !== 200) {
      Message.error(response.data.meta.msg);
    }
    return response.data;
  },
  (err) => {
    if (err.response.status === 401) {
      Message.error(err.response.data.msg);
    }
  }
);
//扩展jsonp
service.jsonp = (url) => {
  if (!url) {
    console.error("Axios.JSONP 至少需要一个url参数!");
    return;
  }
  return new Promise((resolve, reject) => {
    window.jsonCallBack = (result) => {
      resolve(result);
    };
    var JSONP = document.createElement("script");
    JSONP.type = "text/javascript";
    JSONP.src = `${url}&callback=jsonCallBack`;
    document.getElementsByTagName("head")[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(JSONP);
    }, 500);
  });
};

export default service;
