<template>
	<div class="CirculationLog baseTable">
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
					{label: '操作时间', prop: 'operation_date'},
					{label: '操作', prop: 'operation'},
					{label: '操作人', prop: 'name'},
					{label: '信息', prop: 'content'}
				],
				tableData: []
			}
		},		
		created() {
			this.getCirculationLogData(this.orderNumber);
		},
		methods: {
			// 获取流转日志列表
			getCirculationLogData(val) {
				this.$api.post('/factory/order/selectByOrderNo', { "orderNo": val }, res => {
                    this.tableData = res.data;
                    res.data.map((item, index) => {
                    	if(item.content.charAt(0) === '{') {
                    		this.tableData[index].content = JSON.parse(item.content).context ? JSON.parse(item.content).context : '';
                    	}else {
                    		this.tableData[index].content = item.content;
                    	}
                    });
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
	@import url('./CirculationLog.less');
</style>