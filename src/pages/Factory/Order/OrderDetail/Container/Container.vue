<template>
	<div class="OrderDetail">
		<Dialog className="orderDetailDialog" title="订单详情" @closeDialog="closeDialog">
			<div class="slotDiv">
				<div class="tabs">
					<div v-for="item in tabList" :class="item.isActive ? 'active' : ''" @click="clickTab(item.value)">
						{{ item.name }}
					</div>
				</div>
				<div class="tab-content">
					<BaseInfo v-if="activeValue === 'baseInfo'" :data="orderInfo" />
					<ProductionInfo v-else-if="activeValue === 'productionInfo'" :orderNumber="orderNumber" />
					<MaterialTraceability v-else-if="activeValue === 'materialTraceability'" :orderNumber="orderNumber" />
					<LogisticsInfo v-else-if="activeValue === 'logisticsInfo'" :orderNumber="orderNumber" />
					<InspectionRecord v-else-if="activeValue === 'inspectionRecord'" :orderNumber="orderNumber" />
					<CirculationLog v-else-if="activeValue === 'circulationLog'" :orderNumber="orderNumber" />
				</div>
			  	<div class="dialog-footer" align="right">
					<el-button class="del" @click="del" v-if="orderInfo.status == '0701' || orderInfo.terminate_order == 1 || orderInfo.terminate_order == 3">删除</el-button>
					<el-button class="finish" @click="openFinishOrVoidDialog('showFinishOrder', true)" v-if="orderInfo.status != '0701' && orderInfo.terminate_order != 1 && orderInfo.terminate_order != 3">终止</el-button>
					<el-button class="rework" @click="rework" v-if="orderInfo.status == '0701' || orderInfo.terminate_order == 1 || orderInfo.terminate_order == 3">返工</el-button>
					<el-button class="toVoid" @click="openFinishOrVoidDialog('showVoidOrder', true)" v-if="orderInfo.status != '0701' && orderInfo.terminate_order != 1 && orderInfo.terminate_order != 3">作废</el-button>
					<el-button class="edit" @click="edit" v-if="orderInfo.status != '0701' && orderInfo.terminate_order != 1 && orderInfo.terminate_order != 3">修改</el-button>
					<el-button class="print" @click="print">打印</el-button>
				</div>
			</div>
		</Dialog>
		<template>
			<!-- 作废 -->
			<el-dialog title="作废订单" :visible.sync="showVoidOrder" width="500px" class="showVoidOrder operationOrderDialog">
				<el-form :model="voidForm" ref="showVoidOrder">
					<el-form-item label="作废原因" label-width="68px" prop="cancelReason">
						<el-input type="textarea" :rows="2" v-model="voidForm.cancelReason" ref="cancelReason"></el-input>
					</el-form-item>
					<el-form-item label="处置方式" label-width="68px" prop="cancelDisposal">
						<el-input type="textarea" :rows="2" v-model="voidForm.cancelDisposal"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer" align="center">					
					<el-button class="confirmBtnStyle" @click="confirmVoid">确定</el-button>
					<el-button class="cancelBtnStyle" @click="openFinishOrVoidDialog('showVoidOrder', false)">取消</el-button>
				</div>
			</el-dialog>
			<!-- 终止 -->
			<el-dialog title="终止订单" :visible.sync="showFinishOrder" width="500px" class="showFinishOrder operationOrderDialog">
				<el-form :model="finishForm" ref="showFinishOrder">
					<el-form-item label="订单金额" label-width="68px">
						<p style="padding-left: 15px">{{ (amount || 0)  + ' 元' }}</p>
					</el-form-item>
					<el-form-item label="收费金额" label-width="68px" prop="shutDownPrice">
						<!-- <el-input @keyup="keyupShotDownPrice" @afterpaste="afterpasteShotDownPrice" v-model="finishForm.shutDownPrice" maxlength="6" @blur="blurShutDownPrice"></el-input>元 -->
						<el-input v-model="finishForm.shutDownPrice" ref="shutDownPrice" maxlength="6" @blur="blurShutDownPrice"></el-input>元
					</el-form-item>
					<el-form-item label="备注" label-width="68px" prop="shutDownRemark">
						<el-input type="textarea" :rows="2" v-model="finishForm.shutDownRemark"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer" align="center">					
					<el-button class="confirmBtnStyle" @click="confirmFinish">确定</el-button>
					<el-button class="cancelBtnStyle" @click="openFinishOrVoidDialog('showFinishOrder', false)">取消</el-button>
				</div>
			</el-dialog>
		</template>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../../components/Dialog/Dialog';
	import BaseInfo from '../BaseInfo/BaseInfo';
	import CirculationLog from '../CirculationLog/CirculationLog';
	import InspectionRecord from '../InspectionRecord/InspectionRecord';
	import LogisticsInfo from '../LogisticsInfo/LogisticsInfo';
	import MaterialTraceability from '../MaterialTraceability/MaterialTraceability';
	import ProductionInfo from '../ProductionInfo/ProductionInfo';
	export default {
		props: [ 'changeDialogStatus', 'orderNumber', 'amount', 'openAddOrderDialog' ],
		components: { Dialog, ProductionInfo, MaterialTraceability, LogisticsInfo, InspectionRecord, CirculationLog, BaseInfo },
		data() {
			return {
				activeValue: 'baseInfo',
				tabList: [
					{name: '基础信息', value: 'baseInfo', isActive: true},
					{name: '生产信息', value: 'productionInfo', isActive: false},
					{name: '材料追溯', value: 'materialTraceability', isActive: false},
					{name: '物流信息', value: 'logisticsInfo', isActive: false},
					{name: '检验记录', value: 'inspectionRecord', isActive: false},
					{name: '流转日志', value: 'circulationLog', isActive: false},
				],
				postData: {
					"cancelDisposal": "",
					"cancelReason": "",
					"mode": "",
					"number": "",
					"shutDownPrice": "",
					"shutDownRemark": "",
					"unitId": ""
				},
				showVoidOrder: false,
				showFinishOrder: false,
				voidForm: {},
				finishForm: {},
				orderInfo: {}
			}
		},
		created() {
			this.getDetailInfo(this.orderNumber);
		},
		methods: {
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showOrderDetailDialog');
			},
			// 点击tab，切换组件
			clickTab(value) {
				this.tabList.map((item, index) => {
					if(value === item.value) {
						item.isActive = true;
						this.activeValue = item.value;
					}else {
						item.isActive = false;
					}
				});
			},
			getDetailInfo(val) {
				this.$api.post('/factory/order/find', { "number": val }, res => {
                    this.orderInfo = res.data;
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
			},
			// 删除/终止/作废通用api
			deleteShutDownCancel(data) {
				this.$api.post('/factory/order/deleteShutDownCancel', data, res => {
                    this.$message({
	            	 	message: res.msg,
	                    type: 'success',
	                    duration: 1000,
	                    onClose: () => {
	                        this.closeDialog();
	                    }
	                })
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
			},
			// 删除
			del() {
				let data = {...this.postData};
				data.number = this.orderNumber;
				data.mode = 0;						
				this.$confirm('删除订单后无法恢复，确认删除?', '', {
					confirmButtonText: '取消',
					cancelButtonText: '确定删除',
					center: true,
					customClass: 'alertDialog',
					showClose: false
				}).then(() => {
					
				}).catch(() => {
					this.deleteShutDownCancel(data);
				});
			},
			// 打开/关闭 终止弹窗/作废弹窗
			openFinishOrVoidDialog(name, status) {
				this[name] = status;
				if(!status) {
					this.$refs[name].resetFields();
				}
				// 作废聚焦第一个输入框，作废原因
				if(name === 'showVoidOrder') {
					this.$nextTick(() => {
						this.$refs.cancelReason.focus();
					});
				}
				// 收费金额
				else if(name === 'showFinishOrder') {
					this.$nextTick(() => {
						this.$refs.shutDownPrice.focus();
					});
				}
			},
			// 确定终止订单
			confirmFinish() {
				let data = {...this.postData};
				data.number = this.orderNumber;
				data.mode = 1;
				data.shutDownPrice = this.finishForm.shutDownPrice || '';
				data.shutDownRemark = this.finishForm.shutDownRemark || '';
				this.deleteShutDownCancel(data);
			},
			// 确定作废订单
			confirmVoid() {
				let data = {...this.postData};
				data.number = this.orderNumber;
				data.cancelDisposal = this.voidForm.cancelDisposal;
				data.cancelReason = this.voidForm.cancelReason;
				data.mode = 2;
				this.deleteShutDownCancel(data);
			},
			blurShutDownPrice() {
				// let price = this.finishForm.shutDownPrice;
				// this.finishForm.shutDownPrice = Number(price).toFixed(2);
				// this.finishForm.shutDownPrice = Number(this.finishForm.shutDownPrice).toFixed(2);
			},
			keyupShotDownPrice() {
				debugger
				// this.finishForm.shutDownPrice = this.finishForm.shutDownPrice.replace(/\D/g,'');
			},
			afterpasteShotDownPrice() {
				debugger
				// onafterpaste="this.value=this.value.replace(/\D/g,'')"
			},
			// 返工
			rework() {
				this.closeDialog();
				this.$emit('openAddOrderDialog', 'rework');
			},
			// 修改
			edit() {
				this.closeDialog();
				this.$emit('openAddOrderDialog', 'edit');
			},
			// 打印
			print() {
				this.$message({
            	 	message: '功能暂未开发，敬请期待',
            	 	duration: 1000,
                    type: 'warning'
                })
			},
		}
	}
</script>

<style lang="less">
	@import url('./Container.less');
</style>