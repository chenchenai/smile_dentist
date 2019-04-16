<template>
	<div class="TryToWearBack">
		<Dialog className="tryToWearBackDialog" title="试戴回件" @closeDialog="closeDialog">
			<div class="slotDiv">
				<el-form class="form" :model="formData" label-position="left" label-width="82px" ref="addForm">
					<el-form-item label="订单编号" class="fromItem">
						<el-input ref="orderId" v-model="formData.orderId" placeholder="请输入订单编号" maxlength="10" @blur="validOrderId(formData.orderId)"></el-input>
						<p class="errorNotice" v-if="orderIdValid.status">{{ orderIdValid.text }}</p>
					</el-form-item>				
					<el-form-item label="回件日期" class="fromItem">
						<el-date-picker
							v-model="formData.operationDate"
							type="date"
							:editable="false"
							:clearable="false">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="试戴意见" class="fromItem">
						<el-input maxlength="150" v-model="formData.content" placeholder="请输入患者的试戴意见"></el-input>
					</el-form-item>
				</el-form>
				<Detail :orderid="orderIdProps" @valid="validOrderIdByApi" @getOrderStatus="getOrderStatus" />
				<div slot="footer" class="dialog-footer" align="center">					
					<el-button :disabled="!submitStatusWithOrderStatus" class="submit" type="primary" @click.native="submit">
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
					"content": "",
					"id": "",
					"operation": "回件",
					"operationDate": new Date(),
					"orderId": "",
					"processNode": "03",
					"status": "0303",
					"uid": "admin"
				},
				kuaidilist: [
					{ name: '快递1', id: '1' },
					{ name: '快递2', id: '2' }
				],	
				orderIdValid: {
					status: false,
                    text: ''
				},
				orderIdProps: '',
				submitBtnDisabled: true,	
				submitNotice: '该状态下不能登记回件'	,
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
	            		if(_this.submitStatusWithOrderStatus && _this.$refs.orderId) {
	            			_this.submit();
	            		}else {
	            			_this.$message({
		                        message: '请输入可试戴回件的订单编号',
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
				this.$emit('changeDialogStatus', false, 'showTryToWearBack');
			},
			submit() {
				if(this.formData.orderId.toUpperCase().indexOf('ON') != 0) {
					this.formData.orderId = 'ON' + this.formData.orderId;
				}
				this.$api.post('/factory/order/returnProduct', this.formData, res => {
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
			},
			// 提交完成之后，清空表单，不关闭弹窗
			submitSucessCb() {
				// 清空输入
				this.formData = {
					"content": "",
					"id": "",
					"operation": "回件",
					"operationDate": new Date(),
					"orderId": "",
					"processNode": "03",
					"status": "0303",
					"uid": "admin"
				};
				// 清空error提示
				this.orderIdValid = {
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
				if(data.status === '0401' || data.status === '0403' || data.status === '0404' || data.status === '0406') {
					this.submitStatusWithOrderStatus = true;
					this.submitNotice = '扫码或点击确认订单';
				}else {
					this.submitStatusWithOrderStatus = false;
					this.submitNotice = '该状态下不能登记回件';
				}
			},
			// orderid   03462606
			// 校验订单编号输入
			validOrderId(value) {
				if(!value.match(/^[a-zA-Z0-9]{8,10}$/)){
                    this.orderIdValid = {
                        status: true,
                        text: '订单编号输入错误'
                    };
                    this.orderIdProps = '';
                }else{
                    this.orderIdValid = {
                        status: false,
                        text: ''
                    };
                    this.orderIdProps = this.formData.orderId;
                }
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
	@import url('./TryToWearBack.less');
</style>