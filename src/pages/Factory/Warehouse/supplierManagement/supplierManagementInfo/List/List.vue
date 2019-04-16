<template>
    <div class="supplierManagement">
        <!--删除弹框-->
        <el-dialog title="删除" :visible.sync="delDialogVisible" width="30%" class="delDialogVisible">
            <p class="delDialogVisible_tip">供应商删除后无法恢复,确认删除？</p>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="cancel" @click="delDialogVisible = false">
                    取 消
                </el-button>
                <el-button size="small" type="primary" class="submit" @click="delSelect()">
                    确定删除
                </el-button>
            </div>
        </el-dialog>
        <el-row class="row-right">
            <div class="right_top">
                <el-row class="top-btns">
                    <el-button @click.native="openEditDialog(1,'add')">
                        <img src="../../../../../../../static/images/icon/product.png">新建供应商
                    </el-button>
                    <el-button @click.native="openDeleteDialog(1)">
                        <img src="../../../../../../../static/images/technology/shanchu.png">删除
                    </el-button>
                </el-row>
                <div class="top_right" >
                        <el-input placeholder="搜索供应商名称" class="input-with-select searchInput"  @keyup.delete.native='searchBtn(inputSearchKey)' v-model="inputSearchKey">
                            <el-button class="searchBtn" :disabled="searchDisabled" slot="append" @click="searchBtn(inputSearchKey)">搜索</el-button>
                        </el-input>
                </div>
            </div>
            
            <div class="Table">
                <el-table :data="searchResult" style="width: 100%" @row-click="showDetail" @selection-change="selectionMaterial">>
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='供应商名称' prop="name" align="center" width="280"></el-table-column>
                    <el-table-column label='类型'  align="center" width="100">
                        <template slot-scope="scope">
                                        {{ scope.row.supplierType === 0?'生产厂家':'经销商'}}
                        </template>
                    </el-table-column>
                    <el-table-column label='许可证号' prop="licenceNum" align="center"></el-table-column>
                    <el-table-column label='联系人' prop="contacts" align="center" width="250"></el-table-column>
                    <el-table-column label='手机号' prop="mobile" align="center" width="120"></el-table-column>
                    <el-table-column label='电话' prop="tel" align="center" ></el-table-column>
                    <el-table-column label='所属地区' align="center" width="380" class-name='tdLeft'>
                        <template slot-scope="scope">
                                        {{scope.row.province?scope.row.province:''}}
                                        {{scope.row.city?scope.row.city:''}}
                                        {{scope.row.region?scope.row.region:''}}
                                        {{scope.row.addr?scope.row.addr:''}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="searchResult.size" :totalNum="searchResult.total" :currentPage="searchResult.current" />
            </div>
        </el-row>
        <template>
                <!-- 新建供应商 -->
                <AddSupplier v-if="showAddSupplierDialog" @changeDialogStatus="changeDialogStatus"  :selectProductId="selectProductId" :titleType="tType" @clearSelectProductId='clearSelectProductId'/>
                <!-- 新建物料 -->
                <AddMaterial v-if="showAddMaterialDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType"/>
                <!-- 供应商详情 -->
                <SupplierDetail v-if="showSupplierDetailDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" :titleType="tType" @openEditSupplierDialog='openEditDialog(selectProductId,"edit")' @openDeleteDialog='openDeleteDialog' />
</template>

    </div>
</template>

<script type="text/javascript">
    import Page from "../../../../../../components/Page/Page";
    import AddSupplier from "../Add/Add";
    import AddMaterial from "../addMaterial/addMaterial";
    import SupplierDetail from '../Detail/Detail';
    export default {
        components: {
            Page,
            AddSupplier,
            AddMaterial,
            SupplierDetail,
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
                inputSearchKey: '',
                /*输入框搜索关键字 */
                searchKey: '' /*搜索关键字 */ ,
                // openType:'add',/*打开新建或编辑供应商类型add为新建,edit为编辑 */
                result: [],
                /*选择的物料,用于删除 */
                showSupplierDetailDialog: false,
                /*供应商详情页面 */
                showAddMaterialTypeDialog: false,
                /*添加物料类别弹框*/
                goodsName: "",
                showAddSupplierDialog: false,
                showAddMaterialDialog: false,
                searchDisabled:true,/*搜索禁用开关 */
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
                delName: "",
                arrId: [],/*删除选择的id数组,包括详情上面的删除 */
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
                tType: ''
            };
        },
        computed: {
            searchResult() {
                let _self = this;
                if (this.searchKey) {
                    return this.result.filter(item => {
                        return ['name'].some(key => {
                            return String(item[key]).toLowerCase().indexOf(_self.searchKey) > -1;
                        })
                    })
                } else {
                    return this.result
                }
            },
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
        filters:{
            filteNull(val){
                val=val?val:''
            }
        },
        created(){
            this.getWorkProList({
                current: 1,
                rowSize: 15,
            });
        },
        methods: {
            /*搜索 */
            searchBtn(val){
                let searchParams={
                    current:1,
                    name:val,
                    rowSize:15
                }
                this.$api.post('/supplier/selectSupplier',searchParams,
                res=>{
                    this.result=res.data.records;
                },
                res => {
                    this.$message({
                        message: res.msg
                    });
                })
            },
            // 查询供应商信息列表
            getWorkProList(data) {
                this.$api.post("/supplier/listSupplier", data, res => {
                    this.result = res.data.records;
                });
            },
            // 点击分页
            pageChange(page) {
                this.getWorkProList({
                    current: page,
                    rowSize: 20,
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
            // 打开新建或编辑供应商弹窗
            openEditDialog(id, titleType) {
                this.tType = titleType === 'add' ? '新建供应商' : '编辑供应商';
                if(titleType === 'add'){
                    this.selectProductId='';
                }
                this.changeDialogStatus(true, 'showAddSupplierDialog');
            },
            /*选择供应商 */
            selectionMaterial(val) {
                this.arrId=val.map(item=>{
                    return item.id
                })
            },
            /* 打开删除物料弹窗*/
            openDeleteDialog(val) {
                if (val == 1) { /*list组件上的删除 */
                    if (this.arrId.length > 0) {
                        this.delDialogVisible = true;
                    } else {
                        this.delDialogVisible = false;
                        this.$message({
                            message: "请选择需要删除的供应商",
                            type: "error",
                        });
                    }
                } else{ /*供应商详情组件上的删除 */
                    this.arrId=[];
                    this.delDialogVisible = true;
                    this.arrId.push(val)
                }
            },
            /*删除供应商*/
            delSelect() {
                this.deleteSupplier(this.arrId)
                this.delDialogVisible = false;
                this.showSupplierDetailDialog=false;
            },
            /*删除函数*/
            deleteSupplier(data){
                this.$api.post(
                    "/supplier/deleteSupplier", data,res => {
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getWorkProList({
                            current: 1,
                            rowSize: 15,
                        });
                    },
                    res => {
                        this.$message({
                            message: res.msg
                        });
                    }
                )
            },
            /*新建或物料 */
            changeDialogStatus(status, dialogStatusName, type) {
                this[dialogStatusName] = status;
                if (!status) {
                    this.getWorkProList({
                        current: 1,
                        rowSize: 15,
                    });
                }
            },
            /*清空选择的id */
            clearSelectProductId(){
                this.selectProductId=''
            },
            // 显示供应商详情
            showDetail(data) {
                this.selectProductId = data.id;
                this.tType = '供应商详情'
                this.changeDialogStatus(true, 'showSupplierDetailDialog');
            },
        }
    };
</script>

<style lang="less">
    @import url("./List.less");
</style>
