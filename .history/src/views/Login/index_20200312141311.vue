<template>
   <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">
          {{ item.txt }}
        </li>
      </ul>
    <!-- 表单 start -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="medium" class="login-form">

      <el-form-item  prop="pass" class="item-from">
        <label for="email">邮箱</label>
        <el-input id="email" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="checkPass" class="item-from">
        <label for="password">密码</label>
        <el-input id="password" type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="age" class="item-from">
        <label for="code">验证码</label>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-input id="code" v-model="ruleForm.age"></el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="success">获取验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button type="danger" @click="submitForm('ruleForm')" class="block login-btn">提交</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
    <!-- 表单 end -->
    </div>
   </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      menuTab: [
        { txt: "登录", current: true, type: "login" },
        { txt: "注册", current: false, type: "register" }
      ],
      ruleForm: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    toggleMenu(data) {
      /* 点击切换菜单的时候把.current去掉 */
      this.menuTab.forEach(item => {
        item.current = false;
      });
      /* 点击的时候加.current */
      data.current = true;
    }
  }
};
</script>

<style lang="less" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>



