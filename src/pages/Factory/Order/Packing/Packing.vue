<template>
	<div class="Packing">
		<Dialog className="packingDialog" title="包装" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="notPrint">
					<el-form class="form" :model="formData" label-position="left" label-width="70px" ref="addForm">
						<el-form-item label="订单编号" class="fromItem">
							<el-input ref="number" :autofocus="true" maxlength="10" v-model="formData.number" @blur="validOrderId(formData.number)"></el-input>
							<p class="errorNotice" v-if="numberValid.status">{{ numberValid.text }}</p>
						</el-form-item>				
						<el-form-item label="操作人" class="fromItem">
							<el-input v-model="formData.userId" :disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="操作时间" class="fromItem date">
							<el-date-picker
								v-model="formData.date"
								type="date"
								:editable="false"
								:clearable="false">
							</el-date-picker>
						</el-form-item>					
					</el-form>
					<el-checkbox v-model="printType">打印出货单</el-checkbox>
					<!-- <el-radio-group v-model="printType">
					    <el-radio v-for="item in printTypeData" :key="item" :label="item">{{item}}</el-radio>
				  	</el-radio-group> -->
					<Detail v-if="!isBatchPacking" :orderid="orderIdProps" @valid="validOrderIdByApi" />
					<BatchPacking v-else :orderid="orderIdProps" @valid="validOrderIdByApi" @getBatchPackingOrderList="getBatchPackingOrderList" :clearTableData="clearTableData" />
					<div slot="footer" class="dialog-footer" align="center">										
						<el-button :disabled="submitBtnDisabled" class="submit" @click="submit">
							<barcode value="submit" :options="barcode_option" tag="svg" ></barcode>
						</el-button>
						<el-button v-if="!isBatchPacking" class="left" @click="batchPacking">批量包装</el-button>
						<el-checkbox v-else v-model="isRelease">同步放行</el-checkbox>
					</div>
				</div>
				<div class="print">
					测试打印区域
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import $ from 'jquery'
	import Detail from '../DetailInfo/DetailInfo';
	import Dialog from '../../../../components/Dialog/Dialog';
	import BatchPacking from './BatchPacking';
	export default {
		props: [ 'changeDialogStatus' ],
		components: { Dialog, Detail, BatchPacking },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				formData: {
					number: '',
					userId: 'admin',
					date: new Date()
				},
				printType: '',
				isRelease: false,
				isBatchPacking: false,
				clearTableData: false,
				printTypeData: ['打印出货单', '打印合格证', '打印检验报告', '打印追溯标识'],
				orderIdProps: '',
				submitBtnDisabled: true,
				numberValid: statusObj,
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
				batchPackingOrderList: []
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let number = this.formData.number && !this.numberValid.status;
				let userId = this.formData.userId;
				let date = this.formData.date;
				if(number && userId && date) {
					flag = true; 
				}else {
					flag = false;
				}
				return flag;
			}
		},
		watch: {
			canSubmit(curVal,oldVal) {
				this.submitBtnDisabled = !curVal;
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
		                        message: '请输入可包装的订单编号',
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
				this.$emit('changeDialogStatus', false, 'showPackingDialog');
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
                	this.numberValid = {
                        status: false,
                        text: ''
                    };                                                                                                
                    this.orderIdProps = this.formData.number;
                };
			},
			getBatchPackingOrderList(list) {
				this.batchPackingOrderList = list;
			},
			submit() {
				let data = {
					date: this.formData.date.getTime(),
					orderNumber: []
				};
				if(this.isBatchPacking) {
					data.orderNumber = this.batchPackingOrderList;
				}else {
					data.orderNumber = [this.formData.number];
				}
				this.$api.post('/factory/order/packing', data, res => {
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
				this.formData = {
					number: '',
					userId: 'admin',
					date: new Date()
				};
				this.numberValid = {
					status: false,
                    text: ''
				}
				// 焦点回到订单编号
                this.$nextTick(() => {
	        		this.$refs.number.focus();
	        	});
                // 清空订单详情
                this.orderIdProps = '';
                // 清空批量里面的表格数据
                this.clearTableData = true;
			},
			// blur订单编号时如果数据库该订单无效，则提示文字，通过detail组件回调的形式，组件查询不到信息则可以认定为该订单无效
			validOrderIdByApi() {
				this.orderIdValid = {
                    status: true,
                    text: '该编号不存在'
                };
                this.orderIdProps = '';
			},
			batchPacking() {
				this.isBatchPacking = true;
			}
		}
	}
</script>

<style lang="less">
	@import url('./Packing.less');
	@import url("./print.less") print;
</style>