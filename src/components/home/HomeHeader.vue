<template>
  <div class="flex a-center jc-between header-container">
    <div>欢迎来到长江商城后台管理系统</div>
    <div class="flex a-center jc-around header-right">
      <div>{{ time | timeFormat }}</div>
      <div v-if="weather" class="flex a-center">
        <div style="margin-right:10px">
          <img :src="dayFlag?weather.dayPictureUrl:weather.nightPictureUrl" alt />
        </div>
        <div>{{weather.weather}}</div>
      </div>
      <div>亲爱的，{{user.username}}</div>
      <el-button type="text" @click="exit">退出</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("user");
const { mapState: userState, mapActions: userActions } = userModule;
export default {
  name: "homeHeader",
  data() {
    return {
      time: "",
      user: "",
      timeId: "",
      dayFlag: true
    };
  },
  methods: {
    ...userActions(["getWeather"]),
    //退出登录
    exit() {
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("tabList");
      this.$message.success("期待您的下次登录！");
      this.$router.push("/login");
    },
    //显示时间
    setTime() {
      this.time = new Date();
      let dayOrNight = this.time.getHours();
      if (dayOrNight > 6 && dayOrNight < 18) {
        this.dayFlag = true;
      } else {
        this.dayFlag = false;
      }
      clearInterval(this.timeId);
      this.timeId = setInterval(() => {
        this.time = new Date();
      }, 1000);
    }
  },
  mounted() {
    this.getWeather();
    this.setTime();
    this.user = JSON.parse(localStorage.getItem("user"));
  },
  //销毁前清除定时器
  beforeDestroy() {
    clearInterval(this.timeId);
  },
  computed: {
    ...userState(["weather"])
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  height: 100%;
  color: #2e5e85;
}
.header-right {
  > div {
    margin: 0 10px;
  }
}
</style>