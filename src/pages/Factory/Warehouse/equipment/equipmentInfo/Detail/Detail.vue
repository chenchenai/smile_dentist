<template>
    <div class="equipmentDetail">
        <Dialog className="materialDetailDialog" title="设备详情" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="postionBtns">
                    <el-button type="text" @click="editMaterial">编辑</el-button>
                    <el-button type="text" @click="showDeleteMaterial">删除</el-button>
                </div>
                <div class="topTitle">{{detailFormData.devName}}</div>
                <el-form class="top" label-position="left" label-width="130px" ref="detailForm">
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="设备条码" class="fromItem">
                                <p>{{detailFormData.devCode}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanTwo">
                            <el-form-item label="规格型号" class="fromItem">
                                <p>{{detailFormData.spec}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanFour" class="paddingNone">
                            <el-form-item label="生产日期" class="fromItem">
                                <p>{{detailFormData.productDate | timeFormat}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="注册证编号" class="fromItem">
                                <p>{{detailFormData.registrationNum}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanOne">
                            <el-form-item label="有效期至" class="fromItem">
                                <p>{{detailFormData.expiryDate | timeFormat}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="生产厂家" class="fromItem">
                                <p>{{detailFormData.manufacturer}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanOne">
                            <el-form-item label="生产许可证编号" class="fromItem">
                                <p>{{detailFormData.licenceCode}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanOne">
                            <el-form-item label="类别" class="fromItem">
                                <p>{{detailFormData.devType}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanOne">
                            <el-form-item label="状态" class="fromItem">
                                <p>{{devStatus[detailFormData.state]}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="spanThree" class="paddingNone">
                            <el-form-item label="部门" class="fromItem">
                                <p>{{detailFormData.depId}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="spanAll">
                            <el-form-item label="购买时间" class="fromItem">
                                <p>{{detailFormData.buyDate | timeFormat}}</p>
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
        props: ['equipmentDetailId','equipmentDetailId'],
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
                /*设备状态 */
                devStatus:[
                    '使用',
                    '闲置',
                    '维修',
                    '损坏',
                    '报废',
                ],
                detailFormData:{}/*详情表单 */

            }
        },
        filters:{
            timeFormat(value) {
                if (!value) return ''
                const time = new Date(value);
                const year = time.getFullYear();
                const month = time.getMonth()+1;
                const date = time.getDate();
                const hours = time.getHours()<10?'0'+time.getHours():time.getHours();
                const minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
                const seconds = time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds();
                return `${year}-${month}-${date}`;
            },
        },
        created(){
            this.initDevInfo();
        },
        methods: {
            closeDialog() {
                this.$emit('clearEquipmentDetailId')
                this.$emit('changeDialogStatus', false, 'showMaterialDetailDialog');
            },
            /*获取设备详情 */
            initDevInfo(){
                this.$api.post('/device/getDeviceById',{deviceId: this.equipmentDetailId},res=>{
                    this.detailFormData = res.data;
                },res=>{})
            },
            /*切换弹出框状态 */
            changeDialogStatus(status, dialogStatusName) {
                this[dialogStatusName] = status;
            },
            /*弹出删除对话框*/
            showDeleteMaterial() {
                let id=this.equipmentDetailId
                this.$emit('changeDialogStatus', true, 'delDialogVisible',id);
            },
            /*编辑物料 */
            editMaterial() {
                this.closeDialog();
                // 模拟获取id
                let dialogType = 'edit'
                let id = this.equipmentDetailId;
                this.$emit('openAddMaterialDialog', id, dialogType);
            },
        }
    }
</script>

<style lang="less">
    @import url('./Detail.less');
</style>