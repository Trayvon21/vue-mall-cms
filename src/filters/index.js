import Vue from "vue";
//引入dayjs
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

Vue.filter("timeFormat", function timeFormat(val) {
  return dayjs(val)
    .locale("zh-cn")
    .format("YYYY/MM/DD ah:mm:ss");
});

Vue.filter("dateFormat", function dateFormat(val) {
  return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
});
