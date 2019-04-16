<template>
	<div>
		<Dialog className="addProduct" title="新建物料" @closeDialog="closeDialog">
			<div class="slotDiv">
				<el-form :model="addFormData" label-position="left" label-width="80px" ref="addForm">
					<div class="baseInfo">
						<el-form-item label="物料名称" class="fromItem isRequired" prop="name">
							<el-input @blur="validName(addFormData.name)" maxlength="20" placeholder="请输入物料名称" v-model="addFormData.name"></el-input>
							<p class="errorNotice" v-if="nameValid.status">{{ nameValid.text }}</p>
						</el-form-item>
						<el-form-item label="修复类型" class="fromItem isRequired" prop="type">
							<el-select @blur="validType(addFormData.type)" @change="validType(addFormData.type)" v-model="addFormData.type" placeholder="请选择修复类型">
								<el-option
									v-for="item in typeList"
									:key="item.value"
									:label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
							<p class="errorNotice" v-if="typeValid.status">{{ typeValid.text }}</p>
						</el-form-item>
						<el-form-item label="物料类别" class="fromItem isRequired" prop="category">
							<el-select @blur="validCategory(addFormData.category)" @change="validCategory(addFormData.category)" v-model="addFormData.category" placeholder="请选择物料类别" @focus="getCategoryData">
								<el-option
									v-for="item in categoryList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
							<p class="errorNotice" v-if="categoryValid.status">{{ categoryValid.text }}</p>
						</el-form-item>
						<el-form-item label="规格型号" class="fromItem" prop="model">
							<el-input @blur="validModel(addFormData.model)" maxlength="20" placeholder="请输入规格型号" v-model="addFormData.model" auto-complete="off"></el-input>
							<p class="errorNotice" v-if="modelValid.status">{{ modelValid.text }}</p>
						</el-form-item>
						<el-form-item label="单位" class="fromItem" prop="unit">
							<el-input maxlength="8" placeholder="请输入单位" v-model="addFormData.unit" auto-complete="off"></el-input>
						</el-form-item>
						<el-form-item label="生产周期" class="fromItem miniInput" prop="productionCycle">
							<el-input @blur="validWithDot(addFormData.productionCycle, 4, 'productionCycleValid')" maxlength="4" placeholder="请输入生产周期" v-model="addFormData.productionCycle"></el-input>天
							<p class="errorNotice" v-if="productionCycleValid.status">{{ productionCycleValid.text }}</p>
						</el-form-item>
						<el-form-item label="质保期" class="fromItem miniInput" prop="warrantyPeriod">
							<el-input @blur="validWithDot(addFormData.warrantyPeriod, 8, 'warrantyPeriodValid')" maxlength="8" placeholder="请输入质保期" v-model="addFormData.warrantyPeriod"></el-input>年
							<p class="errorNotice" v-if="warrantyPeriodValid.status">{{ warrantyPeriodValid.text }}</p>
						</el-form-item>
						<el-form-item label="质保卡" class="fromItem" prop="card">
							<el-select @focus="getCardData" v-model="addFormData.card" placeholder="请选择质保卡模板">
								<el-option
									v-for="item in cardList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="fromItem"></el-form-item>
						<el-form-item label="备注" class="fromItem remarks" prop="remarks">
							<el-input maxlength="100" type="textarea" :rows="3" resize="none" v-model="addFormData.remarks" auto-complete="off"></el-input>
						</el-form-item>
					</div>
					<div class="calcNumber">
						<el-form-item label="计数方式" class="fromItem isRequired" prop="countingType">
							<el-select @change="validCountingType(addFormData.countingType)" @blur="validCountingType(addFormData.countingType)" v-model="addFormData.countingType" placeholder="请选择计数方式">
								<el-option
									v-for="item in countingTypeList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
							<p class="errorNotice" v-if="countingTypeValid.status">{{ countingTypeValid.text }}</p>
						</el-form-item>
						<el-form-item class="fromItem inputCountingType">
							<el-input @blur="validInputCountingType(inputCountingType)" v-if="addFormData.countingType == '手动输入'" maxlength="20" v-model="inputCountingType" placeholder="请手动输入计数方式"></el-input>
							<p class="errorNotice" v-if="inputCountingTypeValid.status">{{ inputCountingTypeValid.text }}</p>
						</el-form-item>
						<el-form-item class="fromItem"></el-form-item>
						<el-form-item label="单价" class="fromItem isRequired miniInput" prop="unitPrice">
							<el-input @blur="validWithDot(addFormData.unitPrice, 8, 'unitPriceValid', true)" maxlength="8" placeholder="请输入单价" v-model="addFormData.unitPrice"></el-input>元
							<p class="errorNotice" v-if="unitPriceValid.status">{{ unitPriceValid.text }}</p>
						</el-form-item>
						<el-form-item label="封顶价" class="fromItem miniInput" prop="cappedPrice">
							<el-input @blur="validWithDot(addFormData.cappedPrice, 8, 'cappedPriceValid')" maxlength="8" placeholder="请输入封顶价" v-model="addFormData.cappedPrice"></el-input>元
							<p class="errorNotice" v-if="cappedPriceValid.status">{{ cappedPriceValid.text }}</p>
						</el-form-item>
					</div>
					<div class="pro">
						<el-form-item label="生产工艺" class="fromItem isRequired" prop="processId ">
							<el-select @change="validProcessId(addFormData.processId)" @blur="validProcessId(addFormData.processId)" @focus="getProcessData" popper-class="autoHeight" v-model="addFormData.processId" placeholder="请选择生产工艺">
								<el-option
									v-for="item in processIdList"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
							<p class="errorNotice" v-if="processIdValid.status">{{ processIdValid.text }}</p>
						</el-form-item>
						<el-form-item label="检验标准" class="fromItem isRequired" prop="testId">
							<el-select @change="validTestId(addFormData.testId)" @blur="validTestId(addFormData.testId)" @focus="getTestData" popper-class="autoHeight" v-model="addFormData.testId" placeholder="请选择检验标准">
								<el-option
									v-for="item in testIdList"
									:key="item.id"
									:label="item.templateName"
									:value="item.id">
								</el-option>
							</el-select>
							<p class="errorNotice" v-if="testIdValid.status">{{ testIdValid.text }}</p>
						</el-form-item>
					</div>
					<div class="materiel">
						<p class="title">物料追溯</p>
						<div class="content">
							<div class="left">
								<p>使用物料</p>
							</div>
							<div class="right">
								<div class="materielUl">
									<div class="materielItem" v-for="(item, index) in addFormData.materielList" :key="index">
										<el-autocomplete
											placeholder="请输入物料名称"
											class="meterialId"
											@focus="getMeterialData"
											v-model="item.meterialId"
											:maxlength="15"
											:fetch-suggestions="querySearchMeterialId"
											:trigger-on-focus="false"
										></el-autocomplete>
										<el-input class="useAmount" placeholder="请输入物料用量" v-model="item.useAmount"></el-input>
										<p class="unit">{{ changeUnit(item.meterialId) || '克' }}</p>
										<el-button @click.native="deleteMateriel(index)" class="delete" type="text">删除</el-button>
									</div>
								</div>
								<el-button @click.native="addMateriel" class="addMateriel" type="text">添加</el-button>
							</div>
						</div>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer" align="center">
					<el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit">确 定</el-button>
					<el-button class="cancel" @click.native="closeDialog">取 消</el-button>
				</div>
			</div>
		</Dialog>
	</div>	
</template>

<script type="text/javascript">
	import Dialog from '../../../../../../components/Dialog/Dialog';
	export default {
		props: [ 'changeDialogStatus' ],
		components: { Dialog },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				addFormData: {
					"cappedPrice": "",
					"card": "",
					"category": "",
					"countingType": "",
					"materielList": [{ meterialId: '', useAmount: '', unit: '克' }],
					"model": "",
					"name": "",
					"processId": "",
					"productionCycle": "",
					"remarks": "",
					"testId": "",
					"type": "",
					"unit": "",
					"unitPrice": "",
					"warrantyPeriod": ""
				},
				typeList: [
					{ name: '固定修复', value: '0' },
					{ name: '活动修复', value: '1' }
				],
				categoryList: [],
				cardList: [],
				countingTypeList: [
					{ name: '按牙位计数', id: '按牙位计数' },
					{ name: '全口计数', id: '全口计数' },
					// { name: '手动输入', id: '手动输入' }
				],
				processIdList: [],
				testIdList: [],
				publicInstrumentList: [],
				nameValid: statusObj,
				typeValid: statusObj,
				categoryValid: statusObj,
				modelValid: statusObj,
				productionCycleValid: statusObj,
				warrantyPeriodValid: statusObj,
				countingTypeValid: statusObj,
				unitPriceValid: statusObj,
				cappedPriceValid: statusObj,
				processIdValid: statusObj,
				testIdValid: statusObj,
				inputCountingTypeValid: statusObj,
				submitBtnDisabled: false,	
				materielTotalData: [],
				inputCountingType: ''
			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let name = this.addFormData.name && !this.nameValid.status;
				let type = this.addFormData.type && !this.typeValid.status;
				let category = this.addFormData.category && !this.categoryValid.status;
				let model = !this.modelValid.status;
				let productionCycle = !this.productionCycleValid.status;
				let warrantyPeriod = !this.warrantyPeriodValid.status;
				let countingType = this.addFormData.countingType && !this.countingTypeValid.status;
				let inputCountingType = this.addFormData.countingType == '手动输入' && !this.inputCountingTypeValid.status;
				let unitPrice = this.addFormData.unitPrice && !this.unitPriceValid.status;
				let cappedPrice = !this.cappedPriceValid.status;
				let processId = this.addFormData.processId && !this.processIdValid.status;
				let testId = this.addFormData.testId && !this.testIdValid.status;
				if(name && type && category && model && productionCycle && warrantyPeriod && countingType && unitPrice && cappedPrice && processId && testId) {
					flag = true; 
				}else {
					flag = false;
				};
				return flag;
			}
		},
		watch: {
			canSubmit(curVal,oldVal) {
				if(curVal) {
					this.submitBtnDisabled = false;
					this.submitNotice = '扫码或点击确认订单';
				}else {
					this.submitBtnDisabled = true;
					this.submitNotice = '当前状态不可入检';
				}
            }
        },
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false,'showAddDialog');
			},
			submit() {
				// 解析物料List
				let materielList = [];
				let countingType = '';
				let postData = {};
				this.addFormData.materielList.map((item, index) => {
					this.materielTotalData.map((item2, index2) => {
						if(item.meterialId == item2.name) {
							materielList.push({
								meterialId: item2.id,
								useAmount: item.useAmount
							});
						}
					});
				});
				// 解析计数方式
				if(this.addFormData.countingType == '手动输入') {
					countingType = this.inputCountingType;
				}else {
					countingType = this.addFormData.countingType;
				}
				postData = {
					"cappedPrice": this.addFormData.cappedPrice,
					"card": this.addFormData.card,
					"category": this.addFormData.category,
					"countingType": countingType,
					"materielList": materielList,
					"model": this.addFormData.model,
					"name": this.addFormData.name,
					"processId": this.addFormData.processId,
					"productionCycle": this.addFormData.productionCycle,
					"remarks": this.addFormData.remarks,
					"testId": this.addFormData.testId,
					"type": this.addFormData.type,
					"unit": this.addFormData.unit,
					"unitPrice": this.addFormData.unitPrice,
					"warrantyPeriod": this.addFormData.warrantyPeriod
				};
				this.$api.post('/product/product/save', postData, res => {
					this.$message({
                	 	message: '操作成功',
                        type: 'success',
                        onClose: () => {
                            this.submitSucessCb();
                        }
                    })
				}, res => {
					this.$message.error(res.msg);
				});
			},
			submitSucessCb() {
				let initValidStatus = {
					status: false,
					text: ''
				};
				this.addFormData = {
					"cappedPrice": "",
					"card": "",
					"category": "",
					"countingType": "",
					"materielList": [{ meterialId: '', useAmount: '', unit: '克' }],
					"model": "",
					"name": "",
					"processId": "",
					"productionCycle": "",
					"remarks": "",
					"testId": "",
					"type": "",
					"unit": "",
					"unitPrice": "",
					"warrantyPeriod": ""
				};
				this.nameValid = initValidStatus;
				this.typeValid = initValidStatus;
				this.categoryValid = initValidStatus;
				this.modelValid = initValidStatus;
				this.productionCycleValid = initValidStatus;
				this.warrantyPeriodValid = initValidStatus;
				this.countingTypeValid = initValidStatus;
				this.unitPriceValid = initValidStatus;
				this.cappedPriceValid = initValidStatus;
				this.processIdValid = initValidStatus;
				this.testIdValid = initValidStatus;
			},
			// 校验产品名称输入
			validName(value) {
				if(value) {
					if(value.length < 2) {
						this.nameValid = {
							status: true,
							text: '产品名称应为2-20字符'
						}
					}else {
						this.nameValid = {
							status: false,
							text: ''
						}
					}
				}else {
					this.nameValid = {
						status: true,
						text: '产品名称不能为空'
					}
				}
			},
			// 校验修复类型输入
			validType(value) {
				if(value) {
					this.typeValid = {
						status: false,
						text: ''
					}
				}else {
					this.typeValid = {
						status: true,
						text: '修复类型不能为空'
					}
				}
			},
			// 聚焦产品类别，获取产品类别下拉数据
			getCategoryData() {
				this.$api.get('/product/category/tree', null, res => {
					// 解析树结构为 XX-XX-XX
					const getLastChild = (arr, tree, parentName) => {
						tree.map(ch => {
							const { name, id, children, parentId } = ch;
							const _name = parentId ? `${parentName}-${name}` : name;
							if(!children.length) {
								arr.push({
									name: _name,
									id,
								});
							}
							if (children.length) getLastChild(arr, children, _name);
						});
						return arr;
					}
					this.categoryList = getLastChild([], res.data, '');
                });
			},
			// 校验产品类别输入
			validCategory(value) {
				if(value) {
					this.categoryValid = {
						status: false,
						text: ''
					}
				}else {
					this.categoryValid = {
						status: true,
						text: '产品类别不能为空'
					}
				}
			},
			// 遍历category tree
			getLastChild(arr, tree, parentName) {
				tree.map(ch => {
    				const { name, id, resTypeTree, parentId } = ch;
    				const _name = parentId ? `${parentName}-${name}` : name;
    				if (!resTypeTree.length) {
      					arr.push({
        					name: _name,
        					id,
      					});
					}
    				if (resTypeTree.length) this.getLastChild(arr, resTypeTree, _name);
    				return arr;
    			})
			},
			// 校验规格型号输入
			validModel(value) {
				if(value.length > 0 && value.length < 2) {
					this.modelValid = {
						status: true,
						text: '规格型号应为2-20字符'
					}
				}else {
					this.modelValid = {
						status: false,
						text: ''
					}
				}
			},
			// 校验生产周期,质保期，单价，封顶价输入(带小数点)
			validWithDot(value, length, valid, isRequired) {
				let val = Number(value);
				if(isRequired) {
					if(value) {
						if(val > 0) {
							this[valid] = {
								status: false,
								text: ''
							}
						}else {
							this[valid] = {
								status: true,
								text: '输入应为大于0的实数'
							}
						}
					}else {
						this[valid] = {
							status: true,
							text: '单价不能为空'
						}
					}
				}else {
					if(val > 0 || value == '') {
						this[valid] = {
							status: false,
							text: ''
						}
					}else {
						this[valid] = {
							status: true,
							text: '输入应为大于0的实数'
						}
					}
				}
			},
			// 聚焦质保卡，获取质保卡模板数据
			getCardData() {
				this.$api.get('/quality/card/find', null, res => {
					this.cardList = res.data;
                });
			},
			// 校验计数方式
			validCountingType(value) {
				if(value) {
					this.countingTypeValid = {
						status: false,
						text: ''
					}
				}else {
					this.countingTypeValid = {
						status: true,
						text: '计数方式不能为空'
					}
				}
				if(value == '全口计数' || value == '按牙位计数') {
					this.inputCountingTypeValid = {
						status: false,
						text: ''
					}
				}
			},
			// 校验手动计数输入
			validInputCountingType(value) {
				if(value.length < 2) {
					this.inputCountingTypeValid = {
						status: true,
						text: '计数方式应为2-20字符'
					}
				}else {
					this.inputCountingTypeValid = {
						status: false,
						text: ''
					}
				}
			},
			// 聚焦生产工艺，获取生产工艺下拉数据
			getProcessData() {
				this.$api.post('/process/route/shorter', null, res => {
					this.processIdList = res.data;
                });
			},
			// 校验生产工艺必填
			validProcessId(value) {
				if(value) {
					this.processIdValid = {
						status: false,
						text: ''
					}
				}else {
					this.processIdValid = {
						status: true,
						text: '生产工艺不能为空'
					}
				}
			},
			// 聚焦检验标准，获取检验标准下拉数据
			getTestData() {
				this.$api.post('/qc/template/selectEndProduct', null, res => {
					this.testIdList = res.data;
                });
			},
			// 校验检验标准必填
			validTestId(value) {
				if(value) {
					this.testIdValid = {
						status: false,
						text: ''
					}
				}else {
					this.testIdValid = {
						status: true,
						text: '检验标准不能为空'
					}
				}
			},
			// 添加一行物料
			addMateriel() {
				this.addFormData.materielList.push({
					meterialId: '', 
					useAmount: '',
					unit: '克'
				});
			},
			// 删除指定行物料
			deleteMateriel(index) {
				this.addFormData.materielList.splice(index, 1);
			},
			// 聚焦物料名称，获取物料数据
			getMeterialData() {
				this.$api.get('/select/publicInstrument', null, res => {
					this.publicInstrumentList = [];
					this.materielTotalData = res.data;
					res.data.map((item, index) => {
						this.publicInstrumentList.push({
							value: item.name,
							id: item.id
						});
					});
                });
			},
			querySearchMeterialId(queryString, cb) {
				let publicInstrumentList = this.publicInstrumentList;
				let results = queryString ? publicInstrumentList.filter(this.createFilter(queryString)) : publicInstrumentList;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (res) => {
					return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			// 选择物料名称，修改对应单位
			changeUnit(data) {
				let unit = '';
				this.materielTotalData.map((item, index) => {
					if(item.name == data) {
						unit = item.unit;
					}
				});
				return unit;
			}
		}
	}
</script>

<style lang="less">
	@import url(./Add.less);
</style>
		