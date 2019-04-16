<template>
    <div class="equipmentInfo">
        <!--新建节点弹框-->
        <el-dialog title="新建设备类别" :visible.sync="addDialogVisible" class="addDialogVisible">
            <el-form :model="addForm" ref="typeName" :rules="rulesName">
                <el-form-item label="类别名称" prop="name" label-width="70px" class="isRequired">
                    <el-input placeholder="请输入设备类别名称" v-model="addForm.name" ></el-input>
                    <!-- <p class="errorNotice" v-if="nameValid.status">{{ nameValid.text }}</p> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false" class="cancel">取 消</el-button>
                <el-button type="primary" class="submit" :disabled="addTypeNameDisabled" @click="addSelect(addForm.name)">确 定</el-button>
            </div>
        </el-dialog>
        <!--重命名节点弹框-->
        <el-dialog title="重命名类别名称" :visible.sync="editDialogVisible" class="editDialogVisible">
            <el-form :model="editForm" :rules="rulesEditName" ref="editForm">
                <el-form-item label="类别名称" prop="name" label-width="70px" class="isRequired">
                    <el-input placeholder="请输入修改后的节点名称" v-model="editForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false" class="cancel">取 消</el-button>
                <el-button type="primary" class="submit" :disabled="editTypeNameDisabled" @click="editSubmit(editForm.name)">确 定</el-button>
            </div>
        </el-dialog>
        <!--删除弹框-->
        <el-dialog title="删除" :visible.sync="delDialogVisible" width="30%" class="delDialogVisible">
            <p class="delDialogVisible_tip">{{delText}}</p>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="cancel" @click="delDialogVisible = false">
                    取 消
                </el-button>
                <el-button size="small" type="primary" class="submit" @click="delTypeName">
                    确定删除
                </el-button>
            </div>
        </el-dialog>
        <el-row class="row-left">
            <div class="row-left_title">
                <h3>设备类别</h3>
                <p class="row-left_icon" @click="openAddMaterialTypeDialog">+</p>
            </div>
            <el-tree :data="root" default-expand-all node-key="id" ref="tree" highlight-current @node-click="getCurrentKey" :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                          <span>{{ node.label }}</span>
                <div class="custom-tree-btn" @click.stop="getNode(node.data)">
                    <!-- 111 -->
                    <el-popover popper-class="product-tree-right-btn" placement="bottom" width="65" trigger="click" >
                        <el-button type="text" @click="add(node.key)">新建子类</el-button>
                        <el-button type="text" @click="edit(node.key,node.data.name)" style="color:#3672c6">重命名</el-button>
                        <el-button type="text" @click="delSelect(1,node.key,node.label)">删除</el-button>
                        <div class="right" slot="reference" ></div>
                    </el-popover>
                </div>
                </span>
            </el-tree>
        </el-row>
        <el-row class="row-right">
            <div class="top">
                <div class="top_left">
                    <el-button @click.native="openAddDialog('id','add')">
                        <img :src="imgAddUrl">新建设备
                    </el-button>
                    <el-button @click.native="delSelect(2,'ID','',1)">
                        <img :src="imgDelUrl">删除
                    </el-button>
                    <el-button @click.native="printBarCode()">
                        <img :src="imgPrinUrl">打印条码
                    </el-button>
                </div>
                <div class="top_right">
                    <el-select v-model="devStat" placeholder="请选择状态" class="top_right_item" @change="getVal">
                        <el-option v-for="(item,index) in equipmentStatus" :key="index" :label="item.lable" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input placeholder="设备名称"  class="searchInput" @keyup.delete.native='searchBtn(inputSearchKey)' v-model="inputSearchKey">
                        <el-button  class="searchBtn" :disabled="searchDisabled" slot="append" @click.native="searchBtn(inputSearchKey)">搜索</el-button>
                    </el-input>
                </div>
            </div>
            <div class="Table">
                <el-table :data="result" style="width: 100%" @row-click="showDetail" @selection-change="selectEquipment">
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='设备名称' prop="devName" align="center" width="200"></el-table-column>
                    <el-table-column label='规格型号' prop="spec" align="center" width="220"></el-table-column>
                    <el-table-column label='设备条码' prop="devCode" align="center" width="250"></el-table-column>
                    <el-table-column label='注册证号' prop='registrationNum' align="center" width="300" ></el-table-column>
                    <el-table-column label='生产厂家' prop="manufacturer" width="250"  align="center"></el-table-column>
                    <el-table-column label='使用部门' prop="depId" align="center" ></el-table-column>
                    <el-table-column label='当前状态' prop="state" align="center">
                        <template slot-scope="scope">
                                {{devStatus[scope.row.state]}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
             <!-- 打印条码-->
            <!-- <div class="print-label" style="width: 200px;">
                <div class="codeContainer" id='codeContainer' style="width: 200px;page-break-after: always"></div>
            </div> -->
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
            </div>
        </el-row>
        <template>
                <!-- 新建/编辑设备 -->
                <AddMaterial v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" :selectMaterialId="selectMaterialId" :addDialogTitle='addDialogTitle' :dialogType='dialogType' :devId='devId'/>
                <!-- 设备详情 -->
                <EquipmentDetail v-if="showMaterialDetailDialog" @changeDialogStatus="changeDialogStatus" @openAddMaterialDialog="openAddDialog" @showDeleteMaterial="delSelect(2,'ID','',2)" :equipmentDetailId="equipmentDetailId" @clearEquipmentDetailId='clearEquipmentDetailId'/>
                <!-- 打印条码 -->
                <printCode v-if="printCodeDialog" @changeDialogStatus="changeDialogStatus" :dialogTitle='dialogTitle' :selectCodeResult='selectCodeResult'/>
</template>

  </div>
</template>

<script type="text/javascript">
    import $ from 'jquery'
    import JsBarcode from 'jsbarcode'
    import Page from "../../../../../../components/Page/Page";
    import AddMaterial from "../Add/Add";
    import EquipmentDetail from "../Detail/Detail";
    import printCode from "../printCode/printCode";
    export default {
        components: {
            Page,
            AddMaterial,
            EquipmentDetail,
            printCode
        },
        data() {
             const validateEditTypeName = (rule, value, callback) => {
                if (value === this.typeName) {
                    callback(new Error('重命名不能与原名相同'));
                } else {
                    callback();
                }
            };
            let statusObj = {
                status: false,
                text: ''
            };
            return {
                devStat:'',/*选择的设备状态 */
                /*设备状态 */
                devStatus:[
                    '使用',
                    '闲置',
                    '维修',
                    '损坏',
                    '报废',
                ],
                dialogType:'',/*新建或编辑弹框*/
                /*类别相关 */
                typeName:'',/*储存类别名,用于重命名判断是否重复 */
                typeId:'',/*类别id,用于删除 */
                typeIds:[],/*设备类别子类id数组,用于删除 */
                addTypeNameDisabled:true,/*添加节点类名禁用开关 */
                editTypeNameDisabled:true,/*重命名节点类名禁用开关 */
                printCodeDialog:false,/*打印条码弹框 */
                dialogTitle:'',/*打印条码弹框标题 */
                imgAddUrl: require('../../../../../../../static/images/warehouse/equipment.png'),
                imgDelUrl: require('../../../../../../../static/images/technology/shanchu.png'),
                imgPrinUrl: require('../../../../../../../static/images/warehouse/printing_code.png'),
                inputSearchKey: '',
                /*输入框搜索关键字 */
                searchDisabled:true,/*搜索禁用开关 */
                result: [],
                /*校验 */
                nameValid: statusObj,
                /*校验 */
                equipmentStatus: [ /*状态选择项 */ 
                    {
                        value: 0,
                        lable: '使用'
                    },
                    {
                        value: 1,
                        lable: '闲置'
                    },
                    {
                        value: 2,
                        lable: '维修'
                    },
                    {
                        value: 3,
                        lable: '损坏'
                    },
                    {
                        value: 4,
                        lable: '报废'
                    },
                ],
                /*设备状态选择 */
                option: [],
                equipmentDetailId:'',
                /*设备状态绑定值 */
                selectIdResult: [] /*选择的设备id,用于删除 */ ,
                selectCodeResult: [] /*选择的设备编码,用于打印 */ ,
                showMaterialDetailDialog: false,
                showAddMaterialTypeDialog: false /*添加设备类别弹框*/ ,
                goodsName: "",
                showAddDialog: false,
                root: [],
                length: 2,
                defaultProps: {
                    children: "children",
                    label: "name",
                    parentId: 'parentId'
                },
                
                flag: false,
                delDialogVisible: false,
                /*删除弹框开关 */
                addDialogVisible: false /*新建设备类别 */ ,
                editDialogVisible: false,
                addId: "",
                editId: "",
                delId: "",
                delName: "",
                arrId: [],
                addForm: {/*添加节点 */
                    name: ""
                },
                editForm: {/*重命名节点 */
                    name: ""
                },
                editRules: {
                    edit: [{
                            required: true,
                            message: '请输入设备名称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 8,
                            message: '长度在 1 到 8 个字符',
                            trigger: 'blur'
                        }
                    ],
                },
                rulesName:{/*新建设备名称校验*/
                    name:[
                        { required: true, message: '请输入类别名称', trigger: 'change' },
                         { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'change' }
                    ]
                },
                rulesEditName:{/*新建设备名称校验*/
                    name:[
                        { required: true, message: '请输入修改后的节点名称', trigger: 'change' },
                         { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'change' },
                         { validator: validateEditTypeName, trigger: 'change' }
                    ]
                },
                checked: false,
                // 禁用启用
                submitBtnDisabled: true,
                selectMaterialId: "",
                /******** */
                delText: '设备删除后无法恢复,确认删除？',
                addDialogTitle: '新建设备',
                /*打开新建或编辑设备弹窗的title */
                delEquipmentId: '',
                /*删除当前的单个设备,设备详情页面删除*/
                delType:1,/*1为删除类别,2为删除设备 */
            };
        },
        computed: {
        },
        watch: {
            addForm:{
                handler(newVal,oldVal){
                    if(!newVal.name || newVal.name.length<2 || newVal.name.length>12){
                        this.addTypeNameDisabled = true;
                    }else{
                        this.addTypeNameDisabled = false;
                    }
                },
                deep: true
            },
            editForm:{
                handler(newVal,oldVal){
                    if(!newVal.name || newVal.name.length<2 || newVal.name.length>12 || newVal.name==this.typeName){
                        this.editTypeNameDisabled = true;
                    }else{
                        this.editTypeNameDisabled = false;
                    }
                },
                deep: true
            },
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
                rowSize:15
            });
            this.getMatClassList();
        },
        methods: {
            getVal(val){
                this.getWorkProListClsaa(1,15,null,val)
            },
            /*模糊查询 */
            getWorkProListClsaa(current,rowSize,devName,state){
                this.$api.post('/device/selectDevice',{
                    current,rowSize,devName,state
                },res=>{
                    if(res.data==null){
                        this.result=[];
                    }else{
                        this.result = res.data.records;
                    }
                    
                },res=>{})
            },
            getNode(val){
                this.getChildrenIds(val)
            },
            /* 点击子类查询设备信息列表*/
            getCurrentKey(keys) {
                this.typeId=keys.id;
                this.arrId = [];
                let id = this.traverseTree(keys);
                this.typeKeys=this.traverseTree(keys);
                this.getWorkProList({
                    current: 1,
                    rowSize:15,
                    typeId: id[0]
                });
            },
            /*解析类别,获取该类别子级集合 */
            getChildrenIds(keys){
                let arrIds=[];
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
            /*查询设备类别树结构*/
            getMatClassList() {
                this.$api.get("/device/category/tree", "", res => {
                        this.root = res.data;
                    },
                    res => {
                        this.$message({
                            message: res.msg
                        });
                    }
                );
            },
            // 查询设备信息列表
            getWorkProList(data) {
                this.$api.post("/device/listDevice", data, res => {
                    this.result = res.data.records;
                });
            },
            // 点击分页
            pageChange(page) {
                this.getWorkProList({
                    current: page,
                    rowSize: 15,
                });
            },
            /*获取选中树节点 */
            getCheckedNodes() {
                console.log(this.$refs.tree.getCheckedNodes());
            },
            /* 新建节点类别*/
            add(id) {
                this.addId = id;
                this.addDialogVisible = true;
            },
            /*新建节点确定按钮 */
            addSelect(name) {
                this.$api.post(
                    "/device/category/save", {
                        categoryName: name,
                        id: this.addId
                    },
                    res => {
                        this.$message({
                            message: "新建成功",
                            type: "success",
                            onClose: () => {
                                this.addDialogVisible = false;
                                this.addForm.name='';
                                this.getMatClassList();
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
            /*打开删除弹框*/
            delSelect(typeNum, id, name, val) {
                if (typeNum === 1) {
                    /* 删除节点*/
                    this.delText = '将同步删除该类别下的子类别，设备将转移至一级分类下，删除后无法恢复，确认删除？';
                    this.delId = id;
                    this.delName = name;
                    this.delDialogVisible = true;
                    this.delType=1;
                } else if (typeNum === 2) {
                    /* 删除设备*/
                    this.delText = '设备删除后无法恢复,确认删除？';
                    if (val === 1) {
                        this.delType=2;
                        /*list组件上的删除按钮 */
                        if (this.selectIdResult.length > 0) {
                            this.delDialogVisible = true;
                        } else {
                            this.delDialogVisible = false;
                            this.$message({
                                message: "请选择设备",
                                type: "error",
                            });
                        }
                    } else if (val === 2) {
                        this.delType==3;
                        /*设备详情上的删除按钮 */
                        this.delDialogVisible = true;
                        this.delText = '设备删除后无法恢复,确认删除？';
                    }
                } else {
                    this.delText = '设备删除后无法恢复,确认删除？';
                }
            },
            /*删除节点类别或设备确定按钮*/
            delTypeName(){
                let dataParams={};
                if(this.delType==1){/*删除类别 */
                    if(this.typeIds.length==0){
                        dataParams={
                            id:this.delId,
                            ids:[]
                        }
                    }else{
                        dataParams={
                            id:this.delId,
                            ids:this.typeIds
                        }
                    }
                    this.$api.post('/device/category/delete', dataParams, res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            onClose: () => {
                                this.getMatClassList();
                            }
                            
                        });
                        
                    }, res => {
                        this.$message({
                            message: res.msg
                        });
                    });
                    this.delDialogVisible = false;
                }else if(this.delType==2){/*List列表多选删除设备*/
                    dataParams={
                        ids:this.selectIdResult
                    }
                    this.delEquipment(dataParams)
                }else if(this.delType==3){/*设备详情上的删除按钮 */
                    dataParams={
                        ids:[this.delEquipmentId]
                    }
                    this.delEquipment(dataParams);

                }
            },
            /*删除设备请求 */
            delEquipment(params){
                this.$api.post('/device/deleteDevice',params,res=>{
                    this.$message({
                            message: '删除成功',
                            type: 'success',
                            onClose: () => {
                                this.delDialogVisible=false;
                                this.showMaterialDetailDialog=false;
                                this.getWorkProList({
                                    current: 1,
                                    rowSize:15
                                });
                            }
                        });
                },res=>{
                    this.$message({
                        message: res.msg
                    });
                    this.delDialogVisible=false;
                })
            },
            /* 重命名节点名称*/
            edit(id,name) {
                this.editDialogVisible = true;
                this.editId = id;
                this.typeName=name;
            },
            /*重命名节点名称确定按钮 */
            editSubmit(rename) {
                this.$api.post(
                    "/device/category/update", {
                        categoryName: rename,
                        id: this.editId
                    },
                    res => {
                        this.$message({
                            message: "重命名成功",
                            type: "success",
                            onClose: () => {
                                this.editForm.name='';
                                this.editDialogVisible = false;
                                this.getMatClassList();
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
            /*搜索 */
            searchBtn(val) {
                if(val===''){
                    this.getWorkProList({
                    current: 1,
                    rowSize: 15,
                });
                }else{
                    this.getWorkProListClsaa(1,15,val)
                }
                
            },
            /*打开新建设备类别对话框 */
            openAddMaterialTypeDialog() {
                this.addDialogVisible = true;
            },
            // 打开新建或编辑设备弹窗
            openAddDialog(id, dialogType) {
                if (dialogType === 'edit') {
                    this.addDialogTitle = '编辑设备';
                    this.dialogType=1;
                } else if (dialogType === 'add') {
                    this.addDialogTitle = '新建设备';
                    this.dialogType=0;
                }
                this.devId=id;
                this.showAddDialog = true;
            },
            /*选择设备*/
            selectEquipment(val) {
               let selectResultId=[];
               let selectResultCode=[];
                val.forEach(item => {
                    selectResultId.push(item.id);/*用于删除 */
                    selectResultCode.push(item.devCode)/*用于打印 */
                })
                this.selectIdResult=selectResultId;
                this.selectCodeResult=selectResultCode;
            },
            /*打印 */
            printBarCode(){
                this.printCodeDialog=true;
                this.dialogTitle='打印设备条码';
            },
            /*确定删除设备按钮 */
            // confirmDel() {
            //     this.delDialogVisible = false;
            //     let dataParams = {}
            //     if (this.equipmentDetailId !== '') { /*设备详情上面的删除 */
            //         dataParams = {
            //             ids: [this.equipmentDetailId]
            //         }
            //     } else { /* 主页列表上面的删除*/
            //         dataParams = {
            //             ids: this.selectIdResult
            //         }
            //     }
            //     this.$api.post('/warehouse/materiel/delete', dataParams, res => {
            //         this.$message({
            //             message: '删除成功',
            //             type: 'success',
            //             onClose: () => {
            //                 this.getWorkProList({
            //                     current: 1,
            //                     rowSize:15
            //                 });
            //             }
            //         });
            //     }, res => {
            //         this.$message({
            //             message: res.msg
            //         });
            //     });
            // },
            /*新建 */
            changeDialogStatus(status, dialogStatusName, id) {
                /*id为设备详情上的删除按钮设备id */
                this.delEquipmentId = id;
                this[dialogStatusName] = status;
                if(dialogStatusName=='delDialogVisible'){
                        this.delType=3;
                }
                if (!status) {
                    this.getWorkProList({
                        current: 1,
                        rowSize:15
                    });
                }
            },
            /* 显示设备详情*/
            showDetail(data) {
                this.equipmentDetailId = data.id;
                this.changeDialogStatus(true, "showMaterialDetailDialog");
            },
            /*设备详情关闭,清除选择的设备id */
            clearEquipmentDetailId() {
                this.equipmentDetailId = ''
            }
        }
    };
</script>

<style lang="less">
    @import url("./List.less");
</style>
