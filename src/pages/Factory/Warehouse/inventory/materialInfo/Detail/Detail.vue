<template>
	<div class="materialDetail">
		<Dialog className="materialDetailDialog" title="产品详情" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="postionBtns">
					<el-button type="text" @click="editMaterial">编辑</el-button>
					<el-button type="text" @click="showDeleteMaterial">删除</el-button>
				</div>
				<div class="topTitle">上海新世纪义齿基托树脂 自凝牙托粉</div>
				<el-form class="top" label-position="left" label-width="82px" ref="addForm">
					<el-form-item label="物料编码" class="fromItem">
						<p>7894521025632</p>
					</el-form-item>
					<el-form-item label="规格型号" class="fromItem">
						<p>自凝牙托粉II型1类</p>
					</el-form-item>
					<el-form-item label="单位" class="fromItem">
						<p>瓶</p>
					</el-form-item>
					<el-form-item label="有效期" class="fromItem">
						<p>3年</p>
					</el-form-item>
					<el-form-item label="注册证编号" class="fromItem">
						<p>国食药监械(准)字2009第qqqq</p>
					</el-form-item>
					<el-form-item label="有效期至" class="fromItem">
						<p>2018-08-21</p>
					</el-form-item>
					<el-form-item label="生产厂家" class="fromItem">
						<p>广州市科阳医疗设备有限公司</p>
					</el-form-item>
					<el-form-item label="生产许可证编号" class="fromItem">
						<p>粤药管械生产许可证</p>
					</el-form-item>
					<el-form-item label="物料类别" class="fromItem">
						<p>牙托粉</p>
					</el-form-item>
					<el-form-item label="预警数量" class="fromItem">
						<p>20瓶</p>
					</el-form-item>
					<el-form-item label="当前库存" class="fromItem">
						<p>100瓶</p>
					</el-form-item>
					<el-form-item label="供应商" class="fromItem">
						<p>广州市科阳医疗设备有限公司</p>
					</el-form-item>
					<el-form-item label="备注" class="fromItem remarks">
						<p>这里展示备注信息</p>
					</el-form-item>
				</el-form>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../../../components/Dialog/Dialog';
	export default {
		props: [],
		components: {Dialog},
		data() {
			return {

			}
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showMaterialDetailDialog');
            },
             /*切换弹出框状态 */
            changeDialogStatus(status, dialogStatusName) {
                this[dialogStatusName] = status;  
            },
            /*弹出确定删除框*/
            showDeleteMaterial(){
                this.$emit('changeDialogStatus', true, 'DeleteMaterialDialog')
            },
            /*编辑物料 */
			editMaterial() {
			   this.closeDialog();
				// 模拟获取id
                let id = '666';
                this.$emit('openAddMaterialDialog', id);	
            },

		}
	}
</script>

<style lang="less">
	@import url('./Detail.less');
</style>