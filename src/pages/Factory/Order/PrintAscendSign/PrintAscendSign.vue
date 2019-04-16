<template>
	<div class="PrintAscendSign">
		<Dialog className="endProDisinfectionDialog"  title="打印追溯标识" @closeDialog="closeDialog">
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
          <div class="showModel" v-if="showPrintCodeModel">
            <div class="show-cont">
              <h3>{{productInfo.productTitle}}</h3>
              <div class="nav-left">
                <h4 v-for="(item,index) in productInfo.productCont"
                    :key="index">{{item.title}}</h4>
              </div>
              <div class="nav-right">
                <h4>{{product_name}}</h4>
                <h4>铬络合金</h4>
                <h4>2018-8-10</h4>
                <h4>思维尔口腔诊所</h4>
                <h4>陈医生</h4>
                <h4>陈医生</h4>
                <h4>陈医生</h4>
              </div>
              <div class="clear">
                <h2>生产材料</h2>
                <BaseTable :headerData="materialHeaderData" :tableData="[]" border />
              </div>
              <div class="clear">
                <h2>生产设备</h2>
                <BaseTable :headerData="facilityHeaderData" :tableData="[]" border />
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button :disabled="submitBtnDisabled" class="submit" type="primary" @click.native="submit">
            <barcode value="submit" :options="submit_option" tag="svg" ></barcode>
          </el-button>
          <!--<el-popover popper-class="show-printAscendSign-code"-->
            <!--placement="top"-->
            <!--width="380"-->
            <!--trigger="click">-->
            <!--<div class="showModel">-->
              <!--<div class="show-cont">-->
                <!--<h3>{{productInfo.productTitle}}</h3>-->
                <!--<div class="nav-left">-->
                  <!--<h4 v-for="(item,index) in productInfo.productCont"-->
                      <!--:key="index">{{item.title}}</h4>-->
                <!--</div>-->
                <!--<div class="nav-right">-->
                  <!--<h4>ON18003117561234</h4>-->
                  <!--<h4>铬络合金</h4>-->
                  <!--<h4>2018-8-10</h4>-->
                  <!--<h4>思维尔口腔诊所</h4>-->
                  <!--<h4>陈医生</h4>-->
                  <!--<h4>陈医生</h4>-->
                  <!--<h4>陈医生</h4>-->
                <!--</div>-->
                <!--<div class="clear">-->
                  <!--<h2>生产材料</h2>-->
                  <!--<BaseTable :headerData="materialHeaderData" :tableData="[]" border />-->
                <!--</div>-->
                <!--<div class="clear">-->
                  <!--<h2>生产设备</h2>-->
                  <!--<BaseTable :headerData="facilityHeaderData" :tableData="[]" border />-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
            <!--<el-button  class="showPrint" type="text" slot="reference">-->
              <!--<img src="../../../../../static/images/icon/fangdaxuanzhong.png">显示打印预览-->
            <!--</el-button>-->
          <!--</el-popover>-->
        </div>
      </div>
      <!-- 打印追溯标识-->
      <div   class="print-label" style="width: 200px;" >
        <div class="codeContainer"   id='codeContainer' style="width: 200px;page-break-after: always"></div>
      </div>
    </Dialog>
	</div>
</template>

<script type="text/javascript">
  import $ from 'jquery'
	import Dialog from '../../../../components/Dialog/Dialog';
  import BaseTable from '../../../../components/BaseTable/BaseTable';
	export default {
		props: [ 'changeDialogStatus' ],
		components: { Dialog ,BaseTable},
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
        materialHeaderData: [
          {label: '材料名称', prop: 'item'},
          {label: '注册证号', prop: 'standard'},
          {label: '生产厂家', prop: 'result'},
          {label: '厂家生许可证号', prop: 'result'},
          {label: '批号', prop: 'result'},
          {label: '生产日期', prop: 'result'},
          {label: '有效期', prop: 'result'},
        ],
        facilityHeaderData: [
          {label: '设备名称', prop: 'item'},
          {label: '注册证号', prop: 'standard'},
          {label: '生产厂家', prop: 'result'},
          {label: '厂家生许可证号', prop: 'result'},
          {label: '批号', prop: 'result'},
          {label: '生产日期', prop: 'result'},
          {label: '有效期', prop: 'result'},
        ],
        productInfo:{    //产品信息
          productTitle:'产品追溯标识',
          productCont:
            [
            {title: '产品名称'},
            {title: '规格型号'},
            {title: '生产企业'},
            {title: '医疗器械注册证'},
            {title: '医疗器械生产许可证'},
            {title: '生产日期'},
            {title: '质保期'}
            ]
        },
        showPrintCodeModel: false, // 是否显示条形码模板
        // showLowPrintCodeModel: false, // 是否显示右下角条形码模板
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
        ascendLableDate:[],//追溯标识数据
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let orderId = this.formData.orderId && !this.orderIdValid.status;
        let orderIdLen = this.orderInfo.length > 0;
				let userId = this.userId;
				let date = this.formData.date;
				if(orderIdLen && orderId && userId && date || this.ascendLableDate.length) {
					flag = true;
				}else {
					flag = false;
				}
				return flag;
			},
		},
		watch: {
			canSubmit(curVal,oldVal) {
			  if(curVal) {
					this.submitBtnDisabled = false;
					this.showPrintCodeModel = true;
				}else {
					this.submitBtnDisabled = true;
          this.showPrintCodeModel = false;
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

	            	}else if(code.toUpperCase().indexOf('SUBMIT') !== -1) {

	            	}
	                code = '';
	                return false;
	            }
	        }
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showPrintAscendSignDialog');
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
      // //请求追溯码数据
      // getAscendSignDate(number){
      //   this.ascendLableDate.unshift(res.data);
      // },
      //请求订单数据
      getOrderDate(value){
        this.$api.post('/factory/order/find', { "number": value }, res => {
          this.orderIdValid = {
            status: false,
            text: ''
          };
          if(res.data){
            this.orderInfo.unshift(res.data);
            // this.getAscendSignDate(value); //请求追溯码数据
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
          if(this.orderInfo.length > 1){
            this.showPrintCodeModel = false;
          }
          // if(sessionStorage.getItem("ascendLableDate")){
          //   this.certificateDate = JSON.parse(sessionStorage.getItem("ascendLableDate"));
          //   this.factoryName = this.certificateDate[0].factoryName;
          //   this.addr = this.certificateDate[0].addr;
          //   this.tel = this.certificateDate[0].tel;
          //   // this.addr = this.certificateDate[0].addr;
          //   if(this.certificateDate[0].productMsg.length){
          //     this.productName = this.certificateDate[0].productMsg[0].productName;
          //     this.spec = this.certificateDate[0].productMsg[0].spec;
          //     this.produce_licence_num = this.certificateDate[0].produce_licence_num;
          //     this.dateOfManufacture = this.certificateDate[0].productMsg[0].dateOfManufacture;
          //     this.checkDate = this.certificateDate[0].productMsg[0].checkDate;
          //     this.user_name = this.certificateDate[0].productMsg[0].user_name;
          //     this.shelflife = this.certificateDate[0].productMsg[0].shelflife;
          //   }
          //   this.showPrintCodeModel = true;
          // }else{
          //   this.$message.error('暂无历史合格证！');
          //   this.submitBtnDisabled = true;
          // }
        }else{
          this.showPrintCodeModel = false;
          this.$message({
            message: '暂无历史订单！',
            type: 'error',
            duration: 1000,
          });

        }
      },
      //提交
      submit() {
        sessionStorage.clear();
        let canSubmit = this.canSubmit;
        if(canSubmit){
          sessionStorage.setItem("orderInfo", JSON.stringify(this.orderInfo));
          // sessionStorage.setItem("ascendLableDate", JSON.stringify(this.ascendLableDate));
          // this.ascendLableDate.map((item,index) =>{
          //   item.map((item2,index2) =>{
          //     this.prints.push(item2)
          //   });
          // });
          this.prints.push(this.orderInfo);
          let html = '';
          this.prints.map((item, index) => {
            html +='<div class="show-cont" style="overflow: hidden;padding: 10px;">\n' +
              '              <h3 style="text-align: center">产品追溯标识</h3>\n' +
              '              <div class="nav-left" style="float: left; width: 50%;">\n' +
              '                <h4>产品名称</h4>\n' +
              '                <h4>规格型号</h4>\n' +
              '                <h4>生产企业</h4>\n' +
              '                <h4>医疗器械注册证</h4>\n' +
              '                <h4>医疗器械生产许可证</h4>\n' +
              '                <h4>生产日期</h4>\n' +
              '                <h4>质保期</h4>\n' +
              '              </div>\n' +
              '              <div class="nav-right" style="float: left;">\n' +
              '                <h4 style="height: 25px;">'+item.productName+'</h4>\n' +
              '                <h4 style="height: 25px;">'+item.spec+'</h4>\n' +
              '                <h4 style="height: 25px;">'+item.factoryName+'</h4>\n' +
              '                <h4 style="height: 25px;">'+item.factoryName+'</h4>\n' +
              '                <h4 style="height: 25px;">'+item.produce_licence_num+'</h4>\n' +
              '                <h4 style="height: 25px;">'+item.dateOfManufacture+'</h4>\n' +
              '                <h4 style="height: 25px;">'+item.shelflife+'年</h4>\n' +
              '              </div>' +
              '              <div class="clear" style="padding-top: 15px;clear: both;">\n' +
              '                <h2>生产材料</h2>\n' +
              '                <table style="width: 100%">\n' +
              '                   <thead style="background: #f5f5f5;">\n' +
              '                      <tr style="border-top: 1px solid #e2e2e2;border-bottom: 1px solid #e2e2e2">\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">材料名称</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">注册标号</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">生产厂家</td>\n' +
              '                         <td style="width: 16%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">厂家生产许可证号</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">批号</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">生产日期</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2;border-right: 1px solid #e2e2e2">有效期</td>\n' +
              '                      </tr>\n' +
              '                  </thead>\n' +
              '                 <tbody>\n' +
              '                    <tr style="border-bottom: 1px solid #e2e2e2">\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.item+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 16%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                       <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2;border-right: 1px solid #e2e2e2">'+item.result+'</td>\n' +
              '                    </tr>\n'+
              '                </tbody>\n' +
              '              </table>\n'+
              '              </div>\n' +
              '              <div class="clear" style="padding-top: 15px;clear: both;">\n' +
              '                <h2>生产设备</h2>\n' +
              '                <table style="width: 100%">\n' +
              '                   <thead style="background: #f5f5f5;">\n' +
              '                      <tr style="border-top: 1px solid #e2e2e2;border-bottom: 1px solid #e2e2e2">\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">设备名称</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">注册标号</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">生产厂家</td>\n' +
              '                         <td style="width: 16%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">厂家生产许可证号</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">批号</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">生产日期</td>\n' +
              '                         <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2;border-right: 1px solid #e2e2e2">有效期</td>\n' +
              '                      </tr>\n' +
              '                  </thead>\n' +
              '                 <tbody>\n' +
              '                    <tr style="border-bottom: 1px solid #e2e2e2">\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.item+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 16%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                        <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2">'+item.standard+'</td>\n' +
              '                       <td style="width: 14%;height: 40px;text-align: center;border-left: 1px solid #e2e2e2;border-right: 1px solid #e2e2e2">'+item.result+'</td>\n' +
              '                    </tr>\n'+
              '                </tbody>\n' +
              '              </table>\n'+
              '              </div>\n'+
              '            </div>'
          });
          $('.codeContainer').html(html);
          let subOutputRankPrint = document.getElementById('codeContainer');
          let newContent =subOutputRankPrint.innerHTML;
          let oldContent = document.body.innerHTML;
          document.body.innerHTML = newContent;
          window.print();
          window.location.reload();
          $('.codeContainer').html("");

        }

      },

		}
	}
</script>

<style lang="less">
	@import url('./PrintAscendSign.less');
</style>
