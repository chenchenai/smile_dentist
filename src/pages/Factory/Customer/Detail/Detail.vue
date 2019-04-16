<template>
	<div class="customerDetail">
		<Dialog className="customerDetailDialog" :title="baseInfo.customerName" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="postionBtns">
					<el-button type="text" @click="editCustomer">编辑</el-button>
					<el-button type="text" @click="deleteCustomer">删除</el-button>
				</div>
				<div class="tabs">
					<p @click="clickTab(item)" v-for="item in tabsData" :class="item.isActive ? 'isActive' : ''">{{item.name}}</p>
				</div>
				<div class="tabContent baseInfoContent" v-if="tabIndex === 0">
					<el-form class="top" label-position="left" label-width="82px" ref="addForm">
						<el-form-item label="客户类型" class="fromItem">
							<p>{{ createType(baseInfo.create_type) }}</p>
						</el-form-item>
						<el-form-item label="客户简称" class="fromItem">
							<p>{{ baseInfo.name }}</p>
						</el-form-item>
						<el-form-item label="联系人" class="fromItem">
							<p>{{ baseInfo.contacts }}</p>
						</el-form-item>
						<el-form-item label="手机号" class="fromItem">
							<p>{{ baseInfo.mobile }}</p>
						</el-form-item>
						<el-form-item label="电话" class="fromItem">
							<p>{{ baseInfo.tel }}</p>
						</el-form-item>
						<el-form-item label="邮箱" class="fromItem">
							<p>{{ baseInfo.email }}</p>
						</el-form-item>
						<el-form-item label="业务员" class="fromItem">
							<p>{{ baseInfo.sales_man_name }}</p>
						</el-form-item>
						<el-form-item label="报价方案" class="fromItem">
							<p>{{ baseInfo.quote_type_name }}</p>
						</el-form-item>
						<el-form-item label="" class="fromItem">
							<p></p>
						</el-form-item>
						<el-form-item label="营业执照" class="fromItem">
							<p>{{ baseInfo.license_regnum }}</p>
						</el-form-item>
						<el-form-item label="营业许可证" class="fromItem">
							<p>{{ baseInfo.license_code }}</p>
						</el-form-item>
						<el-form-item label="" class="fromItem">
							<p></p>
						</el-form-item>
						<el-form-item label="备注" class="fromItem remarks">
							<p>{{ baseInfo.remark }}</p>
						</el-form-item>
					</el-form>
				</div>
				<div class="tabContent doctorInfoContent" v-else-if="tabIndex === 1">
					<el-button type="text" @click="addDoctor" class="addDoctorBtn">添加医生</el-button>
					<el-table :data="doctorInfo" style="width: 100%" border height="334">
		                <el-table-column prop="name" align="center" label="医生名称"></el-table-column>
		                <el-table-column prop="tel" align="center" label="联系电话"></el-table-column>
		                <el-table-column align="center" label="操作">
		                	<template slot-scope="scope">
		                		<el-button type="text" @click="editDoctor(scope.row)">编辑</el-button>
								<el-button type="text" @click="deleteDoctor(scope.row.id)">删除</el-button>
		                	</template>
		                </el-table-column>
		            </el-table>
				</div>
				<div class="tabContent priceContent" v-else-if="tabIndex === 2">
					<el-table :data="priceInfo" style="width: 100%">
						<el-table-column prop="name" label="产品名称" align="center"></el-table-column>
						<el-table-column prop="spec" label="规格型号" align="center"></el-table-column>
						<el-table-column label="单价" align="center">
							<el-table-column prop="unit" label="单位" align="center"></el-table-column>
							<el-table-column prop="guide_price" label="原价" align="center"></el-table-column>
							<el-table-column prop="real_price" label="实际价" align="center"></el-table-column>
						</el-table-column>
						<el-table-column label="封顶价" align="center">
							<el-table-column prop="top_price" label="原价" align="center"></el-table-column>
							<el-table-column prop="real_top_price" label="实际价" align="center"></el-table-column>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</Dialog>
		<template>
			<el-dialog :title="doctorDialogTitle" :visible.sync="doctorDialog" class="doctorDialog" @close="cancelAddDoctor">
				<el-form :model="addDoctorRowData" label-position="left" label-width="82px" ref="addDoctorRowData" :rules="rules">
					<el-form-item label="医生名称" prop="name">
						<el-input @keyup.enter.native="enterInput('addName')" ref="addName" :maxlength="10" placeholder="请输入医生名称" v-model="addDoctorRowData.name"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="tel">
						<el-input @keyup.enter.native="enterInput('addTel')" ref="addTel" :maxlength="11" placeholder="请输入电话号码" v-model="addDoctorRowData.tel"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer" align="center">
					<el-button class="submit" type="primary" @click="saveAddDoctor" ref="saveAddDoctor">确 定</el-button>
					<el-button class="cancel" @click="cancelAddDoctor">取 消</el-button>
				</div>
			</el-dialog>
		</template>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../components/Dialog/Dialog';
	export default {
		components: {Dialog},
		props: ['changeDialogStatus', 'selectCustomerId', 'openAddDialog'],
		data() {
			const validateName = (rule, value, callback) => {
				// 必填项，2-10个字符，
                // 为空，在弹窗顶部toast提示“医生名称不能为空”；
                // 输入少于2个字符，在弹窗顶部toast提示“至少输入2个字符”；
                // 输入字符超过10个字符，不再输入；
                // 当医生名称字段输入有误，输入框获取焦点高亮显示，直到医生名称输入正确，联系电话字段的输入框自动获取焦点；
        		if (value.length < 2) {
          			callback(new Error('至少输入2个字符'));
          			this.$refs.addName.focus();
        		} else {
        			this.$refs.addTel.focus();			
          			callback();
    			}
      		};
      		const validateTel = (rule, value, callback) => {
				// 11位数字，手机号格式校验
                // 格式错误，在弹窗顶部toast提示“联系电话格式错误”；
                // 当医生名称和联系电话校验通过，自动保存新增医生信息
                // 通过点击列表中的某条数据，可以实时修改
                const r = /^1\d{10}$/;
        		if(!r.test(value)) {
          			callback(new Error('联系电话格式错误'));
          			this.$refs.addTel.focus();	
        		} else {
        			if(this.addDoctorRowData.name.length < 2) {
        				this.$refs.addName.focus();
        			}
          			callback();
    			}
      		};
			return {
				customerDetailInfo: {},
				tabsData: [
					{name: '基础信息', isActive: true, index: 0},
					{name: '医生信息', isActive: false, index: 1},
					{name: '报价详情', isActive: false, index: 2}
				],
				tabIndex: 0,
				baseInfo: {},
				doctorInfo: [],
				priceInfo: [],
				addDoctorRowData: {
					name: '',
					tel: ''
				},
				addNameHasValidate: false,
				addTelHasValidate: false,
				doctorDialog: false,
				rules: {
					name: [
						{ validator: validateName, trigger: 'blur' }
					],
					tel: [
						{ validator: validateTel, trigger: 'blur' }
					]
				},
				doctorDialogTitle: '添加医生',
				hasSelectedDoctorId: ''
			}
		},
		created() {
			this.getBaseInfo();
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showDetailDialog');
			},
			// 点击tab
			clickTab(data) {
				this.tabsData.map((item, index) => {
					if(item.name === data.name) {
						item.isActive = true;
						this.tabIndex = index;
					}else {
						item.isActive = false;
					}
				});
				if(data.index === 0) {
					this.getBaseInfo();
				}else if(data.index === 1) {
					this.getDoctorInfo();
				}else if(data.index === 2) {
					this.getPriceSchemeInfo();
				}
			},
			// 获取客户详情基础信息
			getBaseInfo() {
				this.$api.post('/order/user/selectClientByUnitId', {clinicUnitId: this.selectCustomerId}, res => {
                    this.baseInfo = res.data ? res.data : {};
                });
			},
			// 客户类型解析
			createType(type) {
				let str = '';
				if(type === 0) {
					str = '线上客户';
				}else if(type === 1) {
					str = '自有客户';
				}
				return str;
			},
			// 获取医生信息
			getDoctorInfo() {
				this.$api.post('/clinic/user/selectAllDoctors', {clinicUnitId: this.selectCustomerId}, res => {
                   	this.doctorInfo = res.data;
                });
			},
			// 添加医生
			addDoctor() {
				this.addDoctorRowData = {};
				this.doctorDialogTitle = '添加医生';
				this.doctorDialog = true;
			},
			// 删除医生
			deleteDoctor(id) {
				this.$confirm('医生删除后无法恢复，确认删除?', '删除', {
					confirmButtonText: '取消',
					cancelButtonText: '确定删除',
					center: true,
					customClass: 'alertDialog',
					showClose: false
				}).then(() => {
					
				}).catch(() => {
					this.$api.post('/clinic/user/delDoctor', {id: [id]}, res => {
						this.$message({
		            	 	message: res.msg,
		                    type: 'success',
		                    duration: 1000,
		                    onClose: () => {
		                        this.getDoctorInfo();
		                    }
		                })
					}, res => {
						this.$message({
		            	 	message: res.msg,
		                    type: 'error',
		                    duration: 1000
		                })
					});
				});
			},
			// 编辑医生
			editDoctor(data) {
				this.doctorDialogTitle = '编辑医生';
				this.doctorDialog = true;
				this.addDoctorRowData = {...data};
				this.addDoctorRowData.id = data.id;
			},
			enterInput(refName) {
				this.$refs[refName].blur();
			},
			saveAddDoctor() {
				this.$refs.addDoctorRowData.validate((valid) => {
		          	if (valid) {
		            	this.$api.post('/clinic/user/addDoctor', {
		            		clinicUnitId: this.selectCustomerId,
		            		name: this.addDoctorRowData.name,
		            		tel: this.addDoctorRowData.tel,
		            		id: this.addDoctorRowData.id
		            	}, res => {
		            		this.$message({
			            	 	message: res.msg,
			            	 	duration: 1000,
			                    type: 'success',
			                    onClose: () => {
			                        this.getDoctorInfo();
		            				this.cancelAddDoctor();
			                    }
			                })
		                }, res => {
							this.$message({
			            	 	message: res.msg,
			            	 	duration: 1000,
			                    type: 'error'
			                })
						});
		          	} else {
		            	return false;
		          	}
		        });
			},
			cancelAddDoctor() {
				this.$refs.addDoctorRowData.resetFields();
				this.doctorDialog = false;
			},
			// 获取报价详情信息
			getPriceSchemeInfo() {
				this.$api.post('/priceScheme/selectPriceScheme', {clinicId: this.selectCustomerId}, res => {
                    this.priceInfo = res.data.length > 0 ? res.data[0].priceSchemeItems : [];
                });
			},
			// 点击编辑，关闭详情弹窗，携带id，打开新建弹窗
			editCustomer() {
				this.closeDialog();
				this.$emit('openAddDialog', 1);
			},
			// 删除客户
			deleteCustomer() {
				// this.$confirm('删除后无法恢复，确认删除?', '删除', {
				// 	confirmButtonText: '取消',
				// 	cancelButtonText: '确定删除',
				// 	center: true,
				// 	customClass: 'alertDialog',
				// 	showClose: false
				// }).then(() => {
					
				// }).catch(() => {
				// 	this.$api.post('/product/product/delete', {ids: [this.productDetailId]}, res => {
				// 		this.$message({
		  //           	 	message: res.msg,
		  //                   type: 'success',
		  //                   onClose: () => {
		  //                       this.closeDialog();
		  //                   }
		  //               })
				// 	}, res => {
				// 		this.$message({
		  //           	 	message: res.msg,
		  //                   type: 'error'
		  //               })
				// 	});
				// });
			},
		}
	}
</script>

<style lang="less">
	@import url('./Detail.less');
</style>
