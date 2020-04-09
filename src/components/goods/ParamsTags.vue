<template>
  <div>
    <el-tag
      :key="index"
      v-for="(tag,index) in row.attr_vals"
      closable
      :disable-transitions="false"
      @close="todelTag(row,tag)"
    >{{tag}}</el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="tagValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="inputEditTag(row)"
      @blur="inputEditTag(row)"
    ></el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>

<script>
export default {
  name: "ParamsTags",
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      inputVisible: false,
      tagValue: ""
    };
  },
  methods: {
    todelTag(row, tag) {
      this.$emit("delTag", { row, tag });
    },
    inputEditTag(row) {
      this.$emit("editTag", { row, tagValue: this.tagValue });
      this.inputVisible = false;
      this.tagValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 5px;
}
</style>