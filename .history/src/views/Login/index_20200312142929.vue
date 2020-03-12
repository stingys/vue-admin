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

      <el-form-item prop="username" class="item-from">
        <label for="email">邮箱</label>
        <el-input id="email" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="password" class="item-from">
        <label for="password">密码</label>
        <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="code" class="item-from">
        <label for="code">验证码</label>
        <el-row :gutter="10">
          <el-col :span="15">
            <el-input id="code" v-model="ruleForm.code"></el-input>
          </el-col>
          <el-col :span="9">
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
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (value === "") {
        callback(new Error("请输入用户名"));
      }else if(!reg.test(value)){
        callback(new Error("邮箱格式不正确"));
      }else {
        callback(); //true
      }

      /* 
       else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      }  */
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
         callback(); 
      }
      /* 
       else if (validatePass(value)) {
          callback(new Error("密码为6至20位数字+字母"));
      }
      */
    };
    // 验证验证码 
    let validateCode = (rule, value, callback) => {
      if (value === '') {
          return callback(new Error('请输入验证码'));
        }else{
          callback();
        }
        /* else if(validateVCode(value)){
          return callback(new Error('验证码格式有误'));
        } */
    };
    return {
      menuTab: [
        { txt: "登录", current: true, type: "login" },
        { txt: "注册", current: false, type: "register" }
      ],
      ruleForm: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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



