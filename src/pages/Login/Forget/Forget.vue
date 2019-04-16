<template>
  <div class="factory">
    <div class="title">
      <div class="TitleText">忘记密码</div>
    </div>
    <el-form :model="forgetForm" ref="forgetForm" :rules="rules2"  class="form">
      <el-form-item prop="email"  v-if="flag==0">
        <label class="icon"><img src="../../../../static/images/login/user.png"></label>
        <el-input v-model="forgetForm.email"  placeholder="请输入手机号/邮箱"></el-input>
      </el-form-item>
      <!--<el-form-item prop="code" v-if="flag==0">-->
        <!--<label class="icon"><img src="../../assets/img/mima.png"></label>-->
        <!--<el-input class="code" v-model="forgetForm.code" placeholder="请输入验证码"></el-input>-->
        <!--<el-button class="code-btn"  type="text" @click="getAuthCode()" v-show="sendAuthCode" :class="getCodeNum>5 ? 'disabled':''">获取验证码</el-button>-->
        <!--<el-button class="code-btn"  type="text" v-show="!sendAuthCode">{{auth_time}}</el-button>-->
      <!--</el-form-item>-->
      <el-form-item prop="password"   v-if="flag==1">
        <label class="icon"><img src="../../../../static/images/login/mima.png"></label>
        <el-input v-model="forgetForm.password"  placeholder="3-20位,任意字符"></el-input>
      </el-form-item>
      <el-form-item prop="rePassword"   v-if="flag==1">
        <label class="icon"><img src="../../../../static/images/login/mima.png"></label>
        <el-input v-model="forgetForm.rePassword"  placeholder="3-20位,任意字符"></el-input>
      </el-form-item>
      <div class="register-btn" v-if="flag==0">
        <el-button type="primary" @click="register('forgetForm')">下一步</el-button>
      </div>
      <div class="register-btn"  v-if="flag==1">
        <el-button type="primary" @click="revision('forgetForm')">修改密码</el-button>
      </div>
      <div class="login">
        <el-button  type="text" @click="login()">返回登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data: function(){
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
      var formCode = (rule, value, callback) =>{ //验证码验证
        if (value === '') {
          callback(new Error('请输入验证码'));
        }else{
          if (value !== ''){
            if(value!=this,trueCode){
              callback(new Error('请输入正确的验证码'));
            }if(this.getCodeNum>5){
              callback(new Error('已超过5次，明日再来获取'));
            }
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => { //密码验证
        if (value === '') {
          callback(new Error('请输入3-20位任意字符密码'));
        } else {
          if (value !== '') {
            if(value.length<3 || value.length>20){
              callback(new Error('请输入3-20位任意字符密码'));
            }

          }
          callback();
        }
      };
      return {
        flag:0,
        noticeText:'',
        sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        auth_time: 0, /*倒计时 计数器*/
        trueCode:null,//获取的正确验证码
        getCodeNum:6, //获取验证码次数
        forgetForm:{
          email:"",
          code:"",
          password:'',
          rePassword:''

        },
        rules2:{
          email:[
            { validator: formAccount, trigger: 'blur' }
          ],
          code:[
            {validator: formCode, trigger: 'blur'},

          ],
          password:[
            {validator: validatePass, trigger: 'blur'},
          ],
          rePassword:[
            {validator: validatePass, trigger: 'blur'},
          ]
        }


      }
    },
    methods : {
      /*
      验证码
       */
      getAuthCode() {
        this.sendAuthCode = false;
        this.auth_time = 60;
        var auth_timetimer =  setInterval(()=>{
          this.auth_time--;
          if(this.auth_time<=0){
            this.sendAuthCode = true;
            clearInterval(auth_timetimer);
          }
        }, 1000);
      },
      /*
      下一步
       */
      register(registerName) {
        this.$refs[registerName].validate((vaild) => {
          if(vaild){
            this.flag=1;
            // this.$router.push('/factory/index');
          }else{
            // this.noticeText = '邮箱不能为空';
            return false;
          }
        })
      },
      /*
  修改密码
   */
      revision(registerName) {
        this.$refs[registerName].validate((vaild) => {
          if(vaild){
            this.$router.push('/factory/index');
          }else{
            return false;
          }
        })
      },
      login(){
        this.$router.push('/login/do');
      }
    }
  }
</script>

<style lang="less">
  @import '../Register/Register.less';
</style>
