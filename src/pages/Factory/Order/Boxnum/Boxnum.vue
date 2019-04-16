<template>
  <div class="boxNum">
    <Dialog className="boxNumDialog" title="盒号打印" @closeDialog="closeDialog">
      <div class="slotDiv">
        <el-form :model="boxFormData" ref="boxFormData"   label-position="left" >
          <el-form-item label="编号方式" class="fromItem">
            <el-radio-group v-model="boxFormData.type" @change="selectQc">
              <el-radio :label="1">手动编号</el-radio>
              <!--<el-radio :label="0">自动编号</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <div class="box" v-if="showSelfBox">
            <el-form-item label="" class="fromItem letter"  prop="startLetter">
              <el-input class="box-letter" :maxlength="1" placeholder="请输入起始字母" @blur="validStartLetter(boxFormData.startLetter)" v-model="boxFormData.startLetter" ></el-input>
              <p class="errorNotice" v-if="startLetterValid.status">{{ startLetterValid.text }}</p>
            </el-form-item>
            <el-form-item  class="fromItem letter letters"  prop="startNum">
              <el-input class="box-num" :maxlength="3" placeholder="请输入起始数字" @blur="validStartNum(boxFormData.startNum)" v-model="boxFormData.startNum" ></el-input>
              <p class="errorNotice" v-if="startNumValid.status">{{ startNumValid.text }}</p>
            </el-form-item>
            <div class="clear"></div>
          </div>
          <el-form-item label="打印数量" class="fromItem" prop="printNumber">
            <el-input placeholder="1-99"  v-model="boxFormData.printNumber" @blur="validPrintNumber(boxFormData.printNumber)"  auto-complete="off"></el-input>
            <p class="errorNotice" v-if="printNumberValid.status">{{ printNumberValid.text }}</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
          <el-button class="submit" :disabled="submitBtnDisabled"  type="primary"  @click="submit()" >确 定</el-button>
        </div>
      </div>
      <!--&lt;!&ndash; 打印盒号&ndash;&gt;-->
      <!--<div   class="print-label" style="width: 200px;" >-->
        <!--<div class="codeContainer"   id='codeContainer' style="width: 200px;page-break-after: always"></div>-->
      <!--</div>-->
    </Dialog>

  </div>
</template>

<script type="text/javascript">
  // import $ from 'jquery'
  // import JsBarcode from 'jsbarcode'
  import Dialog from '../../../../components/Dialog/Dialog';
	export default {
    props: [ 'changeDialogStatus' ],
    components: { Dialog },
		data() {
      let statusObj = {
        status: false,
        text: ''
      };
			return {
        startLetterValid: statusObj,
        startNumValid: statusObj,
        printNumberValid: statusObj,
        boxFormData: {
          type: 1,
          startLetter: '',
          startNum: '',
          printNumber: '',
				},
        showSelfBox: true, //是否手动输入盒号
        submitBtnDisabled: true,  // 禁用启用
        prints: [] , //打印条码
			}
    },
		computed: {
      canSubmit() {
        let flag = false;
        let startLetter = this.boxFormData.startLetter && !this.startLetterValid.status;
        let startNum = this.boxFormData.startNum && !this.startNumValid.status;
        let printNumber = this.boxFormData.printNumber && !this.printNumberValid.status;
        if(this.showSelfBox == true){
          if(startLetter && startNum && printNumber ) {
            flag = true;
          }else {
            flag = false;
          }
        }else{
          if(printNumber ) {
            flag = true;
          }else {
            flag = false;
          }
        }

        return flag;
      },

		},
    watch: {
      canSubmit(curVal) {
        if(curVal) {
          this.submitBtnDisabled = false;
        }else {
          this.submitBtnDisabled = true;
        }
      }
    },
		methods: {
      /*
       打印插件
       */
      printCallback(ret){
        if(!ret) {
          this.$message({
            message: '请联系管理员给本机安装打印服务并设置模板',
            type: 'warning',
            duration: 1000
          });
        }
        else{
          /*
          打印服务启动
           */
          setTimeout(() => {
            this.getTime();
            this.closeDialog();
          }, 1000);
        }
      },
      getTime(){
        if(ZK_JSP.View.getTempls().length > 0){
          this.print(this.prints);

        }else{
          this.$message({
            message: '请联系管理员给本机设置模板',
            type: 'warning',
            duration: 1000
          });
        }
      },

      print(repData){
        let data = {templ:"盒号打印模版", content:[],
          repeat:repData,
          header:[],
          footer:[]};
        ZK_JSP.View.print(data);
      },

      // 校验编号首字母
      validStartLetter(value) {
        if (value === '') {
          this.startLetterValid = {
            status: true,
            text: '请输入盒号的初始字母'
          };
        } else {
          if (value !== '') {
            var regNum = /^[a-zA-Z]+$/;
            if (!regNum.test(value)) {
              this.startLetterValid = {
                status: true,
                text: '请输入1位字母'
              };
            }else{
              this.startLetterValid = {
                status: false,
                text: ''
              };
            }
          }
        }
      },
      // 校验编号数字
      validStartNum(value) {
        if (value === '') {
          this.startNumValid = {
            status: true,
            text: '请输入盒号的初始数字'
          };
        } else {
            // var regNum = /^[0-9][0-9][0-9]?$/;
            // if (!regNum.test(value)) {
            if (value.length > 3) {
              this.startNumValid = {
                status: true,
                text: '请输入不超过3位的数字'
              };
            }else{
              this.startNumValid = {
                status: false,
                text: ''
              };
            }
        }
      },
      // 校验打印数量
      validPrintNumber(value) {
        if (value === '') {
          this.printNumberValid = {
            status: true,
            text: '请输入需要打印的数量'
          };
        } else {
          if (value !== '') {
            var regNum = /^[1-9][0-9]?$/;
            if (!regNum.test(value)) {
              this.printNumberValid = {
                status: true,
                text: '请输入正确的数量'
              };
            }else{
              this.printNumberValid = {
                status: false,
                text: ''
              };
            }
          }
        }
      },
      //选择模板类型
      selectQc(value){
        this.boxFormData.type = value;
        console.log(value);
        if(value == 1){
          this.showSelfBox = true;
        }else{
          this.showSelfBox = false;
          this.boxFormData.startLetter = '';
          this.boxFormData.startNum = '';
        }
      },
      // 关闭盒号
      closeDialog() {
        this.$emit('changeDialogStatus', false, 'showBoxDialog');
      },
      //提交盒号
      submit() {
        this.prints=[];
        let canSubmit = this.canSubmit;
        if(canSubmit){
          let submitData={
            "count": this.boxFormData.printNumber,
            "fromLetter": this.boxFormData.startLetter,
            "fromNum": this.boxFormData.startNum,
            "numMethod": this.boxFormData.type
          };
          // $('.codeContainer').html("");
          this.$api.post('/factory/order/printBoxNum', submitData, res => {
            if(res.data.length){
              res.data.map((item,index) =>{
                this.prints.push({
                  BoxNum:item,
                  Barcode:item,
                })
              });
              console.log(this.prints);
              ZK_JSP.View.init(this.printCallback);
              // this.prints = res.data;
              // let html = '';
              // res.data.map((item, index) => {
              //   html += '<svg class="codeItem' + index + '"></svg></br>';
              // });
              // $('.codeContainer').html(html);
              // $('.codeContainer').find('svg').map((index, item) => {
              //   JsBarcode('.' + item.getAttribute('class'), res.data[index],{
              //     format: "CODE128",//选择要使用的条形码类型
              //     text: res.data[index],
              //     displayValue: true,//是否在条形码下方显示文字
              //     textPosition: "bottom",//设置文本的垂直位置
              //     width:1,//设置条之间的宽度
              //     height:40,//高度
              //     fontSize: '14px' //字体大小
              //   });
              // });
              // let subOutputRankPrint = document.getElementById('codeContainer');
              // let newContent =subOutputRankPrint.innerHTML;
              // let oldContent = document.body.innerHTML;
              // document.body.innerHTML = newContent;
              // window.print();
              // window.location.reload();
              // $('.codeContainer').html("");
            }
          })

        }else{
          this.$message({
            message: '请检查必填项输入',
            type: 'error',
            duration: 1000,
          });
        }

      }
		}
	}
</script>

<style lang="less">
	@import url(./Boxnum.less);
</style>
