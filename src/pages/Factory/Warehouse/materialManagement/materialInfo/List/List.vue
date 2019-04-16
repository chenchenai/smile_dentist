<template>
    <div class="materialManagement">
        <!--新建节点弹框-->
        <el-dialog title="新建物料类别" :visible.sync="addDialogVisible" class="addDialogVisible">
            <el-form :model="addForm" :rules="rules1" ref="addTypeName">
                <el-form-item label="类别名称" prop="name" label-width="70px" class="isRequired">
                    <el-input placeholder="请输入物料类别名称" @keyup.native="validAddTypeName('addTypeName')" v-model="addForm.name" maxlength="8"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false;submitBtnDisabled=true;" class="cancel">取 消</el-button>
                <el-button type="primary" class="submit" :disabled="submitBtnDisabled" @click="addSelect(addForm.name)">确 定</el-button>
            </div>
        </el-dialog>
        <!--重命名节点弹框-->
        <el-dialog title="重命名类别名称" :visible.sync="editDialogVisible" class="editDialogVisible">
            <el-form :model="editForm" :rules="rules1" ref="editTypeName" >
                <el-form-item label="类别名称" prop="edit" label-width="70px" class="isRequired">
                    <el-input placeholder="请输入修改后的节点名称" @keyup.native="validAddTypeName('editTypeName')" v-model="editForm.edit" maxlength="8"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false;submitBtnDisabled=true;" class="cancel">取 消</el-button>
                <el-button type="primary" class="submit" :disabled="submitBtnDisabled" @click="editSelect(editForm.edit)">确 定</el-button>
            </div>
        </el-dialog>
        <!--删除弹框-->
        <el-dialog title="删除" :visible.sync="delDialogVisible" width="30%" class="delDialogVisible">
            <p class="delDialogVisible_tip">{{delText}}</p>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="cancel" @click="delDialogVisible = false">
                    取 消
                </el-button>
                <el-button size="small" type="primary" class="submit" @click="confirmDel()">
                    确定删除
                </el-button>
            </div>
        </el-dialog>
        <el-row class="row-left">
            <div class="row-left_title">
                <h3 @click="allMaterial">物料类别</h3>
                <p class="row-left_icon" @click="openAddMaterialTypeDialog">+</p>
            </div>
            <el-tree :data="root" default-expand-all node-key="id" ref="tree" highlight-current @node-click="getCurrentKey" :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                <div class="custom-tree-btn"  @click.stop="getNode(node.data)">
                    <el-popover popper-class="product-tree-right-btn" placement="bottom" width="65"  trigger="click" >
                        <el-button type="text"  @click="add(node.key)">新建子类</el-button>
                        <el-button type="text"  @click="edit(node.key)" style="color:#3672c6">重命名</el-button>
                        <el-button type="text"  @click="delSelect(1,node.key,node.label)">删除</el-button>
                        <div class="right" slot="reference"></div>
                    </el-popover>
                </div>
                </span>
            </el-tree>
        </el-row>
        <el-row class="row-right">
            <el-row class="top-btns">
                <div class="btns_left">
                    <el-button @click.native="openAddDialog('id','add')">
                        <img src="../../../../../../../static/images/icon/material.png">新建物料
                    </el-button>
                    <el-button @click.native="delSelect(2,'ID','',1)">
                        <img src="../../../../../../../static/images/technology/shanchu.png">删除
                    </el-button>
                </div>
                <div class="search">
                    <div class="filter_early_warning">
                        <div class="early_warning_input">
                            <!-- <input type="radio" id="earlyWarning" :checked='false' ref="earlyWarning" @click="earlyWarningClick()"> -->
                            <p id="earlyWarning" class="earlyWarning" ref="earlyWarning" @click="earlyWarningClick()" :class="checked?'earlyWarningChecked':''">
                                <span></span>
                            </p>
                            <label ></label>
                        </div>
                        <p class="early_warning_p" >仅显示预警物料</p>
                    </div>
                    <el-input placeholder="搜索物料名称或物料编码" class="input-with-select searchInput" @keyup.delete.native='searchBtn(inputSearchKey)' v-model="inputSearchKey">
                        <el-button class="searchBtn" :disabled="searchDisabled" slot="append" @click="searchBtn(inputSearchKey)">搜索</el-button>
                    </el-input>
                </div>
            </el-row>
            <div class="Table">
                <el-table :data="result" style="width: 100%" @row-click="showDetail" @selection-change="selectionMaterial">
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='物料名称' prop="materieName" align="center" width="170"></el-table-column>
                    <el-table-column label='物料编码' prop="materieCode" align="center" width="190"></el-table-column>
                    <el-table-column label='规格型号' prop="spec" align="center" width="120"></el-table-column>
                    <el-table-column label='类别'   prop='typeName' align="center" width="110"></el-table-column>
                    <el-table-column label='单位'  prop="unitName" align="center" width="70"></el-table-column>
                    <el-table-column label='注册证编号' prop="registration" align="center" width="240"></el-table-column>
                    <el-table-column label='生产厂家' prop="manufacturer" align="center" width="240"></el-table-column>
                    <el-table-column label='生产许可证编号' prop="licenceCode" align="center" width="240"></el-table-column>
                    <el-table-column label='当前库存' prop="stock" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
            </div>
        </el-row>
        <template>
            <!-- 新建物料 -->
            <AddMaterial v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" :selectMaterialId="selectMaterialId" :addDialogTitle='addDialogTitle'/>
            <!-- 物料详情 -->
            <MaterialDetail v-if="showMaterialDetailDialog" @changeDialogStatus="changeDialogStatus" @openAddMaterialDialog="openAddDialog" @showDeleteMaterial="delSelect(2,'ID','',2)" :MaterialDetailId="MaterialDetailId" @clearMaterialDetailId='clearMaterialDetailId'/>
        </template>

  </div>
</template>

<script type="text/javascript">
    import Page from "../../../../../../components/Page/Page";
    import AddMaterial from "../Add/Add";
    import MaterialDetail from "../Detail/Detail";
    export default {
        components: {
            Page,
            AddMaterial,
            MaterialDetail
        },
        data() {
            var validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("物料类别名称不能为空"));
                } else if(this.typeNameList.includes(value)) {
                    return callback(new Error("物料类别名称已存在"));
                }else{
                    callback();
                }
            };
            var validateRename = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("节点名称不能为空"));
                }else if(value.length<1 || value.length>8){
                    return callback(new Error("长度在 1 到 8 个字符"));
                } else {
                    callback();
                }
            };
            return {
                searchDisabled:true,
                typeNameList:[],/*物料类别名称*/
                inputSearchKey:'',/*输入框搜索关键字 */
                searchKey:''/*搜索关键字 */,
                typeId:'',/*物料类别id,用于删除 */
                typeIds:[],/*物料类别子类id数组,用于删除 */
                typeSwitch:false,/*是否为删除物料类别弹框 */
                result: [],
                selectionResult: [] /*选择的物料,用于删除 */ ,
                showMaterialDetailDialog: false,
                showAddMaterialTypeDialog: false /*添加物料类别弹框*/ ,
                goodsName: "",
                showAddDialog: false,
                root: [],
                length: 2,
                defaultProps: {
                    children: "children",
                    label: "name",
                    parentId: 'parentId'
                },
                addForm: {
                    name: "",
                    edit: ""
                },
                flag: false,
                delDialogVisible: false,
                /*删除弹框开关 */
                addDialogVisible: false /*新建物料类别 */ ,
                editDialogVisible: false,
                addId: "",
                editId: "",
                delId: "",
                delName: "",
                arrId: [],
                rules1: {
                    name:{ validator: validateName, trigger:'keyup'},
                    edit:{ validator: validateName, trigger:'keyup'}
                },
                editForm:{
                    edit:'',
                    name:"",

                },
                earlyWarning: "true" /*只显示预警物料开关 */ ,
                checked: false,
                // 禁用启用
                submitBtnDisabled: true,
                selectMaterialId: "",
                /******** */
                delText: '物料删除后无法恢复,确认删除？',
                addDialogTitle: '新建物料' ,/*打开新建或编辑物料弹窗的title */
                currentPageFlag:null,/*0为全查,1只查询预警物料 */
                delMaterialId:'',/*删除当前的单个物料,物料详情页面删除*/
                typeKeys:'',/* 保存当前选中的类别*/
            };
        },
        computed: {
            canSubmit() {
                let flag = false;
                let name = this.editForm.name;
                let edit = this.editForm.edit;
                if (name || edit) {
                    flag = true;
                } else {
                    flag = false;
                }
                return flag;
            },
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
        mounted() {
            this.getWorkProList({
                current: 1,
            });
            this.getMatClassList();
        },
        methods: {
            getNode(val){
                this.getChildrenIds(val)
            },
            /****验证****/
            validAddTypeName(el){
                this.$refs[el].validate((valid) => {
                    if (valid) {
                        this.submitBtnDisabled = false;
                    } else {
                        this.submitBtnDisabled = true;
                    }
                });
            },
            /* 点击子类查询物料信息列表*/
            getCurrentKey(keys) {
                this.typeId=keys.id;
                // this.getChildrenIds(keys)
                this.arrId = [];
                let id = this.traverseTree(keys);
                this.typeKeys=this.traverseTree(keys);
                this.getWorkProList({
                    current: 1,
                    types: id
                });
            },
            /*解析类别,获取该类别子级集合 */
            getChildrenIds(keys){
                let arrIds=[];
                // arrIds.push(keys.id)
                const getArr=data=>{
                    if(data.length>0){
                        for(let i in data){
                            arrIds.push(data[i].id);
                            getArr(data[i].children);
                        }
                    }
                }
                getArr(keys.children);
                this.typeIds=arrIds;
            },
            /*点击物料类别查询所有 */
            allMaterial(){
                this.getWorkProList({
                    current: 1
                });
            },
            //遍历所有树结构id值
            traverseTree(node) {
                if (!node) {
                    return;
                }
                this.arrId.push(node.id);
                if (node.children && node.children.length > 0) {
                    var i = 0;
                    for (i = 0; i < node.children.length; i++) {
                        this.traverseTree(node.children[i]);
                    }
                }
                return this.arrId;
            },
            // 查询物料信息列表
            getWorkProList(data) {
                this.$api.post("/warehouse/materiel/page/query", data, res => {
                    this.result = res.data.records;
                });
            },
            // 点击分页
            pageChange(page) {
                this.getWorkProList({
                    current: page,
                    flag: this.currentPageFlag,
                    name:this.inputSearchKey
                });
            },
            /*仅显示预警物料开关 */
            earlyWarningClick() {
                this.checked = !this.checked;
                this.$refs.earlyWarning.checked = this.checked;
                
                if(this.checked==true){
                    this.currentPageFlag=1;
                    this.getWorkProList({
                        current: 1,
                        flag: this.currentPageFlag,
                        name:this.inputSearchKey
                    });
                }else{
                    this.currentPageFlag=null;
                    this.getWorkProList({
                        current: 1,
                        flag: this.currentPageFlag,
                        name:this.inputSearchKey
                    });
                }
            },
            /*搜索 */
            searchBtn(val){
                this.getWorkProList({
                    current: 1,
                    flag: this.currentPageFlag,
                    name:val
                });
            },
            /*打开新建物料类别对话框 */
            openAddMaterialTypeDialog() {
                this.addDialogVisible = true;
                this.addId='';
            },
            // 打开新建或编辑物料弹窗
            openAddDialog(id, dialogType) {
                if (dialogType === 'edit') {
                    this.addDialogTitle = '编辑物料';
                } else if (dialogType === 'add') {
                    this.addDialogTitle = '新建物料';
                }
                this.selectMaterialId =
                    typeof id === "string" || typeof id === "number" ? id : "";
                this.showAddDialog = true;
            },
            /*选择物料 */
            selectionMaterial(val) {
                let selectList=val;
                let selectListId=[];
                selectList.forEach(item=>{
                    if(!this.selectionResult.includes(item.id)){
                        this.selectionResult.push(item.id)
                    }
                })
            },
            /*查询物料类别树结构*/
            getMatClassList() {
                this.$api.get("/materiel/category/tree", "", res => {
                        this.root = res.data;
                        
                    },
                    res => {
                        this.$message({
                            message: res.msg
                        });
                    }
                );
            },
            /*获取选中树节点 */
            getCheckedNodes() {
                console.log(this.$refs.tree.getCheckedNodes());
            },
            /*新建节点确定按钮 */
            addSelect(name) {
                this.addDialogVisible = false;
                    this.$api.post(
                        "/materiel/category/save", {
                            categoryName: name,
                            id: this.addId
                        },
                        res => {
                            this.$message({
                                message: "新建成功",
                                type: "success",
                                onClose: () => {
                                    this.getMatClassList();
                                    this.submitBtnDisabled=true;
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
            // 添加节点
            add(id) {
                this.addId = id;
                this.addDialogVisible = true;
            },

            /*打开删除弹框*/
            delSelect(typeNum, id,name, val) {
                if (typeNum === 1) {
                    /* 删除节点*/
                    this.delText = '将同步删除该类别下的子类别，物料将转移至一级分类下，删除后无法恢复，确认删除？';
                    // this.delId = id;
                    this.typeId = id;
                    this.delName = name;
                    this.typeSwitch = true;
                    this.delDialogVisible = true;
                } else if (typeNum === 2) {
                    /* 删除物料*/
                    this.delText = '物料删除后无法恢复,确认删除？';
                    if (val === 1) {
                        /*list组件上的删除按钮 */
                        if (this.selectionResult.length > 0) {
                            this.delDialogVisible = true;
                        } else {
                            this.delDialogVisible = false;
                            this.$message({
                                message: "请选择物料",
                                type: "error",
                            });
                        }
                    } else if (val === 2) {
                        /*物料详情上的删除按钮 */
                        this.delDialogVisible = true;
                    }
                } else {
                    this.delText = '物料删除后无法恢复,确认删除？';
                }
            },
            /*确定删除按钮 */
            confirmDel() {
                this.delDialogVisible = false;
                let _self=this;
                if(this.typeSwitch == true){/*删除物料类别 */
                    this.deleteType();
                }else{
                    if(this.MaterialDetailId){/*物料详情上面的删除 */
                        this.deleteFun({ids:[_self.MaterialDetailId]})
                    }else{/* 主页列表上面的删除*/
                        this.deleteFun({ids: _self.selectionResult})
                    }
                }
                
            },
            /*删除物料类别 */
            deleteType(){
                this.$api.post('/materiel/category/delete',{id:this.typeId,ids:this.typeIds}, res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        onClose: () => {
                            this.getMatClassList();
                        }
                    });
                },res=>{
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                })
                this.typeId='';
                this.typeSwitch == false
            },
            /*删除物料*/
            deleteFun(dataParams){
                this.$api.post('/warehouse/materiel/delete',dataParams, res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        onClose: () => {
                            if(this.typeKeys){
                                this.getWorkProList({
                                    current: 1,
                                    types: this.traverseTree(this.typeKeys)
                                });
                            }else{
                                this.getWorkProList({
                                    current: 1
                                });
                            }
                            this.selectionResult=[];
                        }
                    });
                }, res => {
                    this.$message({
                        message: res.msg
                    });
                });
            },
            // 编辑节点名称
            edit(id) {
                this.editDialogVisible = true;
                this.editId = id;
            },
            /*重命名节点类别 */
            editSelect(rename) {
                this.editDialogVisible = false;
                let canSubmit = this.canSubmit;
                if (canSubmit) {
                    this.$api.post(
                        "/materiel/category/rename", {
                            categoryName: rename,
                            id: this.editId
                        },
                        res => {
                            this.$message({
                                message: "重命名成功",
                                type: "success",
                                onClose: () => {
                                    this.getMatClassList();
                                    this.submitBtnDisabled=true;
                                }
                            });
                        },
                        res => {
                            this.$message({
                                message: res.msg
                            });
                        }
                    );
                }
            },
            /*新建或物料 */
            changeDialogStatus(status, dialogStatusName, id) {
                /*id为物料详情上的删除按钮物料id */
                this.delMaterialId=id;
                this[dialogStatusName] = status;
                if (!status) {
                    this.getWorkProList({
                        current: 1,
                        types: this.traverseTree(this.typeKeys)
                    });
                }else{
                    
                }
            },
            /* 显示物料详情*/
            showDetail(data) {
                this.MaterialDetailId = data.id;
                this.changeDialogStatus(true, "showMaterialDetailDialog");
            },
            /*物料详情关闭,清除选择的物料id */
            clearMaterialDetailId(){
                this.MaterialDetailId=''
            }
        }
    };
</script>

<style lang="less">
    @import url("./List.less");
</style>
