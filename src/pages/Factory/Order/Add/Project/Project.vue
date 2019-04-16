<template>
	<div class="processingProject">
		<div class="title">加工项目</div>
			<div class="content">
				<el-table
					:data="projectInfo.toothData"
					stripe
					:show-header="false"
					class="projectTable validator"
					style="width: 100%">
					<el-table-column
						prop="pos"
						label="牙位"
						class="posTd"
						width="300">
						<template slot-scope="scope">
							<el-form-item label="牙位" prop="pos"  class="requiredThis">
								<div class="posDiv">
									<div class="top">
										<div class="pos1 positem">
											<el-input
												:ref="scope.$index + '-pos0'"
												@keyup.enter.native="enterInput({
													jumpTo: ''
												})"
												@blur="validPostion(scope.row.pos[0], scope)"
												maxlength="8"
												v-model="scope.row.pos[0]"
											></el-input>
										</div>
										<div class="pos2 positem">
											<el-input
												:ref="scope.$index + '-pos1'"
												@keyup.enter.native="enterInput({
													jumpTo: ''
												})"
												@blur="validPostion(scope.row.pos[1], scope)"
												maxlength="8"
												v-model="scope.row.pos[1]"
											></el-input>
										</div>
									</div>
									<div class="bot">
										<div class="pos3 positem">
											<el-input
												:ref="scope.$index + '-pos2'"
												@keyup.enter.native="enterInput({
													jumpTo: ''
												})"
												@blur="validPostion(scope.row.pos[2], scope)"
												maxlength="8"
												v-model="scope.row.pos[2]"
											></el-input>
										</div>
										<div class="pos4 positem">
											<el-input
												:ref="scope.$index + '-pos3'"
												@keyup.enter.native="enterInput({
													jumpTo: ''
												})"
												@blur="validPostion(scope.row.pos[3], scope)"
												maxlength="8"
												v-model="scope.row.pos[3]"
											></el-input>
										</div>
									</div>
									<p class="errorNotice" v-if="scope.row.posValid.status">{{ scope.row.posValid.text }}</p>
								</div>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column
						prop="colorImetric"
						label="产品名称"
						class="colorImetricTd validator"
						width="330">
						<template slot-scope="scope">
							<el-form-item label="产品名称" prop="productCategoryId"  class="isRequired">
								<el-autocomplete
									class="inline-input"
									:ref="scope.$index + '-productCategoryId'"
									@keyup.enter.native="enterInput({
										jumpTo: ''
									})"
									v-model="scope.row.productCategoryId"
									:maxlength="20"
									placeholder="请输入产品名称"
									@select="selectProductCategoryId"
									@focus="getAllProductData"
									@blur="validProduct(scope.row.productCategoryId, scope)"
									:fetch-suggestions="querySearchProductCategoryId"
									:trigger-on-focus="false"
								></el-autocomplete>
								<p class="errorNotice" v-if="scope.row.productValid.status">{{ scope.row.productValid.text }}</p>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column
						prop="colorImetric"
						width="300"
						class="colorImetricTd validator"
						label="比色">
						<template slot-scope="scope">
							<el-form-item label="比色" prop="colorImetric">
								<el-autocomplete
									placeholder="请输入色号"
									:ref="scope.$index + '-colorImetric'"
									@keyup.enter.native="enterInput({
										jumpTo: ''
									})"
									class="inline-input"
									v-model="scope.row.colorImetric"
									:maxlength="15"
									:fetch-suggestions="querySearchColorImetric"
									:trigger-on-focus="false"
								></el-autocomplete>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column
						prop="num"
						width="160"
						class="numTd"
						label="数量">
						<template slot-scope="scope">
							<el-form-item label="数量" prop="num">
								<el-input v-model="scope.row.num" disabled></el-input>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column
						class="addTd"
						label="操作">
						<template slot-scope="scope">
							<el-button
								v-if="!scope.row.del"
								@click.native="addToothRow(scope, $event)"
								type="text">
								+添加牙位
							</el-button>
							<el-button
								v-else
								@click.native="delToothRow(scope)"
								type="text">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
	</div>
</template>

<script>
	export default {
		data() {			
			return {
				allProductCategoryIdData: [],
				colorImetricList: []
			}
		},
		props: ['data', 'getProjectInfo'],
		computed: {
			projectInfo() {
				return this.data;
			}
		},
		watch: {
			projectInfo: {
				handler(newValue, oldValue) {
					// 参数处理
					let data = {...newValue};
					let hasValidate = false;
					let data2 = {
						toothData: []
					};					
					data.toothData.map((item, index) => {
						let pos = [];
						item.pos.map((item2, index2) => {
							pos.push(item2.replace(/\s+/g, ""));
						});
						data2.toothData.push({
							productId: this.getIdByList(item.productCategoryId, this.allProductCategoryIdData),
							colorImetric: item.colorImetric,
							num: item.num,
							pos: pos.join(',')
						});						
					});
					// 必填项是否完成
					data.toothData.map((item, index) => {
						hasValidate = item.pos && item.pos.filter(item => item).length > 0 && !item.posValid.status && !!item.productCategoryId && !item.productValid.status;
					});
					this.$emit('getProjectInfo', data2, hasValidate);
				},
				deep: true
			}
		},
		created() {
			this.getColorImetricData();
		},
		methods: {
			// 校验牙位
			validPostion(value, scope) {
				let row = scope.row;
				let index = scope.$index;
				let countType = '';
				let num = 0;
				if(this.filter_array(row.pos).length > 0) {
					if(value && !this.validateDiffNumber(value)) {
						this.projectInfo.toothData[index].posValid = {
							status: true,
							text: '请输入1-8的不同数字'
						};
						this.projectInfo.toothData[index].num = '';
					}else {
						this.projectInfo.toothData[index].posValid = {
							status: false,
							text: ''
						};
						this.allProductCategoryIdData.map((item2, index2) => {
							if(this.projectInfo.toothData[index].productCategoryId
							 == item2.name) {
								countType = item2.countType;
							}
						});
						// 产品的计数方式为'全口计数'时，toothData.num = 1
						// 产品的计数方式为'按牙位计数'时，toothData.num = 牙位的数量
						if(countType == '全口计数') {
							this.projectInfo.toothData[index].num = 1;
						}else {
							this.filter_array(this.projectInfo.toothData[index].pos).map((item, index) => {
								num += item.replace(/\s+/g, "").split('').length;
							});
							this.projectInfo.toothData[index].num = num;
						}
					}
				}else {
					this.projectInfo.toothData[index].posValid = {
						status: true,
						text: '牙位不能为空'
					};
				}
			},
			// 校验产品名称
			validProduct(value, scope) {
				if(value) {
					for(let i = 0; i < this.allProductCategoryIdData.length; i++) {
						if(value != this.allProductCategoryIdData[i].name) {
							this.projectInfo.toothData[scope.$index].productValid = {
								status: true,
								text: '该产品不存在'
							};
							this.projectInfo.toothData[scope.$index].num = '';
						}else {
							this.projectInfo.toothData[scope.$index].productValid = {
								status: false,
								text: ''
							};
							return;
						}
					}
				}else {
					this.projectInfo.toothData[scope.$index].productValid = {
						status: true,
						text: '产品名称不能为空'
					};
					this.projectInfo.toothData[scope.$index].num = '';
				}
			},
			// 添加一行牙位
			addToothRow(scope, e) {
				// 验证是否可以添加下一行
				this.projectInfo.toothData.push(
					{
						pos: [],
						colorImetric: '',
						productCategoryId: '',
						num: 0,
						del: true,
						productValid: {
							status: false,
							text: ''
						},
						posValid: {
							status: false,
							text: ''
						}
					}
				);
			},
			// 删除一行牙位
			delToothRow(scope) {
				this.projectInfo.toothData.splice(scope.$index, 1);
			},
			enterInput(params) {

			},
			// 模糊查询封装
			querySearch(list, queryString, cb, noResultsCb) {
				let arr = this[list];
				let results = queryString ? arr.filter(this.createFilter(queryString)) : arr;
				noResultsCb && noResultsCb(results);
				cb(results);
			},
			// 产品名称模糊查询
			querySearchProductCategoryId(queryString, cb) {
				this.querySearch('productCategoryIdList', queryString, cb);
			},
			// 比色模糊查询
			querySearchColorImetric(queryString, cb) {
				this.querySearch('colorImetricList', queryString, cb);
			},
			createFilter(queryString) {
				return (res) => {
					return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
				};
			},
			// 获取产品名称数据
			getAllProductData() {
				this.$api.get('/product/selectProductName', null, res => {
					let arr = [];
					res.data.map((item, index) => {
						arr.push({
							value: item.name,
							id: item.id
						})
					});
					this.productCategoryIdList = arr;
					this.allProductCategoryIdData = res.data;
				}, res => {
					this.$message.error(res.msg);
				});
			},
			// 获取比色数据
			getColorImetricData() {
				this.colorImetricList = this.$tool.getColorImetricData();
			},
			// 选择产品名称
			selectProductCategoryId(data) {
				let $index = 0;
				let countType = '';
				let num = 0;
				this.projectInfo.toothData.map((item, index) => {
					if(data.value == item.productCategoryId) {
						$index = index;
					}
				});
				this.allProductCategoryIdData.length > 0 ? this.allProductCategoryIdData.map((item, index) => {
					if(data.value == item.name) {
						countType = item.countType;
					}
				}) : '';
				if(data) {
					this.projectInfo.toothData[$index].productValid = {
						status: false,
						text: ''
					};
					// 产品的计数方式为'全口计数'时，toothData.num = 1
					// 产品的计数方式为'按牙位计数'时，toothData.num = 牙位的数量
					if(countType == '全口计数') {
						this.projectInfo.toothData[$index].num = 1;
					}else{
						this.filter_array(this.projectInfo.toothData[$index].pos).map((item, index) => {
							num += item.replace(/\s+/g, "").split('').length;
						});
						this.projectInfo.toothData[$index].num = num;
					}
				}
			},
			filter_array(array) {
				return this.$tool.filterArray(array);
			},
			// 校验是否是1-8位不同数字
			validateDiffNumber(numString) {
				let arr = numString.replace(/\s+/g, "").split('');
				let nary = arr.sort();
				for(let i = 0; i < arr.length; i++){
					if(nary[i] > 8){
						return false;
					}
			        if (nary[i] == nary[i+1]){
			        	return false;
			        }
			    }
			    return true
			},
			getIdByList(value, list) {
				return this.$tool.getIdByList(value, list);
			}
		}
	}
</script>

<style lang="less">
	@import url('./Project.less');
</style>