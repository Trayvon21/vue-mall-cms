<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addRolesFlag=true">添加角色</el-button>
      <el-table :data="rolesData" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <role-tags
              @todelRoleAuth="todelRoleAuth"
              :data="scope.row.children"
              :roleId="scope.row.id"
            ></role-tags>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column
          v-for="item in labels"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        />
        <el-table-column fixed="right" label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="toEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="todelRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" @click="toRoleAuth(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRolesFlag" width="750px">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName" :required="true">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole('addForm')">取 消</el-button>
        <el-button type="primary" @click="toAddRole('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="eidtRolesFlag" width="750px">
      <el-form :model="eidtForm" :rules="rules" ref="eidtForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName" :required="true">
          <el-input v-model="eidtForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="eidtForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditRole('eidtForm')">取 消</el-button>
        <el-button type="primary" @click="toEditRole('eidtForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="roleAuthFlag" width="750px">
      <el-tree
        ref="tree"
        :data="roleTreeList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="rids"
        :default-checked-keys="rids"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRoleAuth()">取 消</el-button>
        <el-button type="primary" @click="submitRoleAuth()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const rightModel = createNamespacedHelpers("right");
const { mapState: rightState, mapActions: rightActions } = rightModel;
import roleTags from "../../../components/roles/RoleTags";
export default {
  name: "Roles",
  components: { roleTags },
  data() {
    return {
      labels: [
        { prop: "roleName", label: "职位" },
        { prop: "roleDesc", label: "描述" }
      ],
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      eidtForm: {},
      addRolesFlag: false,
      eidtRolesFlag: false,
      roleAuthFlag: false,
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", target: "blur" },
          { min: 2, max: 8, message: "长度在2-8之间", target: "blur" }
        ]
      },
      defaultProps: {
        children: "children",
        label: "authName"
      },
      rids: [],
      selectRid: ""
    };
  },
  methods: {
    ...rightActions([
      "getRoles",
      "addRole",
      "editRole",
      "delRole",
      "delRoleAuth",
      "getRightsList",
      "roleAuth"
    ]),
    todelRoleAuth(params) {
      this.delRoleAuth(params);
    },
    toAddRole(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRole(this.addForm);
          this.addRolesFlag = false;
        } else {
          this.$message.error("内容错误");
        }
      });
    },
    toEdit(row) {
      this.eidtForm = {
        rid: row.id,
        roleName: row.roleName,
        roleDesc: row.roleDesc
      };
      this.eidtRolesFlag = true;
    },
    toEditRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editRole(this.eidtForm);
          this.eidtRolesFlag = false;
        } else {
          this.$message.error("内容错误");
        }
      });
    },
    cancelEditRole(formName) {
      this.$refs[formName].resetFields();
      this.eidtRolesFlag = false;
    },
    todelRole(rid) {
      this.$confirm("此操作将永远删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRole(rid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cancelAddRole(formName) {
      this.$refs[formName].resetFields();
      this.addRolesFlag = false;
    },
    toRoleAuth(row) {
      this.ids = [];
      this.getRightsList("tree");
      this.maprids(row.children);
      this.roleAuthFlag = true;
      this.selectRid = row.id;
    },
    maprids(data) {
      data.map(item => {
        this.rids.push(item.id);
        if (item.children && item.children.length > 0) {
          this.maprids(item.children);
        }
      });
    },
    cancelRoleAuth() {
      this.roleAuthFlag = false;
      this.ids = [];
    },
    submitRoleAuth() {
      let rids = this.$refs.tree.getCheckedKeys().join(",");
      this.roleAuth({
        rid: this.selectRid,
        rids
      });
      this.rids = [];
      this.selectRid = "";
      this.roleAuthFlag = false;
    },
    getCheckedNodes(nodes) {
      console.log(nodes);
    }
  },
  mounted() {
    this.getRoles();
  },
  computed: {
    ...rightState(["rolesData", "roleTreeList"])
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}
</style>