<template>
	<div class="dialogComponent">
		<el-dialog :class="className" :title="title" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false" >
			<el-button @click="close" type="text" icon="el-icon-close" class="closeDialog"></el-button>
			<slot></slot>
		</el-dialog>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: [ 'className', 'title', 'closeDialog' ],
		data() {
			return {
				dialogVisible: true
			}
		},
		methods: {
			close() {
				this.$emit('closeDialog');
			}
		}
	}
</script>

<style lang="less">
	@import url('./Dialog.less');
</style>
