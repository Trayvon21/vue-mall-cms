<template>
  <div>
    <el-card>
      <div>
        <el-input class="users-search" placeholder="请输入搜索内容" v-model="search" clearable>
          <el-button slot="append" icon="el-icon-search" @click="gotoSearch()"></el-button>
        </el-input>
        <el-button class="add-user" type="primary" @click="addUserFlag=true">添加用户</el-button>
      </div>
      <div>
        <el-table :data="userData" style="width: 100%" border>
          <el-table-column type="index" label="#" align="center"></el-table-column>
          <el-table-column
            v-for="item in labels"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          />
          <el-table-column fixed="right" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="toStateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="gotoEditUser(scope.row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="toDelUser(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userPagenum"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="userPagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userTotal"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserFlag" width="750px">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username" :required="true">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="true">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :required="true">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" :required="true">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addForm')">取 消</el-button>
        <el-button type="primary" @click="toAddUser('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editUserFlag" width="750px">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :required="true">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" :required="true">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editForm')">取 消</el-button>
        <el-button type="primary" @click="toEditUser('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="userRoleFlag" width="400px">
      <div class="role-each">当前用户：{{roleData.username}}</div>
      <div class="role-each">当前角色：{{roleData.role_name}}</div>
      <el-select v-model="roleSelect" placeholder="请选择">
        <el-option v-for="item in rolesData" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRole()">取 消</el-button>
        <el-button type="primary" @click="toUserRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapActions } from "vuex";
const userModule = createNamespacedHelpers("user");
const { mapState: userState, mapActions: userActions } = userModule;
export default {
  name: "Users",
  data() {
    var checkmobile = (rule, value, callback) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };
    return {
      search: "",
      addUserFlag: false,
      editUserFlag: false,
      userRoleFlag: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", target: "blur" },
          { min: 4, max: 16, message: "账号字符在4-16之间", target: "blur" }
        ],
        password: [
          { required: true, message: "账号不能为空", target: "blur" },
          { min: 4, max: 16, message: "密码字符在4-16之间", target: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "电话不能为空", target: "blur" },
          {
            validator: checkmobile,
            message: "请输入正确的电话",
            target: "blur"
          }
        ]
      },
      labels: [
        // { prop: "index", label: "#", width: 100 },
        { prop: "username", label: "姓名" },
        { prop: "role_name", label: "角色" },
        { prop: "mobile", label: "电话" },
        { prop: "email", label: "邮箱" }
      ],
      editForm: {},
      roleData: {},
      roleSelect: ""
    };
  },
  methods: {
    ...userActions([
      "getUserData",
      "addUser",
      "stateChange",
      "editUser",
      "delUser",
      "userRole",
      "getRoles"
    ]),
    gotoSearch() {
      if (this.search.trim() !== "") {
        this.$store.state.user.userPagenum = 1;
        this.getUserData(this.search.trim());
      }
    },
    toAddUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addUser(this.addForm);
          this.addUserFlag = false;
        } else {
          this.$message.error("内容错误");
        }
      });
    },
    cancelAdd(formName) {
      this.$refs[formName].resetFields();
      this.addUserFlag = false;
    },
    toStateChange(row) {
      this.stateChange({ uId: row.id, type: row.mg_state });
    },
    gotoEditUser(row) {
      this.editForm = JSON.parse(JSON.stringify(row));
      this.editUserFlag = true;
    },
    toEditUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editUser({
            uId: this.editForm.id,
            email: this.editForm.email,
            mobile: this.editForm.mobile
          });
          this.editUserFlag = false;
        } else {
          this.$message.error("内容错误");
        }
      });
    },
    cancelEdit(formName) {
      this.$refs[formName].resetFields();
      this.editUserFlag = false;
    },
    toDelUser(uid) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delUser(uid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    setRole(data) {
      this.userRoleFlag = true;
      this.roleSelect = "";
      this.roleData = data;
      this.getRoles();
    },
    toUserRole() {
      this.userRole({ uId: this.roleData.id, rid: this.roleSelect });
      this.userRoleFlag = false;
    },
    cancelRole() {
      this.userRoleFlag = false;
    },
    handleSizeChange(e) {
      this.$store.state.user.userPagesize = e;
      this.getUserData(this.search);
    },
    handleCurrentChange(e) {
      this.$store.state.user.userPagenum = e;
      this.getUserData(this.search);
    }
  },
  mounted() {
    this.getUserData(this.search);
  },
  computed: {
    ...userState([
      "userData",
      "userTotal",
      "userPagenum",
      "userPagesize",
      "rolesData"
    ])
  }
};
</script>

<style lang="scss" scoped>
.users-search {
  width: 300px;
}
.add-user {
  margin-left: 20px;
}
.add-user-main {
  width: 750px;
  height: 430px;
}
.dialog-footer {
  text-align: right;
}
.el-table {
  margin: 20px 0;
}
.role-each {
  margin-bottom: 20px;
}
</style>