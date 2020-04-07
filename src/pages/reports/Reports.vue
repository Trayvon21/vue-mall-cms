<template>
  <div>
    <el-card>
      <div id="main" class="line-chart"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapActions, mapState } from "vuex";
export default {
  name: "Reports",
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["getChartData"]),
    init() {
      let myChart = echarts.init(document.getElementById("main"));
      this.getChartData().then(() => {
        myChart.setOption(this.chartData);
        myChart.setOption(this.options);
      });
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState(["chartData"])
  }
};
</script>

<style lang="scss" scoped>
.line-chart{
  height: 400px;
  width: 750px;
}
</style>