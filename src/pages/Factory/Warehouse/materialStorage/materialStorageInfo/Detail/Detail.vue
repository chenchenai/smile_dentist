<template>
    <div class="storageDetail" id="storageDetail">
        <Dialog className="materialDetailDialog" title="入库详情" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="postionBtns">
                    <el-button type="text" @click="showPrint">打印入库单</el-button>
                    <!-- <el-button type="text" @click="editMaterial">编辑</el-button> -->
                    <el-button v-if="addFormData.status=== 1" type="text" @click="cancelOrDelete('cancel')">作废</el-button>
                    <el-button v-else type="text" @click="cancelOrDelete('delete')">删除</el-button>
                </div>
                <div class="topTitle">{{addFormData.orderNo}}</div>
                <el-form class="top" :model="addFormData" label-position="left" label-width="92px" ref="addForm">
                    <el-form-item label="供应商" class="fromItem lWith" prop='supplierName'>
                        <p>{{addFormData.supplierName}}</p>
                    </el-form-item>
                    <el-form-item label="入库时间" class="fromItem" prop="date">
                        <p>{{addFormData.date}}</p>
                    </el-form-item>
                    <el-form-item label="经办人" class="fromItem sWith" prop="agentName">
                        <p>{{addFormData.agentName}}</p>
                    </el-form-item>
                    <el-form-item label="采购单号" class="fromItem lWith" prop="purchaseCode">
                        <p>{{addFormData.purchaseCode}}</p>
                    </el-form-item>
                    <el-form-item label="操作人" class="fromItem" prop="operator">
                        <p>{{addFormData.operator}}</p>
                    </el-form-item>
                    <el-form-item label="状态" class="fromItem sWith" prop="status">
                        <p>{{addFormData.status=== 1 ? '正常' : '作废'}}</p>
                    </el-form-item>
                    <el-form-item label="备注" class="fromItem lWith" prop="remark">
                        <p>{{addFormData.remark}}</p>
                    </el-form-item>
                </el-form>
                <div class="detail">
                    <div class="detail_left">
                        <p class="el-form_p">物料明细</p>
                        <p class="total">合计</p>
                    </div>
                    <div class="materiel_tab">
                        <happy-scroll color="#ffffff" size="4" resize hide-vertical>
                            <div class="materiel_tab_con">
                                <ul class="materiel_tab_th" ref="topMaterielTabTh">
                                    <li class="materiel_tab_th_item" v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                                </ul>
                                <div class="happyScroll_box" style="height:155px;" ref="happyScrollBox">
                                    <happy-scroll color="#ffffff" size="4" resize hide-horizontal>
                                        <ul class="materiel_tab_td">
                                            <li v-for="(item,index) in addFormData.inMaterialDetailed" :key="index">
                                                <p>{{item.name}}</p>
                                                <p>{{item.materialNo}}</p>
                                                <p>{{item.spec}}</p>
                                                <p>{{item.clasName}}</p>
                                                <p>{{item.unitName}}</p>
                                                <p>{{item.registrationNum}}</p>
                                                <p>{{item.manufacturer}}</p>
                                                <p>{{item.licenceCode}}</p>
                                                <p>{{item.tracebackCode}}</p>
                                                <p>{{item.batchNo}}</p>
                                                <p>{{item.manufactureDate}}</p>
                                                <p>{{item.price | fixFloat2}}</p>
                                                <p>{{item.inNum}}</p>
                                            </li>
                                        </ul>
                                    </happy-scroll>
                                </div>
                                <ul class="totalBox">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li>{{totalPrice | fixFloat2}}</li>
                                    <li>{{totalNum}}</li>
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
                materialTabTh: [
                    '物料名称',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '注册证编号',
                    '生产厂家',
                    '生产许可证编号',
                    '追溯码',
                    '批次号',
                    '生产日期',
                    '单价',
                    '入库数量',
                ],
                addFormData: {
                    orderNo:'',
                    agentId: '',
                    /*经办人id */
                    agentName: '',
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
                totalPrice:0,
                totalNum:0,
            }
        },
        filters: {
            fixFloat2(value) {
                let value_new = Number(value);
                if (isNaN(value_new)) {
                    return value;
                } else {
                    return value_new.toFixed(2);
                }
            },
        },
        created() {
            this.getEntryDetail();
        },
        mounted() {
        },
        methods: {
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'showEntryDetailDialog');
            },
            /*切换弹出框状态 */
            changeDialogStatus(status, dialogStatusName) {
                this[dialogStatusName] = status;
            },
            /*弹出作废或删除框*/
            cancelOrDelete(type) {
                this.$emit('changeDialogStatus', true, 'delDialogVisible')
                this.$emit('cancelOrDelete',this.entryDetailId,type)
            },

            /*获取入库单详情 */
            getEntryDetail() {
                this.$api.post('/warehouse/materialDetailed', {
                    id: this.entryDetailId
                }, res => {
                    this.addFormData.agentId = res.data.handleUserId;
                    this.addFormData.orderNo = res.data.orderNo;
                    this.addFormData.agentName = res.data.handleUser;
                    this.addFormData.date = res.data.createDate;
                    this.addFormData.supplierid = res.data.supplierid;
                    this.addFormData.supplierName = res.data.supplierName;
                    this.addFormData.inMaterialDetailed = res.data.inMaterialDetailed;
                    this.addFormData.purchaseCode = res.data.purchaseCode;
                    this.addFormData.operator = res.data.operator;
                    this.addFormData.remark = res.data.remark;
                    this.addFormData.status = res.data.states;
                    res.data.inMaterialDetailed.forEach(item => {
                        this.totalNum += Number(item.inNum);
                        this.totalPrice +=Number(Number(item.price)*Number(item.inNum));
                    });
                }, res => {})
            },
            /*打印入库单 */
            showPrint() {
                this.$emit('changeDialogStatus', true, 'showPrintOrdedrNumDialog');
                this.$emit('printOrdedr',this.entryDetailId)
            }
        }
    }
</script>

<style lang="less">
    @import url('./Detail.less');
</style>
