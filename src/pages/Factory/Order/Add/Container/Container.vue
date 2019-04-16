<template>
	<div class="editOrder">
		<Dialog className="addDialog" title="新建订单" @closeDialog="closeDialog">
			<div class="slotDiv">
				<el-form :model="addFormData" label-position="left" label-width="82px" ref="addForm">
					<BaseInfo :data="baseInfo" @getBaseInfo="getBaseInfo" />
					<Project :data="projectInfo" @getProjectInfo="getProjectInfo" />
					<div class="charge" style="margin-top: 20px">
						<el-form-item label="备注" prop="charge">
							<el-input
								placeholder="请填写备注信息"
								ref="charge"
								maxlength="500"
								v-model="addFormData.charge"
							></el-input>
						</el-form-item>
					</div>
					<Requirements :data="requirementsInfo" @getRequirementsInfo="getRequirementsInfo" :delImgList="delImgList" @resetDelImgList="resetDelImgList" />
				</el-form>
				<div slot="footer" class="dialog-footer" align="center">
					<el-button :disabled="!requirementsHasValid && !projectHasValid" class="submit" type="primary" @click="submit">确 定</el-button>
					<el-button class="cancel" @click="closeDialog">取 消</el-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script>
	import Dialog from '../../../../../components/Dialog/Dialog';
	import BaseInfo from '../BaseInfo/BaseInfo';
	import Project from '../Project/Project';
	import Requirements from '../Requirements/Requirements';
	export default {
		props: [ 'changeDialogStatus' ],
		components: { Dialog, BaseInfo, Project, Requirements },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				addFormData: {},
				baseInfo: {
					type: '普通',   // 0/1   TODO   数字转换为汉字
					oldNumber: '',
					number: '',
					boxNo: '',
					salesMan: '',
					unitClinicId: '',
					doctor: '',
					patient: '',
					addEdService: false, // 0
					sex: '', // 0
					age: '',
					feature: '', //0
					wearingTeethDate: '',
					entryDate: new Date(),
					expectedDate: this.$tool.getAddDate(new Date(), 7),	
				},
				requirementsInfo: {
					occlusion: '',
					approximalSurface: '',
					inPlace: '',
					embrasuresDeep: '',
					lipDesing: '',
					bridgeType: '',
					cermetsDesign: '',
					attachment: '',
					path: ''
				},
				delImgList: false,
				projectInfo: {
					toothData: [
						{
							pos: ['', '', '', ''],
							colorImetric: '',
							productCategoryId: '',
							num: '',
							posValid: statusObj,
							productValid: statusObj
						}
					],
				},
				baseInfoHasValid: false,
				requirementsHasValid: true,
				projectHasValid: false,
				submitCanUse: false
			}
		},
		methods: {
			// 关闭新建订单
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showEditDialog');
			},
			// 修改需要提交的参数
			editPostData() {
				let data = {...this.addFormData};
				return data;
			},
			// 提交
			submit() {
				this.$api.post('/factory/order/add', this.editPostData(), res => {
					this.$message({
	            	 	message: '保存订单成功',
	                    type: 'success',
	                    onClose: () => {
	                        this.submitSucessCb();
	                    }
	                })
				}, res => {
					this.$message.error(res.msg);
				});
			},
			submitSucessCb() {
				let statusObj = {
					status: false,
					text: ''
				};
				this.baseInfo = {
					type: '普通',   // 0/1   TODO   数字转换为汉字
					oldNumber: '',
					number: '',
					boxNo: '',
					salesMan: '',
					unitClinicId: '',
					doctor: '',
					patient: '',
					addEdService: false, // 0
					sex: '', // 0
					age: '',
					feature: '', //0
					wearingTeethDate: '',
					entryDate: new Date(),
					expectedDate: this.$tool.getAddDate(new Date(), 7),	
				};
				this.requirementsInfo = {
					occlusion: '',
					approximalSurface: '',
					inPlace: '',
					embrasuresDeep: '',
					lipDesing: '',
					bridgeType: '',
					cermetsDesign: '',
					attachment: '',
					path: ''
				};
				this.projectInfo = {
					toothData: [
						{
							pos: ['', '', '', ''],
							colorImetric: '',
							productCategoryId: '',
							num: '',
							posValid: statusObj,
							productValid: statusObj
						}
					],
				};
				// 清空上传的图片
				this.delImgList = true;
			},
			// 获取基础信息数据
			getBaseInfo(data, status) {
				this.baseInfoHasValid = !!status;
				Object.assign(this.addFormData, data);
			},
			// 获取加工产品数据
			getProjectInfo(data, status) {
				data.toothData = JSON.stringify(data.toothData);
				Object.assign(this.addFormData, data);
			},
			// 获取特殊要求数据
			getRequirementsInfo(data, status) {
				Object.assign(this.addFormData, data);
			},
			// 修改delImgList
			resetDelImgList() {
				this.delImgList = false;
			},
			getIdByList(value, list) {
				return this.$tool.getIdByList(value, list);
			}
		}
	}
</script>

<style lang="less">
	@import url('./Container.less');
</style>