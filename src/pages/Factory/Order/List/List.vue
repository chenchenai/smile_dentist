<template>
    <div id="order">
        <div class="operationBtns">
            <div class="left one">
                <el-button @click="changeDialogStatus(true, 'showAddDialog')">新建订单</el-button>
            </div>
            <div class="left two">
                <el-button class="left" @click="changeDialogStatus(true, 'showBoxDialog')" >盒号</el-button>
                <el-button class="left"  @click="changeDialogStatus(true, 'showCodeDialog')">订单条码</el-button>
                <el-button class="left">订单信息</el-button>
            </div>
            <div class="left three">
                <el-button class="left" @click="changeDialogStatus(true, 'showDisinfectionDialog', 1)">模型消毒</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showReleaseModelEntryTestDialog', 1)">模型入检</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showTryToWearBack')">试戴回件</el-button>
            </div>
            <div class="left four">
                <el-button class="left" @click="photographDialog(true)">拍照</el-button>
            </div>
            <div class="left five">
                <el-button class="left" @click="changeDialogStatus(true, 'showDisinfectionDialog', 2)">成品消毒</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showPackingDialog')">包装</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showReleaseModelEntryTestDialog', 2)">放行</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showDeliverGoodsDialog')">发货</el-button>
            </div>
            <div class="left six">
                <el-button class="left" @click="changeDialogStatus(true, 'showPrintLableDialog')">标签</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showPrintQualityCardDialog')">质保卡</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showPrintQualifiedCardDialog')">合格证</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showPrintReportDialog')">检验报告</el-button>
                <el-button class="left" @click="changeDialogStatus(true, 'showPrintAscendSignDialog')">追溯标识</el-button>
            </div>
        </div>
        <div class="statusAndSearch">
            <el-radio-group v-model="selectOrderStatus" @change="changeOrderStatus">
                <el-radio-button :key="item.node" v-for="(item, index) in orderStatusList" :label="item.nodeName + '（' + item.amount +'）'"></el-radio-button>
            </el-radio-group>
            <div class="search">
                <div class="inputSearch">
                    <el-input placeholder="订单编号/盒号" v-model="inputSearch" size="small">
                        <el-button slot="append" @click="find">搜索</el-button>
                    </el-input>
                </div>
                <div class="seniorSearch">
                    <el-button type="text" icon="el-icon-search" @click="changeSearchDialog(true)">高级搜索</el-button>
                </div>
            </div>
        </div>
        <div class="orderTable">
            <el-table
                :data="result.records"
                @row-click="showDetail"
                style="width: 100%">
                <el-table-column
                    prop="number"
                    align="center"
                    width="240"
                    label="订单编号">
                    <template slot-scope="scope">
                        <i class="hasRequireType" v-if="scope.row.require_type || scope.row.require_type == '0'">试</i>
                        <i class="hasAddEdService" v-if="scope.row.added_service == 1">急</i>
                        <i class="isReturn" v-if="scope.row.type == '1'">返</i>
                        <span>{{ scope.row.number }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="box_no"
                    align="center"
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
                    label="进件日期">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.entry_date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="预出日期">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.expected_date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="实出日期">
                    <template slot-scope="scope">
                        <span>{{ formatDate(scope.row.complete_date) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="clinic_name"
                    align="center"
                    label="客户名称">
                </el-table-column>
                <el-table-column
                    prop="doctor_name"
                    align="center"
                    label="医生姓名">
                </el-table-column>
                <el-table-column
                    prop="patient"
                    align="center"
                    label="患者姓名">
                </el-table-column>
                <el-table-column
                    prop="salesman_name"
                    align="center"
                    width="140"
                    label="业务员">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="试戴">
                    <template slot-scope="scope">
                        <span>{{ getNameByValue(scope.row.require_type, requireTypeList) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="300"
                    label="产品名称/数量/牙位/比色">
                    <template slot-scope="scope">
                        <span v-html="anysisProduceMsg(scope.row.produceMsg || scope.row.orderProduct)"></span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
            <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
        </div>
        <template>
            <!-- 新建订单弹窗 -->
            <AddOrder v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" :number="selectRowOrderNumber" :type="isRework" />
            <!--盒号 -->
            <BoxNum v-if="showBoxDialog" @changeDialogStatus="changeDialogStatus" />
            <!--订单条码 -->
            <CodeOrder v-if="showCodeDialog" @changeDialogStatus="changeDialogStatus" />
            <!-- 编辑订单 -->
            <EditOrder v-if="showEditDialog" @changeDialogStatus="changeDialogStatus" />
            <!-- 发货弹窗 -->
            <DeliverGoods v-if="showDeliverGoodsDialog" @changeDialogStatus="changeDialogStatus" />
            <!-- 标签 -->
            <PrintLable v-if="showPrintLableDialog" @changeDialogStatus="changeDialogStatus" @openPrintQualityCard="openPrintQualityCard" />
            <!-- 质保卡 -->
            <PrintQualityCard v-if="showPrintQualityCardDialog" @changeDialogStatus="changeDialogStatus" @openPrintQualifiedCard="openPrintQualifiedCard" />
            <!-- 合格证 -->
            <PrintQualifiedCard v-if="showPrintQualifiedCardDialog" @changeDialogStatus="changeDialogStatus"  @openPrintReport="openPrintReport"/>
            <!-- 检验报告 -->
            <PrintReport v-if="showPrintReportDialog" @changeDialogStatus="changeDialogStatus"  @openPrintAscendSign="openPrintAscendSign"/>
            <!-- 追溯标识 -->
            <PrintAscendSign v-if="showPrintAscendSignDialog" @changeDialogStatus="changeDialogStatus" />
            <!-- 试戴回件 -->
            <TryToWearBack v-if="showTryToWearBack" @changeDialogStatus="changeDialogStatus" />
            <!-- 成品消毒/模型消毒 -->
            <Disinfection v-if="showDisinfectionDialog" :disinfectionType="disinfectionType" @changeDialogStatus="changeDialogStatus" />
            <!-- 模型入检/放行 -->
            <ReleaseModelEntryTest v-if="showReleaseModelEntryTestDialog" @changeDialogStatus="changeDialogStatus" :type="releaseModelEntryTestType" />
            <!-- 高级搜索 -->
            <AdvancedSearch :visible="showAdvancedSearchDialog" @changeSearchDialog="changeSearchDialog" @getSearchResults="getSearchResults" />
            <!-- 包装 -->
            <Packing v-if="showPackingDialog" @changeDialogStatus="changeDialogStatus" />
            <!-- 拍照 -->
            <Photograph v-if="showPhotographDialog" @photographDialog="photographDialog" :showPhotographDialog="showPhotographDialog" />
            <!-- 订单详情 -->
            <OrderDetail v-if="showOrderDetailDialog" @openAddOrderDialog="openAddOrderDialog" @changeDialogStatus="changeDialogStatus" :orderNumber="selectRowOrderNumber" :amount="selectRowOrderAmount" />
        </template>
    </div>
</template>

<script type="text/javascript">
    import Page from '../../../../components/Page/Page';
    import AddOrder from '../Add/Add'; // 新建订单
    import EditOrder from '../Add/Container/Container'; // 编辑订单---------暂时绑定在盒号上面做测试
    import BoxNum from '../Boxnum/Boxnum'; // 盒号
    import CodeOrder from '../Code/Code'; // 订单条码
    import DeliverGoods from '../DeliverGoods/DeliverGoods';  // 发货
    import TryToWearBack from '../TryToWearBack/TryToWearBack'; // 试戴回件
    import PrintLable from '../PrintLable/PrintLable'; // 打印标签
    import PrintQualityCard from '../PrintQualityCard/PrintQualityCard'; // 打印质保卡
    import PrintQualifiedCard from '../PrintQualifiedCard/PrintQualifiedCard'; // 打印合格证
    import PrintReport from '../PrintReport/PrintReport'; // 打印检验报告
    import PrintAscendSign from '../PrintAscendSign/PrintAscendSign'; // 打印检验报告
    import Disinfection from '../Disinfection/Disinfection'; // 模型消毒/成品消毒
    import ReleaseModelEntryTest from '../ReleaseModelEntryTest/ReleaseModelEntryTest'; // 放行
    import AdvancedSearch from '../AdvancedSearch/AdvancedSearch'; // 高级搜索
    import OrderDetail from '../OrderDetail/Container/Container'; // 订单详情
    import Packing from '../Packing/Packing'; // 包装
    import Photograph from '../Photograph/Photograph'; // 拍照
    export default {
        components: { Page, AddOrder, EditOrder, CodeOrder,BoxNum, DeliverGoods,PrintLable,PrintQualityCard,PrintQualifiedCard,PrintReport, Disinfection, ReleaseModelEntryTest, AdvancedSearch, OrderDetail,Packing,TryToWearBack,PrintAscendSign, Photograph },
        data() {
            return {
                inputSearch: '',
                showAddDialog: false, // 新建订单
                showEditDialog: false, // 编辑订单
                showCodeDialog: false, // 打印条码
                showBoxDialog: false, // 盒号
                showDeliverGoodsDialog: false, // 发货
                showTryToWearBack: false, // 试戴回件
                showPrintLableDialog: false, // 打印标签
                showPrintQualityCardDialog: false, // 打印质保卡
                showPrintQualifiedCardDialog: false, // 打印合格证
                showPrintReportDialog: false, // 打印检验报告
                showPrintAscendSignDialog: false, // 打印追溯标识
                showDisinfectionDialog: false, // 成品消毒/模型消毒
                disinfectionType: 1, // 1 模型消毒   2 成品消毒
                showReleaseModelEntryTestDialog: false,
                releaseModelEntryTestType: 1,
                showAdvancedSearchDialog: false, // 高级查询
                showOrderDetailDialog: false, // 订单详情
                showPackingDialog: false, // 包装
                showPhotographDialog: false, // 拍照
                result: {},
                statusList: [
                    { name: '待下单', value: '0101' },
                    { name: '待寄出', value: '0201' },
                    { name: '已下单-已寄出', value: '0202' },
                    { name: '生产中-模型消毒', value: '0301' },
                    { name: '生产中-模型入检', value: '0302' },
                    { name: '生产中-工序生产中', value: '0303' },
                    { name: '试戴-寄至诊所', value: '0401' },
                    { name: '试戴-待试戴', value: '0403' },
                    { name: '试戴-试戴中', value: '0404' },
                    { name: '试戴-已试戴', value: '0405' },
                    { name: '试戴-寄至工厂', value: '0406' },
                    { name: '试戴-试戴结束', value: '0407' },
                    { name: '生产完成-成品终检', value: '0501' },
                    { name: '生产完成-成品消毒', value: '0502' },
                    { name: '生产完成-包装', value: '0503' },
                    { name: '生产完成-放行', value: '0504' },
                    { name: '生产完成-成品发货', value: '0505' },
                    { name: '成品收货', value: '0601' },
                    { name: '订单结束', value: '0701' }
                ],
                requireTypeList: [
                    { name: '试冠', value: '0' },
                    { name: '试瓷', value: '1' },
                    { name: '腊牙', value: '2' },
                    { name: '试架', value: '3' },
                    { name: '试颌', value: '4' }
                ],
                orderStatusList: [],
                pageApiName: '',
                advancedsearchData: {},
                selectOrderStatus: '',
                orderStatesList: [
                    {name: '已下单', id: '02'},
                    {name: '生产中', id: '03'},
                    {name: '试戴', id: '04'},
                    {name: '生产完成', id: '05'},
                ],
                terminateOrdersList: [
                    {name: '已终止', id: '3'},
                    {name: '已作废', id: '1'}
                ],
                selectRowOrderNumber: '',
                isRework: false
            }
        },
        computed: {
            statusName() {
                return this.getNameByValue();
            }
        },
        created(){
            this.getOrderList(1);
            this.getOrderStatusList();
        },
        mounted() {
            let code = "";
            let lastTime = null;
            let nextTime = null;
            let lastCode = null;
            let nextCode = null;
            let _this = this;
            document.onkeypress = function(e) {
                nextCode = e.which;
                nextTime = new Date().getTime();
                if(lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
                    code += String.fromCharCode(lastCode);
                } else if(lastCode != null && lastTime != null && nextTime - lastTime > 100){
                    code = "";
                }
                lastCode = nextCode;
                lastTime = nextTime;
                let hasOn = code.toUpperCase().indexOf('ON');
                if(nextCode == 13){
                    _this.inputSearch = code;
                    if(_this.$refs.searchOrderInput) {
                        _this.$refs.searchOrderInput.blur(code.split('ON')[1]);
                        // _this.find(function(res) {
                        //     console.log(res)
                        // });
                    }
                    code = '';
                    return false;
                }
            }
        },
        methods: {
            // 获取列表数据
            getOrderList(current) {
                this.$api.post('/factory/order/list', {
                        "current": current,
                        "rowSize": 15
                    },
                res => {
                    if(res.data) {
                        this.result = res.data;
                    };
                    this.pageApiName = 'list';
                }, res => {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
            },
            // 获取订单状态
            getOrderStatusList() {
                this.$api.get('/factory/order/statistics', null, res => {
                    this.orderStatusList = res.data;
                    this.selectOrderStatus = res.data[0].nodeName + '（' + res.data[0].amount +'）';
                }, res => {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
            },
            // 点击订单状态
            changeOrderStatus(data) {
                let postData = {
                    "boxNo": '',
                    "clinic": '',
                    "current": 1,
                    "dateType": 0,
                    "doctor": '',
                    "startDate": '',
                    "goodsName": '',
                    "isNormal": 1,
                    "isRework": 1,
                    "orderStates": null,
                    "patient": '',
                    "repairType": null,
                    "rowSize": 15,
                    "salesman": '',
                    "endDate": '',
                    "isUrgent": 0,
                    "terminateOrders": null
                };
                let name = data.split('（')[0];
                if(name == '全部') {
                    postData.isUrgent = 0;
                    postData.isRework = 1;
                    postData.isNormal = 1;
                    postData.orderStates = ['02', '03', '04', '05'];
                    postData.terminateOrders = ['1', '3'];
                }
                else if (name == '返工件') {
                    postData.isRework = 1;
                    postData.isNormal = 0;
                    postData.isUrgent = 0;
                    postData.orderStates = ['02', '03', '04', '05'];
                    postData.terminateOrders = null;
                }else if (name == '加急件') {
                    postData.isUrgent = 1;
                    postData.isRework = 1;
                    postData.isNormal = 1;
                    postData.orderStates = ['02', '03', '04', '05'];
                    postData.terminateOrders = null;
                }else {
                    this.orderStatesList.map((item, index) => {
                        if(item.name == name) {
                            postData.orderStates = [item.id];
                            postData.terminateOrders = null;
                            postData.isUrgent = 0;
                            postData.isRework = 1;
                            postData.isNormal = 1;
                        }
                    });
                    this.terminateOrdersList.map((item, index) => {
                        if(item.name == name) {
                            postData.terminateOrders = [Number(item.id)];
                            postData.orderStates = null;
                            postData.isUrgent = 0;
                            postData.isRework = 1;
                            postData.isNormal = 1;
                        }
                    });
                };
                this.$api.post('/factory/order/advancedsearch', postData, res => {
                    this.result = res.data ? res.data : {};
                    this.showAdvancedSearchDialog = false;
                    this.pageApiName = 'advancedsearch';
                    this.advancedsearchData = postData;
                }, res => {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
            },
            // 搜索订单号/盒号
            find() {
                this.$api.post('/factory/order/find', {number: this.inputSearch}, res => {
                    this.result = {
                        size: 15,
                        total: 1,
                        current: 1,
                        records: [res.data]
                    };
                }, res => {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
            },
            // 点击高级搜索
            advancedSearch() {
                this.showAdvancedSearchDialog = true;
            },
            changeSearchDialog(status) {
                this.showAdvancedSearchDialog = status;
            },
            // 获取高级搜索数据
            getSearchResults(res, data) {
                this.result = res;
                this.pageApiName = 'advancedsearch';
                this.advancedsearchData = data;
            },
            // 点击分页
            pageChange(page) {
                this.showAdvancedSearchDialog = false;
                if(this.pageApiName == 'list') {
                    this.getOrderList(page);
                }else if(this.pageApiName == 'advancedsearch') {
                    let data = this.advancedsearchData;
                    data.current = page;
                    this.$api.post('/factory/order/advancedsearch', data, res => {
                        this.result = res.data ? res.data : {};
                    }, res => {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000,
                        });
                    });
                }
            },
            // 匹配订单状态
            getNameByValue(status, list) {
                let name = '';
                list.map((item, index) => {
                    if(status && status == item.value){
                        name = item.name;
                    }
                });
                return name;
            },
            // 解析产品名称/数量/牙位/比色
            anysisProduceMsg(produceMsg) {
                return this.$tool.anysisProduceMsg(produceMsg);
            },
            // 打开或者关闭弹窗
            changeDialogStatus(status, dialogStatusName, type) {
                this[dialogStatusName] = status;
                this.disinfectionType = type && type == 1 ? 1 : 2;
                this.releaseModelEntryTestType = type && type == 1 ? 1 : 2;
                this.showAdvancedSearchDialog = false;
                if(!status) {
                    this.getOrderList(1);
                    this.number = '';
                    if(dialogStatusName != 'showOrderDetailDialog') {
                        this.selectRowOrderNumber = '';
                    }
                }
                if(dialogStatusName == 'showAddDialog') {
                    this.selectRowOrderNumber = '';
                }
            },
            // 详情页面，打开编辑订单弹窗
            openAddOrderDialog(type) {
                this.showAddDialog = true;
                this.isRework = type === 'rework';
            },
           //打开质保卡弹窗
            openPrintQualityCard() {
                this.showPrintQualityCardDialog = true;
            },
            //打开合格证弹窗
            openPrintQualifiedCard() {
              this.showPrintQualifiedCardDialog = true;
            },
            //打开检验报告弹窗
            openPrintReport() {
              this.showPrintReportDialog = true;
            },
            //打开追溯标识弹窗
            openPrintAscendSign() {
              this.showPrintAscendSignDialog = true;
            },
            // 去除时间时分秒
            formatDate(date) {
                return this.$tool.formatDate(date);
            },
            // 点击表格行，显示订单详情
            showDetail(data) {
                this.selectRowOrderNumber = data.number;
                this.selectRowOrderAmount = data.amount;
                this.changeDialogStatus(true, 'showOrderDetailDialog')
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
            photographDialog(status) {
                // window.location.href = '../../../../../static/iframe/vue.html'
                this.showPhotographDialog = status;
                if(!status) {
                    this.getOrderList(1);
                }
            }
        }
    }
</script>
<style lang="less">
    @import './List.less';
</style>
