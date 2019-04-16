<template>
	<div class="PrintReport">
		<Dialog className="endProDisinfectionDialog"  title="打印检验报告" @closeDialog="closeDialog">
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
          <div style="width: 100%;overflow-y: scroll;max-height: 400px;height: 400px;" >
            <!--表格-->
            <el-table
              :data="orderInfo"
              border
              style="width: 100%">
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
            <!--检验记录-->
            <InspectionRecord style="max-height:none!important;"  v-if="showInspectionRecord"  :orderNumber="orderCode" @getInspectionRecord="getInspectionRecord"/>
          </div>

        </div>
        <div slot="footer" class="dialog-footer" align="center">
          <!--<el-button class="print-go" plain @click="goPrintAscendSign">去打印追溯标识</el-button>-->
          <el-button :disabled="submitBtnDisabled" class="submit" type="primary" @click.native="submit">
            <barcode value="submit" :options="submit_option" tag="svg" ></barcode>
          </el-button>
        </div>
      </div>
      <!-- 打印检验报告-->
      <!--<div   class="print-label" style="width: 200px;" >-->
        <!--<div class="codeContainer"   id='codeContainer' style="width: 200px;page-break-after: always"></div>-->
      <!--</div>-->

    </Dialog>
	</div>
</template>

<script type="text/javascript">
  // import $ from 'jquery'
  import moment from "moment";
	import Dialog from '../../../../components/Dialog/Dialog';
  import InspectionRecord from '../OrderDetail/InspectionRecord/InspectionRecord';
	export default {
		props: [ 'changeDialogStatus','openPrintAscendSign' ,'orderNumber',],
		components: { Dialog,InspectionRecord },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				formData: {
          orderId: '',
					date: new Date(),
				},
				userId: 'admin',
        orderInfo: [],
        orderCode:'',
        orderIdValid: statusObj,
        submitBtnDisabled: true,
        showInspectionRecord: false,
        orderCodeNotice: '',
        clinic_name: '',
        salesman_name: '',
        doctor_name: '',
        patient: '',
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
        inspectionRecordDate:[]//检验报告数据
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let orderId = this.formData.orderId && !this.orderIdValid.status;
        let orderIdLen = this.orderInfo.length > 0;
				let userId = this.userId;
				let date = this.formData.date;
				if(orderIdLen && orderId && userId && date || this.inspectionRecordDate.length) {
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
				}else {
					this.submitBtnDisabled = true;
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
        	// this.$refs.number.focus();

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
                  _this.submit()

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
          // for(let i=0;i<this.prints.length;i++){
          //   this.print(this.prints[i].content,this.prints[i].repeat);
          // }
            this.print(this.prints[0].content,this.prints[0].repeat);
        }else{
          this.$message({
            message: '请联系管理员给本机设置模板',
            type: 'warning',
            duration: 1000
          });
        }
      },

      print(contData,repData){
        let data = {templ:"检验报告打印模版", content:[contData],
          repeat:repData,
          header:[],
          footer:[]};
        ZK_JSP.View.print(data);
      },

      // // 打开追溯标识弹窗
      // goPrintAscendSign() {
      //   this.closeDialog();
      //   this.$emit('openPrintAscendSign');
      // },
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showPrintReportDialog');
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
      getInspectionRecord(val){
			  this.inspectionRecordDate.unshift(val);
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
            this.orderCode = value;
            if(this.orderInfo.length){
              let codeNum = value;
              if(value.toUpperCase().split('ON')[1]){
                codeNum = value.toUpperCase();
              }else{
                codeNum='ON'+value;
              }
              this.iFGetorderDataByList(codeNum,this.orderInfo);
              if(this.iFGetorderDataByList(codeNum,this.orderInfo) == 0){
                this.getOrderDate(value);
                this.showInspectionRecord = true;
              }

            }else{
              this.getOrderDate(value);
              this.showInspectionRecord = true;
            }
          }
        }else {
          this.showInspectionRecord = false;
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
            // this.clinic_name = this.orderInfo[0].clinic_name;
            // this.doctor_name = this.orderInfo[0].doctor_name;
            // this.patient = this.orderInfo[0].patient;
            // this.orderNum = this.orderInfo[0].number;
            // this.orderCodeNotice=this.orderInfo[0].number;
            // if(this.orderInfo[0].orderProduct.length){   //产品相关信息
            //   this.product_name = this.orderInfo[0].orderProduct[0].goods_name;
            // }
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
          // this.orderCode=this.orderInfo[0].number;
          // this.inspectionRecordDate = [];
          // this.showInspectionRecord = true;
          if(sessionStorage.getItem("inspectionRecordDate")){
            this.inspectionRecordDate = JSON.parse(sessionStorage.getItem("inspectionRecordDate"));
          }else{
            this.$message({
              message: '暂无历史检验报告！',
              type: 'error',
              duration: 1000,
            });
            this.submitBtnDisabled = true;
          }
        }else{
          this.$message({
            message: '暂无历史订单！',
            type: 'error',
            duration: 1000,
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
          sessionStorage.setItem("inspectionRecordDate", JSON.stringify(this.inspectionRecordDate));
          this.inspectionRecordDate.map((item1,index1) =>{
           item1.map((item2,index2) =>{
             let rep=[];
             JSON.parse(item2.items).item.map((item3,index3)=>{
               rep.push({
                 CheckItem:item3.name,
                 CheckStd:item3.standard,
                 CheckItemResult:item3.isAllowedName,
               })
             });
             this.prints.push({
               content:{
                 CheckProject:item2.itemName,
                 CheckResult:item2.testResults =='1' ? '合格':'不合格',
                 Checker :item2.checker,
                 CheckDate:item2.checkDate,
               },
               repeat:rep
             })
          });
          });
          console.log(this.prints);
          ZK_JSP.View.init(this.printCallback);

          // this.inspectionRecordDate.map((item,index) =>{
          //  item.map((item2,index2) =>{
          //    this.prints.push(item2)
          // });
          // });
          // let html = '';
          // this.prints.map((item, index) => {
          //   let testResults='';
          //   let html3 = '';
          //
          //   if(item.testResults == 1){
          //       testResults = '合格'
          //   }else{
          //       testResults = '不合格'
          //   }
          //   if(item.items.length > 0){
          //     let itemsData = item.items;
          //     let html2 = '';
          //     itemsData.map((item2,index2) =>{
          //       html2 +=
          //         '        <tr style="border-bottom: 1px solid #e2e2e2">\n' +
          //         '          <td style="width: 33%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item2.item+'</td>\n' +
          //         '          <td style="width: 33%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item2.standard+'</td>\n' +
          //         '          <td style="width: 33%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2;border-right: 1px solid #e2e2e2">'+item2.result+'</td>\n' +
          //         '        </tr>\n';
          //     });
          //     html3 = '<table style="width: 100%">\n' +
          //       '        <thead style="background: #f5f5f5;">\n' +
          //       '         <tr style="border-top: 1px solid #e2e2e2;border-bottom: 1px solid #e2e2e2">\n' +
          //       '          <td style="width: 33%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">检验条目</td>\n' +
          //       '          <td style="width: 33%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">检验标准</td>\n' +
          //       '          <td style="width: 33%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2;border-right: 1px solid #e2e2e2">检验结果</td>\n' +
          //       '         </tr>\n' +
          //       '        </thead>\n' +
          //       '        <tbody>\n' +
          //       html2+
          //       '        </tbody>\n' +
          //       '      </table>\n'
          //     ;
          //
          //   }
          //   html +=' <div class="recordItem" style="margin-bottom: 10px;">\n' +
          //     '<div class="top" style="display: flex;">\n' +
          //     '<p style="flex: 1;height: 34px;line-height: 34px;font-size: 10px">\n' +
          //     '<span style="margin-right: 20px;color: #666;">检验项目</span>\n' +
          //     '<span style="color: #333;">'+item.itemName+'</span>\n' +
          //     '</p>\n' +
          //     '<p style="flex: 1;height: 34px;line-height: 34px;font-size: 10px">\n' +
          //     '<span style="margin-right: 20px;color: #666;">检验结果</span>\n' +
          //     '<span style="color: #333;">'+testResults+'</span>\n' +
          //     '</p>\n' +
          //     '<p style="flex: 1;height: 34px;line-height: 34px;font-size: 10px">\n' +
          //     '<span style="margin-right: 20px;color: #666;">检验员</span>\n' +
          //     '<span style="color: #333;">'+item.checker+'</span>\n' +
          //     '</p>\n' +
          //     '<p align="right" style="flex: 1;height: 34px;line-height: 34px;font-size: 10px">\n' +
          //     '<span style="margin-right: 20px;color: #666;">检验时间</span>\n' +
          //     '<span style="color: #333;">'+this.formatDate(item.checkDate)+'</span>\n' +
          //     '</p>\n' +
          //     '</div>\n' +
          //     html3+
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

      },
      // 日期转换
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD');
      }

		}
	}
</script>

<style lang="less">
	@import url('./PrintReport.less');
</style>
