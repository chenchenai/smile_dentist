<template>
	<div class="PrintQualityCard">
		<Dialog className="endProDisinfectionDialog"  title="打印质保卡" @closeDialog="closeDialog">
			<div class="slotDiv">
        <div class="scrollBox">
				<el-form class="form" :model="formData" label-position="left" label-width="70px" ref="addForm">
					<el-form-item label="订单编号" class="fromItem">
						<el-input ref="orderId" :autofocus="true" maxlength="10" v-model="formData.orderId" @blur="validOrderId(formData.orderId)"></el-input>
						<p class="errorNotice" v-if="orderIdValid.status">{{ orderIdValid.text }}</p>
					</el-form-item>
					<el-form-item label="操作人" class="fromItem">
						<el-input v-model="userId" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="操作日期" class="fromItem date">
						<el-date-picker
							v-model="formData.date"
							type="date"
							:editable="false"
							:clearable="false">
						</el-date-picker>
					</el-form-item>
          <el-form-item class="fromItem" >
            <el-button  @click="getHistoryOrderData()">历史订单</el-button>
          </el-form-item>
				</el-form>
          <!--表格-->
        <el-table
          :data="orderInfo"
          border
          style="width: 100%;overflow-y: scroll" max-height="460px"  >
          <el-table-column
            prop="number"
            align="center"
            width="130"
            label="订单编号">
          </el-table-column>
          <el-table-column
            prop="box_no"
            align="center"
            label="盒号">
          </el-table-column>
          <el-table-column
            align="center"
            label="进件日期">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.entry_date) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="预出日期">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.expected_date) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="clinic_name"
            align="center"
            label="客户">
          </el-table-column>
          <el-table-column
            prop="doctor_name"
            align="center"
            label="医生">
          </el-table-column>
          <el-table-column
            prop="salesman_name"
            align="center"
            label="业务员">
          </el-table-column>
          <el-table-column
            prop="patient"
            align="center"
            label="患者">
          </el-table-column>
          <el-table-column
            align="center"
            width="280"
            label="产品名称/数量/牙位">
            <template slot-scope="scope">
              <span v-html="anysisProduceMsg(scope.row.orderProduct)"></span>
            </template>
          </el-table-column>
        </el-table>
          <div class="showModel" v-if="showPrintCodeModel">
            <div class="show-cont">
              <div class="nav-left">
                <h4><label>追溯码：</label>{{orderNum}}</h4>
                <h4><label>产品名称：</label>{{product_name}}</h4>
                <h4><label>质保时间：</label>{{shelflife}}天</h4>
                <h4><label>诊所名称：</label>{{clinic_name}}</h4>
                <h4><label>医生名称：</label>{{doctor_name}}</h4>
                <h4><label>患者名称：</label>{{patient}}</h4>
              </div>
              <div class="nav-right">
                <div class="tooth" v-if="!productInfo">
                  <div class="text">
                    <div class="topPos">
                      <p></p>
                      <p></p>
                    </div>
                    <div class="botPos">
                      <p></p>
                      <p></p>
                    </div>
                  </div>
                </div>
                <div class="tooth"  v-else>
                  <div class="text">
                    <div class="topPos">
                      <p>{{ productInfo.posNum1 }}</p>
                      <p>{{ productInfo.posNum2 }}</p>
                    </div>
                    <div class="botPos">
                      <p>{{ productInfo.posNum3}}</p>
                      <p>{{ productInfo.posNum4}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" align="center">
          <!--<el-button class="print-go" plain @click="goPrintQualifiedCardPrint">去打印合格证</el-button>-->
          <el-button :disabled="submitBtnDisabled" class="submit" type="primary" @click.native="submit">
            <barcode value="submit" :options="submit_option" tag="svg" ></barcode>
          </el-button>
          <el-popover popper-class="show-printCard-code"
            placement="top"
            width="380"
            trigger="hover">
            <div class="showModel">
              <div class="show-cont">
                <div class="nav-left">
                  <h4><label>追溯码：</label>{{orderNum}}</h4>
                  <h4><label>产品名称：</label>{{product_name}}</h4>
                  <h4><label>质保时间：</label>{{shelflife}}天</h4>
                  <h4><label>诊所名称：</label>{{clinic_name}}</h4>
                  <h4><label>医生名称：</label>{{doctor_name}}</h4>
                  <h4><label>患者名称：</label>{{patient}}</h4>
                </div>
                <div class="nav-right">
                  <div class="tooth" v-if="!productInfo">
                    <div class="text">
                      <div class="topPos">
                        <p></p>
                        <p></p>
                      </div>
                      <div class="botPos">
                        <p></p>
                        <p></p>
                      </div>
                    </div>
                  </div>
                  <div class="tooth" v-else>
                    <div class="text">
                      <div class="topPos">
                        <p>{{ productInfo.posNum1 }}</p>
                        <p>{{ productInfo.posNum2 }}</p>
                      </div>
                      <div class="botPos">
                        <p>{{ productInfo.posNum3}}</p>
                        <p>{{ productInfo.posNum4}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-button  class="showPrint" type="text" slot="reference" v-show="showLowPrintCodeModel">
              <img src="../../../../../static/images/icon/fangdaxuanzhong.png">显示打印预览
            </el-button>
          </el-popover>
        </div>
      </div>
      <!--&lt;!&ndash; 打印质保卡&ndash;&gt;-->
      <!--<div   class="print-label" style="width: 200px;" >-->
        <!--<div class="codeContainer"   id='codeContainer' style="width: 200px;page-break-after: always"></div>-->
      <!--</div>-->
    </Dialog>
	</div>
</template>

<script type="text/javascript">
  // import $ from 'jquery'
	import Dialog from '../../../../components/Dialog/Dialog';
	export default {
		props: [ 'changeDialogStatus','openPrintQualifiedCard' ],
		components: { Dialog },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
        showPrintCodeModel: false, // 是否显示条形码模板
        showLowPrintCodeModel: false, // 是否显示右下角条形码模板
				formData: {
          orderId: '',
					date: new Date(),
				},
        userId: 'admin',
        orderInfo: [],
        orderIdValid: statusObj,
        submitBtnDisabled: true,
        orderCodeNotice: '',
        clinic_name: '',
        product_name: '',
        doctor_name: '',
        patient: '',
        productInfo:{   //牙位数据
          posNum1:'',
          posNum2:'',
          posNum3:'',
          posNum4:'',
        },
        shelflife:'',
        orderNum: 'submit',
        submit_option:{
          format: "CODE128",//选择要使用的条形码类型
          text: "扫码或点击确认",
          displayValue: true,//是否在条形码下方显示文字
          textPosition: "bottom",//设置文本的垂直位置
          width: 1,//设置条之间的宽度
          height: 30,//高度
          background: '#fff', //条形码背景颜色
          fontSize: '14px' //字体大小
        },
        prints: [] , //打印条码
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let orderId = this.formData.orderId && !this.orderIdValid.status;
				let userId = this.userId;
        let orderIdLen = this.orderInfo.length > 0;
				let date = this.formData.date;
				if(orderIdLen && orderId && userId && date || this.orderInfo.length) {
					flag = true;
				}else {
					flag = false;
				}
				return flag;
			},
		},
		watch: {
			canSubmit(curVal) {
        if(curVal) {
					this.submitBtnDisabled = false;
					this.showLowPrintCodeModel = true;
				}else {
					this.submitBtnDisabled = true;
          this.showLowPrintCodeModel = false;
				}
      }
		},
		mounted() {
			let code = "";
        	let lastTime = null;
        	let nextTime = null;
        	let lastCode = null;
        	let nextCode = null;
        	let _this = this;

        	document.onkeypress = function(e) {
	            nextCode = e.which;
	            nextTime = new Date().getTime();
	            if(lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
	                code += String.fromCharCode(lastCode);
	            } else if(lastCode != null && lastTime != null && nextTime - lastTime > 100){
	                code = "";
	            }
	            lastCode = nextCode;
	            lastTime = nextTime;
	            if(e.which == 13){
	            	if(code.toUpperCase().indexOf('ON') !== -1){ // 判断扫描订单
                  _this.formData.orderId = code;
                  _this.validOrderId(code);
	            	}else if(code.toUpperCase().indexOf('SUBMIT') !== -1) {
                  _this.submit();
	            	}
	                code = '';
	                return false;
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
          }, 1000);
        }
      },
      getTime(){
        if(ZK_JSP.View.getTempls().length > 0){
          for(let i=0;i<this.prints.length;i++){
            this.print(this.prints[i]);
          }
        }else{
          this.$message({
            message: '请联系管理员给本机设置模板',
            type: 'warning',
            duration: 1000
          });
        }
      },

      print(repData){
        let data = {templ:"质保卡打印模板", content:[repData],
          repeat:[],
          header:[],
          footer:[]};
        ZK_JSP.View.print(data);
      },

      // // 打开合格证弹窗
      // goPrintQualifiedCardPrint() {
      //   this.closeDialog();
      //   this.$emit('openPrintQualifiedCard');
      // },
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showPrintQualityCardDialog');
			},
      getIdByList(value, list) {
        let id = null;
        list.map((item, index) => {
          if(value == item.number){
            id = item.id;
          }
        });
        return id;
      },
      //判断是否订单相同
      iFGetorderDataByList(value, list) {
        let  ifGetOrder= 0;
        list.map((item, index) => {
          if(value == item.number){
            this.orderIdValid = {
              status: true,
              text: '订单号重复'
            };
            ifGetOrder= 1;
          }
        });
        return ifGetOrder;
      },

      // 校验订单编号输入
      validOrderId(value) {
        if(value) {
          if(!value.match(/^[a-zA-Z0-9]{8,10}$/)){
            this.orderIdValid = {
              status: true,
              text: '订单编号输入错误'
            };
            this.orderInfo = [];
          }else {
            if(this.orderInfo.length){
              let codeNum = value;
              if(value.toUpperCase().split('ON')[1]){
                codeNum = value.toUpperCase();
              }else{
                codeNum='ON'+value;
              }
              this.iFGetorderDataByList(codeNum,this.orderInfo);
              if(this.iFGetorderDataByList(codeNum,this.orderInfo) == 0){
                this.getOrderDate(value)
              }

            }else{
              this.getOrderDate(value)
            }
          }
        }else {
          this.orderIdValid = {
            status: true,
            text: '订单编号不能为空'
          };
          this.orderInfo = [];
        }
      },
      //请求订单数据
      getOrderDate(value){
        this.$api.post('/factory/order/find', { "number": value }, res => {
          this.orderIdValid = {
            status: false,
            text: ''
          };
          if(res.data){
            this.orderInfo.unshift(res.data);
            this.clinic_name = this.orderInfo[0].clinic_name;
            this.doctor_name = this.orderInfo[0].doctor_name;
            this.patient = this.orderInfo[0].patient;
            this.orderNum = this.orderInfo[0].number;
            this.orderCodeNotice=this.orderInfo[0].number;
            if(this.orderInfo[0].orderProduct.length){   //产品相关信息
              this.product_name = this.orderInfo[0].orderProduct[0].goods_name;
              this.shelflife = this.orderInfo[0].orderProduct[0].shelflife;
              this.productInfo = this.orderInfo[0].orderProduct[0];
              this.productInfo={
                posNum1:this.productInfo.pos.split(',')[0],
                posNum2:this.productInfo.pos.split(',')[1],
                posNum3:this.productInfo.pos.split(',')[2],
                posNum4:this.productInfo.pos.split(',')[3],
              }
            }
            this.showPrintCodeModel = true;
            if(this.orderInfo.length > 1){
                this.showPrintCodeModel = false;
            }
          }

        }, res => {
          if(res.status == '152') {
            this.orderIdValid = {
              status: true,
              text: '该编号未关联订单'
            };
            this.orderInfo = [];
            this.showPrintCodeModel = false;
            // this.showLowPrintCodeModel = false;
          }else {
            this.$notify.error({
              title: '错误',
              message: res.msg,
              position: 'top-left'
            });
          }
        })
      },
      // 去除时间时分秒
      formatDate(date) {
        return this.$tool.formatDate(date);
      },
      // 解析产品名称/数量/牙位/比色
      anysisProduceMsg(produceMsg) {
        return this.$tool.anysisProduceMsg(produceMsg);
      },
      //获取历史订单
      getHistoryOrderData() {
        if(sessionStorage.getItem("orderInfo")){
          this.orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
          this.clinic_name = this.orderInfo[0].clinic_name;
          this.salesman_name = this.orderInfo[0].salesman_name;
          this.doctor_name = this.orderInfo[0].doctor_name;
          this.patient = this.orderInfo[0].patient;
          this.orderNum = this.orderInfo[0].number;
          this.orderCodeNotice=this.orderInfo[0].number;
          if(this.orderInfo[0].orderProduct.length){   //产品相关信息
            this.product_name = this.orderInfo[0].orderProduct[0].goods_name;
            this.shelflife = this.orderInfo[0].orderProduct[0].shelflife;
            this.productInfo = this.orderInfo[0].orderProduct[0];
            this.productInfo={
              posNum1:this.productInfo.pos.split(',')[0],
              posNum2:this.productInfo.pos.split(',')[1],
              posNum3:this.productInfo.pos.split(',')[2],
              posNum4:this.productInfo.pos.split(',')[3],
            }
          }
          this.showPrintCodeModel = true;
          if(this.orderInfo.length > 1){
            this.showPrintCodeModel = false;
          }
        }else{
          this.showPrintCodeModel = false;
          this.$message({
            message: '暂无历史订单！',
            type: 'error',
            duration: 1000
          });
        }
      },
      //提交
      submit() {
        this.prints=[];
        sessionStorage.clear();
        let canSubmit = this.canSubmit;
        if(canSubmit){
          sessionStorage.setItem("orderInfo", JSON.stringify(this.orderInfo));
          this.orderInfo.map((item,index) =>{
            this.prints.push({
              DevName:item.number,
              Clinic:item.clinic_name,
              Doctor:item.doctor_name,
              Patient:item.patient,
              ProductName:item.orderProduct[0].goods_name,
              ExpiryDate:item.orderProduct[0].shelflife,
              PosTL:item.orderProduct[0].pos.split(',')[0],
              PosTR:item.orderProduct[0].pos.split(',')[1],
              PosDL:item.orderProduct[0].pos.split(',')[2],
              PosDR:item.orderProduct[0].pos.split(',')[3],
            })
          });
          ZK_JSP.View.init(this.printCallback);
          // this.orderInfo.map((item,index) =>{
          //   this.prints.push({
          //     orderNum:item.number,
          //     clinic_name:item.clinic_name,
          //     salesman_name:item.salesman_name,
          //     doctor_name:item.doctor_name,
          //     patient:item.patient,
          //     number:item.number,
          //     product_name:item.orderProduct[0].goods_name,
          //     shelflife:item.orderProduct[0].shelflife,
          //     productInfo:{
          //       posNum1:item.orderProduct[0].pos.split(',')[0],
          //       posNum2:item.orderProduct[0].pos.split(',')[1],
          //       posNum3:item.orderProduct[0].pos.split(',')[2],
          //       posNum4:item.orderProduct[0].pos.split(',')[3],
          //     }
          //   })
          // });
          // let html = '';
          // this.prints.map((item, index) => {
          //   html +='<div class="show-cont" style="padding:10px;background-color: #E2E2E2;width: 320px;margin-bottom: 15px;font-size: 10px;overflow:hidden;border-radius:5px;font-family:SimSun!important;">\n' +
          //     '<div class="nav-left" style="float: left;width: 60%;">\n'+
          //     '<h4 style="font-size: 10px;"><label>追溯码：</label>'+item.orderNum+'</h4>\n' +
          //     '<h4 style="font-size: 10px;"><label>产品名称：</label>'+item.product_name+'</h4>\n' +
          //     '<h4 style="font-size: 10px;"><label>质保时间：</label>'+item.shelflife+'天</h4>\n' +
          //     '<h4 style="font-size: 10px;"><label>诊所名称：</label>'+item.clinic_name+'</h4>\n' +
          //     '<h4 style="font-size: 10px;"><label>医生名称：</label>'+item.doctor_name+'</h4>\n' +
          //     '<h4 style="font-size: 10px;"><label>患者名称：</label>'+item.patient+'</h4>\n' +
          //     '</div>\n'+
          //     '<div class="nav-right" style="float: right;width: 40%;position: relative;height: 156px;">\n'+
          //     '<div class="tooth" style="position: absolute;bottom: 0px;right: 0;">\n'+
          //     '<div class="text" style="height: 58px;width: 85px;float: left;color: #333;">\n'+
          //     '<div class="topPos" style="height: 28px;">\n'+
          //     '<p style=" float: left;width: 42px;height: 28px;border-bottom: 1px solid rgba(204,204,204,1);\n' +
          //     'border-right: 1px solid rgba(204,204,204,1);text-align: center;">'+item.productInfo.posNum1+'</p>\n'+
          //     '<p style=" float: left;width: 42px;height: 28px;border-bottom: 1px solid rgba(204,204,204,1);\n' +
          //     'border-right: 1px solid rgba(204,204,204,1);text-align: center;border-right: 0;">'+item.productInfo.posNum2+'</p>\n'+
          //     '</div>\n'+
          //     '<div class="botPos" style="height: 28px;">\n'+
          //     '<p style="float: left; width: 42px;height: 28px;border-right: 1px solid rgba(204,204,204,1); text-align: center;">\n' +
          //     ''+item.productInfo.posNum3+'</p>\n'+
          //     '<p style="float: left; width: 42px;height: 28px;border-right: 1px solid rgba(204,204,204,1); text-align: center;border-right: 0;">'+
          //     ''+item.productInfo.posNum4+'</p>\n'+
          //     '</div>\n'+
          //     '</div>\n'+
          //     '</div>\n'+
          //     '</div>\n'+
          //     '</div>\n'
          // });
          // $('.codeContainer').html(html);
          // let subOutputRankPrint = document.getElementById('codeContainer');
          // let newContent =subOutputRankPrint.innerHTML;
          // let oldContent = document.body.innerHTML;
          // document.body.innerHTML = newContent;
          // window.print();
          // window.location.reload();
          // $('.codeContainer').html("");

        }

      }
		}
	}
</script>

<style lang="less">
	@import url('./PrintQualityCard.less');
</style>
