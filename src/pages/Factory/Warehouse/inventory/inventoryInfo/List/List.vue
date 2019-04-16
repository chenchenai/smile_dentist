<template>
    <div class="inventoryInfo">
        <el-row class="row-left">
            <div class="row-left_title">
                <h3 @click="getAllEntry()">物料类别</h3>
            </div>
            <el-tree :data="root" default-expand-all node-key="id" ref="tree" highlight-current @node-click="getCurrentKey" :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                </span>
                <div class="custom-tree-btn">
                    <el-popover popper-class="product-tree-right-btn" placement="bottom" width="65" trigger="click">
                        <el-button type="text" @click="add(node.key)">新建子类</el-button>
                        <el-button type="text" @click="edit(node.key)" style="color:#3672c6">重命名</el-button>
                        <el-button type="text" @click="delSelect(1,node.key,node.label)">删除</el-button>
                        <div class="right" slot="reference" @click.stop=""></div>
                    </el-popover>
                </div>
            </el-tree>
        </el-row>
        <el-row class="row-right">
            <el-row class="top-btns">
                <el-button @click.native="openModifyDialog">
                    <img src="../../../../../../../static/images/warehouse/modify.png">修改库存
                </el-button>
                <div class="search" >
                    <el-input placeholder="物料名称/追溯码/物料编码/入库单号" class="input-with-select searchInput" v-model="searchKey" @keyup.native.delete='searchResult(searchKey)' @keyup.native.enter='searchResult(searchKey)'>
                        <el-button slot="append" class="searchBtn" :disabled="searchDisabled" @click="searchResult(searchKey)">搜索</el-button>
                    </el-input>
                </div>
            </el-row>
            <div class="Table">
                <el-table :data="result" style="width: 100%" @selection-change="selectionMaterial">
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='追溯码' prop="traceCode" align="center" width="200"></el-table-column>
                    <el-table-column label='物料名称' prop="materialName" align="center" width="100"></el-table-column>
                    <el-table-column label='物料编码' prop="materialNo" align="center" width="200"></el-table-column>
                    <el-table-column label='规格型号' prop="spec" align="center"></el-table-column>
                    <el-table-column label='类别' prop='materialType' align="center" width="70"></el-table-column>
                    <el-table-column label='单位' prop="unitName" align="center" width="50"></el-table-column>
                    <el-table-column label='供应商' prop="supplier" align="center" width="150"></el-table-column>
                    <el-table-column label='入库单号' prop="orderNo" align="center" width="200"></el-table-column>
                    <el-table-column label='批次号' prop="batchNo" align="center"></el-table-column>
                    <el-table-column label='生产日期' prop="productionDate" align="center"></el-table-column>
                    <el-table-column label='当前库存' prop="stock" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
            </div>
        </el-row>
        <template>
                <!-- 修改入库 -->
                <ModifyEntry v-if="showModifyDialog" @changeDialogStatus="changeDialogStatus" :titleType='titType' :selectionResult='selectionResult'/>
</template>

    </div>
</template>

<script type="text/javascript">
    import Page from "../../../../../../components/Page/Page";
    import ModifyEntry from "../Modify/Modify";
    export default {
        components: {
            Page,
            ModifyEntry
        },
        data() {
            return {
                showModifyDialog: false,
                result: [],
                searchKey: '',
                selectionResult: [],
                /*选择的物料 */
                searchDisabled:true,
                idArray: [] /* 选择的id数组*/ ,
                goodsName: "",
                titType: '',
                root: [],
                typeNameList: [],
                /*类别树结构 */
                length: 2,
                defaultProps: {
                    children: "children",
                    label: "name",
                    parentId: 'parentId'
                },
                submitBtnDisabled: true,
                /* 禁用启用*/
            };
        },
        computed: {
        },
        watch: {
            canSubmit(curVal) {
                if (curVal) {
                    this.submitBtnDisabled = false;
                } else {
                    this.submitBtnDisabled = true;
                }
            },
            searchKey(newVal,oldVal){
                if(newVal===''){
                    this.searchDisabled=true;
                }else{
                    this.searchDisabled=false;
                }
            }
        },
        created() {
            this.getWorkProList({
                current: 1,
                rowSize: 15
            });
            // this.getProClassList();
            this.getMatClassList();
        },
        methods: {
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
            // 点击子类查询物料信息列表
            getCurrentKey(keys) {
                this.arrId = [];
                let id = this.traverseTree(keys);
                this.getWorkProList({
                    current: 1,
                    rowSize:15,
                    ids: id
                });
            },
            /*查询所有库存 */
            getAllEntry(){
                this.getWorkProList({
                current: 1,
                rowSize: 15
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
            /*搜索查询 */
            searchResult(val) {
                this.getWorkProList({
                    param: val,
                    current: 1,
                    rowSize: 15
                })
            },
            // 查询物料信息列表
            getWorkProList(data) {
                this.$api.post("/warehouse/inventory/page", data, res => {
                    this.result = res.data.records;
                });
            },
            // 点击分页
            pageChange(page) {
                this.getWorkProList({
                    current: page,
                    rowSize: 15
                });
            },
            // 解析类别--递归遍历类别
            anysisDeptUsers(data) {
                // 解析树结构为 XX-XX-XX
                if (data.resType == null) {
                    return;
                }
                let _data = {
                    resType: data.resType
                };
                const type = obj =>
                    Object.prototype.toString
                    .call(obj)
                    .replace(/^\[object ([a-zA-Z0-9]+)\]$/, "$1");
                const concatString = (prev, next) =>
                    next ? String(prev).concat(`-${String(next)}`) : prev;
                const getName = (obj, key, name) => {
                    let lastName = name;
                    const keys = Object.keys(obj);
                    if (keys.includes(key)) {
                        const {
                            name: childName
                        } = obj[key] || {};
                        const _name = !name ? childName : concatString(name, childName);
                        const isObject = type(obj[key]) === "Object" && obj[key] !== null;
                        if (obj[key] && isObject) {
                            lastName = getName(obj[key], key, _name);
                        }
                    }
                    return lastName;
                };
                const lastName =
                    getName(_data, "resType", "")
                    .split("-")
                    .reverse()
                    .join("-") +
                    "-" +
                    data.itemCategoryName;
                return lastName;
            },
            /*打开新建物料类别对话框 */
            openModifyDialog() {
                this.titType = '修改库存'
                if(this.result.length===0){
                    this.$message.error('暂时还没有物料数据');
                }else{
                    if (this.selectionResult.length == 0) {
                        this.$message.error('请选择需要修改的物料');
                    } else {
                        this.showModifyDialog = true;
                    }
                }
                
            },
            /*选择物料 */
            selectionMaterial(val) {
                this.selectionResult = val;
            },
            //查询物料类别
            getProClassList() {
                this.$api.get("/materiel/category/tree", "", res => {
                    if (res.data.length) {
                        this.root = res.data;
                    }
                });
            },
            /*入库修改弹框 */
            changeDialogStatus(status, dialogStatusName, type) {
                this[dialogStatusName] = status;
                if (!status) {
                    this.getWorkProList({
                        current: 1,
                        rowSize: 15
                    });
                }
            },
        }
    };
</script>

<style lang="less">
    @import url("./List.less");
</style>
