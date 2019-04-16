<template>
	<div class="InspectionRecord">
		<template v-if="hasRecordData">
			<div class="recordItem" v-for="(item, index) in recordData" :key="index" v-if="hasRecordData">
				<div class="top">
					<p>
						<span>检验项目</span>
						<span>{{ item.itemName }}</span>
					</p>
					<p>
						<span>检验结果</span>
						<span>{{ checkResult(item.testResults) }}</span>
					</p>
					<p>
						<span>检验员</span>
						<span>{{ item.checker }}</span>
					</p>
					<p align="right">
						<span>检验时间</span>
						<span>{{ formatDate(item.checkDate) }}</span>
					</p>
				</div>
				<BaseTable :headerData="headerData" :tableData="JSON.parse(item.items).item" border />
			</div>
		</template>
		<template v-else>
			<div class="recordItem">
				<div class="top">
					<p>
						<span>检验项目</span>
						<span></span>
					</p>
					<p>
						<span>检验结果</span>
						<span></span>
					</p>
					<p>
						<span>检验员</span>
						<span></span>
					</p>
					<p align="right">
						<span>检验时间</span>
						<span></span>
					</p>
				</div>
				<BaseTable :headerData="headerData" :tableData="[]" border />
			</div>
		</template>
	</div>
</template>

<script>
	import BaseTable from '../../../../../components/BaseTable/BaseTable';
	import moment from "moment";
	export default {
		props: ['orderNumber','getInspectionRecord'],
		components: {BaseTable},
		data() {
			return {
				headerData: [
					{label: '检验条目', prop: 'name'},
					{label: '检验标准', prop: 'standard'},
					{label: '检验结果', prop: 'isAllowedName'}
				],
				recordData: []
			}
		},
		created() {
			this.getRecordData(this.orderNumber);
		},
	    watch: {
	        orderNumber(cur, old) {
	            if(cur !== old) {
	                this.getRecordData(this.orderNumber);
	            }
	        }
	    },
		computed: {
			hasRecordData() {
				return this.recordData.length > 0;
			}
		},
		methods: {
			checkResult(val) {
				let str = '';
				if(val === '1') {
					str = '合格';
				}else if(val === '0') {
					str = '不合格';
				}else {
					str = '';
				}
				return str;
			},
			getRecordData(val) {
				this.$api.post('/factory/order/details/record', { "orderNum": val }, res => {
                    this.recordData = res.data;
                    // res.data.map((item, index) => {
                    	// let arr = [];
            			// JSON.parse(item.items).item.map((item2, index2) => {
            			// 	arr.push({
            			// 		id: item2.id,
            			// 		result: item2.isAllowedName,
            			// 		standard: item2.standard,
            			// 		item: item2.name,
            			// 		resultType: item2.isAllowed
            			// 	});
            			// });
            			// JSON.parse(this.recordData[index].items).item = arr;
            			// console.log(this.recordData[index].items);
            			// // this.recordData[index].items = arr;
                    // });
                  	this.$emit('getInspectionRecord', this.recordData);
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
                });
			},
			formatDate(date) {
				return moment(date).format('YYYY-MM-DD');
			}
		}
	}
</script>

<style lang="less">
	@import url('./InspectionRecord.less');
</style>
