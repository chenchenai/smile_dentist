<template>
    <div class="materielOutDetail" id="supplierDetail">
        <Dialog className="materielDetailDialog" title="出库详情" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="postionBtns">
                    <el-button type="text" @click="printOutOrder()">打印出库单</el-button>
                    <!-- <el-button type="text" @click="editmateriel">编辑</el-button> -->
                    <el-button type="text" @click="showDeletemateriel">作废</el-button>
                </div>
                <div class="topTitle">{{addFormData.orderNo}}</div>
                <el-form class="top" label-position="left" label-width="92px" ref="addForm">
                    <el-row :gutter="gutter" class="remakesRow">
                        <el-col :span='spanOne'>
                            <el-form-item label="出库类型" class="fromItem lWith">
                                <p>部门使用</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span='spanOne'>
                            <el-form-item label="部门" class="fromItem">
                                <p>{{addFormData.deptName}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span='spanOne'>
                            <el-form-item label="领料人" class="fromItem sWith">
                                <p>{{addFormData.userName}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter" class="remakesRow">
                        <el-col :span='spanOne'>
                            <el-form-item label="出库时间" class="fromItem lWith">
                                <p>{{addFormData.date}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span='spanOne'>
                            <el-form-item label="经办人" class="fromItem">
                                <p>{{addFormData.agentName}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span='spanOne'>
                            <el-form-item label="操作人" class="fromItem sWith">
                                <p>{{addFormData.operator}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter" class="remakesRow">
                        <el-col :span='spanTwo'>
                            <el-form-item label="状态" class="fromItem sWith">
                                <p>{{addFormData.status=== 1 ? '正常' : '作废'}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter" class="remakesRow">
                        <el-col :span='spanTwo'>
                            <el-form-item label="备注" class="fromItem lWith">
                                <p>{{addFormData.remark}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="detail">
                    <div class="detail_left">
                        <p class="el-form_p">物料明细</p>
                        <p class="total">合计</p>
                    </div>
                    <div class="materiel_tab">
                        <happy-scroll color="#ffffff" size="4" resize  hide-vertical>
                            <div class="materiel_tab_con">
                                <ul class="materiel_tab_th" ref="topMaterielTabTh">
                                    <li class="materiel_tab_th_item" v-for="(item,index) in materielTabTh" :key="index">{{item}}</li>
                                </ul>
                                <div class="happyScroll_box" style="height:155px;" ref="happyScrollBox">
                                    <happy-scroll color="#ffffff" size="4" resize  hide-horizontal>
                                        <ul class="materiel_tab_td">
                                            <li v-for="(item,index) in addFormData.inMaterialDetailed" :key="index">
                                                <p>{{item.name}}</p>
                                                <p>{{item.tracebackCode}}</p>
                                                <p>{{item.materialNo}}</p>
                                                <p>{{item.spec}}</p>
                                                <p>{{item.clasName}}</p>
                                                <p>{{item.unitName}}</p>
                                                <p>{{item.registrationNum}}</p>
                                                <p>{{item.manufacturer}}</p>
                                                <p>{{item.licenceCode}}</p>
                                                <p>{{item.batchNo}}</p>
                                                <p>{{item.manufactureDate}}</p>
                                                <p>{{item.price}}</p>
                                                <p>{{item.inNum}}</p>
                                            </li>
                                        </ul>
                                    </happy-scroll>
                                </div>
                                <ul class="totalBox">
                                    <li>{{totalData.materielName}}</li>
                                    <li>{{totalData.traceCode}}</li>
                                    <li>{{totalData.materielCode}}</li>
                                    <li>{{totalData.spec}}</li>
                                    <li>{{totalData.type}}</li>
                                    <li>{{totalData.unit}}</li>
                                    <li>{{totalData.materielRegNum}}</li>
                                    <li>{{totalData.materielfactor}}</li>
                                    <li>{{totalData.licenseCode}}</li>
                                    <li>{{totalData.batchNum}}</li>
                                    <li>{{totalData.date}}</li>
                                    <li>{{totalData.price}}</li>
                                    <li>{{totalData.outNun}}</li>
       
                                </ul>
                            </div>
                        </happy-scroll>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import Dialog from '../../../../../../components/Dialog/Dialog';
    export default {
        props: ['entryDetailId'],
        components: {
            Dialog
        },
        data() {
            return {
                materielTabTh: [
                    '物料名称',
                    '追溯码',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '注册证编号',
                    '生产厂家',
                    '生产许可证编号',
                    '批次号',
                    '生产日期',
                    '单价',
                    '出库数量',
                ],
                addFormData: {
                    agentId: '',
                    /*经办人id */
                    agentName: '',
                    deptName:'',
                    supplierName: '' /*供应商名称 */ ,
                    supplierid: '',
                    purchaseCode: '' /*采购单号 */ ,
                    remark: '',
                    inMaterialDetailed: [],
                    /******以下接口没有返回 */
                    date: '',
                    operator: '',
                    status: 0,
                },
                totalData: { /*合计 */
                    materielName: '',
                    traceCode: '',
                    materielCode: '',
                    spec: '',
                    type: '',
                    unit: '',
                    materielfactor: '',
                    licenseCode: '',
                    batchNum: '',
                    date: '',
                    price: '',
                    outNun: '',
                },
                gutter: 20,
                spanOne: 8,
                spanTwo: 24,
            }
        },
        created() {
            this.getOutDetail();
        },
        mounted() {
            this.$nextTick(()=>{
                 document.querySelector('.gutter').style.width = 3 + 'px';
            })
           
        },
        methods: {
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'showOutDetailDialog');
            },
            /*切换弹出框状态 */
            changeDialogStatus(status, dialogStatusName) {
                this[dialogStatusName] = status;
            },
            /*弹出确定作废框*/
            showDeletemateriel() {
                this.$emit('changeDialogStatus', true, 'delDialogVisible')
            },
            /*获取出库单详情 */
            getOutDetail() {
                this.$api.post('/warehouse/materialOutDetailed', {
                    id: this.entryDetailId
                }, res => {
                    this.addFormData.orderNo = res.data.orderNo,
                    this.addFormData.agentId = res.data.handleUserId,
                        this.addFormData.agentName = res.data.handleUser,
                        this.addFormData.deptName = res.data.deptName,
                        this.addFormData.date = res.data.createDate,
                        this.addFormData.supplierid = res.data.supplierid,
                        this.addFormData.supplierName = res.data.supplierName,
                        this.addFormData.userName = res.data.userName,
                        this.addFormData.inMaterialDetailed = res.data.inMaterialDetailed,
                        this.addFormData.purchaseCode = res.data.purchaseCode,
                        this.addFormData.operator = res.data.operator,
                        this.addFormData.remark = res.data.remark,
                        this.addFormData.status = res.data.states
                }, res => {})
            },
            /*弹出打印出库单弹窗 */
            printOutOrder() {
                this.$emit('changeDialogStatus', true, 'showPrintOrdedrNumDialog');
                this.$emit('printOrdedr',this.entryDetailId)
                this.closeDialog()
            }
        }
    }
</script>

<style lang="less">
    @import url('./Detail.less');
</style>