<template>
    <div >
        <Dialog className="setPrint" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="addFormData" label-position="left" label-width="90px" ref="addForm">
                    <div class="baseInfo">
                        <el-row :gutter="gutter">
                            <el-col :span="spanTwo">
                                <el-form-item label="打印机" class="fromItem marginLeft" prop="equipment">
                                   <el-input placeholder="" v-model="addFormData.equipment" auto-complete="off"></el-input>
                                   
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="gutter">
                            <el-col :span="spanTwo">
                                <el-form-item label="纸张" class="fromItem marginLeft" prop="paperSize">
                                    <el-input placeholder="" v-model="addFormData.paperSize"  auto-complete="off"></el-input>
                                   
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="布局" class="fromItem marginLeft" prop="layOut">
                                    <el-input placeholder="" v-model="addFormData.layOut"  auto-complete="off"></el-input>
                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="彩色" class="fromItem" prop="color">
                                    <el-input v-model="addFormData.color"  auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="缩放" class="fromItem fromDate" prop="zoom">
                                    <el-input v-model="addFormData.zoom"  auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <p>边距</p>
                        <el-row :gutter="gutter">
                            <el-col :span="spanTwo">
                                <el-form-item label="上" class="fromItem isRequired marginLeft" prop="top">
                                    <el-input v-model="addFormData.top"  auto-complete="off"></el-input>
                                    
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="下" class="fromItem isRequired marginLeft" prop="bottom">
                                   
                                    <el-input v-model="addFormData.bottom"  auto-complete="off"></el-input>
                                   
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="左" class="fromItem" prop="">
                                    <el-input v-model="addFormData.left"  auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="右" class="fromItem fromDate isRequired" prop="right">
                                     <el-input v-model="addFormData.right" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer" align="right">
                    <el-button  type="primary" class="submit" @click.native="submit">确 定</el-button>
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
<script>
import Dialog from "../../../../../../components/Dialog/Dialog";
export default {
    props: ["changeDialogStatus", "titleType"],
        components: {
            Dialog
        },
        data(){
            return{
                addFormData:{
                    equipment:'打印机1'/*打印设备 */,
                    paperSize:'A4'/*纸张大小 */,
                    layOut:'纵向'/*布局 */,
                    color:'彩色',
                    zoom:'100',
                    top:10,
                    bottom:10,
                    left:10,
                    right:10
                },
                gutter:20,
                spanOne:24,
                spanTwo:6,
            }
        },
        methods:{
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showSetPrintDialog");
            },
            openAddMaterialDialog() {
                this.$emit("changeDialogStatus", true, "showSetPrintDialog");
            },
            submit(){
                 this.$emit("changeDialogStatus", true, "showPrintTraCodeDialog");
                this.closeDialog();
            },
                　　
                       
        }
}
</script>
<style lang="less">
@import url(./setPrint.less);
</style>


