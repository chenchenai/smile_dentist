<template>
    <div class="materialStorageList">
        <!--删除节点弹框-->
        <el-dialog title="" :visible.sync="delDialogVisible" width="30%" class="delDialogVisible">
            <p class="delDialogVisible_tip" v-text="deleteOrCancelTip"></p>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" class="submit" @click="delSelect()">
                    确 认
                </el-button>
                <el-button size="small" class="cancel" @click="delDialogVisible = false">
                    取 消
                </el-button>
            </div>
        </el-dialog>
        <el-row class="row-right">
            <div class="top">
                <div class="top_left">
                    <el-button @click.native="openEditDialog(0)">
                        <img src="../../../../../../../static/images/warehouse/add.png">新建入库
                    </el-button>
                    <el-button @click.native="openPrintTraCodeDialog(1,'add')">
                        <img src="../../../../../../../static/images/warehouse/printing_code.png">打印追溯码
                    </el-button>
                    <el-button @click.native="openPrintOrdedrNumDialog()">
                        <img src="../../../../../../../static/images/warehouse/printing_order.png">打印入库单
                    </el-button>
                    <el-button @click.native="export2Excel()">
                        <img src="../../../../../../../static/images/warehouse/export.png">导出入库明细
                    </el-button>
                </div>
                <div class="top_right">
                    <el-select v-model="state" placeholder="状态" class="top_right_item" @change="changeState(state)">
                        <el-option v-for="item in entryStatus" :key="item.state" :label="item.stateName" :value="item.state">
                        </el-option>
                    </el-select>
                    <el-date-picker class="top_right_item fromDate" type="date" placeholder="请选择入库日期" :clearable='false' v-model="entryDate" style="width: 100%;" @change="changeDate(entryDate)" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    <el-input placeholder="请输入入库单号" class="input-with-select searchInput" @keyup.delete.native='changeOrderNum(inputSearchKey)' @keyup.native.enter='changeOrderNum(inputSearchKey)' v-model="inputSearchKey">
                        <el-button class="searchBtn" slot="append" :disabled="searchDisabled" @click="changeOrderNum(inputSearchKey)">搜索</el-button>
                    </el-input>
                </div>
            </div>
            <div class="Table">
                <el-table :data="result" style="width: 100%" @row-click="showDetail" @selection-change="selectionMaterial">>
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='入库单号' prop="orderNo" align="center" width="350"></el-table-column>
                    <el-table-column label='入库时间' prop="createDate" align="center" width="200"></el-table-column>
                    <el-table-column label='供应商' prop="supplierName" align="center" width="350"></el-table-column>
                    <el-table-column label='经办人' prop="handleUser" align="center" width="120"></el-table-column>
                    <el-table-column label='操作人' prop="operator" align="center" width="120"></el-table-column>
                    <el-table-column label='采购单号' prop="purchaseCode" align="center" ></el-table-column>
                    <el-table-column label='总金额(元)' prop="sum" align="center" width="120"></el-table-column>
                    <el-table-column label='状态' align="center" width="100">
                        <template slot-scope="scope">
                                {{ scope.row.states === 1 ? '正常' : '作废' }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
            </div>
        </el-row>
        <template>
            <!-- 新建入库 -->
            <AddEntry v-if="showAddEntryDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" />
            <!-- 打印追溯码 -->
            <PrintTraceabilityCode v-if="showPrintTraCodeDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" @openSetPrintDialog="openSetPrintDialog" :selectIdResult='selectIdResult'/>
            <!-- 打印设置 -->
            <setPrint v-if="showSetPrintDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" />
            <!-- 打印入库单 -->
            <PrintOrdedrNum v-if="showPrintOrdedrNumDialog" @changeDialogStatus="changeDialogStatus" :titleType="tType" :selectIdResult='selectIdResult'/>
            <!-- 入库单详情 -->
            <EntryDetail v-if="showEntryDetailDialog" @changeDialogStatus="changeDialogStatus" :entryDetailId="entryDetailId" @openEditSupplierDialog="openEditDialog" @printOrdedr='printOrdedr' @cancelOrDelete='cancelOrDelete'/>
           
        </template>
    </div>
</template>

<script type="text/javascript">
    import Page from "../../../../../../components/Page/Page";
    import AddEntry from "../Add/Add";
    import PrintTraceabilityCode from "../PrintTraceabilityCode/PrintTraceabilityCode";
    import setPrint from "../setPrint/setPrint"; /*打印设置 */
    import EntryDetail from '../Detail/Detail';
    import PrintOrdedrNum from '../PrintOrdedrNum/PrintOrdedrNum';
    import Blob from '@/toExcelJs/Blob.js';
    import Export2Excel from '@/toExcelJs/Export2Excel.js';
    export default {
        components: {
            Page,
            AddEntry,
            PrintTraceabilityCode,
            setPrint,
            PrintOrdedrNum,
            EntryDetail
        },
        data() {
            var validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("物料类别名称不能为空"));
                } else {
                    callback();
                }
            };
            var validateRename = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("节点名称不能为空"));
                } else {
                    callback();
                }
            };
            return {
                deleteOrCancelTip:'',/*删除或作废弹框文字提示 */
                cancelOrDeleteType:'',/*作废或者删除 */
                searchDisabled:true,/*搜索禁用开关 */
                inputSearchKey: '',
                /*输入框搜索关键字 */
                state: 0,
                entryStatus: [{
                        state: 0,
                        stateName: '全部',
                    },
                    {
                        state: 1,
                        stateName: '正常',
                    },
                    {
                        state: -1,
                        stateName: '作废',
                    },
                ],
                entryDetailId: '',
                /*入库单详情ID */
                /*入库状态 */
                entryDate: '',
                /*入库日期 */
                entryInfo: { /*入库信息字段 */
                    orderNum: '',
                    date: '',
                    supplier: '',
                    /*供应商 */
                    operator: '',
                    /*经办人 */
                    operation: '',
                    /*操作人 */
                    purchaseNum: '',
                    /*采购单号 */
                    totalMoney: '',
                    /*总金额 */
                    status: '',
                    /*状态 */
                },
                result: [],
                selectionResult: [],
                selectIdResult:[],
                /*选择的物料,用于删除 */
                showPrintTraCodeDialog: false,
                /*打印追溯码弹框 */
                showSetPrintDialog: false,
                /* 打印设置*/
                /*添加物料类别弹框*/
                showAddEntryDialog: false,
                showPrintOrdedrNumDialog: false,
                showEntryDetailDialog:false,/*入库详情 */
                /*打印入库单弹窗 */
                addForm: {
                    name: "",
                    edit: ""
                },
                delDialogVisible: false,
                selectProductId: '',
                tType: '',
                toExcelData:[]/*导出到excel数据 */,
            };
        },
        computed: {

        },
        watch: {
            inputSearchKey(newVal,oldVal){
                if(newVal===''){
                    this.searchDisabled=true;
                }else{
                    this.searchDisabled=false;
                }
            }
        },
        created() {
            this.getList({
                current: 1,
                rowSize: 15,
            })
        },
        methods: {
            /*按状态查询 */
            changeState(state) {
                this.getList({
                    state: state,
                    current: 1,
                    rowSize: 15
                })
            },
            /*按日期查询 */
            changeDate(entryDate) {
                this.getList({
                    state: this.state,
                    current: 1,
                    rowSize: 15,
                    date: entryDate
                })
            },
            /*按单号查询 */
            changeOrderNum(val) {
                if(val===''){
                    this.getList({
                        current: 1,
                        rowSize: 15,
                    })
                }else{
                    this.getList({
                        purchaseCode:val,
                        current: 1,
                        rowSize: 15,
                    })
                }
                
            },
            /*获取列表 */
            getList(listParams) {
                this.$api.post('/warehouse/incomingList', listParams, res => {
                    this.result = res.data.records;
                })
            },
            // 点击分页
            pageChange(page) {
                this.getList({
                    current: page,
                    rowSize: 15
                });
            },
            /*打开打印设置弹框 */
            openSetPrintDialog() {
                this.tType = '打印设置',
                    this.showSetPrintDialog = true;
            },
            /*打开打印入库单 */
            openPrintOrdedrNumDialog() {
                if(this.selectionResult.length==0){
                    this.$message.error('请选择入库单');
                }else{
                    this.tType = '打印入库单',
                    this.showPrintOrdedrNumDialog = true;
                }
            },
            /*入库单详情打开打印入库单*/
            printOrdedr(val){
                this.selectIdResult=[];
                this.selectIdResult.push(val)
            },
            /*作废该入库单 */
            cancelOrDelete(val,type){
                this.entryDetailId=val;
                if(type==='cancel'){
                    this.deleteOrCancelTip='入库单作废后无法恢复，且入库物料不会计入库存，也不能再进行出库，确认作废？';
                }else if(type==='delete'){
                    this.deleteOrCancelTip='单据删除后无法恢复，确认删除？';
                }
                this.cancelOrDeleteType=type;
            },
            /*作废或删除确定按钮*/
            delSelect() {
                this.delDialogVisible = false;
                if(this.cancelOrDeleteType==='cancel'){
                    this.calOrDel("/warehouse/cancellation",{id: this.entryDetailId},'作废成功');
                }else if(this.cancelOrDeleteType==='delete'){
                    this.calOrDel("/warehouse/cancellation",{id: this.entryDetailId},'删除成功')
                }
            },
            /*作废或删除函数*/
            calOrDel(url,httpParams,msg){
                this.$api.post(url, httpParams,res => {
                        this.$message({
                            message: msg,
                            type: "success",
                            onClose: () => {
                                this.getList({
                                    current: 1,
                                    rowSize: 15
                                });
                                this.showEntryDetailDialog=false;
                            }
                        });
                    },
                    res => {
                        this.$message({
                            message: res.msg
                        });
                    }
                );
            },
            /* 打开新建或编辑入库弹窗*/
            openEditDialog(id) {
                if(id===0){
                    this.selectProductId='';
                    this.tType='新建入库'
                }else{
                    this.selectProductId=id;
                    this.tType='编辑入库'
                }
                this.showAddEntryDialog = true;
            },
            /*打印追溯码弹框 */
            openPrintTraCodeDialog() {
                if(this.selectionResult.length==0){
                    this.$message.error('请选择入库单');
                }else{
                    this.tType = '打印追溯码';
                    this.showPrintTraCodeDialog = true
                }
            },
            /*选择物料 */
            selectionMaterial(val) {
                this.selectionResult = val;
                this.selectIdResult=val.map(item=>{
                    return item.id
                })
            },
            /*新建或物料 */
            changeDialogStatus(status, dialogStatusName, type) {
                this[dialogStatusName] = status;
                if (!status) {
                    this.getList({
                        current: 1,
                        rowSize: 15
                    });
                }
            },
            // 显示入库详情
            showDetail(data) {
                this.entryDetailId = data.id;
                this.changeDialogStatus(true, "showEntryDetailDialog");
            },
            /*导出为excel */
            export2Excel() {　
                let _self = this;
                if (this.selectionResult.length == 0) {
                    this.$message.error('请选择入库库单');
                } else {
                    require.ensure([], () => {　　　
                        const {
                            export_json_to_excel
                        } = require('../../../../../../toExcelJs/Export2Excel');　　　
                        const tHeader = ['入库单号', '入库时间', '供应商', '经办人', '操作人', '物料追溯码', '物料名称', '物料编码', '规格型号', '类别', '单位', '注册证编号', '生产厂家', '生产许可证编号', '批次号', '生产日期', '入库数量', '入库单价(元)'];
                        const filterVal = ['orderNo', 'createDate', 'supplierName', 'handleUser', 'operator', 'tracebackCode', 'name', 'materialNo', 'spec', 'clasName', 'unitName', 'registrationNum', 'manufacturer', 'licenceCode', 'batchNo', 'manufactureDate', 'inNum', 'price'];
                        let resultList = []
                        let count = 0;
                        this.selectIdResult.forEach(item => {
                            this.$api.post('/warehouse/materialDetailed', {
                                id: item
                            }, res => {
                                let itemList = [];
                                if (res.data.inMaterialDetailed.length > 0) {
                                    itemList = res.data.inMaterialDetailed.map(sItem => {
                                        return {
                                            orderNo: res.data.orderNo,
                                            createDate: res.data.createDate,
                                            supplierName: res.data.supplierName,
                                            handleUser: res.data.handleUser,
                                            operator: res.data.operator,/*操作人 */
                                            tracebackCode: sItem.tracebackCode,
                                            name: sItem.name,
                                            materialNo: sItem.materialNo,
                                            spec: sItem.spec,
                                            clasName: sItem.clasName,
                                            unitName: sItem.unitName,
                                            registrationNum: sItem.registrationNum,
                                            manufacturer: sItem.manufacturer,
                                            licenceCode: sItem.licenceCode,
                                            batchNo: sItem.batchNo,
                                            manufactureDate: sItem.manufactureDate,
                                            inNum: sItem.inNum,
                                            price: sItem.price
                                        }
                                    })
                                    resultList.push(itemList);
                                    this.toExcelData = [].concat.apply([], resultList);
                                }else{
                                    itemList={
                                        orderNo: res.data.orderNo,
                                        createDate: res.data.createDate,
                                        supplierName: res.data.supplierName,
                                        handleUser: res.data.handleUser,
                                        operator: res.data.operator,/*操作人 */
                                        tracebackCode:'此入库单没有物料'
                                    }
                                    resultList.push(itemList);
                                    this.toExcelData = [].concat.apply([], resultList);
                                }
                                count += 1;
                                if (count === this.selectIdResult.length) {
                                    const data = this.formatJson(filterVal, _self.toExcelData);
                                    　export_json_to_excel(tHeader, data, '入库单明细');
                                }
                            }, res => {
                                count += 1;
                                if (count === this.selectIdResult.length) {
                                    const data = this.formatJson(filterVal, _self.toExcelData);
                                    　export_json_to_excel(tHeader, data, '入库单明细');
                                }
                            })
                        })　
                    })
                }
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    };
</script>

<style lang="less">
    @import url("./List.less");
</style>
