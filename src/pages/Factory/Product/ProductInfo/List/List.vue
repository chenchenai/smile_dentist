
<template>
    <div class="product">
        <!--新建节点弹框-->
        <el-dialog class="productClassDialog" title="新建产品类别"  :visible.sync="addDialogVisible">
            <el-form :model="addForm"  ref="addForm">
                <el-form-item label="类别名称" prop="name" label-width="70px" class="isRequired" >
                  <el-input maxlength="32" placeholder="请输入产品类别名称" v-model="addForm.name" @blur="validName(addForm.name)"></el-input>
                  <p class="errorNotice" v-if="nameValid.status">{{ nameValid.text }}</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="submitBtnDisabled" @click="addSelect(addForm.name)">确 定</el-button>
            </div>
        </el-dialog>
        <!--重命名节点弹框-->
        <el-dialog class="productClassDialog" title="重命名产品名称" :visible.sync="editDialogVisible">
            <el-form :model="addForm"  ref="addForm">
                <el-form-item label="类别名称" prop="edit" label-width="70px" class="isRequired" >
                  <el-input maxlength="32" placeholder="请输入修改后的节点名称" v-model="addForm.edit"  @blur="validEdit(addForm.edit)"></el-input>
                  <p class="errorNotice" v-if="editValid.status">{{ editValid.text }}</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="submitBtnDisabled" @click="editSelect(addForm.edit)">确 定</el-button>
            </div>
        </el-dialog>
        <!--删除节点弹框-->
         <el-dialog class="productClassDeletDialog"
            title="将同步删除该类别下的子类别，删除后且无法恢复，确认删除？"
            :visible.sync="delDialogVisible"
            width="30%"
            :append-to-body="true">
            <span slot="footer">
                <el-button
                    size="small"
                    @click="delDialogVisible = false">
                    取 消
                </el-button>
                <el-button
                    size="small"
                    type="primary"
                    @click="delSelect()">
                    确 定
                </el-button>
            </span>
        </el-dialog>
        <el-row class="row-left">
            <h3>产品类别</h3>
            <el-tree
                :data="root"
                default-expand-all
                node-key="id"
                ref="tree"
                :expand-on-click-node="false"
                highlight-current
                @node-click="getCurrentKey"
                :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <div class="custom-tree-btn">
                        <el-popover
                            popper-class="product-tree-right-btn"
                            placement="bottom"
                            width="65"
                            trigger="click"
                        >
                            <el-button type="text" @click="() => add(node.key)">新建子类</el-button>
                            <el-button type="text" v-if="node.label!='固定' && node.label!='活动' "  @click="() => edit(node.key)">重命名</el-button>
                            <el-button type="text" v-if="node.label!='固定' && node.label!='活动' " @click="() => del(node.key,node.label)">删除</el-button>
                            <div class="right" slot="reference" @click.stop></div>
                        </el-popover>
                    </div>
                </span>
            </el-tree>
        </el-row>
        <el-row class="row-right">
            <el-row class="top-btns">
                <el-button @click="openAddDialog">
                    <img src="../../../../../../static/images/icon/product.png">新建产品
                </el-button>
                <el-button  >
                    <img src="../../../../../../static/images/technology/shanchu.png">删除
                </el-button>
                <div class="search" style="margin-top: 15px;">
                    <el-input placeholder="搜索产品名称"  class="input-with-select">
                        <el-button slot="append" >搜索</el-button>
                    </el-input>
                </div>
            </el-row>
            <div class="Table" >
                <el-table :data="result" style="width: 100%" @row-click="showDetail">
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='产品名称' prop="goodsName" align="center" width="100"></el-table-column>
                    <el-table-column label='修复类型' prop="repairTypeName" align="center" width="100"></el-table-column>
                    <el-table-column label='规格型号' prop="spec" align="center"></el-table-column>
                    <el-table-column label='类别' align="center" width="100">
                        <template slot-scope="scope">{{ anysisDeptUsers(scope.row) }}</template>
                    </el-table-column>
                    <el-table-column label='生产周期（天）' prop="takingtime" align="center"></el-table-column>
                    <el-table-column label='质保期（年）' prop="shelflife" align="center"></el-table-column>
                    <el-table-column label='单价（元）' prop="guidePrice" align="center"></el-table-column>
                    <el-table-column label='封顶价（元）' prop="topPrice" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
            </div>
        </el-row>
        <template>
            <!-- 新建产品 -->
            <AddProduct v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId" />
            <!-- 产品详情 -->
            <ProductDetail v-if="showProductDetailDialog" @changeDialogStatus="changeDialogStatus" @openAddProductDialog="openAddDialog" :productDetailId="productDetailId" />
        </template>
    </div>
</template>

<script type="text/javascript">
    import Page from '../../../../../components/Page/Page';
    import AddProduct from '../Add/Add';
    import ProductDetail from '../Detail/Container';
  	export default {
        components: { Page, AddProduct, ProductDetail },
		data(){
        let statusObj = {
          status: false,
          text: ''
        };
  			return {
                nameValid: statusObj,
                editValid: statusObj,
                result: [],
                goodsName: '',
                showAddDialog: false,
                root:[],
                length:2,
                defaultProps: {
                    children: 'children',
                    label: 'name',
                },
                addForm: {
                    name: '',
                    edit:''
                },
                flag: false,
                delDialogVisible: false,
                addDialogVisible: false,
                editDialogVisible: false,
                addId:'',
                editId:'',
                delId:'',
                delName:'',
                arrId:[],
                // 禁用启用
                submitBtnDisabled: true,
                showProductDetailDialog: false,
                selectProductId: '',
                productDetailId: ''
  			}
		},
        computed: {
            canSubmit(){
                let flag = false;
                let name=this.addForm.name && !this.nameValid.status;
                let edit=this.addForm.edit && !this.editValid.status;
                if(name || edit) {
                    flag = true;
                }else {
                    flag = false;
                };
                return flag;
            }
        },
        watch: {
            canSubmit(curVal) {
                if(curVal) {
                    this.submitBtnDisabled = false;
                }else {
                    this.submitBtnDisabled = true;
                }
            }
        },
        created() {
            this.getWorkProList({
                "currentPage": 1,
                "goodsName": this.goodsName
            });
            this.getProClassList();
        },
        methods: {
            //校验新建子类
            validName(value) {
              if(value) {
                if(value.length < 2){
                  this.nameValid = {
                    status: true,
                    text: '产品类别名称应为2-32个字符'
                  };
                }
                else{
                  this.nameValid = {
                    status: false,
                    text: ''
                  };
                }
              }else {
                this.nameValid = {
                  status: true,
                  text: '产品类别名称不能为空'
                };
              }

            },
          //校验重命名
          validEdit(value) {
            if(value) {
              if(value.length < 2){
                this.editValid = {
                  status: true,
                  text: '产品类别名称应为2-32个字符'
                };
              }
              else{
                this.editValid = {
                  status: false,
                  text: ''
                };
              }
            }else {
              this.editValid = {
                status: true,
                text: '产品类别名称不能为空'
              };
            }

          },
            // 点击子类查询产品信息列表
            getCurrentKey(keys){
                this.arrId = [];
                let id=this.traverseTree(keys);
                this.getWorkProList({
                    "currentPage": 1,
                    "itemCategoryIdArray":id
                });
            },
            //遍历所有树结构id值
            traverseTree(node){
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
                return this.arrId
            },
            // 查询产品信息列表
            getWorkProList(data) {
                this.$api.post('/product/selectProduct/page', data, res => {
                    this.result = res.data;
                });
            },
            // 点击分页
            pageChange(page) {
                this.getWorkProList({
                    "currentPage": page,
                    "goodsName": this.goodsName
                });
            },
            // 解析类别--递归遍历类别
            anysisDeptUsers(data) {
                // 解析树结构为 XX-XX-XX
                if(data.resType == null) {
                    return ;
                }
                let _data = { resType: data.resType};
                const type = obj => Object.prototype.toString.call(obj).replace(/^\[object ([a-zA-Z0-9]+)\]$/, '$1');
                const concatString = (prev, next) => next ? String(prev).concat(`-${String(next)}`) : prev;
                const getName = (obj, key, name) => {
                    let lastName = name;
                    const keys = Object.keys(obj);
                    if(keys.includes(key)){
                        const { name: childName } = obj[key] || {};
                        const _name = !name ? childName : concatString(name, childName);
                        const isObject = type(obj[key]) === 'Object' && obj[key] !== null;
                        if(obj[key] && isObject) {
                            lastName = getName(obj[key], key,_name);
                        }
                    }
                    return lastName;
                }
                const lastName = getName(_data, 'resType', '').split('-').reverse().join('-')+'-'+data.itemCategoryName;
                return lastName;
            },
            // 打开新建订单弹窗
            openAddDialog(id) {
                this.selectProductId = typeof(id) === 'string' || typeof(id) === 'number' ? id : '';
                this.showAddDialog = true;
            },
            //查询产品类别
            getProClassList(){
                this.$api.get('/product/category/tree', "", res => {
                    if(res.data.length){
                        this.root = res.data;
                    }
                });
            },
            // 添加节点
            add(id){
                this.addId=id;
                this.addForm.name='';
                this.nameValid = {
                  status: false,
                  text: ''
                };
                this.addDialogVisible = true;

            },
            addSelect(name){
                this.addDialogVisible = false;
                let canSubmit = this.canSubmit;
                if(canSubmit) {
                    this.$api.post('/product/category/save', {categoryName:name,id:this.addId}, res => {
                        this.$message({
                            message: '新建成功',
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.getProClassList();
                            }
                        });
                    },res =>{
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000,
                        });
                    });
                }
            },
            // 移除节点
            del(id,name){
                this.delId=id;
                this.delName=name;
                this.delDialogVisible = true;
            },
            delSelect() {
                this.delDialogVisible = false;
                this.$api.post('/product/category/delete', {categoryName:this.delName,id:this.delId}, res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.getProClassList();
                        }
                    });
                },res =>{
                    this.$message({
                        message: res.msg,
                        type: 'error',
                        duration: 1000,
                    });
                });
            },
            // 编辑节点名称
            edit(id){
                this.addForm.edit='';
                this.editValid = {
                  status: false,
                  text: ''
                };
                this.editDialogVisible = true;
                this.editId=id;
            },
            editSelect(rename) {
                this.editDialogVisible = false;
                let canSubmit = this.canSubmit;
                if(canSubmit) {
                    this.$api.post('/product/category/rename', {categoryName:rename,id:this.editId}, res => {
                        this.$message({
                            message: '重命名成功',
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.getProClassList();
                            }
                        });
                    },res =>{
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000,
                        });
                    });
                }
            },
            // 打开或者关闭弹窗
            changeDialogStatus(status, dialogStatusName, type) {
                this[dialogStatusName] = status;
                if(!status) {
                    this.getWorkProList({
                        "currentPage": 1,
                        "goodsName": this.goodsName
                    });
                }
            },
            // 显示产品详情
            showDetail(data) {
                this.productDetailId = data.id;
                this.changeDialogStatus(true, 'showProductDetailDialog')
            },
        }
    }
</script>

<style lang="less">
    @import url('./List.less');
</style>
