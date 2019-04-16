<template>
	<div class="ProductionInfo">
		<!-- <BaseTable :headerData="headerData" :tableData="tableData" border /> -->
		<el-table
			:data="tableData"
			class="baseTable"
			border
			style="width: 100%">
			<el-table-column align="center" label="加工产品" prop="goodsName"></el-table-column>
			<el-table-column align="center" label="工序" prop="proc_name">
				<template slot-scope="scope">
                    <p>{{scope.row.proc_name + (scope.row.procedureType === 1 ? '※' : '')}}</p>
                </template>
			</el-table-column>
			<el-table-column align="center" label="状态" prop="status"></el-table-column>
			<el-table-column align="center" label="生产人员" prop="user_name"></el-table-column>
			<el-table-column align="center" label="开工时间" prop="start_time"></el-table-column>
			<el-table-column align="center" label="完工时间" prop="end_time"></el-table-column>
			<el-table-column align="center" label="检验人员" prop="checkName"></el-table-column>
			<el-table-column align="center" label="检验结果" prop="checkResult"></el-table-column>
			<el-table-column align="center" label="检验时间" prop="check_time"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	import BaseTable from '../../../../../components/BaseTable/BaseTable';
	export default {
		components: {BaseTable},
		data() {
			return {
				tableData: []
			}
		},
		props: ['orderNumber'],
		created() {
			this.getProductInfoData(this.orderNumber);
		},
		methods: {
			getProductInfoData(val) {
				let users = [];
				let arr = [];
				let productArr = [];
				this.$api.post('/order/product/selectByOrderNoProductionDetails', { "orderNo": val }, res => {
					// 数据二次处理
					// 遍历产品分组
					let data = res.data;
					data.map((item, index) => {
						// item.productInfo 产品信息（包含全部工序）
						// item.bsOrderProductions 已完工工序（生产数据+检验数据）
						// 如果已完工工序里面有检验数据，则将检验数据和生产数据合并成一条
						let o = {};
						let new_bsOrderProductions = [];
						let re_bsOrderProductions = [];
						let arr = item.bsOrderProductions;
						for(let i = 0; i < arr.length; i++){
						    var k = arr[i].proc_id;
						    if(!o[k]){
						        o[k] = true;
						        new_bsOrderProductions.push(arr[i]);
						    }else {
								re_bsOrderProductions.push(arr[i])
							}
						}
						new_bsOrderProductions.map((item2, index2) => {
							re_bsOrderProductions.map((item3, index3) => {
								if(item2.proc_id === item3.proc_id) {
									item2.checkName = item3.checkName;
									item2.check_info = item3.check_info;
									item2.check_time = item3.check_time;
									item2.opt_type = item3.opt_type;
									item2.isqualified = item3.isqualified;
								}
							});
						});
						item.bsOrderProductions = new_bsOrderProductions;
					});
					// 数据解析表格填值
					data.map((item4, index4) => {
						// 遍历当前产品全部工序
						JSON.parse(item4.productInfo.goodProcessRoute).map((item5, index5) => {
							let oneRowData = {
								goodsName: item4.bsOrderProductions.length > 0 ? item4.bsOrderProductions[0].goodsName : '',
								proc_name: item5.procedureName,
								status: '待开工',
								procedureType: item5.procedureType
							};
							// 遍历已完工工序
							item4.bsOrderProductions.map((item6, index6) => {
								if(item6.proc_id === item5.procedureId) {
									oneRowData.status = '已完工';
									oneRowData.start_time = item6.start_time;
									oneRowData.end_time = item6.end_time;
									oneRowData.user_name = item6.user_name ? item6.user_name : '';
									// 判断是否是已完工的关键工序
									if(item5.procedureType === 1) {
										oneRowData.checkName = item6.opt_type === 2 ? item6.checkName : '';
										oneRowData.check_time = item6.opt_type === 2 ? item6.check_time : '';
										oneRowData.checkResult = item6.opt_type === 2 ? item6.isqualified === 1 ? '合格' : '不合格' : '';
									}
								}
							});
							productArr.push(oneRowData);
						});
					});
					this.tableData = productArr;
				}, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
                });
			}
		}
	}
</script>

<style lang="less">
	@import url('./ProductionInfo.less');
</style>