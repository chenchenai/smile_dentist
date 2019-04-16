<template>
    <div class="supplierDetail">
        <Dialog className="materialDetailDialog" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="postionBtns">
                    <el-button type="text" @click="editMaterial">编辑</el-button>
                    <el-button type="text" @click="showDeleteMaterial">删除</el-button>
                </div>
                <div class="topTitle">{{supplierInfo.name}}</div>
                <el-form class="top" :data="supplierInfo" label-position="left" label-width="92px" ref="addForm">
                    <el-form-item label="类型" class="fromItem lWith">
                        <p>{{supplierInfo.suppliertype===0?'生产厂家':'经销商'}}</p>
                    </el-form-item>
                    <el-form-item label="联系人" class="fromItem">
                        <p>{{supplierInfo.contacts}}</p>
                    </el-form-item>
                    <el-form-item label="电话" class="fromItem sWith">
                        <p>{{supplierInfo.tel}}</p>
                    </el-form-item>
                    <el-form-item label="手机" class="fromItem lWith">
                        <p>{{supplierInfo.mobile}}</p>
                    </el-form-item>
                    <el-form-item label="许可证编号" class="fromItem">
                        <p>{{supplierInfo.licencenum}}</p>
                    </el-form-item>
                    <el-form-item label="有效期至" class="fromItem sWith">
                        <p>{{supplierInfo.expipydate | timeFormat}}</p>
                    </el-form-item>
                    <el-form-item label="地址" class="fromItem lWith">
                        <p>{{supplierInfo.province}}{{supplierInfo.city}}{{supplierInfo.region}}{{supplierInfo.addr}}</p>
                    </el-form-item>
                </el-form>
                <p class="el-form_p">供应物料</p>
                <div class="material_tab">
                    <ul class="material_tab_th">
                        <li v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                    </ul>
                    <div class="happyScroll_box" style="height:155px;">
                        <happy-scroll color="#ffffff" size="4" resize style="min-height: 146px">
                            <ul class="material_tab_td">
                                <li v-for="(item,index) in supplierInfo.materiels" :key="index">
                                    <p>{{item.name}}</p>
                                    <p>{{item.material_no}}</p>
                                    <p>{{item.spec}}</p>
                                    <p>{{item.type}}</p>
                                    <p>{{item.unitName}}</p>
                                    <p>{{item.registration_num}}</p>
                                    <p>{{item.manufacturer}}</p>
                                    <p>{{item.licence_code}}</p>
                                </li>
                            </ul>
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
        props: ['selectProductId','titleType'],
        components: {
            Dialog
        },
        data() {
            return {
                supplierInfo:{},
                materialTabTh: [
                    // '物料名称',
                    // '物料编码',
                    // '类别',
                    // '规格型号',
                    // '单位',
                    // '注册证编号',
                    // '生产厂家',
                    // '生产许可证编号'
                    '物料名称',
                    '物料编码',
                     '规格型号',
                    '类别',
                    '单位',
                    '注册证编号',
                    '生产厂家',
                    '生产许可证编号',
                ],
                materialResult: [{

                //         materieName: '瓷粉1',
                //         materieCode: '7894521025632',
                //         spec: '自凝牙托粉II型1类',
                //         typeName: '牙托粉',
                //         unitName: '瓶', 
                //         registration:'',
                //         manufacturer: '广州市科阳医疗设备有限公司',
                //          licenceCode:'', 
                    },
                ]
            }
        },
        filters:{
            timeFormat:function(value) {
                if (!value) return ''
                const time = new Date(value);
                const year = time.getFullYear();
                const month = time.getMonth()+1;
                const date = time.getDate();
                const hours = time.getHours();
                const minutes = time.getMinutes();
                const seconds = time.getSeconds();
                return year+'-'+month+'-'+date;
            },
        },
        created(){
            this.getSupplierInfo();
        },
        mounted() {
            document.querySelector('.gutter').style.width = 3 + 'px'
        },
        methods: {
            getSupplierInfo(){
                this.$api.post('/supplier/getSupplierById',{id:this.selectProductId},res=>{
                    this.supplierInfo=res.data;
                })
            },
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'showSupplierDetailDialog');
            },
            /*切换弹出框状态 */
            changeDialogStatus(status, dialogStatusName) {
                this[dialogStatusName] = status;
            },
            /*弹出确定删除框*/
            showDeleteMaterial() {
                this.$emit('changeDialogStatus', true, 'delDialogVisible')
                this.$emit('openDeleteDialog',this.selectProductId)
            },
            /*编辑供应商 */
            editMaterial() {
                this.closeDialog();
                // 模拟获取id
                let id = this.selectProductId;
                this.$emit('openEditSupplierDialog', id);
            },

        }
    }
</script>

<style lang="less">
    @import url('./Detail.less');
</style>