<template>
	<div class="Release">
		<Dialog className="releaseDialog" title="放行标准" @closeDialog="closeDialog">
			<div class="slotDiv">
				<el-table :data="records" style="width: 100%" border>
	                <el-table-column prop="sortNo" align="center" label="编号">
	                    <template slot-scope="scope">
	                        <el-input maxlength="15" placeholder="请输入编号" v-model="scope.row.sortNo"></el-input>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="itemName" align="center" label="质检项目">
						<template slot-scope="scope">
	                        <el-input maxlength="15" placeholder="请输入质检项目" v-model="scope.row.itemName"></el-input>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="standard" align="center" label="标准" width="300">
						<template slot-scope="scope">
	                        <el-input maxlength="500" placeholder="请输入标准" v-model="scope.row.standard"></el-input>
	                    </template>
	                </el-table-column>
	                <el-table-column prop="isAllowed" align="center" label="允许不合格">
						<template slot-scope="scope">
	                        <el-checkbox v-model="scope.row.isAllowed" ></el-checkbox>
	                    </template>
	                </el-table-column>
	                <el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button class="deleteRow" type="text" @click="deleteRow(scope)" icon="el-icon-delete"></el-button>
	                    </template>
	                </el-table-column>
	            </el-table>
	            <el-button class="addRow" type="text" @click="addRow">添加标准项</el-button>
				<div slot="footer" class="dialog-footer" align="center">
					<el-button class="submit" type="primary" @click="submit">确 定</el-button>
					<el-button class="cancel" @click="cancel">取 消</el-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../../components/Dialog/Dialog';	
	export default {
		components: {Dialog},
		props: ['changeDialogStatus'],
		data() {
			return {
				records: [],
				recordsId: ''
			}
		},
		created() {
			this.getDetail();
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showReleaseDialog');
			},
			// 查询模型入检标准模板
			getDetail() {
				this.$api.post('/qc/template/selectPassThrough', null, res => {
                    res.data.map((item, index) => {
                    	this.records.push({
                    		sortNo: item.sortNo,
                    		itemName: item.itemName,
                    		standard: item.standard,
                    		isAllowed: (item.isAllowed != null && item.isAllowed === 1) ? true : false,
                    	});
                    	this.recordsId = item.id;
                    });
                }, res => {
                	this.$message.error(res.msg);
                });
			},
			submit() {
				let items = [];
				this.records.map((item, index) => {
					items.push({
						sortNo: item.sortNo,
                		qcItem: item.itemName,
                		qcStandard: item.standard,
                		isAllowUnqualified: !!item.isAllowed ? 1 : 0
					});
				});
				this.$api.post('/qc/template/save/factory/sys/template', {
  					id: this.recordsId,
  					items: items,
  					name: "",
					type: 3
				}, res => {
					this.$message({
	            	 	message: '操作成功',
	                    type: 'success'
	                })
				});
			},
			cancel() {
				this.closeDialog();
			},
			addRow() {
				this.records.push({
					sortNo: '',
					itemName: '',
					standard: '',
					isAllowed: 0
				});
			},
			deleteRow(scope) {
				this.records.splice(scope.$index, 1);
			}
		}
	}
</script>

<style lang="less">
	@import url('./Release.less');
</style>