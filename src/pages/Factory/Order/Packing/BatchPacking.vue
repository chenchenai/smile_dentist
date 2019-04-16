<template>
	<div class="BatchPacking">
		<el-table
            :data="orderList"
            border
            style="width: 100%">
            <el-table-column
                prop="number"
                align="center"
                width="120"
                label="订单编号">
            </el-table-column>
            <el-table-column
                prop="box_no"
                align="center"
                width="60"
                label="盒号">
            </el-table-column>
            <el-table-column
                label="流转状态">
                <template slot-scope="scope">
                    <span>{{ anysisOrderStatus(scope.row) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100"
                label="进件日期">
                <template slot-scope="scope">
                    <span>{{ formatDate(scope.row.entry_date) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100"
                label="预出日期">
                <template slot-scope="scope">
                    <span>{{ formatDate(scope.row.expected_date) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="clinic_name"
                align="center"
                label="客户">
            </el-table-column>
            <el-table-column
                prop="doctor_name"
                align="center"
                label="医生">
            </el-table-column>
            <el-table-column
                prop="salesman_name"
                align="center"
                label="业务员">
            </el-table-column>
            <el-table-column
                align="center"
                prop="patient_name"
                label="患者">
            </el-table-column>
            <el-table-column
                align="center"
                width="280"
                label="产品名称/数量/牙位/比色">
                <template slot-scope="scope">
                    <span v-html="anysisProduceMsg(scope.row.produceMsg || scope.row.orderProduct)"></span>
                </template>
            </el-table-column>
        </el-table>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: ['valid', 'orderid', 'getBatchPackingOrderList', 'clearTableData'],
		data() {
			return {
				orderList: [],
				orderInfo: {},
				statusList: [
                    { name: '待下单', value: '0101' },
                    { name: '待寄出', value: '0201' },
                    { name: '已下单-已寄出', value: '0202' },
                    { name: '生产中-模型消毒', value: '0301' },
                    { name: '生产中-模型入检', value: '0302' },
                    { name: '生产中-工序生产中', value: '0303' },
                    { name: '寄至诊所', value: '0401' },
                    { name: '待试戴', value: '0403' },
                    { name: '试戴-寄至诊所', value: '0404' },
                    { name: '已试戴', value: '0405' },
                    { name: '寄至工厂', value: '0406' },
                    { name: '试戴结束', value: '0407' },
                    { name: '生产完成-成品终检', value: '0501' },
                    { name: '生产中-成品消毒', value: '0502' },
                    { name: '包装', value: '0503' },
                    { name: '生产完成-放行', value: '0504' },
                    { name: '生产完成-成品发货', value: '0505' },
                    { name: '成品收货', value: '0601' },
                    { name: '订单结束', value: '0701' }
                ],
			}
		},
		watch: {
			orderid(val1, val2) {
				if(!val1) {
					
				}else {
					this.getDetailInfo(val1);
				}
			},
            clearTableData(val1, val2) {
                if(val1) {
                    this.orderList = [];
                }
            }
		},
		methods: {
			getDetailInfo(val) {
				this.$api.post('/factory/order/find', { "number": val }, res => {
                    let arr = [];
					// 去除重复添加					
					this.orderList.map((item, index) => {
						if(res.data.number === item.number) {
							this.orderList.splice(index, 1);
						}
					});
					this.orderList.push(res.data);
                    this.orderList.map((item, index) => {
                        arr.push(item.number);
                    });
                    this.$emit('getBatchPackingOrderList', arr);
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
			// 去除时间时分秒
            formatDate(date) {
                return this.$tool.formatDate(date);
            },
            // 解析产品名称/数量/牙位/比色
            anysisProduceMsg(produceMsg) {
                return this.$tool.anysisProduceMsg(produceMsg);
            },
            anysisOrderStatus(data) {
                let status = data.status;
                let terminate_order = data.terminate_order;
                let state = '';
                if(status === '0701') {
                    if(terminate_order === 0) {
                        state = '订单结束';
                    }else if(terminate_order === 1) {
                        state = '已作废';
                    }
                    else if(terminate_order === 2) {
                        state = '已取消';
                    }else if(terminate_order === 3) {
                        state = '已终止';
                    }
                }else {
                    state = this.getNameByValue(status, this.statusList);
                }
                return state;
            },
            // 匹配订单状态
            getNameByValue(status, list) {
                let name = '';
                list.map((item, index) => {
                    if(status == item.value){
                        name = item.name;
                    }
                });
                return name;
            },
		}
	}
</script>

<style lang="less">
	@import url('./BatchPacking.less');
</style>