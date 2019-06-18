<template>
  <el-dialog
    class="loginDialog"
    title="手机号登录"
    :visible="dialogVisible"
    width="400px"
    @close="$emit('update:dialogVisible', false)"
  >
    <el-form
      ref="loginForm"
      :model="phoneLogin"
      class="login_form"
    >
      <el-form-item
        prop="phone"
        :rules="[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的11位手机号', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="phoneLogin.phone"
          placeholder="请输入手机号"
          clearable
          prefix-icon="el-icon-mobile-phone"
        />
      </el-form-item>
      <el-form-item
        prop="password"
        :rules="[
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="phoneLogin.password"
          show-password
          placeholder="请输入密码"
          clearable
          prefix-icon="el-icon-lock"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="btnLoading"
          type="primary"
          @click="loginpost('dynamicValidateForm')"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "LoginDialog",
  props: {
    dialogVisible: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      phoneLogin: {
        phone: "",
        password: ""
      }
    };
  },
  mounted() {},
  methods: {
    // 登录post
    loginpost() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          axios
            .get("/login/cellphone", {
              params: {
                phone: this.phoneLogin.phone,
                password: this.phoneLogin.password
              }
            })
            .then(res => {
              this.btnLoading = false;
              if (res.code == 200) {
                this.$store.commit("userInfo", res);
                this.$emit("update:dialogVisible", false);
                 this.$message({
                  message: "登录成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "登录错误" + res.msg,
                  type: "error"
                });
              }
            })
            .catch((err) => {
              this.btnLoading = false;
              this.$message({
                message: err.msg,
                type: "error"
              });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
