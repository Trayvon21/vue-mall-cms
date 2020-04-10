<template>
  <div class="login-container flex jc-center a-center">
    <div class="login-box">
      <h2 class="login-top">长江商城后台管理系统</h2>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="login-main"
      >
        <el-form-item label="请输入用户名" prop="username" :required="true">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="请输入密码" prop="password" :required="true">
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <div class="msg">特别提醒: 如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。</div>
        <el-form-item class="bottom-btn">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("user");
const { mapState: userState, mapActions: userActions } = userModule;
export default {
  name: "Login",
  data() {
    return {
      ruleForm: { username: "", password: "" },
      rules: {
        username: [
          { required: true, message: "账号不能为空", target: "blur" },
          { min: 4, max: 16, message: "账号字符在4-16之间", target: "blur" }
        ],
        password: [
          { required: true, message: "账号不能为空", target: "blur" },
          { min: 4, max: 16, message: "密码字符在4-16之间", target: "blur" }
        ]
      }
    };
  },
  methods: {
    ...userActions(["login"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login(this.ruleForm);
        } else {
          this.$message.error("内容错误");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  computed: {
    ...userState(["loading"])
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.login-box {
  width: 640px;
  height: 300px;
  padding: 20px 0;
  border-radius: 10px;
  box-shadow: 5px 5px 20px #444444;
  margin-top: -100px;
  .login-top {
    border-bottom: 1px solid #ebeef5;
    color: gray;
    padding: 15px;
    text-align: center;
  }
  .login-main {
    padding: 20px;
    .msg {
      color: gray;
    }
    .bottom-btn {
      /deep/.el-form-item__content {
        margin-left: 0 !important;
      }
      text-align: center;
      .el-button {
        margin-top: 20px;
        width: 140px;
      }
    }
  }
}
</style>