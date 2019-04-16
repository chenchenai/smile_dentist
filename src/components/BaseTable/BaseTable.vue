<template>
	<el-table
		:data="tableData"
		class="baseTable"
		:border="this.border == ''"
		style="width: 100%">
		<el-table-column
			v-for="(item,index) in headerData"
			:key="index"
			:prop="item.prop"
			align="center"
			:label="item.label">
		</el-table-column>
	</el-table>
</template>

<script type="text/javascript">
	export default {
		props: ['tableData', 'headerData', 'border'],
		data() {
			return {

			}
		},
		created() {
			
		}
	}
</script>