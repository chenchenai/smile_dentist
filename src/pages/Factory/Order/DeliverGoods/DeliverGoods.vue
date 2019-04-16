<template>
	<div class="DeliverGoods">
		<Dialog className="deliverGoodsDialog" title="发货" @closeDialog="closeDialog">
			<div class="slotDiv">
				<el-form class="form" :model="formData" label-position="left" label-width="82px" ref="addForm">
					<el-form-item label="订单编号" class="fromItem">
						<el-input ref="orderId" maxlength="10" v-model="formData.orderId" @blur="validOrderId(formData.orderId)"></el-input>
						<p class="errorNotice" v-if="orderIdValid.status">{{ orderIdValid.text }}</p>
					</el-form-item>				
					<el-form-item label="操作人" class="fromItem">
						<el-input v-model="formData.userId" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="发货日期" class="fromItem">
						<el-date-picker
							v-model="formData.finishtime"
							type="date"
							:editable="false"
							:clearable="false">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="发货类型" class="fromItem">
						<el-radio v-model="formData.productType" label="1">成品</el-radio>
						<el-radio v-model="formData.productType" label="0">试戴</el-radio>
					</el-form-item>
					<el-form-item label="发货方式" class="fromItem">
						<el-radio v-model="formData.sendtype" label="0">快递</el-radio>
						<el-radio v-model="formData.sendtype" label="1">业务员</el-radio>
					</el-form-item>
					<el-form-item class="fromItem"></el-form-item>
					<div v-if="formData.sendtype == '1'">
						<el-form-item label="业务员" class="fromItem">
							<el-autocomplete
								:maxlength="8"
								placeholder="请输入业务员姓名"
								@focus="foucsSalesMan"
								@select="selectSalesmans"
								@blur="validateSalesMan(formData.salesman)"
								v-model="formData.salesman"
								:fetch-suggestions="querySearchSalesMan"
								:trigger-on-focus="false"
							></el-autocomplete>
							<p class="errorNotice" v-if="salesManValid.status">{{ salesManValid.text }}</p>
						</el-form-item>
						<el-form-item label="联系方式" class="fromItem">
							<el-input v-model="formData.salesmanPhone" :disabled="true"></el-input>
						</el-form-item>
					</div>
					<div v-else>
						<el-form-item label="快递公司" class="fromItem">
							<el-autocomplete
								:maxlength="15"
								placeholder="请选择快递公司"
								@focus="foucsLogCompany"
								@blur="validateLogCompany(formData.logCompany)"
								v-model="formData.logCompany"
								:fetch-suggestions="querySearchLogCompany"
								:trigger-on-focus="false"
							></el-autocomplete>
							<p class="errorNotice" v-if="logCompanyValid.status">{{ logCompanyValid.text }}</p>
						</el-form-item>
						<el-form-item label="快递单号" class="fromItem">
							<el-input :maxlength="20" @blur="validateDid(formData.did)" v-model="formData.did" placeholder="请输入快递单号"></el-input>
							<p class="errorNotice" v-if="didValid.status">{{ didValid.text }}</p>
						</el-form-item>
					</div>
				</el-form>
				<Detail :orderid="orderIdProps" @valid="validOrderIdByApi" @getOrderStatus="getOrderStatus" />
				<div slot="footer" class="dialog-footer" align="center">					
					<el-button :disabled="submitStatus" class="submit" type="primary" @click.native="submit">
						<barcode value="submit" :options="barcode_option" tag="svg" ></barcode>
					</el-button>
					<p class="noticeText">{{ submitNotice }}</p>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../components/Dialog/Dialog';
	import Detail from '../DetailInfo/DetailInfo';
	export default {
		props: [ 'changeDialogStatus' ],
		components: { Dialog, Detail },
		data() {
			return {
				formData: {
					"createtime": "",
					"did": "",
					"finishtime": new Date(),
					"id": "",
					"logCompany": "",
					"logisticsType": "发货",
					"orderId": "",
					"productType": "1",
					"salesman": "",
					"salesmanPhone": "",
					"sendtype": "0",
					"status": "",
  					"userId": "admin",
  					"processnode": ""
				},
				logCompanyList: [],
				orderIdProps: ''	,
				orderIdValid: {
                    status: false,
                    text: ''
                },
                salesManValid: {
                    status: false,
                    text: ''
                },
                logCompanyValid: {
                    status: false,
                    text: ''
                },
                didValid: {
                    status: false,
                    text: ''
                },
                salesmansList: [],
                submitBtnDisabled: true,
                autofocusOrderId: true,
                submitNotice: '该状态下不能进行发货',
                submitStatusWithOrderStatus: false,
				barcode_option:{
					format: "CODE128",//选择要使用的条形码类型
					text: '扫码或点击按钮确认订单',
					displayValue: true,//是否在条形码下方显示文字
					textPosition: "bottom",//设置文本的垂直位置
					width: 1,//设置条之间的宽度
					height: 30,//高度
					background: '#fff', //条形码背景颜色
					fontSize: '14px' //字体大小
				},
				orderStatus: '',
			}
		},
		mounted() {
			let code = "";
        	let lastTime = null;
        	let nextTime = null;
        	let lastCode = null;
        	let nextCode = null;
        	let _this = this;
        	_this.$nextTick(() => {
        		_this.$refs.orderId.focus();
        	});
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
	            		if(_this.$refs.orderId) {
	            			_this.validOrderId(code.split('ON')[1]);
	            		}
	            	}else if(code.toUpperCase().indexOf('SUBMIT') !== -1) {
	            		if(!_this.submitStatus && _this.$refs.orderId) {
	            			_this.submit();
	            		}else {
	            			this.$message({
		                        message: '请先填写发货信息',
		                        type: 'error',
		            			duration: 1000,
		                    });
	            		}
	            	}
	                code = '';
	                return false;
	            }
	        }
		},
		computed: {
			canSubmit() {
				
			},
			productType() {
            	return this.formData.productType;
            },
            submitStatus() {
            	let flag = true;
				let orderId = this.formData.orderId && !this.orderIdValid.status;
				let userId = this.formData.userId;
				let finishtime = this.formData.finishtime;
				let sendtype = this.formData.sendtype;
				let logCompany = this.formData.logCompany && !this.logCompanyValid.status;
				let did = this.formData.did && !this.didValid.status;
				let salesman = this.formData.salesman && !this.salesManValid.status;
				if(this.formData.productType === '0') {
					if(this.orderStatus === '0303') {
						if((this.formData.sendtype === '1' && orderId && userId && finishtime && salesman) || (this.formData.sendtype === '0' && orderId && userId && finishtime && logCompany && did)) {
							flag = false;
							this.submitNotice = '扫码或点击确认订单';
						}else {
							flag = true;
							this.submitNotice = '该状态下不能进行发货';
						}
					}else {
						flag = true;
						this.submitNotice = '该状态下不能进行发货';
					}
				}else {
					if(this.orderStatus === '0501' || this.orderStatus === '0502' || this.orderStatus === '0503' || this.orderStatus === '0504' || this.orderStatus === '0505') {
						if((this.formData.sendtype === '1' && orderId && userId && finishtime && salesman) || (this.formData.sendtype === '0' && orderId && userId && finishtime && logCompany && did)) {
							flag = false;
							this.submitNotice = '扫码或点击确认订单';
						}else {
							flag = true;
							this.submitNotice = '该状态下不能进行发货';
						}
					}
					else {
						flag = true;
						this.submitNotice = '该状态下不能进行发货';
					}
				}
				return flag;
            }
		},
		watch: {
			// 发货类型
            productType(curVal, oldVal) {
            	if(curVal === '0') { // 试戴
            		this.formData.status = '0404';
            		this.formData.processnode = '04';
            	}else {
            		this.formData.status = '0505';
            		this.formData.processnode = '05';
            	}
            },
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showDeliverGoodsDialog');
			},
			submit() {
				if(this.formData.orderId.toUpperCase().indexOf('ON') != 0) {
					this.formData.orderId = 'ON' + this.formData.orderId;
				}
				this.$api.post('/factory/order/sendOutProduct', this.formData, res => {
					this.$message({
                        message: '操作成功',
                        duration: 1000,
                        type: 'success',
                        onClose: () => {
                            this.submitSucessCb();
                        }
                    });
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 提交完成之后，清空表单，不关闭弹窗
			submitSucessCb() {
				// 清空输入
				this.formData = {
					"createtime": "",
					"did": "",
					"finishtime": new Date(),
					"id": "",
					"logCompany": "",
					"logisticsType": "发货",
					"orderId": "",
					"productType": "",
					"salesman": "",
					"salesmanPhone": "",
					"sendtype": "",
					"status": "",
  					"userId": "admin",
  					"processnode": ""
				};
				// 清空error提示
				this.orderIdValid = {
                    status: false,
                    text: ''
                };
                this.salesManValid = {
                    status: false,
                    text: ''
                };
                this.logCompanyValid = {
                    status: false,
                    text: ''
                };
                this.didValid = {
                    status: false,
                    text: ''
                };
                // 焦点回到订单编号
                // this.autofocusOrderId = true;
                // 清空订单详情
                this.orderIdProps = '';
			},
			// 获取detail组件，订单的状态，据此判定确定按钮是否禁用
			getOrderStatus(data) {
				// 试戴发货：启用： 生产中-工序生产中
				// 成品发货：启用： 生产完成-成品质检、生产完成-成品消毒、生产完成-包装、生产完成-放行（合格）、生产完成-成品发货
				this.orderStatus = data.status;
				this.formData.status = data.status;
				this.formData.processnode = data.process_node;
			},
			// 获取焦点，获取业务员数据
			foucsSalesMan() {
				this.$api.post('/factory/user/selectSalesmans', null, res => {
					let arr = [];
					res.data.map((item, index) => {
						arr.push({
							value: item.name,
							id: item.id
						})
					});
					this.salesmansList = arr;
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 选择业务员带出业务员电话
			selectSalesmans(val) {
				this.formData.salesmanPhone = val.phone;
			},
			// 校验业务员输入
			validateSalesMan(value) {
				if(value) {
					this.salesManValid = {
	                    status: false,
	                    text: ''
	                }
				}else {
					this.salesManValid = {
	                    status: true,
	                    text: '请输入业务员姓名'
	                }
				};
				this.autofocusOrderId = false;
			},
			// 查询业务员
			querySearchSalesMan(queryString, cb) {
				let salesmansList = this.salesmansList;
				let results = queryString ? salesmansList.filter(this.createFilter(queryString)) : salesmansList;
				// 调用 callback 返回建议列表的数据
				if(results.length != 0){
					this.salesManValid = {
	                    status: false,
	                    text: ''
	                }
				}else {
					this.salesManValid = {
	                    status: true,
	                    text: '该业务员不存在'
	                }
				};
				cb(results);
			},
			// 获取焦点，获取快递公司数据
			foucsLogCompany() {
				this.logCompanyList = [
					{ value: '顺丰快递', id: '1' },
					{ value: '韵达快递', id: '2' },
					{ value: '中通快递', id: '3' },
					{ value: '申通快递', id: '4' },
					{ value: '圆通快递', id: '5' }
				];
			},
			// 输入校验快递公司
			validateLogCompany(value) {
				if(value) {
					this.logCompanyValid = {
	                    status: false,
	                    text: ''
	                }
				}else {
					this.logCompanyValid = {
	                    status: true,
	                    text: '请选择快递公司'
	                }
				}
			},
			// 查询快递公司
			querySearchLogCompany(queryString, cb) {
				let logCompanyList = this.logCompanyList;
				let results = queryString ? logCompanyList.filter(this.createFilter(queryString)) : logCompanyList;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			// 校验快递单号输入
			validateDid(value) {
				if(value) {
					this.didValid = {
						status: false,
						text: ''
					}
				}else {
					this.didValid = {
						status: true,
						text: '请输入快递单号'
					}
				}
			},
			createFilter(queryString) {
				return (res) => {
					return (res.value.toLowerCase().indexOf(queryString.toLowerCase())  != -1);
				};
			},
			// 校验订单编号输入
			validOrderId(value) {
				if(!value.match(/^[a-zA-Z0-9]{8,10}$/)){
                    this.orderIdValid = {
                        status: true,
                        text: '订单编号输入错误'
                    };
                    this.orderIdProps = '';
                }else{
                	// 请求接口，判断是否已被打印，在回调里面做判断   ---  该编号不存在
                	this.orderIdValid = {
                        status: false,
                        text: ''
                    };
                    this.orderIdProps = this.formData.orderId;
                };
			},
			// blur订单编号时如果数据库该订单无效，则提示文字，通过detail组件回调的形式，组件查询不到信息则可以认定为该订单无效
			validOrderIdByApi() {
				this.orderIdValid = {
                    status: true,
                    text: '该编号不存在'
                };
                this.orderIdProps = '';
			}
		}
	}
</script>

<style lang="less">
	@import url('./DeliverGoods.less');
</style>