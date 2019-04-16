<template>
  <div class="login">
    <div class="title">
      <div class="TitleText">欢迎登录管理中心</div>
      <div class="NoticeText">{{noticeText}}</div>
    </div>
    <el-form :model="ruleForm" :rules="rules2" ref="ruleForm"  class="form">
      <el-form-item prop="account" >
        <label class="icon"><img src="../../../../static/images/login/user.png"></label>
        <el-input  placeholder="请输入手机号/邮箱"  v-model="ruleForm.account"></el-input>
      </el-form-item>
      <el-form-item prop="password" >
        <label class="icon"><img src="../../../../static/images/login/mima.png"></label>
        <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" ></el-input>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click="login('ruleForm')" round>登录</el-button>
      </div>
      <div class="btns">
        <el-button type="text" @click="factory()">工厂注册</el-button>
        <el-button type="text" @click="clinic()">诊所注册</el-button>
        <el-button type="text" @click="forget()">忘记密码</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data: function () {
      var validatePass = (rule, value, callback) => { //密码验证
          if (value === '') {
            callback(new Error('请输入3-20位任意字符密码'));
          } else {
            if (value !== '') {
              if(value.length<3 || value.length>20){
                callback(new Error('请输入3-20位任意字符密码'));
              }
              // else{
              //   this.$refs.ruleForm.validateField('password');
              // }

            }
            callback();
          }
        };

      var formAccount = (rule, value, callback) => { //手机号/邮箱验证
        if (value === '') {
          callback(new Error('请输入手机号/邮箱'));
        } else {
          if (value !== '') {
            var regTel=/^1[3456789]\d{9}$/;
            var regEmail=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!regTel.test(value) && !regEmail.test(value) ){
              callback(new Error('请输入正确的手机号/邮箱'));
            }
          }
          callback();
        }
      };
      return {
        noticeText: "",//提示内容
        ruleForm: {
          account: '',
          password: ''
        },
        rules2: {
          account: [
            { validator: formAccount, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      /**
       *  登录
       */
      login(formName) {
        sessionStorage.clear();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.post('/login/gotoLogin', {
                "account": this.ruleForm.account,
                "passwd": this.ruleForm.password,
              },
              res => {
                if(res.data){
                  sessionStorage.setItem("token", res.data);
                  this.$message({
                    message: "登录成功",
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.$router.push('/factory');
                    }
                  });
                }else{
                  this.$router.push('/')
                }

              }, res => {
                this.noticeText = '账号与密码不匹配';
                // this.$message.error(res.msg);
              });

          } else {
            // this.noticeText = '账号与密码不匹配';
            return false;
          }
        });

      },
      // 工厂注册
      factory() {
        this.$router.push('/login/factory');
      },
      // 诊所注册
      clinic() {
        this.$router.push('/login/clinic');
      },
      // 忘记密码
      forget() {
        this.$router.push('/login/forget');
      }
    }
  }
</script>

<style lang="less">
  @import './Login.less';
</style>
