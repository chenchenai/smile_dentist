<template>
    <div class="materialDetail">
        <Dialog className="materialDetailDialog" title="物料详情" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="postionBtns">
                    <el-button type="text" @click="editMaterial">编辑</el-button>
                    <el-button type="text" @click="showDeleteMaterial">删除</el-button>
                </div>
                <div class="topTitle">{{detailFormData.materieName}}</div>
                <el-form class="top" label-position="left" label-width="130px" ref="detailForm">
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="物料编码" class="fromItem noWrap">
                                <p>{{detailFormData.materieCode}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanTwo">
                            <el-form-item label="规格型号" class="fromItem noWrap">
                                <p>{{detailFormData.spec}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanFour" class="paddingNone ">
                            <el-form-item label="单位" class="fromItem noWrap">
                                <p>{{detailFormData.unitName}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanFour" class="paddingNone">
                            <el-form-item label="有效期" class="fromItemLast noWrap">
                                <p>{{detailFormData.validityterm}}{{detailFormData.validitytermType===0?'年':'月'}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="注册证编号" class="fromItem noWrap">
                                <p>{{detailFormData.registration}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanOne">
                            <el-form-item label="有效期至" class="fromItem noWrap">
                                <p>{{detailFormData.registrationValiddate |　getDate}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="生产厂家" class="fromItem noWrap">
                                <p>{{detailFormData.manufacturer}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanOne">
                            <el-form-item label="生产许可证编号" class="fromItem noWrap">
                                <p>{{detailFormData.licenceCode}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="物料类别" class="fromItem noWrap">
                                <p>{{detailFormData.typeName}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanOne">
                            <el-form-item label="预警数量" class="fromItem noWrap">
                                <p>{{detailFormData.waringNum}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanThree" class="paddingNone">
                            <el-form-item label="当前库存" class="fromItem noWrap">
                                <p>{{detailFormData.primeNum}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanAll">
                            <el-form-item label="供应商" class="fromItem">
                                <p>{{detailFormData.supplier}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanAll">
                            <el-form-item label="备注" class="fromItem remarks">
                                <p>{{detailFormData.remark}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import Dialog from '../../../../../../components/Dialog/Dialog';
    export default {
        props: ['MaterialDetailId'],
        components: {
            Dialog
        },
        data() {
            return {
                gutter:20,
                spanAll:24,
                spanOne:9,
                spanTwo:9,
                spanThree:6,
                spanFour:3,
                detailFormData:{}/*详情表单 */

            }
        },
        filters:{
            getDate(val){
                if(val){
                    return val.split(' ')[0]
                }else{
                    return ''
                }
            }
        },
        created(){
            this.initMaterialDetail();
        },
        methods: {
            closeDialog() {
                this.$emit('clearMaterialDetailId')
                this.$emit('changeDialogStatus', false, 'showMaterialDetailDialog');
            },
            /*切换弹出框状态 */
            changeDialogStatus(status, dialogStatusName) {
                this[dialogStatusName] = status;
            },
            /*弹出删除对话框*/
            showDeleteMaterial() {
                let id=this.MaterialDetailId
                this.$emit('changeDialogStatus', true, 'delDialogVisible',id);
            },
            /*编辑物料 */
            editMaterial() {
                this.closeDialog();
                // 模拟获取id
                let dialogType = 'edit'
                let id = this.MaterialDetailId;
                this.$emit('openAddMaterialDialog', id, dialogType);
            },
            /*初始化物料详情 */
            initMaterialDetail(){
                this.$api.post("/warehouse/materiel/detail", {
                    id:this.MaterialDetailId
                }, res => {
                    this.detailFormData = res.data;
                });
            },
        }
    }
</script>

<style lang="less">
    @import url('./Detail.less');
</style>