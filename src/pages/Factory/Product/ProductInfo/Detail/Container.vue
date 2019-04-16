<template>
	<div class="productDetail">
		<Dialog className="productDetailDialog" title="产品详情" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="postionBtns">
					<el-button type="text" @click="editProduct">编辑</el-button>
					<el-button type="text" @click="deleteProduct">删除</el-button>
				</div>
				<div class="topTitle">全瓷冠</div>
				<el-form class="top" label-position="left" label-width="82px" ref="addForm">
					<el-form-item label="修复类型" class="fromItem">
						<p>{{ productDetailInfo.repairTypeName }}</p>
					</el-form-item>
					<el-form-item label="产品类别" class="fromItem">
						<p>{{ productDetailInfo.itemCategoryName }}</p>
					</el-form-item>
					<el-form-item label="规格型号" class="fromItem">
						<p>{{ productDetailInfo.spec }}</p>
					</el-form-item>
					<el-form-item label="单位" class="fromItem">
						<p>{{ productDetailInfo.unit }}</p>
					</el-form-item>
					<el-form-item label="生产周期" class="fromItem">
						<p>{{ productDetailInfo.takingtime }}</p>
					</el-form-item>
					<el-form-item label="质保期" class="fromItem">
						<p>{{ productDetailInfo.shelflife }}</p>
					</el-form-item>
					<el-form-item label="计数方式" class="fromItem">
						<p>{{ productDetailInfo.countType }}</p>
					</el-form-item>
					<el-form-item label="单价" class="fromItem">
						<p>{{ productDetailInfo.guidePrice }}</p>
					</el-form-item>
					<el-form-item label="封顶价" class="fromItem">
						<p>{{ productDetailInfo.topPrice }}</p>
					</el-form-item>
					<el-form-item label="备注" class="fromItem remarks">
						<p>{{ productDetailInfo.remark }}</p>
					</el-form-item>
				</el-form>
				<div class="tabs">
					<p @click="clickTab(item)" v-for="item in tabsData" :class="item.isActive ? 'isActive' : ''">{{item.name}}</p>
				</div>
				<div class="tabContent technologyContent" v-if="tabIndex === 0">
					<p class="title">全瓷冠工艺路线：</p>
					<div class="">
						<P v-for="(item,index) in processRoute" :key="index">{{item}}</P>
					</div>
				</div>
				<div class="tabContent qualityCardContent" v-else-if="tabIndex === 1">
					
				</div>
				<div class="tabContent materialContent" v-else-if="tabIndex === 2">
					<el-table :data="productDetailInfo.goodMaterial" style="width: 100%" border height="244">
		                <el-table-column prop="materialName" align="center" label="物料名称"></el-table-column>
		                <el-table-column prop="typeName" align="center" label="类别"></el-table-column>
		                <el-table-column prop="spec" align="center" label="规格型号"></el-table-column>
		            </el-table>
				</div>
				<div class="tabContent checkContent" v-else-if="tabIndex === 3">
					<el-table :data="productDetailInfo.qcTemplateItemsList" style="width: 100%" border height="244">
		                <el-table-column prop="sortNo" align="center" label="编号"></el-table-column>
		                <el-table-column prop="qcItem" align="center" label="检验项目"></el-table-column>
		                <el-table-column prop="qcStandard" align="center" label="标准"></el-table-column>
		            </el-table>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../../components/Dialog/Dialog';
	export default {
		props: ['changeDialogStatus', 'showProductDetailDialog', 'openAddProductDialog', 'productDetailId'],
		components: {Dialog},
		data() {
			return {
				productDetailInfo: {},
				tabsData: [
					{name: '工艺路线', isActive: true},
					{name: '质保卡', isActive: false},
					{name: '材料追溯', isActive: false},
					{name: '检验标准', isActive: false}
				],
				tabIndex: 0,
				materialData: [],
				checkData: [],
				technology: [],
				processRoute: []
			}
		},
		created() {
			this.getDetailInfo();
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showProductDetailDialog');
			},
			// 获取产品详情数据
			getDetailInfo() {
				this.$api.post('/product/product/details', {id: this.productDetailId}, res => {
					this.productDetailInfo = res.data;
					// 工艺路线解析
					this.processRoute = res.data.processRoute.split('>');
				});
			},
			clickTab(data) {
				this.tabsData.map((item, index) => {
					if(item.name === data.name) {
						item.isActive = true;
						this.tabIndex = index;
					}else {
						item.isActive = false;
					}
					// 按类型发起请求，避免所以请求一次发送
					if(index === 0) {	
						this.technology = [];
					}else if(index === 2) {
						this.materialData = [
							{a: 1, b: 2, c: 3}
						];
					}else if(index === 3) {
						this.checkData = [
							{a: 11, b: 22, c: 33}
						];
					}
				});
			},
			editProduct() {
				this.closeDialog();
				// 模拟获取id
				let id = '666';
				this.$emit('openAddProductDialog', id);
			},
			deleteProduct() {
				this.$confirm('产品删除后无法恢复，确认删除?', '删除', {
					confirmButtonText: '取消',
					cancelButtonText: '确定删除',
					center: true,
					customClass: 'alertDialog',
					showClose: false
				}).then(() => {
					
				}).catch(() => {
					this.$api.post('/product/product/delete', {ids: [this.productDetailId]}, res => {
						this.$message({
		            	 	message: res.msg,
		                    type: 'success',
		                    duration: 1000,
		                    onClose: () => {
		                        this.closeDialog();
		                    }
		                })
					}, res => {
						this.$message({
		            	 	message: res.msg,
		            	 	duration: 1000,
		                    type: 'error'
		                })
					});
				});
			}
		}
	}
</script>

<style lang="less">
	@import url('./Container.less');
</style>