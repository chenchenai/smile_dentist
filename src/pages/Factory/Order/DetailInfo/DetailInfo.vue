<template>
	<div class="detail">
		<div class="position">
			<i class="border"></i>
			<div class="left">
				<el-form class="top" label-position="left" label-width="82px" ref="addForm">
					<el-form-item label="订单编号" class="fromItem" placeholder="请输入订单编号">
						<p>{{ orderInfo.number }}</p>
					</el-form-item>				
					<el-form-item label="客户名称" class="fromItem">
						<p>{{ orderInfo.clinic_name }}</p>
					</el-form-item>
					<el-form-item label="业务员" class="fromItem">
						<p>{{ orderInfo.salesman_name }}</p>
					</el-form-item>
					<el-form-item label="医生姓名" class="fromItem">
						<p>{{ orderInfo.doctor_name }}</p>
					</el-form-item>
					<el-form-item label="联系电话" class="fromItem">
						<p>{{ orderInfo.dtel }}</p>
					</el-form-item>
					<el-form-item label="患者姓名" class="fromItem">
						<p>{{ orderInfo.patient }}</p>
					</el-form-item>
					<el-form-item label="进件日期" class="fromItem">
						<p>{{ formatDate(orderInfo.entry_date) }}</p>
					</el-form-item>
					<el-form-item label="预出日期" class="fromItem">
						<p>{{ formatDate(orderInfo.expected_date) }}</p>
					</el-form-item>
					<el-form-item label="戴牙日期" class="fromItem">
						<p>{{ formatDate(orderInfo.wearingteeth_date) }}</p>
					</el-form-item>
					<el-form-item label="试戴" class="fromItem">
						<p>{{ getNameByValue(orderInfo.require_type, requireTypeList) }}</p>
					</el-form-item>
					<el-form-item label="盒号" class="fromItem">
						<p>{{ orderInfo.box_no }}</p>
					</el-form-item>
				</el-form>
				<div class="bot">
					<template v-if="!orderInfo.orderProduct">
						<div class="toothItem" >
							<div class="tooth">
								<span class="label">牙位</span>
								<div class="text">
									<div class="topPos">
										<p></p>
										<p></p>
									</div>
									<div class="botPos">
										<p></p>
										<p></p>
									</div>
								</div>
							</div>
							<div class="product item">
								<span class="label">产品名称</span>
								<span class="text"></span>
							</div>
							<div class="colorImetric item">
								<span class="label">比色</span>
								<span class="text"></span>
							</div>
							<div class="num item">
								<span class="label item">数量</span>
								<span class="text"></span>
							</div>
						</div>
					</template>
					<template v-for="item in orderInfo.orderProduct" v-else>
						<div class="toothItem" >
							<div class="tooth">
								<span class="label">牙位</span>
								<div class="text">
									<div class="topPos">
										<p>{{ item.pos.split(',')[0] }}</p>
										<p>{{ item.pos.split(',')[1] }}</p>
									</div>
									<div class="botPos">
										<p>{{ item.pos.split(',')[2] }}</p>
										<p>{{ item.pos.split(',')[3] }}</p>
									</div>
								</div>
							</div>
							<div class="product item">
								<span class="label">产品名称</span>
								<span class="text">{{ item.goods_name }}</span>
							</div>
							<div class="colorImetric item">
								<span class="label">比色</span>
								<span class="text">{{ item.colorimetric }}</span>
							</div>
							<div class="num item">
								<span class="label item">数量</span>
								<span class="text">{{ item.num }}</span>
							</div>
						</div>
					</template>
					<div class="remark">
						<span class="label">备注</span>
						<span class="text">{{ orderInfo.charge }}</span>
					</div>
					<div class="suggestion">
						<span class="label">试戴意见</span>
						<!-- <span class="text" v-if="operation">{{ context }}</span> -->
						<span class="text" v-html="context"></span>
					</div>
				</div>
			</div>
			<div class="right">
				<div class="tab">
					<p :class="curTab == 1 ? 'cur' : ''" @click="curTab = 1">照片</p>
					<p :class="curTab == 2 ? 'cur' : ''" @click="curTab = 2">日志</p>
				</div>
				<div class="content">
					<div v-if="curTab == 1"></div>
					<div v-else></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: ['valid', 'orderid', 'getOrderStatus'],
		data() {
			return {
				curTab: 1,
				orderInfo: {},
				requireTypeList: [
		          	{ "value": "试架", id: 0 },
		          	{ "value": "试颌", id: 1 },
		          	{ "value": "试冠", id: 2 },
		          	{ "value": "试瓷", id: 3 },
		          	{ "value": "腊牙", id: 4 },
		        ],
			}
		},
		computed: {
			entry_date() {
				return this.$tool.formatDate("yyyy-MM-dd");
			},
			operation() {
				if(this.orderInfo.orderChangeMsg && this.orderInfo.orderChangeMsg[0].operation == '试戴回件') {
					return true;
				}else {
					return false;
				}	
			},
			context() {
				let html = '';
				if(this.orderInfo.orderChangeMsg) {
					this.orderInfo.orderChangeMsg.map((item, index) => {
						if(item.operation == '试戴回件') {
							if(JSON.parse(item.bs_order_change_content).context) {
								html += `<p>${JSON.parse(item.bs_order_change_content).context + ' -- ' + JSON.parse(item.bs_order_change_content).date}</p>`;
							}
						}
					});
				}
				return html;
				// if(this.operation) {
				// 	return JSON.parse(this.orderInfo.orderChangeMsg[0].bs_order_change_content).context;
				// }
			}
		},
		watch: {
			orderid(val1, val2) {
				if(!val1) {
					this.orderInfo = {};
				}else {
					this.getDetailInfo(val1)
				}
			}
		},
		methods: {
			getDetailInfo(val) {
				this.$api.post('/factory/order/find', { "number": val }, res => {
                    this.orderInfo = res.data;
                    this.$emit('getOrderStatus', res.data);
                }, res => {
                	if(res.status == '152') {
                		this.$emit('valid');
                	}else {
                		this.$message({
	                        message: res.msg,
	                        type: 'error',
	            			duration: 1000,
	                    });
                	}
                });
			},
			formatDate(date) {
				return date ? date.split(' ')[0] : '';
			},
			getNameByValue(status, list) {
				if(status != undefined) {
					let name = '';
	                list.map((item, index) => {
	                    if(status == item.id){
	                        name = item.value;
	                    }
	                });
	                return name;
				}else {
					return '';
				}
            },
		}
	}
</script>

<style lang="less">
	@import url('./DetailInfo.less');
</style>