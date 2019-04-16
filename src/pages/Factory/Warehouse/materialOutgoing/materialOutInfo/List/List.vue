<template>
    <div class="materialOutInfoList">
        <!--删除出库弹框-->
        <el-dialog title="" :visible.sync="delDialogVisible" width="30%" class="delDialogVisible">
            <p class="delDialogVisible_tip">出库单作废后无法恢复，且出库物料不会计出库存，<br/> 也不能再进行出库，确认作废？
            </p>
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
                    <el-button @click.native="openEditDialog(1,'add')">
                        <img src="../../../../../../../static/images/warehouse/add.png">新建出库
                    </el-button>
                    <el-button @click.native="openPrintTraCodeDialog(1,'add')">
                        <img src="../../../../../../../static/images/warehouse/printing_code.png">打印追溯码
                    </el-button>
                    <el-button @click.native="openPrintOrdedrNumDialog()">
                        <img src="../../../../../../../static/images/warehouse/printing_order.png">打印出库单
                    </el-button>
                    <el-button @click.native="export2Excel()">
                        <img src="../../../../../../../static/images/warehouse/export.png">导出出库明细
                    </el-button>
                </div>
                <div class="top_right">
                    <el-select v-model="state" placeholder="状态" class="top_right_item" @change="changeState(state)">
                        <el-option v-for="(item,index) in entryStatus" :key="item.state" :label="item.stateName" :value="item.state">
                        </el-option>
                    </el-select>
                        <el-date-picker align='center' class="top_right_item fromDate" v-model="entryDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="changeDate(entryDate)" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    <el-input placeholder="出库单号" class="input-with-select searchInput" @keyup.delete.native='searchBtn(inputSearchKey)'  @keyup.native.enter='searchBtn(inputSearchKey)' v-model="inputSearchKey">
                        <el-button class="searchBtn" slot="append" :disabled="searchDisabled" @click="searchBtn(inputSearchKey)">搜索</el-button>
                    </el-input>
                </div>
            </div>
            <div class="Table">
                <el-table :data="result" style="width: 100%" @row-click="showDetail" @selection-change="selectionMaterial">>
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='出库单号' prop="orderNo" align="center" width="350"></el-table-column>
                    <el-table-column label='出库时间' prop="createDate" align="center" width="200"></el-table-column>
                    <el-table-column label='出库类型'  align="center" width="350">
                        <template slot-scope="scope">
                                        {{ scope.row.outcomingType === 0 ? '部门领用' : '个人领用' }}
                        </template>
                    </el-table-column>
                    <el-table-column label='部门' prop="deptName" align="center" width="120"></el-table-column>
                    <el-table-column label='领料人' prop="handleUser" align="center" width="120"></el-table-column>
                    <el-table-column label='总金额(元)' prop="sum" align="center" width="120"></el-table-column>
                    <el-table-column label='经办人' prop="agentName" align="center"></el-table-column>
                    <el-table-column label='操作人' prop="operator" align="center"></el-table-column>
                    <el-table-column label='状态' align="center">
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
    <!-- 新建出库 -->
    <AddEntry v-if="showAddEntryDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" />
    <!-- 打印追溯码 -->
    <PrintTraceabilityCode v-if="showPrintTraCodeDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" @openSetPrintDialog="openSetPrintDialog" :selectCodeResult='selectCodeResult' />
    <!-- 打印设置 -->
    <setPrint v-if="showSetPrintDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" />
    <!-- 打印出库单 -->
    <PrintOrdedrNum v-if="showPrintOrdedrNumDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" :selectIdResult='selectIdResult' />
    <!-- 出库单详情 -->
    <OutDetail v-if="showOutDetailDialog" @changeDialogStatus="changeDialogStatus" :entryDetailId="entryDetailId" @openEditSupplierDialog="openEditDialog(1,'edit')" @printOrdedr='printOrdedr' />
    
</template>

    </div>
</template>

<script type="text/javascript">
    import Page from "../../../../../../components/Page/Page";
    import AddEntry from "../Add/Add";
    import PrintTraceabilityCode from "../PrintTraceabilityCode/PrintTraceabilityCode";
    import setPrint from "../setPrint/setPrint"; /*打印设置 */
    import OutDetail from '../Detail/Detail';
    import PrintOrdedrNum from '../PrintOrdedrNum/PrintOrdedrNum';
    import Blob from '@/toExcelJs/Blob.js';
    import Export2Excel from '@/toExcelJs/Export2Excel.js';
    export default {
        components: {
            Page,
            AddEntry,
            PrintTraceabilityCode,
            setPrint,
            OutDetail,

            PrintOrdedrNum
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
                option: [],
                inputSearchKey: '',
                /*输入框搜索关键字 */
                searchDisabled: true,
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
                /*出库单详情ID */
                /*出库状态 */
                entryDate: '',
                /*出库日期 */
                entryInfo: { /*出库信息字段 */
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
                selectIdResult: [],
                selectCodeResult:[],/*出库单号,用于打印追溯码*/
                selectionResult: [],
                /*选择的物料,用于删除 */
                showOutDetailDialog: false,
                // DeleteMaterialDialog: false,
                showAddMaterialTypeDialog: false,
                showPrintTraCodeDialog: false,
                /*打印追溯码弹框 */
                showSetPrintDialog: false,
                /* 打印设置*/
                /*添加物料类别弹框*/
                goodsName: "",
                showAddEntryDialog: false,
                // showAddMaterialDialog: false,
                showPrintOrdedrNumDialog: false,
                /*打印出库单弹窗 */
                root: [{
                    label: '瓷粉',
                    children: []
                }, {
                    label: '支架',
                    children: [{
                        label: '钴铬合金',
                    }, {
                        label: '无波合金',
                    }]
                }, {
                    label: '树脂牙',
                    children: [{
                        label: '国产',
                    }, {
                        label: '进口',
                    }]
                }],
                length: 2,
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                addForm: {
                    name: "",
                    edit: ""
                },
                flag: false,
                delDialogVisible: false,
                addDialogVisible: false,
                /*新建物料类别 */
                editDialogVisible: false,
                addId: "",
                editId: "",
                delId: "",
                delName: "",
                arrId: [],
                rules1: {
                    name: [{
                        validator: validateName,
                        trigger: "blur"
                    }]
                },
                rules2: {
                    edit: [{
                        validator: validateRename,
                        trigger: "blur"
                    }]
                },
                earlyWarning: 'true',
                /*只显示预警物料开关 */
                checked: false,
                // 禁用启用
                submitBtnDisabled: true,
                selectProductId: '',
                tType: '',
                toExcelData: [ /*导出到excel数据 */]
            };
        },
        computed: {
            canSubmit() {
                let flag = false;
                let name = this.addForm.name;
                let edit = this.addForm.edit;
                if (name || edit) {
                    flag = true;
                } else {
                    flag = false;
                }
                return flag;
            }
        },
        watch: {
            canSubmit(curVal) {
                if (curVal) {
                    this.submitBtnDisabled = false;
                } else {
                    this.submitBtnDisabled = true;
                }
            },
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
                console.log(entryDate)
                this.getList({
                    state: this.state,
                    current: 1,
                    rowSize: 15,
                    date: entryDate
                })
            },
            /*按单号查询 */
            changeOrderNum() {
                this.getList({
                    state: this.state,
                    current: 1,
                    rowSize: 15,
                    date: this.entryDate
                })
            },
            /*搜索 */
            searchBtn(val) {
                if(val){
                    this.getList({
                        current: 1,
                        rowSize: 15,
                        purchaseCode: val
                    })
                }else{
                    this.getList({
                        current: 1,
                        rowSize: 15
                    })
                }
                
            },
            /*获取列表 */
            getList(listParams) {
                this.$api.post('/warehouse/outComingList', listParams, res => {
                    this.result = res.data.records;
                })
            },
            // 点击子类查询物料信息列表
            getCurrentKey(keys) {
                this.arrId = [];
                let id = this.traverseTree(keys);
                this.getList({
                    current: 1,
                    unitId: id,
                    rowSize: 15,
                });
            },
            // 点击分页
            pageChange(page) {
                this.getList({
                    current: page,
                    rowSize: 15
                });
            },
            /*仅显示预警物料开关 */
            earlyWarningClick() {
                this.checked = !this.checked;
                this.$refs.earlyWarning.checked = this.checked;
            },
            /*打开新建物料类别对话框 */
            openAddMaterialTypeDialog() {
                this.addDialogVisible = true;
            },
            /*打开打印设置弹框 */
            openSetPrintDialog() {
                this.tType = '打印设置',
                    this.showSetPrintDialog = true;
            },
            /*打开打印出库单 */
            openPrintOrdedrNumDialog() {
                if (this.selectionResult.length == 0) {
                    this.$message.error('请选择出库单');
                } else {
                    this.tType = '打印出库单',
                        this.showPrintOrdedrNumDialog = true;
                }
            },
            /*出库单详情打开打印出库单*/
            printOrdedr(val) {
                this.selectIdResult = [];
                this.selectIdResult.push(val)
            },
            // 打开新建或编辑出库弹窗
            openEditDialog(id, titleType) {
                this.selectProductId = typeof(id) === 'string' || typeof(id) === 'number' ? id : '';
                this.tType = titleType === 'add' ? '新建出库' : '编辑出库'
                this.showAddEntryDialog = true;
            },
            /*打印追溯码弹框 */
            openPrintTraCodeDialog() {
                if (this.selectionResult.length == 0) {
                    this.$message.error('请选择出库单');
                } else {
                    this.tType = '打印追溯码';
                    this.showPrintTraCodeDialog = true
                }
            },
            /*选择出库单*/
            selectionMaterial(val) {
                
                this.selectionResult = val;
                this.selectIdResult = val.map(item => {
                    return item.id
                })
                this.selectCodeResult=val.map(item => {
                    return item.orderNo
                })
                console.log(this.selectCodeResult)
            },
            delSelect() {
                this.delDialogVisible = false;
                this.$api.post(
                    "/warehouse/cancellation", {
                        id: this.entryDetailId
                    },
                    res => {
                        this.$message({
                            message: "删除成功",
                            type: "success",
                            onClose: () => {}
                        });
                    },
                    res => {
                        this.$message({
                            message: res.msg
                        });
                    }
                );
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
            // 显示出库详情
            showDetail(data) {
                this.entryDetailId = data.id;
                this.changeDialogStatus(true, "showOutDetailDialog");
            },
            /*导出为excel */
            export2Excel() {　
                let _self = this;
                if (this.selectionResult.length == 0) {
                    this.$message.error('请选择出库单');
                } else {
                    require.ensure([], () => {　　　
                        const {
                            export_json_to_excel
                        } = require('../../../../../../toExcelJs/Export2Excel');　　　
                        const tHeader = ['出库单号', '出库时间', '供应商', '经办人', '操作人', '物料追溯码', '物料名称', '物料编码', '规格型号', '类别', '单位', '注册证编号', '生产厂家', '生产许可证编号', '批次号', '生产日期', '出库数量', '出库单价(元)'];
                        const filterVal = ['orderNo', 'createDate', 'supplierName', 'handleUser', 'operator', 'tracebackCode', 'name', 'materialNo', 'spec', 'clasName', 'unitName', 'registrationNum', 'manufacturer', 'licenceCode', 'batchNo', 'manufactureDate', 'outNumber', 'price'];
                        let resultList = []
                        let count = 0;
                        this.selectIdResult.forEach(item => {
                            this.$api.post('/warehouse/materialOutDetailed', {
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
                                            operator: res.data.operator,
                                            /*操作人 */
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
                                            outNumber: sItem.outNumber,
                                            price: sItem.price
                                        }
                                    })
                                    resultList.push(itemList);
                                    this.toExcelData = [].concat.apply([], resultList);
                                } else {
                                    itemList = {
                                        orderNo: res.data.orderNo,
                                        createDate: res.data.createDate,
                                        supplierName: res.data.supplierName,
                                        handleUser: res.data.handleUser,
                                        operator: res.data.operator,
                                        /*操作人 */
                                        tracebackCode: '此出库单没有物料'
                                    }
                                    resultList.push(itemList);
                                    this.toExcelData = [].concat.apply([], resultList);
                                }
                                count += 1;
                                if (count === this.selectIdResult.length) {
                                    const data = this.formatJson(filterVal, _self.toExcelData);　
                                    export_json_to_excel(tHeader, data, '出库单明细');
                                }
                            }, res => {
                                count += 1;
                                if (count === this.selectIdResult.length) {
                                    const data = this.formatJson(filterVal, _self.toExcelData);　
                                    export_json_to_excel(tHeader, data, '出库单明细');
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
