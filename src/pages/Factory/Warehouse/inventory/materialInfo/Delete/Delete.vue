<template>
	<div class="deleteMaterial">
		<Dialog className="deleteDetailDialog" title="删除" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="topTitle">物料删除后无法恢复,确认删除？</div>
				<div slot="footer" class="dialog-footer" align="center">
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
					<el-button  type="primary" class="submit" @click.native="submit">确定删除</el-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../../../components/Dialog/Dialog';
	export default {
		props: ['changeDialogStatus'],
		components: {Dialog},
		data() {
			return {

			}
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'DeleteMaterialDialog');
            },

			submit(id) {

			}
		}
	}
</script>

<style lang="less">
	@import url('./Delete.less');
</style>