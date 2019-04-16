<template>
	<div class="BaseInfo">
		<div class="leftInfo">
		<!-- <el-scrollbar class="leftInfo"> -->
			<el-form class="top topForm" label-position="left" label-width="82px">
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
					<p>{{ orderInfo.entry_date }}</p>
				</el-form-item>
				<el-form-item label="预出日期" class="fromItem">
					<p>{{ orderInfo.expected_date }}</p>
				</el-form-item>
				<el-form-item label="戴牙日期" class="fromItem">
					<p>{{ orderInfo.wearingteeth_date }}</p>
				</el-form-item>
				<el-form-item label="试戴" class="fromItem">
					<p>{{ getNameByValue(orderInfo.require_type, requireTypeList) }}</p>
				</el-form-item>
				<el-form-item label="盒号" class="fromItem">
					<p>{{ orderInfo.box_no }}</p>
				</el-form-item>
			</el-form>
			<div class="bot">
				<template v-if="!orderInfo.orderProduct || !orderInfo.orderProduct[0]">
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
					<span class="text">{{ context }}</span>
				</div>			
			</div>
			<el-form class="botForm" label-position="left" label-width="82px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="咬合" prop="occlusion" class="occlusion">
							<el-radio-group v-model="orderInfo.occlusion" disabled>
								<el-radio-button v-for="(item,index) in occlusionList" :key="index" :label="item"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邻接面" class="approximalSurface" prop="approximalSurface">
							<el-radio-group v-model="orderInfo.approximal_surface" disabled>
								<el-radio-button v-for="(item,index) in approximalSurfaceList" :key="index" :label="item"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>					
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="唇纹设计" class="lipDesing" prop="lipDesing">
							<el-radio-group v-model="orderInfo.lip_design" disabled>
								<el-radio-button v-for="(item,index) in lipDesingList" :key="index" :label="item"></el-radio-button>
							</el-radio-group>
						</el-form-item>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="就位要求" class="inPlace" prop="inPlace">
							<el-radio-group v-model="orderInfo.in_place" disabled>
								<el-radio-button v-for="(item,index) in inPlaceList" :key="index" :label="item"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="外展隙深度" class="embrasuresDeep" prop="embrasuresDeep">
							<el-radio-group v-model="orderInfo.embrasures_deep" disabled>
								<el-radio-button v-for="(item,index) in embrasuresDeepList" :key="index" :label="item"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>										
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="桥体设计" class="bridgeType" prop="bridgeType">
							<el-radio-group v-model="orderInfo.bridge_type" disabled>
								<el-radio-button v-for="(item,index) in bridgeTypeList" :key="index" :label="item"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="瓷金设计" class="cermetsDesign" prop="cermetsDesign">
							<el-radio-group v-model="orderInfo.cermets_design" disabled>
								<el-radio-button label="金属舌面"></el-radio-button>
								<el-radio-button label="常规设计"></el-radio-button>
								<el-radio-button label="全瓷边"></el-radio-button>
								<el-radio-button label="全金属脚边"></el-radio-button>
								<el-radio-button label="颌面金属"></el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item label="附件" class="attachment" prop="attachment">
						<el-input disabled v-model="orderInfo.attachment"></el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="上传图片" class="uploadImg" prop="fileList">
						<div v-if="orderInfo.orderAttachment && orderInfo.orderAttachment[0] != null" class="pathListBox">
							<img :src="item.bs_order_attachment_path" v-for="item in orderInfo.orderAttachment">
						</div>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
		<!-- </el-scrollbar> -->
		<div class="rightInfo">
			<div class="tab">
				<p>照片</p>
			</div>
			<div class="content">
				
			</div>
		</div>
	</div>
</template>

<script>
	import moment from "moment";
	export default {
		props: ['data'],
		data() {
			return {
				botForm: {},
				requireTypeList: [
		          	{ "value": "试架", id: 0 },
		          	{ "value": "试颌", id: 1 },
		          	{ "value": "试冠", id: 2 },
		          	{ "value": "试瓷", id: 3 },
		          	{ "value": "腊牙", id: 4 },
		        ],
		        occlusionList: ['正常', '无', '轻', '重'],
				approximalSurfaceList: ['面接触', '点接触'],
				inPlaceList: ['紧', '正常', '松'],
				embrasuresDeepList: ['浅', '深'],
				lipDesingList: ['深', '浅', '无'],
				bridgeTypeList: ['卫生型', '偏侧型', '小马鞍型', '大马鞍型'],
				cermetsDesignList: ['金属舌面', '常规设计', '全瓷边', '全金属脚边', '颌面金属'],
			}
		},
		computed: {
			operation() {
				if(!this.orderInfo.orderChangeMsg || !this.orderInfo.orderChangeMsg[0]) {
					return false;
				}else {
					if(this.orderInfo.orderChangeMsg && this.orderInfo.orderChangeMsg[0].operation == '试戴回件') {
						return true;
					}else {
						return false;
					}
				}	
			},
			context() {
				if(this.operation) {
					return this.orderInfo.orderChangeMsg[0].bs_order_change_content ? JSON.parse(this.orderInfo.orderChangeMsg[0].bs_order_change_content).context : '';
				}
			},
			orderInfo() {
				let data = {...this.data};
				data.entry_date = moment(data.entry_date).format('YYYY-MM-DD');
                data.expected_date = moment(data.expected_date).format('YYYY-MM-DD');
                data.wearingteeth_date = moment(data.wearingteeth_date).format('YYYY-MM-DD');
                data.occlusion = this.getValueByIndex(data.occlusion, this.occlusionList);
                data.approximal_surface = this.getValueByIndex(data.approximal_surface, this.approximalSurfaceList);
                data.in_place = this.getValueByIndex(data.in_place, this.inPlaceList);
                data.embrasures_deep = this.getValueByIndex(data.embrasures_deep, this.embrasuresDeepList);
                data.lip_design = this.getValueByIndex(data.lip_design, this.lipDesingList);
                data.bridge_type = this.getValueByIndex(data.bridge_type, this.bridgeTypeList);
                data.cermets_design = this.getValueByIndex(data.cermets_design, this.cermetsDesignList);
				return data;
			}
		},
		created() {
			// this.getDetailInfo(this.orderNumber);
		},
		methods: {
			getDetailInfo(val) {
				this.$api.post('/factory/order/find', { "number": val }, res => {
                    this.orderInfo = res.data;
                    this.orderInfo.entry_date = moment(this.orderInfo.entry_date).format('YYYY-MM-DD');
                    this.orderInfo.expected_date = moment(this.orderInfo.expected_date).format('YYYY-MM-DD');
                    this.orderInfo.wearingteeth_date = moment(this.orderInfo.wearingteeth_date).format('YYYY-MM-DD');
                    this.orderInfo.occlusion = this.getValueByIndex(this.orderInfo.occlusion, this.occlusionList);
                    this.orderInfo.approximal_surface = this.getValueByIndex(this.orderInfo.approximal_surface, this.approximalSurfaceList);
                    this.orderInfo.in_place = this.getValueByIndex(this.orderInfo.in_place, this.inPlaceList);
                    this.orderInfo.embrasures_deep = this.getValueByIndex(this.orderInfo.embrasures_deep, this.embrasuresDeepList);
                    this.orderInfo.lip_design = this.getValueByIndex(this.orderInfo.lip_design, this.lipDesingList);
                    this.orderInfo.bridge_type = this.getValueByIndex(this.orderInfo.bridge_type, this.bridgeTypeList);
                    this.orderInfo.cermets_design = this.getValueByIndex(this.orderInfo.cermets_design, this.cermetsDesignList);
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
			},
			getNameByValue(status, list) {
				return this.$tool.getNameByValue(status, list);
            },
            getValueByIndex(value, list) {
            	return this.$tool.getValueByIndex(value, list);
            }
		}
	}
</script>

<style lang="less">
	@import url('./BaseInfo.less');
</style>