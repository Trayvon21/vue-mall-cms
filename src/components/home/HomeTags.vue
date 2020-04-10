<template>
  <div class="flex a-center position-re" ref="tags">
    <div v-show="flag" class="right-click" ref="rightClick">
      <div v-for="item in rightClick" :key="item.type" @click="toClose(item.type)">{{item.name}}</div>
    </div>
    <div
      class="tag-each flex a-center"
      :class="active===item.path?'active':''"
      v-for="(item,index) in tabList"
      :key="item.path"
      :ref="`tag${index}`"
      @click="goto(item.path)"
      @contextmenu.prevent="show($event,index)"
      :draggable="true"
      @drag="dragto($event,index)"
    >
      <div v-if="active===item.path" class="circle"></div>
      <div>{{item.name}}</div>
      <div
        v-if="active===item.path&&!(tabList.length===1&&tabList[0].path==='/index')"
        @click.stop="delTag(item.path,index)"
      >
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeTags",
  data() {
    return {
      tags: null,
      tabList: [],
      flag: false,
      select: null,
      rightClick: [
        { name: "关闭其他", type: "0" },
        { name: "关闭左侧", type: "1" },
        { name: "关闭右侧", type: "2" }
      ]
    };
  },
  methods: {
    //跳转标签
    goto(path) {
      if (this.$route.path !== path) this.$router.push(path);
    },
    //删除标签
    delTag(path, index) {
      if (this.tabList.length === 1) {
        this.tabList = [
          {
            path: "/index",
            name: "主页"
          }
        ];
        localStorage.setItem("tabList", JSON.stringify(this.tabList));
      } else {
        this.tabList = this.tabList.filter(item => item.path !== path);
      }
      if (index > this.tabList.length - 1) {
        this.$router.push(this.tabList[index - 1].path);
      } else {
        if (this.$route.path !== this.tabList[index].path) {
          this.$router.push(this.tabList[index].path);
        }
      }
    },
    //显示标签
    show(e, select) {
      this.flag = true;
      const { offsetTop, offsetLeft } = this.$refs.tags;
      this.$refs.rightClick.style.top = e.clientY - offsetTop + "px";
      this.$refs.rightClick.style.left = e.clientX - offsetLeft + "px";
      this.select = select;
    },
    //关闭标签
    toClose(type) {
      if (type === "0") {
        this.tabList = [this.tabList[this.select]];
      } else if (type === "1") {
        this.tabList = this.tabList.filter(
          (item, index) => index >= this.select
        );
      } else if (type === "2") {
        this.tabList = this.tabList.filter(
          (item, index) => index <= this.select
        );
      }
      //跳转
      if (type === "2") {
        if (this.tabList[this.select].path !== this.$route.path) {
          this.$router.push(this.tabList[this.select].path);
        }
      } else {
        if (this.tabList[0].path !== this.$route.path) {
          this.$router.push(this.tabList[0].path);
        }
      }
      this.flag = false;
    },
    //拓拽效果
    dragto(e, index) {
      if (e.x !== 0) {
        let left = e.clientX - this.$refs.tags.offsetLeft;
        let arr = [];
        this.tabList.map((item, i) => {
          arr.push(this.$refs[`tag${i}`][0].offsetLeft);
        });
        if (left > arr[arr.length - 1]) {
          this.tabList[index] = this.tabList.splice(
            arr.length - 1,
            1,
            this.tabList[index]
          )[0];
        } else if (left < 0) {
          this.tabList[index] = this.tabList.splice(
            0,
            1,
            this.tabList[index]
          )[0];
        } else {
          for (let i in arr) {
            if (arr[i] < left && arr[Number(i) + 1] > left && i !== index) {
              this.tabList[index] = this.tabList.splice(
                i,
                1,
                this.tabList[index]
              )[0];
              return;
            }
          }
        }
      }
    }
  },
  watch: {
    //监听路由变化并改变tabList值
    $route(route) {
      let tabList = JSON.parse(localStorage.getItem("tabList"));
      if (!tabList.some(item => item.path === route.path)) {
        tabList.push({
          path: route.path,
          name: route.meta.title
        });
        this.tabList = tabList;
      }
    },
    //监听tabList变化，保存到本地
    tabList(val) {
      localStorage.setItem("tabList", JSON.stringify(val));
    }
  },
  mounted() {
    //初始化tablist
    if (!localStorage.getItem("tabList")) {
      this.tabList = [{ path: this.$route.path, name: this.$route.meta.title }];
    } else {
      this.tabList = JSON.parse(localStorage.getItem("tabList"));
    }
    //空白位置单击关闭右键窗口
    this.$bus.$on("closeRightClick", () => {
      this.flag = false;
    });
  },
  computed: {
    active() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-each {
  white-space: nowrap;
  border: 1px solid #ddd;
  font-size: 12px;
  padding: 2px 10px;
  margin-right: 5px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.circle {
  height: 8px;
  width: 8px;
  margin: 4px;
  border-radius: 50%;
  background: white;
}
.right-click {
  position: absolute;
  background: #fff;
  -webkit-box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  color: #333;
  border-radius: 4px;
  font-size: 12px;
  padding: 5px;
  z-index: 9999;
  cursor: pointer;
  > div {
    padding: 7px 5px;
    z-index: 9999;
  }
}
.active {
  background: #409eff;
  color: #fff;
}
</style>