<template>
	<div class="advancedSearch" v-show="visible">
		<div class="searchTitle">
			<p>高级搜索</p>
			<el-button type="text" icon="el-icon-close" @click="close"></el-button>
		</div>
		<el-form :model="form" ref="searchForm">
			<div class="date searchItem">
				<p class="title" style="margin-bottom: 6px">
					<span>日期</span>
					<span></span>
				</p>
				<el-form-item prop="dateType">
					<el-select v-model="form.dateType" placeholder="日期类型" @change="changeDateType">
						<el-option v-for="item in dateTypeList" :label="item.label" :key="item.value" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="datepicker" prop="date">
					<el-date-picker
						v-model="form.date"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
			</div>
			<div class="orderType searchItem">
				<p class="title">
					<span>订单类型</span>
					<span></span>
				</p>
				<el-form-item prop="orderType">
					<el-checkbox-group v-model="form.orderType">
						<el-checkbox v-for="(item, index) in orderTypeList" :label="item.name" :key="index"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</div>
			<div class="orderStatus searchItem">
				<p class="title">
					<span>订单状态</span>
					<span></span>
				</p>
				<el-form-item prop="orderStatus">
					<el-checkbox-group v-model="form.states">
						<el-checkbox v-for="(item, index) in statesList" :label="item.name" :key="index"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</div>
			<div class="searchContent searchItem">
				<p class="title" style="margin-bottom: 6px">
					<span>内容</span>
					<span></span>
				</p>
				<el-form-item prop="boxNo">
					<el-input
						v-model="form.boxNo"
						ref="boxNo"
						@keyup.enter.native="enterInput('boxNo')"
						@blur="validBoxNo(form.boxNo)"
						maxlength="4"
						placeholder="输入盒号"
					></el-input>
					<p class="errorNotice" v-if="boxNoValid.status">{{ boxNoValid.text }}</p>
				</el-form-item>
				<el-form-item prop="salesman">
					<el-input
						v-model="form.salesman"
						ref="salesman"
						@keyup.enter.native="enterInput('salesman')"
						@blur="validSalesman(form.salesman)"
						maxlength="8"
						placeholder="输入业务员姓名"
					></el-input>
					<p class="errorNotice" v-if="salesmanValid.status">{{ salesmanValid.text }}</p>
				</el-form-item>
				<el-form-item prop="clinic">
					<el-input
						v-model="form.clinic"
						maxlength="16"
						ref="clinic"
						@keyup.enter.native="enterInput('clinic')"
						@blur="validClinic(form.clinic)"
						placeholder="输入客户名称"
					></el-input>
					<p class="errorNotice" v-if="clinicValid.status">{{ clinicValid.text }}</p>
				</el-form-item>
				<el-form-item prop="doctor">
					<el-input
						v-model="form.doctor"
						maxlength="8"
						ref="doctor"
						@keyup.enter.native="enterInput('doctor')"
						@blur="validDoctor(form.doctor)"
						placeholder="输入医生姓名"
					></el-input>
					<p class="errorNotice" v-if="doctorValid.status">{{ doctorValid.text }}</p>
				</el-form-item>
				<el-form-item prop="patient">
					<el-input
						v-model="form.patient"
						maxlength="8"
						ref="patient"
						@keyup.enter.native="enterInput('patient')"
						@blur="validPatient(form.patient)"
						placeholder="输入患者姓名"
					></el-input>
					<p class="errorNotice" v-if="patientValid.status">{{ patientValid.text }}</p>
				</el-form-item>
				<el-form-item prop="goodsName">
					<el-input
						v-model="form.goodsName"
						ref="goodsName"
						maxlength="20"
						@keyup.enter.native="enterInput('goodsName')"
						@blur="validGoodsName(form.goodsName)"
						placeholder="输入产品名称"
					></el-input>
					<p class="errorNotice" v-if="goodsNameValid.status">{{ goodsNameValid.text }}</p>
				</el-form-item>
				<el-form-item prop="repairType">
					<el-select v-model="form.repairType" placeholder="修复类型">
						<el-option v-for="item in repairTypeList" :label="item.label" :key="item.value" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</div>
		</el-form>
		<div class="dialog-footer" align="left" style="margin-top: 24px">
			<el-button type="primary" @click="search">搜索</el-button>
			<el-button @click="reset">重置</el-button>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	export default {
		props: ["visible", "changeSearchDialog", "getSearchResults"],
		data() {
			let error = {
				text: '',
				status: false
			}
			return {
				form: {
					dateType: '',
					orderType: ['普通', '返工'],
					states: [],
					date: '',
					boxNo: '',
					salesman: '',
					clinic: '',
					doctor: '',
					patient: '',
					goodsName: '',
					repairType: ''
				},
				boxNoValid: error,
				salesmanValid: error,
				clinicValid: error,
				doctorValid: error,
				goodsNameValid: error,
				patientValid: error,
				postData: {
					"boxNo": '1111',
					"clinic": '刘沅易诊所1',
					"current": 1,
					"dateType": 0,
					"doctor": '刘沅易',
					"startDate": '2018-09-16',
					"goodsName": '2622',
					"isNormal": 1,
					"isRework": 1,
					"isUrgent": 0,
					"orderStates": ['02', '05'],
					"patient": 'string',
					"repairType": null,
					"rowSize": 15,
					"salesman": '王维',
					"endDate": '2018-10-01',
					"terminateOrders": null
				},
				dateTypeList: [
					{label: '进件日期', value: '0'},
					{label: '戴牙日期', value: '1'},
					{label: '预出日期', value: '2'}
				],
				orderTypeList: [
					{name: '普通', id: '1'},
					{name: '返工', id: '2'}
				],
				orderStatesList: [
					{name: '已下单', id: '02'},
					{name: '生产中', id: '03'},
					{name: '试戴', id: '04'},
					{name: '生产完成', id: '05'},
				],
				terminateOrdersList: [
					{name: '已终止', id: '3'},
					{name: '已作废', id: '1'}
				],
				repairTypeList: [
					{label: '所有类型', value: ''},
					{label: '固定类修复', value: '1'},
					{label: '活动类修复', value: '2'}
				]
			}
		},
		computed: {
			statesList() {
				return this.orderStatesList.concat(this.terminateOrdersList);
			}
		},
		methods: {
			close() {
				this.$emit("changeSearchDialog", false);
			},
			beforeClose() {
				this.close();
			},
			// 修改时间类型
			changeDateType(value) {
				this.form.date = [new Date(), new Date()];
			},
			// 搜索
			search() {
				let isNormal = 0;
				let isRework = 0;
				let data = {};
				let orderStates = [];
				let terminateOrders = [];
				this.form.orderType.length > 0 && this.form.orderType.map((item, index) => {
					if(item == '普通') {
						isNormal = 1;
					}
					if(item == '返工') {
						isRework = 1;
					}
				});
				this.form.states.length > 0 && this.form.states.map((item, index) => {
					this.orderStatesList.map((item2, index2) => {
						if(item == item2.name) {
							orderStates.push(item2.id);
						}
					});
					this.terminateOrdersList.map((item3, index3) => {
						if(item == item3.name) {
							terminateOrders.push(Number(item3.id));
						}
					});
				});
				terminateOrders.push(0);
				data = {
					"boxNo": this.form.boxNo,
					"clinic": this.form.clinic,
					"current": 1,
					"dateType": Number(this.form.dateType),
					"doctor": this.form.doctor,
					"endDate": this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD') : null,
					"goodsName": this.form.goodsName,
					"isNormal": isNormal,
					"isRework": isRework,
					"isUrgent": 0,
					"orderStates": orderStates.length > 0 ? orderStates : [],
					"patient": this.form.patient,
					"repairType": this.form.repairType == '' ? null : this.form.repairType,
					"rowSize": 15,
					"salesman": this.form.salesman,
					"startDate": this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD') : null,
					"terminateOrders": terminateOrders.length > 0 ? terminateOrders : null,
					"unitId": ""
				};
				this.$api.post('/factory/order/advancedsearch', data, res => {
                    this.$emit('getSearchResults', !!res.data ? res.data : {}, data);
                    this.close();
                }, res => {
                    this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
                });
			},
			reset() {
				this.$refs.searchForm.resetFields();
			},
			// enter触发
			enterInput(name) {
				this.$refs[name].blur();
			},
			// 校验
			validBoxNo(value) {

			},
			validSalesman(value) {
				this.$api.post('/factory/user/selectSalesmans', null, res => {
					for(let i = 0; i < res.data.length; i++) {
						if(res.data[i].name != value && value != "") {
							this.salesmanValid = {
								text: '该业务员不存在',
								status: true
							}
						}else {
							this.salesmanValid = {
								text: '',
								status: false
							}
							break;
						}
					}
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			validClinic(value) {
				this.$api.post('/clinic/user/selectAllClinicAndDoctor', { unitId: '61ebbd921e874032bfc267736126450d' }, res => {
					for(let i = 0; i < res.data.length; i++) {
						if(res.data[i].clinicName != value && value != "") {
							this.clinicValid = {
								text: '该客户与工厂未建立关系',
								status: true
							}
						}else {
							this.clinicValid = {
								text: '',
								status: false
							}
							break;
						}
					};
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			validDoctor(value) {
				this.$api.post('/clinic/user/selectAllClinicAndDoctor', { unitId: '61ebbd921e874032bfc267736126450d' }, res => {
					for(let i = 0; i < res.data.length; i++) {
						if(res.data[i].bsClinicUsers.length > 0) {
							let item = res.data[i].bsClinicUsers;
							for(let j = 0; j < item.length; j++) {
								if(item[j].name != value && value != "") {
									this.doctorValid = {
										text: '该医生不存在',
										status: true
									}
								}else {
									this.doctorValid = {
										text: '',
										status: false
									};
									break;
								}
							}
						}
					};
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			validPatient(value) {

			},
			validGoodsName(value) {
				this.$api.get('/product/selectProductName', null, res => {
					for(let i = 0; i < res.data.length; i++) {
						if(res.data[i].name != value && value != "") {
							this.goodsNameValid = {
								text: '该产品不存在',
								status: true
							}
						}else {
							this.goodsNameValid = {
								text: '',
								status: false
							}
							break;
						}
					}
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
		}
	}
</script>

<style lang="less">
	@import url('./AdvancedSearch.less');
</style>
