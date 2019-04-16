<template>
	<div class="PrintQualifiedCard">
		<Dialog className="endProDisinfectionDialog"  title="打印合格证" @closeDialog="closeDialog">
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
            <el-button  @click="getHistoryOrderData">历史订单</el-button>
          </el-form-item>
				</el-form>
          <!--表格-->
        <el-table
          :data="orderInfo"
          border
          style="width: 100%;overflow-y: scroll" max-height="460px">
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
                <h4>{{productName}}</h4>
                <h4>{{spec}}</h4>
                <h4>{{factoryName}}</h4>
                <h4>{{addr}}</h4>
                <h4>{{tel}}</h4>
                <h4>{{registration}}</h4>
                <h4>{{produce_licence_num}}</h4>
                <h4>{{dateOfManufacture}}</h4>
                <h4>{{checkDate}}</h4>
                <h4>{{user_name}}</h4>
                <h4>{{shelflife}}年</h4>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" align="center">
          <!--<el-button class="print-go" plain @click="goPrintReport">去打印检验报告</el-button>-->
          <el-button :disabled="submitBtnDisabled" class="submit" type="primary" @click.native="submit">
            <barcode value="submit" :options="submit_option" tag="svg" ></barcode>
          </el-button>
          <el-popover popper-class="show-printQuelified-code"
            placement="top"
            width="380"
            trigger="hover">
            <div class="showModel">
              <div class="show-cont">
                <h3>{{productInfo.productTitle}}</h3>
                <div class="nav-left">
                  <h4 v-for="(item,index) in productInfo.productCont"
                      :key="index">{{item.title}}</h4>
                </div>
                <div class="nav-right">
                  <h4>{{productName}}</h4>
                  <h4>{{spec}}</h4>
                  <h4>{{factoryName}}</h4>
                  <h4>{{addr}}</h4>
                  <h4>{{tel}}</h4>
                  <h4>{{registration}}</h4>
                  <h4>{{produce_licence_num}}</h4>
                  <h4>{{dateOfManufacture}}</h4>
                  <h4>{{checkDate}}</h4>
                  <h4>{{user_name}}</h4>
                  <h4>{{shelflife}}年</h4>
                </div>
              </div>
            </div>
            <el-button  class="showPrint" type="text" slot="reference"  v-show="showLowPrintCodeModel">
              <img src="../../../../../static/images/icon/fangdaxuanzhong.png">显示打印预览
            </el-button>
          </el-popover>
        </div>
      </div>
      <!--&lt;!&ndash; 打印合格证&ndash;&gt;-->
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
		props: [ 'changeDialogStatus','openPrintReport' ],
		components: { Dialog },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
        productInfo:{    //产品信息
          productTitle:'产品合格证',
          productCont:
            [
              {title: '产品名称'},
              {title: '规格型号'},
              {title: '生产企业'},
              {title: '地址'},
              {title: '联系电话'},
              {title: '医疗器械注册证'},
              {title: '医疗器械生产许可证'},
              {title: '生产日期'},
              {title: '检验日期'},
              {title: '检验员'},
              {title: '质保期'}
            ]
        },
        showPrintCodeModel: false, // 是否显示条形码模板
        showLowPrintCodeModel: false, // 是否显示右下角条形码模板
				formData: {
          orderIdValid: '',
					date: new Date(),
				},
				userId: 'admin',
        orderInfo: [],
        orderIdValid: statusObj,
        submitBtnDisabled: true,
        orderCodeNotice: '',
        factoryName: '',
        addr: '',
        tel: '',
        registration:'',
        produce_licence_num: '',
        productName: '',
        spec: '',
        dateOfManufacture: '',
        checkDate: '',
        user_name: '',
        shelflife: '',
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
        certificateDate:[] //合格产品数据
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let orderId = this.formData.orderId && !this.orderIdValid.status;
        let orderIdLen = this.orderInfo.length > 0;
				let userId = this.userId;
				let date = this.formData.date;
				if(orderIdLen && orderId && userId && date || this.certificateDate.length) {
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
          this.showLowPrintCodeModel = true;
				}else {
					this.submitBtnDisabled = true;
          this.showLowPrintCodeModel = false;
				}
      }
		},
		updated() {
			// this.$refs.number.focus();
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
          //   this.print(this.prints[i]);
          // }
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
        let data = {templ:"产品合格证打印模板", content:[],
          repeat:[repData],
          header:[],
          footer:[]};
        ZK_JSP.View.print(data);
      },

      // // 打开检验报告弹窗
      // goPrintReport() {
      //   this.closeDialog();
      //   this.$emit('openPrintReport');
      // },
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showPrintQualifiedCardDialog');
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
      //获取产品合格证数据
      getCertificateDate(number){
        this.$api.post('/factory/order/printCertificate', { "orderNumber": number }, res => {
          if(res.data!=''){
            this.certificateDate.unshift(res.data);
            this.factoryName = this.certificateDate[0].factoryName;
            this.addr = this.certificateDate[0].addr;
            this.tel = this.certificateDate[0].tel;
            // this.addr = this.certificateDate[0].addr;
            this.produce_licence_num = this.certificateDate[0].produce_licence_num;
            if(this.certificateDate[0].productMsg.length){
              this.productName = this.certificateDate[0].productMsg[0].productName;
              this.spec = this.certificateDate[0].productMsg[0].spec;
              if(this.certificateDate[0].productMsg[0].repair_type==0){
                this.registration = this.certificateDate[0].fixed_licence_num
              }else{
                this.registration = this.certificateDate[0].movable_licence_num
              }
              this.dateOfManufacture = this.certificateDate[0].productMsg[0].dateOfManufacture;
              this.checkDate = this.certificateDate[0].productMsg[0].checkDate;
              this.user_name = this.certificateDate[0].productMsg[0].user_name;
              this.shelflife = this.certificateDate[0].productMsg[0].shelflife;
            }
          }
        })
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
            this.getCertificateDate(value);
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
          if(sessionStorage.getItem("certificateDate")){
            this.certificateDate = JSON.parse(sessionStorage.getItem("certificateDate"));
            this.factoryName = this.certificateDate[0].factoryName;
            this.addr = this.certificateDate[0].addr;
            this.tel = this.certificateDate[0].tel;
            // this.addr = this.certificateDate[0].addr;
            if(this.certificateDate[0].productMsg.length){
              this.productName = this.certificateDate[0].productMsg[0].productName;
              this.spec = this.certificateDate[0].productMsg[0].spec;
              this.produce_licence_num = this.certificateDate[0].produce_licence_num;
              if(this.certificateDate[0].productMsg[0].repair_type==0){
                this.registration = this.certificateDate[0].fixed_licence_num
              }else{
                this.registration = this.certificateDate[0].movable_licence_num
              }
              this.dateOfManufacture = this.certificateDate[0].productMsg[0].dateOfManufacture;
              this.checkDate = this.certificateDate[0].productMsg[0].checkDate;
              this.user_name = this.certificateDate[0].productMsg[0].user_name;
              this.shelflife = this.certificateDate[0].productMsg[0].shelflife;
            }
            this.showPrintCodeModel = true;
          }else{
            this.$message({
              message: '暂无历史合格证！',
              type: 'error',
              duration: 1000,
            });
            this.submitBtnDisabled = true;
          }
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
        this.prints=[];
        sessionStorage.clear();
        let canSubmit = this.canSubmit;
        if(canSubmit){
          sessionStorage.setItem("orderInfo", JSON.stringify(this.orderInfo));
          sessionStorage.setItem("certificateDate", JSON.stringify(this.certificateDate));
          console.log(this.certificateDate);
          this.certificateDate.map((item,index) =>{
            if(item.productMsg.length >0 ){
              debugger
              this.prints.push({
                FactoryName:item.factoryName,
                Addr: item.addr,
                Tel :item.tel,
                Licence : item.produce_licence_num,
                ProductName :item.productMsg[0].productName,
                Spec:item.productMsg[0].spec,
                Registration:item.productMsg[0].repair_type == 0 ? item.fixed_licence_num : item.movable_licence_num,
                ProductionDate : item.productMsg[0].dateOfManufacture,
                CheckDate : item.productMsg[0].checkDate,
                Checker :item.productMsg[0].user_name,
                ExpiryDate : item.productMsg[0].shelflife
              })
            }else{
              this.prints.push({
                FactoryName:item.factoryName,
                Addr: item.addr,
                Tel :item.tel,
                Licence : item.produce_licence_num,
                ProductName :'',
                Spec:'',
                Registration:'',
                ProductionDate : '',
                CheckDate : '',
                Checker :'',
                ExpiryDate : ''
              })
            }
          });
          console.log(this.prints)
          ZK_JSP.View.init(this.printCallback);
          // this.certificateDate.map((item,index) =>{
          //   if(item.productMsg.length >0 ){
          //     this.prints.push({
          //       factoryName:item.factoryName,
          //       addr: item.addr,
          //       tel :item.tel,
          //       produce_licence_num : item.produce_licence_num,
          //       productName :item.productMsg[0].productName,
          //       spec:item.productMsg[0].spec,
          //       dateOfManufacture : item.productMsg[0].dateOfManufacture,
          //       checkDate : item.productMsg[0].checkDate,
          //       user_name :item.productMsg[0].user_name,
          //       shelflife : item.productMsg[0].shelflife
          //     })
          //   }else{
          //     this.prints.push({
          //       factoryName:item.factoryName,
          //       addr: item.addr,
          //       tel :item.tel,
          //       produce_licence_num : item.produce_licence_num,
          //       productName :'',
          //       spec:'',
          //       dateOfManufacture : '',
          //       checkDate : '',
          //       user_name :'',
          //       shelflife : ''
          //     })
          //   }
          //
          // });
          // let html = '';
          // this.prints.map((item, index) => {
          //   html +='<div class="show-cont" style="overflow: hidden;padding: 10px;">\n' +
          //     '              <h3 style="text-align: center">产品合格证</h3>\n' +
          //     '              <div class="nav-left" style="float: left; width: 50%;">\n' +
          //     '                <h4>产品名称</h4>\n' +
          //     '                <h4>规格型号</h4>\n' +
          //     '                <h4>生产企业</h4>\n' +
          //     '                <h4>地址</h4>\n' +
          //     '                <h4>联系电话</h4>\n' +
          //     '                <h4>医疗器械注册证</h4>\n' +
          //     '                <h4>医疗器械生产许可证</h4>\n' +
          //     '                <h4>生产日期</h4>\n' +
          //     '                <h4>检验日期</h4>\n' +
          //     '                <h4>检验员</h4>\n' +
          //     '                <h4>质保期</h4>\n' +
          //     '              </div>\n' +
          //     '              <div class="nav-right" style="float: left;">\n' +
          //     '                <h4 style="height: 25px;">'+item.productName+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.spec+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.factoryName+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.addr+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.tel+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.factoryName+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.produce_licence_num+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.dateOfManufacture+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.checkDate+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.user_name+'</h4>\n' +
          //     '                <h4 style="height: 25px;">'+item.shelflife+'年</h4>\n' +
          //     '              </div>' +
          //     '            </div>'
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
	@import url('./PrintQualifiedCard.less');
</style>
