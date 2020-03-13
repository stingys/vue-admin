<template>
   <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">
          {{ item.txt }}
        </li>
      </ul>
    <!-- 表单 start -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" size="medium" class="login-form">

      <el-form-item prop="username" class="item-from">
        <label for="email">邮箱</label>
        <el-input id="email" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="password" class="item-from">
        <label for="password">密码</label>
        <el-input id="password" type="text" v-model="ruleForm.password" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>

       <el-form-item prop="passwords" class="item-from" v-show="model === 'register'">
        <label for="passwords">重复密码</label>
        <el-input id="passwords" type="text" v-model="ruleForm.passwords" maxlength="20" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="code" class="item-from">
        <label for="code">验证码</label>
        <el-row :gutter="10">
          <el-col :span="15">
            <el-input id="code" v-model="ruleForm.code" maxlength="6"></el-input>
          </el-col>
          <el-col :span="9">
            <el-button type="success" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button type="danger" @click="submitForm('ruleForm')" class="block login-btn" :disabled="loginButtonStatus">{{model == 'login' ? '提交' : '注册'}}</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
    <!-- 表单 end -->
    </div>
   </div>
</template>

<script>
import { GetSms, Register, Login } from "@/api/login";
import {
  stripscript,
  validatePass,
  validateEmail,
  validateVCode
} from "@/utils/validate";
import axios from "@/utils/request";
import { reactive, ref, onMounted } from "@vue/composition-api";
import { setInterval, clearInterval } from "timers";
export default {
  name: "Home",
  setup(props, { refs, root }) {
    //这里面放置data数据、生命周期、自定义的函数
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 如果模块值为login, 直接通过
      // 原因:因为重复密码块使用的是v-show 只是display了元素 点击提交的时候还是会验证重复密码规则
      if (model.value === "login") {
        callback();
      }
      // 过滤后的数据
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    // 验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    /* *******************************声明变量******************************* */
    // 模块值
    const model = ref("login");
    // 登陆按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮状态和文本
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    // 验证码倒计时
    const timer = ref(null);
    // 菜单块
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    // 表单规则
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    /* *******************************声明函数******************************* */
    // 登陆/注册切换模块
    const toggleMenu = data => {
      /* 点击切换菜单的时候把所有元素.current去掉 */
      menuTab.forEach(item => {
        item.current = false;
      });
      /* 点击的时候加.current */
      data.current = true;
      /* 点击的时候改变当前的model值,动态显示/隐藏 重复密码表单块 */
      model.value = data.type;
      resetFormData();
      clearCountDown();
    };
    // 表单提交
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
          model.vaule === "login" ? '' : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 表单重置
    const resetFormData = formName => {
      refs["loginForm"].resetFields();
    };
    // 登陆
    const login = () => {};
    // 注册
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
        module: "register"
      };
      // 注册接口
      Register(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //  // 模拟注册成功
          // toggleMenu(menuTab[0])
          // clearCountDown()
        })
        .catch(error => {
          // 失败时执行的代码
        });
    };
    // 获取验证码
    const getSms = () => {
      // 后台为了保险虽然做了处理 但是前端依旧必须要进行判空处理 这样network就不会发送一次多余的请求
      if (!ruleForm.username) {
        root.$message.error("邮箱不能为空！！");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      // 修改获取验证按钮状态
      updataButtonStatus({
        status: true,
        text: "发送中"
      });
      // 获取验证码
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      GetSms(requestData)
        .then(res => {
          let data = res.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          // 调定时器，倒计时
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 更新按钮状态
    const updataButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    // 倒计时
    const countDown = number => {
      if (timer.value) clearInterval(timer.value);
      let time = number;
      // 这里需要加.value
      timer.value = setInterval(() => {
        time--;
        if (time == 0) {
          // 清除定时器
          clearInterval(timer.value);
          // 更新按钮状态
          updataButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    // 清除倒计时
    const clearCountDown = () => {
      // 还原验证码按钮默认状态
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      clearInterval(timer.value);
    };
    /* *******************************声明生命周期******************************* */

    onMounted(() => {});

    /* 定义的变量和函数都要return出去 */
    return {
      //ref块
      model,
      loginButtonStatus,
      timer,
      // reactive块
      codeButtonStatus,
      menuTab,
      ruleForm,
      rules,
      //函数块
      toggleMenu,
      submitForm,
      resetFormData,
      getSms,
      updataButtonStatus,
      countDown,
      clearCountDown,
      login,
      register
    };
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



