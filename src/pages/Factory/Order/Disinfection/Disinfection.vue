<template>
	<div class="EndProDisinfection">
		<Dialog className="endProDisinfectionDialog" :title="dialogTitle" @closeDialog="closeDialog">
			<div class="slotDiv">
				<el-form class="form" :model="formData" label-position="left" label-width="70px" ref="addForm">
					<el-form-item label="订单编号" class="fromItem">
						<el-input @keyup.enter.native="enterNumberInput" ref="number" placeholder="请输入订单编号" :autofocus="true" maxlength="10" v-model="formData.number" @blur="validOrderId(formData.number)"></el-input>
						<p class="errorNotice" v-if="numberValid.status">{{ numberValid.text }}</p>
					</el-form-item>				
					<el-form-item label="消毒人" class="fromItem">
						<el-input v-model="userId" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="消毒开始时间" class="fromItem date">
						<!-- <el-date-picker
							v-model="formData.date"
							type="date"
							:editable="false"
							:clearable="false">
						</el-date-picker> -->
						<el-date-picker
					      	v-model="formData.date"
					      	:editable="false"
							:clearable="false"
					      	type="datetime">
					    </el-date-picker>
						<p class="errorNotice" v-if="dateValid.status">{{ dateValid.text }}</p>
					</el-form-item>
					<el-form-item label="消毒时长" class="fromItem timeLength">
						<el-input placeholder="请输入消毒时长" @blur="validDurationMin(formData.durationMin)" v-model="formData.durationMin" :maxlength="3"></el-input>分
						<p class="errorNotice" v-if="durationMinValid.status">{{ durationMinValid.text }}</p>
					</el-form-item>
					<el-form-item label="消毒设备" class="fromItem">
						<el-autocomplete
							:maxlength="7"
							placeholder="请输入设备名称"
							@focus="foucsDevId"
							@select="selectDevId"
							v-model="formData.devId"
							:fetch-suggestions="querySearchDevId"
							:trigger-on-focus="false"
						></el-autocomplete>
						<p class="errorNotice" v-if="devIdValid.status">{{ devIdValid.text }}</p>
					</el-form-item>
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
		props: [ 'changeDialogStatus', 'disinfectionType' ],
		components: { Dialog, Detail },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				formData: {
					number: '',
					date: new Date(),
					durationMin: '30',
					devId: ''
				},
				userId: 'admin',
				orderIdProps: '',
				numberValid: statusObj,
                dateValid: statusObj,
                durationMinValid: statusObj,
                devIdValid: statusObj,
                devIdData: [],
                submitBtnDisabled: true,
                submitStatusWithOrderStatus: false,
                submitNotice: '',
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
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let number = !!this.formData.number && !this.numberValid.status;
				let userId = this.userId;
				let date = this.formData.date;
				let durationMin = !!this.formData.durationMin && !this.durationMinValid.status;
				let devId = true;
				if(this.formData.devId) {
					if(!this.devIdValid.status) {
						devId = true;
					}else {
						devId = false;
					}
				}
				if(number && userId && date && durationMin && devId) {
					flag = true; 
				}else {
					flag = false;
				}				
				return flag;
			},
			dialogTitle() {
				return this.disinfectionType == 1 ? '模型消毒' : '成品消毒';
			},
			submitStatus() {
				return !(this.submitStatusWithOrderStatus && !this.submitBtnDisabled);
			}
		},
		watch: {
			canSubmit(curVal,oldVal) {
                if(curVal && this.submitStatusWithOrderStatus) {               	
					this.submitBtnDisabled = false;
					this.submitNotice = '扫码或点击按钮确认订单';
				}else {
					this.submitBtnDisabled = true;
					if(this.disinfectionType == 1) {
						this.submitNotice = '该状态下不能进行模型消毒';
					}else {
						this.submitNotice = '该状态下不能进行成品消毒';
					}
				}
            },
            submitStatusWithOrderStatus(curVal,oldVal) {
                if(curVal && this.canSubmit) {
                	this.submitBtnDisabled = false;
					this.submitNotice = '扫码或点击按钮确认订单';
				}else {
					this.submitBtnDisabled = true;
					if(this.disinfectionType == 1) {
						this.submitNotice = '该状态下不能进行模型消毒';
					}else {
						this.submitNotice = '该状态下不能进行成品消毒';
					}
				}
            }
		},
		created() {
			if(this.disinfectionType == 1) {
				this.submitNotice = '该状态下不能进行模型消毒';
				this.formData.durationMin = '30';
			}else {
				this.submitNotice = '该状态下不能进行成品消毒';
				this.formData.durationMin = '5';
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
        		_this.$refs.number.focus();
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
	            		_this.formData.number = code;
	            		if(_this.$refs.number) {
	            			_this.validOrderId(code.split('ON')[1]);
	            		}
	            	}else if(code.toUpperCase().indexOf('SUBMIT') !== -1) {
	            		if(_this.canSubmit && _this.$refs.number) {
	            			_this.submit();
	            		}else {
	            			_this.$message({
		                        message: '请先填写消毒信息',
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
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showDisinfectionDialog');
			},
			submit() {
				this.formData.date = this.formData.date.getTime();
				if(this.formData.number.toUpperCase().indexOf('ON') != 0) {
					this.formData.number = 'ON' + this.formData.number;
				}
				if(this.disinfectionType == 1) {
					// 模型消毒
					this.$api.post('/factory/order/modeldisinfection', this.formData, res => {
						this.$message({
	                        message: '操作成功',
	                        type: 'success',
	                        duration: 1000,
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
				}else if(this.disinfectionType == 2) {
					// 成品消毒
					this.$api.post('/factory/order/productdisinfection', this.formData, res => {
						this.$message({
	                        message: '操作成功',
	                        type: 'success',
	                        duration: 1000,
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
				}else {
					// type值错误
					alert('type值错误')
				}
			},
			// 提交完成之后，清空表单，不关闭弹窗
			submitSucessCb() {
				// 清空输入
				this.formData = {
					number: '',
					date: '',
					durationMin: '',
					devId: ''
				};
                this.$refs.number.focus();
                // 清空订单详情
                this.orderIdProps = '';
			},
			// 获取detail组件，订单的状态，据此判定确定按钮是否禁用
			getOrderStatus(data) {
				if(this.disinfectionType == 1) {
					if(data.status === '0202' || data.status === '0301') {
						this.submitStatusWithOrderStatus = true;
					}else {
						this.submitStatusWithOrderStatus = false;
					}
				}else {
					if(data.status === '0501' || data.status === '0502') {
						this.submitStatusWithOrderStatus = true;
					}else {
						this.submitStatusWithOrderStatus = false;
					}
				}
			},
			// 获取消毒设备数据
			foucsDevId() {
				this.devIdData = this.$tool.getDevIdData();
			},
			// 查询消毒设备
			querySearchDevId(queryString, cb) {
				let devIdData = this.devIdData;
				let results = queryString ? devIdData.filter(this.createFilter(queryString)) : devIdData;
				if(results.length > 0) {
					this.devIdValid = {
						status: false,
						text: ''
					}
				}else {
					this.devIdValid = {
						status: true,
						text: '该设备不存在'
					}
				}
				cb(results);
			},
			// 选择消毒设备
			selectDevId(value) {
				this.formData.devId = value.value;
			},
			createFilter(queryString) {
				return (res) => {
					return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
				};
			},
			enterNumberInput() {
				this.$refs.number.blur()
			},
			// 校验订单编号输入
			validOrderId(value) {
				if(!value.match(/^[a-zA-Z0-9]{8,10}$/)){
                    this.numberValid = {
                        status: true,
                        text: '订单编号输入错误'
                    };
                    this.orderIdProps = '';
                }else{
                	// 请求接口，判断是否已被打印，在回调里面做判断   ---  该编号不存在
                	let orderNumber = '';
                	if(value.substr(0, 2) === 'ON') {
                		orderNumber = value;
                	}else {
                		orderNumber = 'ON' + value;
                	}
                	this.$api.post('/factory/order/checkOrderNumber', {orderNum: orderNumber}, res => {}, res => {
                		if(res.msg === '该订单编号不存在') {
                			this.numberValid = {
								status: true,
								text: '该编号未关联订单'
							}
                		}else {
                			this.numberValid = {
		                        status: false,
		                        text: ''
		                    };
		                    this.orderIdProps = this.formData.number;
                		}
                	});
                	// this.numberValid = {
                 //        status: false,
                 //        text: ''
                 //    };
                 //    this.orderIdProps = this.formData.number;
                };
			},
			// blur订单编号时如果数据库该订单无效，则提示文字，通过detail组件回调的形式，组件查询不到信息则可以认定为该订单无效
			validOrderIdByApi() {
				this.orderIdValid = {
                    status: true,
                    text: '该编号不存在'
                };
                this.orderIdProps = '';
			},
			// 校验消毒时长输入
			validDurationMin(value) {
				if(!value.match(/^[0-9]{0,3}$/)){
                    this.timeLengthValid = {
                        status: true,
                        text: '请输入正确的消毒时长'
                    };
                }else{
                	this.timeLengthValid = {
                        status: false,
                        text: ''
                    };
                };
			},
			// 校验消毒设备输入
			validDevId(value) {

			}
		}
	}
</script>

<style lang="less">
	@import url('./Disinfection.less');
</style>