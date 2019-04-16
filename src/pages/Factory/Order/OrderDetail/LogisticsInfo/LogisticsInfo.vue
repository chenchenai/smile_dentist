<template>
	<div class="LogisticsInfo baseTable">
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
					{label: '物流类型', prop: 'logisticsType'},
					{label: '方式', prop: 'sendtype'},
					{label: '信息', prop: 'content'}
				],
				tableData: []
			}
		},		
		created() {
			this.getData(this.orderNumber);
		},
		methods: {
			// 获取流转日志列表
			getData(val) {
				this.$api.post('/factory/order/logisticsInformation', { "orderNo": val }, res => {
                    this.tableData = res.data;
                    res.data.map((item, index) => {
                    	this.tableData[index].content = item.logCompany + '/' + item.did;
                    	this.tableData[index].sendtype = item.sendtype == '0' ? '快递' : '业务员';
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
	@import url('./LogisticsInfo.less');
</style>