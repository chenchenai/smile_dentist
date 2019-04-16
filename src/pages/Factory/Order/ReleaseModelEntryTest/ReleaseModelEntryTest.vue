<template>
	<div class="ReleaseModelEntryTest">
		<Dialog className="deliverGoodsDialog" :title="dialogTitle" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="scrollBox">
					<el-form class="form" :model="formData" label-position="left" label-width="82px" ref="addForm">
						<el-form-item label="订单编号" class="fromItem">
							<el-input ref="orderId" placeholder="请输入订单编号" :autofocus="true" maxlength="10" v-model="formData.orderId" @blur="validOrderId(formData.orderId)"></el-input>
							<p class="errorNotice" v-if="orderIdValid.status">{{ orderIdValid.text }}</p>
						</el-form-item>				
						<el-form-item :label="userLabel" class="fromItem">
							<el-input v-model="userId" :disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="放行日期" class="fromItem">
							<el-date-picker
								v-model="formData.date"
								type="date"
								:editable="false"
								:clearable="false">
							</el-date-picker>
						</el-form-item>
					</el-form>
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
		            <el-table
		                :data="checkInfo"
		                class="checkTable"
		                border
		                v-if="type == 1"
		                style="width: 100%">
		                <el-table-column
		                    prop="sortNo"
		                    align="center"
		                    label="编号">
		                </el-table-column>
		                <el-table-column
		                    prop="itemName"
		                    align="center"
		                    label="质检项目">
		                </el-table-column>
		                <el-table-column
		                    prop="standard"
		                    align="center"
		                    label="质检标准">
		                </el-table-column>
		                <el-table-column
		                    align="center"
		                    label="结果">
		                    <template slot-scope="scope" >
								<el-radio v-model="scope.row.allowedNumber" label="0">合格</el-radio>
								<el-radio v-model="scope.row.allowedNumber" label="1">不合格</el-radio>
							</template>
		                </el-table-column>
		            </el-table>
		            <el-table
		                :data="checkInfo"
		                class="checkTable"
		                border
		                v-else
		                style="width: 100%">
		                <el-table-column
		                    prop="itemName"
		                    align="center"
		                    label="检验条目">
		                </el-table-column>
		                <el-table-column
		                    prop="standard"
		                    align="center"
		                    label="检验标准">
		                </el-table-column>
		                <el-table-column
		                    align="center"
		                    label="结果">
		                    <template slot-scope="scope" >
		                    	<el-radio-group v-model="scope.row.allowedNumber" @change="checkIsAllowed(scope.row)">
								    <el-radio label="0">合格</el-radio>
								    <el-radio label="1">不合格</el-radio>
							  	</el-radio-group>
								<!-- <el-radio v-model="scope.row.allowedNumber" label="0">合格</el-radio>
								<el-radio v-model="scope.row.allowedNumber" label="1">不合格</el-radio> -->
							</template>
		                </el-table-column>
		            </el-table>
		        </div>
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
		props: [ 'changeDialogStatus', 'type' ],
		components: { Dialog, Detail },
		data() {
			return {
				formData: {
					"date": new Date(),
					"orderId": ""
				},
				orderInfo: [],
				checkInfo: [],
				userId: "admin",
				orderIdValid: {
                    status: false,
                    text: ''
                },
                checkInfoStatus: true,
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
		created() {
			this.getTemplateData();	
			if(this.type == 1) {
				this.submitNotice = '该状态下不能进行模型入检';
			}else {
				this.submitNotice = '该状态下不能进行放行';
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
	            		if(_this.canSubmit && _this.$refs.orderId) {
	            			_this.submit();
	            		}else {
	            			if(_this.type === 1) {
	            				_this.$message({
			                        message: '请输入可进入模型入检的订单编号',
			                        type: 'error',
			            			duration: 1000,
			                    });
	            			}else{
	            				_this.$message({
			                        message: '请输入可放行的订单编号',
			                        type: 'error',
			            			duration: 1000,
			                    });
	            			}
	            		}
	            	}
	            	
	                code = '';
	                return false;
	            }
	        }
		},
		computed: {
			canSubmit() {
				// 订单号不为空，放行标准不为空，并且放行每条标准是否允许合格生效
				let flag = false;
				let orderId = this.orderInfo.length > 0;
				let userId = this.userId;
				let date = this.formData.date;
				let checkInfo = this.checkInfo.length > 0;
				if(orderId && userId && !!date && checkInfo) {
					flag = true; 
				}else {
					flag = false;
				}
				return flag;
			},
			dialogTitle() {
				return this.type == 1 ? '模型入检' : '放行';
			},
			userLabel() {
				return this.type == 1 ? '检验人' : '放行人';
			},
			tableThLiat() {
				let arr = [];
				if(this.type == 1) {
					arr = [
						{ label: '编号', prop: 'sortNo'},
						{ label: '质检项目', prop: 'itemName'},
						{ label: '质检标准', prop: 'standard'},
						{ label: '结果', prop: 'allowedNumber'}
					];
				}else {
					arr = [
						{ label: '检验条目', prop: 'itemName'},
						{ label: '检验标准', prop: 'standard'},
						{ label: '结果', prop: 'allowedNumber'}
					];
				}
				return arr;
			},
			submitStatus() {
				return !(this.submitStatusWithOrderStatus && !this.submitBtnDisabled);
			}
		},
		watch: {
			canSubmit(curVal,oldVal) {
                if(curVal && this.submitStatusWithOrderStatus) {
					this.submitBtnDisabled = false;
					this.submitNotice = '扫码或点击确认订单';
				}else {
					this.submitBtnDisabled = true;
					if(this.type == 1) {
						this.submitNotice = '该状态下不能进行模型入检';
					}else {
						this.submitNotice = '该状态下不能进行放行';
					}
				}
            },
            submitStatusWithOrderStatus(curVal,oldVal) {
                if(curVal && this.canSubmit) {
					this.submitNotice = '扫码或点击按钮确认订单';
				}else {
					if(this.type == 1) {
						this.submitNotice = '该状态下不能进行模型入检';
					}else {
						this.submitNotice = '该状态下不能进行放行';
					}
				}
            },
            checkInfoStatus(curVal,oldVal) {
            	if(curVal) {
            		if(this.canSubmit) {
            			this.submitBtnDisabled = false;
            			this.submitNotice = '扫码或点击按钮确认订单';
            		}else {
            			this.submitBtnDisabled = true;
            			if(this.type == 1) {
							this.submitNotice = '该状态下不能进行模型入检';
						}else {
							this.submitNotice = '该状态下不能进行放行';
						}
            		}
            	}else {
            		this.submitBtnDisabled = true;
            		if(this.type == 1) {
						this.submitNotice = '质检不合格不能模型入检';
					}else {
						this.submitNotice = '质检不合格不能放行';
					}
            	}
            }
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showReleaseModelEntryTestDialog');
			},
			submit() {
				let itemArr = [];
				this.checkInfo.map((item, index) => {
					itemArr.push({
						name: item.itemName,
        				standard: item.standard,
        				id: item.id,
        				isAllowed: item.allowedNumber,
        				isAllowedName: item.allowedNumber == '0' ? '合格' : '不合格'
					});
				});
				let data = {
					"date": this.formData.date.toLocaleString().substr(0,10).split('/').join('-'),
					"item": itemArr,
					"user": "",
					"userId": "",
					"orderId": this.orderInfo[0].id,
					"orderNum": this.formData.orderId.toUpperCase().indexOf('ON') != 0 ? ('ON' + this.formData.orderId) : this.formData.orderId
				};
				if(this.type == 1) {
					this.$api.post('/factory/order/modelCheckIn', data, res => {
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
					this.$api.post('/factory/order/Release', data, res => {
						this.$message({
	                        message: '操作成功',
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
				}
			},
			// 提交完成之后，清空表单，不关闭弹窗
			submitSucessCb() {
				// 清空输入
				this.formData = {
					"date": new Date(),
					"orderId": ""
				};
                // 焦点回到订单编号
                this.$refs.orderId.focus();
                // 清空订单详情
                this.orderInfo = [];
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
	                	this.$api.post('/factory/order/find', { "number": value }, res => {
	                		this.orderIdValid = {
		                        status: false,
		                        text: ''
		                    };
		                    if(this.type === 1) {
		                    	if(res.data.status === '0202' || res.data.status === '0301' || res.data.status === '0302') {
									this.submitStatusWithOrderStatus = true;
								}else {
									this.submitStatusWithOrderStatus = false;
								}
		                    }else {
		                    	if(res.data.status === '0501' || res.data.status === '0502' || res.data.status === '0503' || res.data.status === '0504') {
									this.submitStatusWithOrderStatus = true;
								}else {
									this.submitStatusWithOrderStatus = false;
								}
		                    }
		                    this.orderInfo = [];
		                    this.orderInfo.push(res.data);
	                	}, res => {
		                	if(res.status == '152') {
		                		this.orderIdValid = {
			                        status: true,
			                        text: '该编号未关联订单'
			                    };
			                    this.orderInfo = [];
		                	}else {
		                		this.$notify.error({
		          					title: '错误',
		          					message: res.msg,
		          					position: 'top-left'
		    					});
		                	}
		                })
	                }
				}else {
					this.orderIdValid = {
                        status: true,
                        text: '订单编号不能为空'
                    };
                    this.orderInfo = [];
				}
			},
			// 去除时间时分秒
            formatDate(date) {
                return this.$tool.formatDate(date);
            },
            // 解析产品名称/数量/牙位/比色
            anysisProduceMsg(produceMsg) {                
                return this.$tool.anysisProduceMsg(produceMsg);
            },
            // 获取放行质检模板
            getTemplateData() {
            	if(this.type == 1) {
            		this.$api.post('/qc/template/selectModelCheckIn', null, res => {
	            		res.data.map((item, index) => {
	            			this.checkInfo.push({
	            				sortNo: item.sortNo,
	            				allowedNumber: '0',
	            				itemName: item.itemName,
	            				standard: item.standard,
	            				id: item.itemId,
	            				isAllowed: item.isAllowed
	            			});
	            		});
	            	}, res => {
						this.$message({
	                        message: res.msg,
	                        type: 'error',
	            			duration: 1000,
	                    });
					});
            	}else {
            		this.$api.post('/qc/template/selectPassThrough', null, res => {
	            		res.data.map((item, index) => {
	            			this.checkInfo.push({
	            				allowedNumber: '0',
	            				itemName: item.itemName,
	            				standard: item.standard,
	            				id: item.itemId,
	            				isAllowed: item.isAllowed
	            			});
	            		});
	            	}, res => {
						this.$message({
	                        message: res.msg,
	                        type: 'error',
	            			duration: 1000,
	                    });
					});
            	}
            },
            checkIsAllowed(data) {
            	let statusArr = [];
            	let status = true;
            	this.checkInfo.map((item, index) => {
            		statusArr.push(!(item.isAllowed == 0 && item.allowedNumber == '1'));
            	});
            	statusArr.map((item, index) => {
            		status = status && item;
            	});
            	this.checkInfoStatus = status;
            }
		}
	}
</script>

<style lang="less">
	@import url('./ReleaseModelEntryTest.less');
</style>