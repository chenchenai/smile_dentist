<template>
	<div class="Photograph">
		<el-dialog class="photographDialog" :visible.sync="showThis" :show-close="false" :close-on-click-modal="false">
			<el-button id="closeDialog" type="text" icon="el-icon-close" class="closeDialog"></el-button>		
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
            	<object id="eloamplugin1" type="application/x-eloamplugin" width="800" height="300" name="view"></object>
			<div class="eloamplugin2Box" style="float: right;">
				<object id="eloamplugin2" type="application/x-eloamplugin" width="200" height="200" name="thumb"></object>
			</div>				
            </div>
            <div class="needPack" v-if="!isImport">
            	<el-checkbox v-model="needPack">同时包装</el-checkbox>	
            </div>
            <div slot="footer" class="dialog-footer" align="center">	            					
				<el-button class="submit" id="submitPhotograph" type="primary">
					<barcode value="submit" :options="barcode_option" tag="svg"></barcode>
				</el-button>
				<p class="noticeText">{{ submitNotice }}</p>
			</div>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../components/Dialog/Dialog';
	import $ from 'jquery';
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
				Video: null
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
	            			_this.$message.error('请输入可试戴回件的订单编号');
	            		}
	            	}
	            	
	                code = '';
	                return false;
	            }
	        }
	      	var DeviceMain;//主头
	      	var Video;//视频
	      	function plugin() {
              	return document.getElementById('eloamplugin1');
          	} 
          	function view() {
              	return document.getElementById('eloamplugin1');
          	}   
	      	function thumb() {
              	return document.getElementById('eloamplugin2');
          	}
	      	function addEvent(obj, name, func) {
          		if (obj.attachEvent) {
                  	obj.attachEvent("on"+name, func);
              	} else {
                  	obj.addEventListener(name, func, false); 
              	}
          	}
	      	function OpenVideo() {    
		        var dev = DeviceMain;
		        var nResolution = 0;
		        var SelectType = 2;
		        Video = plugin().Device_CreateVideo(dev, nResolution, SelectType);
		        if (Video) {
		          	view().View_SelectVideo(Video);
		          	view().View_SetText("打开视频中，请等待...", 0);		            
		        }        
	      	} 
	      	function CloseVideo() {
		        if (Video) {
		          	view().View_SetText("", 0);
		          	plugin().Video_Release(Video);
		          	Video = null;
		        }    
	      	}  
	      	function Load() {
		        //设备接入和丢失
		        //type设备类型， 1 表示视频设备， 2 表示音频设备
		        addEvent(plugin(), 'DevChange', function (type, idx, dbt) {
		          	if(1 == type) {
		            	if(1 == dbt) {
		              		var deviceType = plugin().Global_GetEloamType(1, idx);
		              		if(1 == deviceType) {
		                		if(null == DeviceMain) {
		                  			DeviceMain = plugin().Global_CreateDevice(1, idx);                    
		                  			if(DeviceMain) {
		                    			OpenVideo();//是主头自动打开视频
		                  			}
		                		}
		              		}
		            	} else if(2 == dbt) {}
		          	}
		        });
		        var title = document.title;
		        document.title = title + plugin().version;      
		        view().Global_SetWindowName("view");
		        thumb().Global_SetWindowName("thumb");
		        plugin().Global_InitDevs();
	      	}
	      	function Unload() {
		        if (Video) {
		          	view().View_SetText("", 0);
		          	plugin().Video_Release(Video);
		          	Video = null;
		        }
		        if(DeviceMain) {
		          	plugin().Device_Release(DeviceMain);
		          	DeviceMain = null;  
		        }
		        plugin().Global_DeinitDevs();
	      	}
	      	function Scan(e, vm) {
		        var isInout = true;
		        var number = vm.formData.number ? vm.formData.number : 'orderNumber';
		        var inoutType = vm.tabsData[0].isActive ? '_in' : '_out';
		        var Name = "C:\\" + 'ON' +  number + inoutType + ".jpg";  
		        var httpImgUrl = vm.$api.exportNewSysBaseUrl() + '/img/productinout/' + 'ON' +  number + inoutType + ".jpg";
		        var uploadUrl = vm.$api.exportNewSysBaseUrl() + '/file/upload?type=1';  
		        var img = plugin().Video_CreateImage(Video, 0, view().View_GetObject());
		        var bSave = plugin().Image_Save(img, Name, 0);
		        if (bSave) {
              		view().View_PlayCaptureEffect();
              		thumb().Thumbnail_Clear(false);
              		thumb().Thumbnail_Add(Name);
              		thumb().Thumbnail_SetCheck(0, true);
			      	var isUploadSuccess;
			      	setTimeout(() => {
				    	isUploadSuccess = thumb().Thumbnail_HttpUploadCheckImage(uploadUrl, 0); 
				    	var postData =  {
							flag: vm.tabsData[0].isActive ? 1 : 0,
							orderNumber: 'ON' + vm.formData.number,
							path: httpImgUrl,
							type: 1,
							date: vm.formData.date.getTime()
				      	};
				      	if(isUploadSuccess) {
							vm.$api.post('/factory/order/takep', postData, res => {
								// 是否同时包装
								if(!vm.tabsData[0].isActive && vm.needPack) {
									let data = {
										date: _this.formData.date.getTime(),
										orderNumber: [_this.formData.number]
									};
									_this.$api.post('/factory/order/packing', data, res => {
										_this.$message({
						            	 	message: res.msg,
						                    type: 'success',
						                    //onClose: () => {
						                        //thumb().Thumbnail_Clear(true);
									  			//vm.formData = {
									    			//number: '',
													//date: new Date()
									  			//};
									  			//vm.orderInfo = [];
						                    //}
						                })
									});
								}else {
									vm.$message({
					            	 	message: '操作成功',
					                    type: 'success',
					                    //onClose: () => {
					                        //thumb().Thumbnail_Clear(true);
								  			//vm.formData = {
								    			//number: '',
												//date: new Date()
								  			//};
								  			//vm.orderInfo = [];
					                    //}
					                })
								}
							});
				      	}
			      	}, 1000);    
	            }
		        plugin().Image_Release(img);
	      	}
	      	function isIE() {
		        return !!window.ActiveXObject || "ActiveXObject" in window;
	       	}
	      	_this.$nextTick(() => {
		        if(isIE()) {
		          	Load();
		          	document.getElementById('submitPhotograph').onclick = (e) => {
		            	Scan(e, _this);
		          	};
		        }else {
		          	console.log('请使用ie浏览器打开');
		        }		        
	      	});
	      	_this.$nextTick(() => {
		        document.getElementById('closeDialog').onclick = () => {
		          	_this.$emit('photographDialog', false);
		          	if(isIE()) {
		            	Unload();
		          	}
		        	}
		      });  
	      	window.addEventListener('beforeunload', () => {
	        	if(isIE()) {
	          		Unload();
	        	}
	      	})  
	    },
		computed: {
			showThis() {
				return this.showPhotographDialog;
			}
		},
		methods: {
			// -------------------------------------------
			closeDialog() {
				this.$emit('photographDialog', false);
				this.$nextTick(() => {
					this.CloseVideo();
				})
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