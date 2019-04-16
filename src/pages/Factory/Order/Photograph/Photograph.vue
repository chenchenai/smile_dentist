<template>
	<div class="Photograph">
		<el-dialog class="photographDialog" :visible.sync="showThis" :show-close="false" :close-on-click-modal="false">
			<el-button id="closeDialog" type="text" icon="el-icon-close" class="closeDialog" @click="closeDialog"></el-button>		
			<div class="tabs">
				<p @click="clickTab(item)" v-for="item in tabsData" :class="item.isActive ? 'isActive' : ''">{{item.name}}</p>
			</div>
			<el-form class="form" :model="formData" label-position="left" label-width="70px" ref="addForm">
				<el-form-item label="订单编号" class="fromItem">
					<el-input ref="number" maxlength="10" v-model="formData.number" @blur="validOrderId(formData.number)"></el-input>
					<p class="errorNotice" v-if="numberValid.status">{{ numberValid.text }}</p>
				</el-form-item>	
				<el-form-item label="消毒人" class="fromItem">
					<el-input v-model="userId" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="操作时间" class="fromItem date" v-if="isImport">
					<el-date-picker
						v-model="formData.date"
						type="date"
						:editable="false"
						:clearable="false">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<el-table :data="orderInfo" border style="width: 100%">
                <el-table-column prop="number" align="center" width="130" label="订单编号"></el-table-column>
                <el-table-column prop="box_no" align="center" label="盒号"></el-table-column>
                <el-table-column align="center" label="进件日期">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.entry_date) }}</span>
                    </template>
                </el-table-column>                     
                <el-table-column align="center" label="预出日期">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.expected_date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="clinic_name" align="center" label="客户"></el-table-column>
                <el-table-column prop="doctor_name" align="center" label="医生"></el-table-column>
                <el-table-column prop="salesman_name" align="center" label="业务员"></el-table-column>
                <el-table-column prop="patient" align="center" label="患者"></el-table-column>
                <el-table-column align="center" width="280" label="产品名称/数量/牙位">
                    <template slot-scope="scope">
                        <span v-html="anysisProduceMsg(scope.row.orderProduct)"></span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="imgList">
		        <div v-if="showImagewrapper" id="imagewrapper"></div>				
            </div>
            <div class="needPack" v-if="!isImport">
            	<el-checkbox v-model="needPack">同时包装</el-checkbox>	
            </div>
            <div slot="footer" class="dialog-footer" align="center">	            					
				<el-button :disabled="submitStatus" class="submit" id="submitPhotograph" type="primary" @click="submit">
					<barcode value="submit" :options="barcode_option" tag="svg"></barcode>
				</el-button>
				<p class="noticeText">{{ submitNotice }}</p>
			</div>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../components/Dialog/Dialog';
	import './source/jquery-3.2.1.min.js';
	import './source/JsCameraSrv.min.js';
	export default {
		props: [ 'changeDialogStatus', 'showPhotographDialog' ],
		components: { Dialog },
		data() {
			return {
				tabsData: [
					{name: '进件拍照', isActive: true},
					{name: '出件拍照', isActive: false}
				],
				formData: {
					number: '',
					date: new Date()
				},
				userId: 'admin',
				numberValid: {
					status: false,
					text: ''
				},
				orderInfo: [],
				submitBtnDisabled: true,
                submitStatusWithOrderStatus: false,
                submitNotice: '该状态下不能拍照',
                barcode_option:{
					format: "CODE128",//选择要使用的条形码类型
					text: '拍照并上传',
					displayValue: true,//是否在条形码下方显示文字
					textPosition: "bottom",//设置文本的垂直位置
					width: 1,//设置条之间的宽度
					height: 30,//高度
					background: '#fff', //条形码背景颜色
					fontSize: '14px' //字体大小
				},
				submitStatus: true,
				needPack: false,
				isImport: true,
				DeviceMain: null,
				Video: null,
				showImagewrapper: false,
			}
		},
		mounted() {
			var code = "";
        	var lastTime = null;
        	var nextTime = null;
        	var lastCode = null;
        	var nextCode = null;
        	var _this = this;
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

	        // 拍照服务
	        ZK_JSC.View.init(_this.cameraCallback);
	    },
		computed: {
			showThis() {
				return this.showPhotographDialog;
			}
		},
		mounted() {
			console.log(this.$api.exportNewSysBaseUrl() + "/file/upload?type=1")
		},
		methods: {
			// -------------------------------------------
			isChecked(res) {
				if(!res) {
		    		this.$message({
	                    message: '请联系管理员给本机安装拍照服务并设置模板',
	                    type: 'warning',
	                    duration: '5000'
	                });
		    	}else {
		    		ZK_JSC.View.get(this.cameraCallback);
		    	}
			},
			cameraCallback(ret) {
	            if(ret.data){
	            	var _this = this;
	                $("#imagewrapper").css('background-image', 'url(' + ret.data + ')');
	                //这里对base64串进行操作，去掉url头，并转换为byte
					var bytes = window.atob(ret.data.split(',')[1]);
					var ab = new ArrayBuffer(bytes.length);
					var ia = new Uint8Array(ab);
					for(var i = 0; i < bytes.length; i++){
					    ia[i] = bytes.charCodeAt(i); //这里有点疑惑，ia是怎么改变ab的？注：①
					}
					//Blob对象
					var blob = new Blob([ab], {type: 'image/jpeg'}); //type为图片的格式
					//FormData对象
					var fd = new FormData();
					//TDOD Ajax或者其他方式上传FormData对象
					//FormData对象接受三个参数，第三个参数为文件名，通常我们只传前两个参数，第三个参数不传则使用默认文件名，这里使用的Blob对象，所以需要一个文件名，用时间戳代替。
					fd.append('file',blob, Date.now() + '.jpg');
					// 上传图片,获取图片路径
            		$.ajax({
						type: "POST",
						// url: "http://10.10.20.117:9090/file/upload?type=1",
						url: _this.$api.exportNewSysBaseUrl() + "/file/upload?type=1",
						data: fd,
						processData: false,
						contentType: false,
						success: function(res){							
							var number = _this.formData.number ? _this.formData.number : 'orderNumber';
					        var inoutType = _this.isImport ? '_in' : '_out'; 
					        var httpImgUrl = _this.$api.exportNewSysBaseUrl() + '/img/productinout/' + 'ON' +  number + inoutType + ".jpg";
							var postData =  {
								flag: _this.isImport ? 1 : 0,
								orderNumber: 'ON' + _this.formData.number,
								path: res.data[0].path,
								date: _this.formData.date.getTime()
					      	};
					      	// 请求拍照接口，保存拍照和订单信息
					      	_this.$api.post('/factory/order/takep', postData, res => {
								// 是否同时包装
								if(!_this.isImport && _this.needPack) {
									let data = {
										date: _this.formData.date.getTime(),
										orderNumber: [_this.formData.number]
									};
									_this.$api.post('/factory/order/packing', data, res => {
										_this.$message({
						            	 	message: '操作成功',
						                    type: 'success',
			                    			duration: 1000
						                })
									}, res => {
										_this.$message({
						            	 	message: res.msg,
						                    type: 'error',
			                    			duration: 1000
						                })
									});
								}else {
									_this.$message({
					            	 	message: '操作成功',
					                    type: 'success',
		                    			duration: 1000
					                })
								}
							}, res => {
								_this.$message({
				            	 	message: res.msg,
				                    type: 'error',
	                    			duration: 1000
				                })
							});
						},
						error: function(res){
							_this.$message({
			            	 	message: res.msg,
			                    type: 'error',
			                    duration: 1000
			                })
						}
					});
	            }
			},
			submit() {
				this.showImagewrapper = true;
				// 检查计算机是否安装了拍照服务
	    		ZK_JSC.View.check(this.isChecked);
			},
			// -------------------------------------------
			closeDialog() {
				this.$emit('photographDialog', false);
			},
			clickTab(data) {
				this.tabsData.map((item, index) => {
					if(item.name === data.name) {
						item.isActive = true;
						this.tabIndex = index;
					}else {
						item.isActive = false;
					}
				});
				this.isImport = data.name === '进件拍照';
			},
			// 校验订单编号输入
			validOrderId(value) {
				if(!value.match(/^[a-zA-Z0-9]{8,10}$/)){
                    this.numberValid = {
                        status: true,
                        text: '订单编号输入错误'
                    };
                    this.orderInfo = [];
                    this.submitStatus = true;
            		this.submitNotice = '该状态下不能拍照';
                }else{
                	// 请求接口，判断是否已被打印，在回调里面做判断   ---  该编号不存在
                	this.numberValid = {
                        status: false,
                        text: ''
                    };
                    this.$api.post('/factory/order/find', {number: value}, res => {
                    	this.orderInfo = [res.data];
                    	if(res.data.terminate_order === 1 || res.data.terminate_order === 3 || res.data.status === '0701') {
                    		this.submitStatus = true;
                    		this.submitNotice = '该状态下不能拍照';
                    	}else {
                    		this.submitStatus = false;
                    		this.submitNotice = '拍照并上传';
                    	}
	                }, res => {
	                    this.$message.error(res.msg);
	                    this.orderInfo = [];
	                    this.submitStatus = true;
                		this.submitNotice = '该状态下不能拍照';
	                });
                };
			},
			// 去除时间时分秒
            formatDate(date) {
                return this.$tool.formatDate(date);
            },
            // 解析产品名称/数量/牙位/比色
            anysisProduceMsg(produceMsg) {                
                return this.$tool.anysisProduceMsg(produceMsg);
            },
            // 获取detail组件，订单的状态，据此判定确定按钮是否禁用
			getOrderStatus(data) {
				if(data.status === '0202' || data.status === '0301') {
					this.submitStatusWithOrderStatus = true;
				}else {
					this.submitStatusWithOrderStatus = false;
				}
			},
		}
	}
</script>

<style lang="less">
	@import url('./Photograph.less');
</style>