<template>
	<div class="MaterialTraceability baseTable">
		<BaseTable :headerData="headerData" :tableData="tableData" border />
	</div>
</template>

<script>
	import BaseTable from '../../../../../components/BaseTable/BaseTable';
	export default {
		props: ['orderNumber'],
		components: {BaseTable},
		data() {
			return {
				headerData: [
					{label: '物料名称', prop: 'name'},
					{label: '规格型号', prop: 'model'},
					{label: '追溯码', prop: 'code'},
					{label: '生产厂家', prop: 'manufactor'},
					{label: '注册证号', prop: 'number1'},
					{label: '厂家批号', prop: 'number2'}
				],
				tableData: []
			}
		},		
		created() {
			this.getData(this.orderNumber);
		},
		methods: {
			// 获取材料追溯数据
			getData() {
				this.tableData = [
					{name: '基托聚合物', model: 'G01', code: '201807151230001', manufactor: '日进齿材料有限公司', number1: '器械标准20163632123', number2: 'D1235'}
				];
			}			
		}
	}
</script>

<style lang="less">
	@import url('./MaterialTraceability.less');
</style>