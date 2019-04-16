<template>
	<div class="baseInfo">
		<p class="title">基础信息</p>
		<div class="baseInfoForm">
			<el-form-item label="订单类型" prop="type">
				<el-radio-group v-model="baseInfo.type">
					<el-radio-button label="普通"></el-radio-button>
					<el-radio-button label="返工"></el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="订单编号" prop="number" class="isRequired">
				<el-input 
					@keyup.enter.native="enterInput('number', baseInfo.type == '普通' ? 'boxNo' : 'oldNumber')"
					@blur="blurNumber(baseInfo.number, 1)"
					placeholder="请输入编号上的数字部分" 
					:autofocus="true" 
					maxlength="8" 
					ref="number"
					v-model="baseInfo.number"
				></el-input>
				<p class="errorNotice" v-if="numberValid.status">{{ numberValid.text }}</p>
			</el-form-item>
			<el-form-item label="原订单编号" v-if="baseInfo.type == '返工'" prop="oldNumber" class="isRequired">
				<el-input 
					ref="oldNumber" 
					@keyup.enter.native="enterInput('oldNumber', 'boxNo')"
					@blur="blurNumber(baseInfo.oldNumber, 2)"
					placeholder="请输入编号上的数字部分" 
					maxlength="8" 
					v-model="baseInfo.oldNumber"
				></el-input>
				<p class="errorNotice" v-if="oldNumberValid.status">{{ oldNumberValid.text }}</p>
			</el-form-item>
			<el-form-item label="盒号" prop="boxNo">
				<el-input 
					ref="boxNo" 
					@keyup.enter.native="enterInput('unitClinicIdInput')" 
					@blur="blurBoxNo(baseInfo.boxNo)"
					placeholder="请输入盒号" 
					maxlength="4" 
					v-model="baseInfo.boxNo"
				></el-input>
				<p class="errorNotice" v-if="boxNoValid.status">{{ boxNoValid.text }}</p>
			</el-form-item>
			<el-form-item label="客户名称" ref="unitClinicId" prop="unitClinicId" class="isRequired">
				<el-autocomplete
					ref="unitClinicIdInput"
					:maxlength="16"
					@keyup.enter.native="enterInput('salesMan')"
					@focus="getAllUnitClinicIdData"
					@select="selectUnitClinicId"
					@blur="blurUnitClinicIds(baseInfo.unitClinicId)"
					placeholder="请输入客户名称"
					v-model="baseInfo.unitClinicId"
					:fetch-suggestions="querySearchUnitClinicIds"
					:trigger-on-focus="false"
				></el-autocomplete>
				<p class="errorNotice" v-if="unitIdValid.status">{{ unitIdValid.text }}</p>
			</el-form-item>
			<el-form-item label="业务员" prop="salesMan" class="isRequired">
				<el-autocomplete
					:maxlength="8"
					ref="salesMan"
					@select="selectSalesMan"
					@keyup.enter.native="enterInput('doctor')"
					@focus="getAllSalesManData"
					@blur="blurSalesMan(baseInfo.salesMan)"
					placeholder="请输入业务员姓名"
					v-model="baseInfo.salesMan"
					:fetch-suggestions="querySearchSalesMan"
					:trigger-on-focus="false"
				></el-autocomplete>
				<p class="errorNotice" v-if="salesManValid.status">{{ salesManValid.text }}</p>
			</el-form-item>
			<el-form-item label="医生姓名" prop="doctor" class="isRequired">
				<el-autocomplete
					:maxlength="8"
					ref="doctor"
					placeholder="请输入医生姓名"
					@select="selectDoctor"
					@keyup.enter.native="enterInput()"
					@blur="blurDoctor(baseInfo.doctor)"
					v-model="baseInfo.doctor"
					:fetch-suggestions="querySearchDoctor"
					:trigger-on-focus="false"
				></el-autocomplete>
				<p class="errorNotice" v-if="doctorValid.status">{{ doctorValid.text }}</p>
			</el-form-item>
			<el-form-item label="患者姓名" prop="patient" class="isRequired">
				<el-input 
					ref="patient" 
					@keyup.enter.native="enterInput('requireType')" 
					@blur="blurPatient(baseInfo.patient)"
					placeholder="请输入患者姓名" 
					maxlength="8" 
					v-model="baseInfo.patient"
				></el-input>
				<p class="errorNotice" v-if="patientValid.status">{{ patientValid.text }}</p>
			</el-form-item>
			<el-form-item label="试戴类型" prop="requireType">
				<el-autocomplete
					:maxlength="8"
					ref="requireType"
					@keyup.enter.native="enterInput()"
					placeholder="请选择试戴类型"
					v-model="baseInfo.requireType"
					:fetch-suggestions="querySearchRequireType"
					:trigger-on-focus="true"
				></el-autocomplete>
			</el-form-item>
			<el-form-item label="性别" class="fromItem" prop="sex">
				<el-autocomplete
					v-model="baseInfo.sex"
					:maxlength="0"
					ref="sex"
					@keyup.enter.native="enterInput()"
					placeholder="请输入性别"
					:fetch-suggestions="querySearchSex"
					:trigger-on-focus="true"
				></el-autocomplete>
			</el-form-item>
			<el-form-item label="年龄" class="fromItem" prop="age">
				<el-input 
					ref="age"
					@keyup.enter.native="enterInput()" 
					@blur="blurAge(baseInfo.age)" 
					maxlength="3" 
					placeholder="请输入患者年龄" 
					v-model="baseInfo.age"></el-input>
			</el-form-item>
			<el-form-item label="脸型" class="feature fromItem" prop="feature">
				<el-autocomplete
					v-model="baseInfo.feature"
					:maxlength="0"
					ref="feature"
					@keyup.enter.native="enterInput()" 
					placeholder="请选择患者脸型"
					:fetch-suggestions="querySearchFeature"
					:trigger-on-focus="true"
				></el-autocomplete>
			</el-form-item>
			<el-form-item label="是否加急" prop="addEdService">
				<el-checkbox v-model="baseInfo.addEdService"></el-checkbox>
			</el-form-item>
			<el-form-item label="带牙日期" prop="wearingTeethDate">
				<el-date-picker
					v-model="baseInfo.wearingTeethDate"
					type="date"
					placeholder="请选择戴牙日期"
					:picker-options="pickerOptions"
					:clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="进件日期" prop="entryDate">
				<el-date-picker
					v-model="baseInfo.entryDate"
					type="date"
					:readonly="true"
					:clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="预出日期" prop="expectedDate">
				<el-date-picker
					v-model="baseInfo.expectedDate"
					type="date"
					:clearable="false"
					:picker-options="pickerOptions"
					placeholder="请选择预出日期">
				</el-date-picker>
			</el-form-item>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				requireTypeList: [		      
		          	{ "value": "试冠", id: 0 },
		          	{ "value": "试瓷", id: 1 },
		          	{ "value": "腊牙", id: 2 },
		          	{ "value": "试架", id: 3 },
		          	{ "value": "试颌", id: 4 }
		        ],
		        sexList: [
		        	{value: '男', id: '男'},
		        	{value: '女', id: '女'}
		        ],
		        featureList: [
		          	{ value: "方脸", id: "方脸" },
		          	{ value: "尖脸", id: "尖脸" },
		          	{ value: "卵圆脸", id: "卵圆脸" }
		        ],
		        doctorList: [],
		        unitClinicIdList: [],
				allUnitClinicIdData: [],
		        numberValid: statusObj,
				oldNumberValid: statusObj,
				boxNoValid: statusObj,
				salesManValid: statusObj,
				doctorValid: statusObj,
				patientValid: statusObj,
				unitIdValid: statusObj,
				ageValid: statusObj,
			}
		},
		props: ['data', 'getBaseInfo'],
		computed: {
			baseInfo() {
				return this.data;
			}
		},
		watch: {
			baseInfo: {
				handler(newValue, oldValue) {
					// 参数处理
					let data = {...newValue};
					let hasValidate = false;
					data.addEdService = data.addEdService ? 1 : 0;
					data.type = data.type == '普通' ? 0 : 1;
					data.wearingTeethDate = data.wearingTeethDate ? new Date(data.wearingTeethDate).getTime() : '';
					data.entryDate = new Date(data.entryDate).getTime();
					data.expectedDate = new Date(data.expectedDate).getTime();
					data.doctor = this.getIdByList(data.doctor, this.doctorList);
					data.unitClinicId = this.getIdByList(data.unitClinicId, this.unitClinicIdList);
					data.salesMan = this.getIdByList(data.salesMan, this.salesManList);
					data.requireType = this.getIdByList(data.requireType, this.requireTypeList);
					// 必填项是否输入正确
					let number = !!data.number && !this.numberValid.status;
					let oldNumber = true;
					if(data.type == '返工') {
						if(!!data.oldNumber && !this.oldNumberValid.status) {
							oldNumber = true;
						}else {
							oldNumber = false;
						}
					}else {
						oldNumber = true;
					}
					let unitClinicId = !!data.unitClinicId && !this.unitIdValid.status;					
					let salesMan = !!data.salesMan && !this.salesManValid.status;;
					let doctor = !!data.doctor && !this.doctorValid.status;
					let patient = !!data.patient && !this.patientValid.status;
					hasValidate = number && oldNumber && unitClinicId && salesMan && doctor && patient;
					this.$emit('getBaseInfo', data, hasValidate);
				},
				deep: true
			}
		},
		methods: {
			// 聚焦客户名称，获取诊所和医生数据
			getAllUnitClinicIdData() {
				// this.$api.post('/clinic/user/selectAllClinicAndDoctor', null, res => {
				this.$api.post('/clinic/user/selectAllClinicAndDoctor', { unitId: '61ebbd921e874032bfc267736126450d' }, res => {
					let arr = [];
					res.data.map((item, index) => {
						if(item.clinicName) {
							arr.push({
								value: item.clinicName,
								id: item.unitId
							})
						}
					});
					this.allUnitClinicIdData = res.data;
					this.unitClinicIdList = arr;
				}, res => {
					this.$message.error(res.msg);
				});
			},
			// 聚焦业务员，获取业务员数据
			getAllSalesManData() {
				this.$api.post('/factory/user/selectSalesmans', null, res => {
					let arr = [];
					res.data.map((item, index) => {
						arr.push({
							value: item.name,
							id: item.id
						})
					});
					this.salesManList = arr;
					this.allSalesManData = res.data;
				}, res => {
					this.$message.error(res.msg);
				});
			},
			// 客户名称改变，获取对应的医生数据
			getAllDoctorData() {
				let unitId = this.getIdByList(this.baseInfo.unitClinicId, this.unitClinicIdList);
				let allUnitClinicIdData = this.allUnitClinicIdData;
				let arr = [];
				allUnitClinicIdData.map((item, index) => {
					if(unitId == item.unitId){
						item.bsClinicUsers.length > 0 ? item.bsClinicUsers.map((item2, index2) => {
							arr.push({
								value: item2.name,
								id: item2.id
							});
						}) : '';
					}
				});
				this.doctorList = arr;
			},
			// 选择客户
			selectUnitClinicId(data) {
				this.getAllDoctorData();
				// 带出默认业务员
				this.baseInfo.salesMan = data.sales_man;
				if(data) {
					this.unitIdValid = {
						status: false,
						text: ''
					}
				}
			},
			// 选择业务员
			selectSalesMan(data) {
				if(data) {
					this.salesManValid = {
						status: false,
						text: ''
					}
				}
			},
			// 选择医生
			selectDoctor(data) {				
				if(data) {
					this.doctorValid = {
						status: false,
						text: ''
					}
				}
			},
			// 模糊查询封装
			querySearch(list, queryString, cb, noResultsCb) {
				let arr = this[list];				
				let results = queryString ? arr.filter(this.createFilter(queryString)) : arr;
				noResultsCb && noResultsCb(results);				
				cb(results);
			},
			// 客户名称模糊查询
			querySearchUnitClinicIds(queryString, cb) {
				this.querySearch('unitClinicIdList', queryString, cb, res => {
					this.unitIdNotVisable = res.length > 0 ? false : true;
				});
			},
			// 医生姓名模糊查询
			querySearchDoctor(queryString, cb) {
				this.querySearch('doctorList', queryString, cb);
			},
			// 业务员模糊查询
			querySearchSalesMan(queryString, cb) {
				this.querySearch('salesManList', queryString, cb);
			},
			// 脸部特征模糊查询
			querySearchFeature(queryString, cb) {
				this.querySearch('featureList', queryString, cb);
			},
			// 性别模糊查询
			querySearchSex(queryString, cb) {
				this.querySearch('sexList', queryString, cb);
			},
			// 试戴类型模糊查询
			querySearchRequireType(queryString, cb) {
				this.querySearch('requireTypeList', queryString, cb);
			},
			createFilter(queryString) {
				return (res) => {
					return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
				};
			},
			enterInput(curInput, nextInput) {
				this.$refs[curInput].blur();
				this.$refs[nextInput].focus();
			},
			// 校验订单编号
			blurNumber(value, type) {
				let valid = '';
				if(type == 2) {
					valid = 'oldNumberValid';
				}else {
					valid = 'numberValid';
				}
				if(value) {
					if(!value.match(/\d{8}$/)) {
						this[valid] = {
							status: true,
							text: '该编号不存在'
						}
					}else {
						// TODO发请求   该编号不存在   该订单已在进行中
						this[valid] = {
							status: false,
							text: ''
						}
					}
				}else {
					this[valid] = {
						status: true,
						text: '请输入订单编号'
					}
				}
			},
			blurBoxNo(value) {

			},
			blurUnitClinicIds(value) {
				if(value) {
					for(let i = 0; i < this.allUnitClinicIdData.length; i++) {
						if(value != this.allUnitClinicIdData[i].clinicName) {
							this.unitIdValid = {
								status: true,
								text: '该客户与工厂未建立关系'
							}
						}else {
							this.unitIdValid = {
								status: false,
								text: ''
							}
							return
						}
					}
				}else {
					this.unitIdValid = {
						status: true,
						text: '请选择客户'
					}
				}
			},
			blurSalesMan(value) {
				if(value) {
					if(this.allSalesManData.length > 0) {
						for(let i = 0; i < this.allSalesManData.length; i++) {
							if(value != this.allSalesManData[i].name) {
								this.salesManValid = {
									status: true,
									text: '该业务员不存在'
								}
							}else {
								this.salesManValid = {
									status: false,
									text: ''
								}
								return;
							}
						}
					}else {
						this.salesManValid = {
							status: true,
							text: '该业务员不存在'
						}
					}
				}else {
					this.salesManValid = {
						status: true,
						text: '请选择业务员'
					}
				}
			},
			blurDoctor(value) {
				if(value) {
					for(let i = 0; i < this.doctorList.length; i++) {
						if(value == this.doctorList[i].value) {
							this.doctorValid = {
								status: false,
								text: ''
							}
							return
						}else {
							this.doctorValid = {
								status: true,
								text: '该医生与客户未建立关系'
							}
						}
					}
				}else {
					this.doctorValid = {
						status: true,
						text: '请选择医生姓名'
					}
				}
			},
			blurPatient(value) {
				if(value) {
					this.patientValid = {
						status: false,
						text: ''
					}
				}else {
					this.patientValid = {
						status: true,
						text: '请选择患者姓名'
					}
				}
			},
			blurAge(value) {
				if(value) {
					if(!value.match(/\d{1,3}$/)) {
						this.ageValid = {
							status: true,
							text: '请输入1至3位数字'
						}
					}else {
						this.ageValid = {
							status: false,
							text: ''
						}
					}
				}else {
					this.ageValid = {
						status: false,
						text: ''
					}
				}
			},
			getIdByList(id, list) {
				return this.$tool.getIdByList(id, list);
			}
		}
	}
</script>

<style lang="less">
	@import url('./BaseInfo.less');
</style>