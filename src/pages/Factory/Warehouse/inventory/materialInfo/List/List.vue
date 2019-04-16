<template>
    <div class="materialManagement">
        <!--新建节点弹框-->
        <el-dialog title="新建物料类别" :visible.sync="addDialogVisible" class="addDialogVisible">
            <el-form :model="addForm" :rules="rules1" ref="addForm">
                <el-form-item label="类别名称" prop="name" label-width="70px" class="isRequired">
                    <el-input placeholder="请输入物料类别名称" v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false" class="cancel">取 消</el-button>
                <el-button type="primary" class="submit" :disabled="submitBtnDisabled" @click="addSelect(addForm.name)">确 定</el-button>
            </div>
        </el-dialog>
        <!--重命名节点弹框-->
        <el-dialog title="重命名物料名称" :visible.sync="editDialogVisible"  class="editDialogVisible">
            <el-form :model="addForm" :rules="rules2" ref="addForm">
                <el-form-item label="类别名称" prop="edit" label-width="70px" class="isRequired">
                    <el-input placeholder="请输入修改后的节点名称" v-model="addForm.edit"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false" class="cancel">取 消</el-button>
                <el-button type="primary" class="submit" :disabled="submitBtnDisabled" @click="editSelect(addForm.edit)">确 定</el-button>
            </div>
        </el-dialog>
        <!--删除节点弹框-->
        <el-dialog title="删除" :visible.sync="delDialogVisible" width="30%" class="delDialogVisible">
            <p class="delDialogVisible_tip">物料删除后无法恢复,确认删除？</p>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="cancel" @click="delDialogVisible = false">
                    取 消
                </el-button>
                <el-button size="small" type="primary" class="submit" @click="delSelect()">
                    确定删除
                </el-button>
            </div>
        </el-dialog>
        <el-row class="row-left">
            <div class="row-left_title">
                <h3>物料类别</h3>
                <p class="row-left_icon" @click="openAddMaterialTypeDialog">+</p>
            </div>
            
            <el-tree :data="root" default-expand-all node-key="id" ref="tree" highlight-current @node-click="getCurrentKey" :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <div class="custom-tree-btn">
                        <el-popover popper-class="product-tree-right-btn" placement="bottom" width="65" trigger="click">
                            <el-button type="text" v-if="node.label!='固定' && node.label!='活动' " @click="edit(node.key)" style="color:#3672c6">重命名</el-button>
                            <el-button type="text" v-if="node.label!='固定' && node.label!='活动' " @click="del(node.key,node.label)">删除</el-button>
                            <div class="right" slot="reference" @click.stop=""></div>
                        </el-popover>
                    </div>
                </span>
            </el-tree>
        </el-row>
        <el-row class="row-right">
            <el-row class="top-btns">
                <el-button @click.native="openAddDialog">
                    <img src="../../../../../../../static/images/icon/product.png">新建物料
                </el-button>
                <el-button @click.native="openDeleteDialog(1)">
                    <img src="../../../../../../../static/images/technology/shanchu.png">删除
                </el-button>
                <div class="search" style="margin-top: 15px;">
                    <div class="filter_early_warning">
                        <div class="early_warning_input">
                            <input type="radio" id="earlyWarning" :checked='false' ref="earlyWarning" @click="earlyWarningClick()">
                            <label for="earlyWarning"></label>
                        </div>
                        <p class="early_warning_p">仅显示预警物料</p>
                    </div>
                    <el-input placeholder="搜索物料名称" class="input-with-select">
                        <el-button slot="append">搜索</el-button>
                    </el-input>
                </div>
            </el-row>
            <div class="Table">
                <el-table :data="result" style="width: 100%" @row-click="showDetail"  @selection-change="selectionMaterial">>
                    <el-table-column type="selection" align="center" width="74"></el-table-column>
                    <el-table-column label='物料名称' prop="materialName" align="center" width="100"></el-table-column>
                    <el-table-column label='物料编码' prop="materialCode" align="center" width="100"></el-table-column>
                    <el-table-column label='规格型号' prop="materialSpecModel" align="center"></el-table-column>
                    <!-- <el-table-column label='类别'  align="center" width="70">
                        <template slot-scope="scope">{{ anysisDeptUsers(scope.row) }}</template>
                    </el-table-column> -->
                    <el-table-column label='类别'  align="center" width="70" prop='materialType'></el-table-column>
                    <el-table-column label='单位' width="50" prop="materialUnit" align="center"></el-table-column>
                    <el-table-column label='注册证编号' prop="materialRegNum" align="center"></el-table-column>
                    <el-table-column label='生产厂家' prop="materialManufactor" align="center"></el-table-column>
                    <el-table-column label='生产许可证编号' prop="materialLicenseNum" align="center"></el-table-column>
                    <el-table-column label='当前库存' prop="materialStock" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="page">
                <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
            </div>
        </el-row>

        <template>
            <!-- 新建物料 -->
            <AddMaterial v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" :selectProductId="selectProductId"/>
            <!-- 物料详情 -->
            <MaterialDetail v-if="showMaterialDetailDialog" @changeDialogStatus="changeDialogStatus" @openAddMaterialDialog="openAddDialog" />
            <!-- 删除物料 -->
            <DeleteMaterial v-if="DeleteMaterialDialog" @openDeleteMaterialDialog="openDeleteDialog(2)" @changeDialogStatus="changeDialogStatus"/>
        </template>

    </div>
</template>

<script type="text/javascript">
import Page from "../../../../../../components/Page/Page";
import AddMaterial from "../Add/Add"; 
import MaterialDetail from '../Detail/Detail';
import DeleteMaterial from '../Delete/Delete';

export default {
  components: { Page, AddMaterial ,MaterialDetail,DeleteMaterial},
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
      result: [
          {
            materialName: '瓷粉',
            materialCode: '7894521025632',
            materialSpecModel: '自凝牙托粉II型1类',
            materialType: '牙托粉',
            materialUnit: '瓶',
            materialRegNum: '国食药监械(准)字2009第qqqq',
            materialManufactor: '广州市科阳医疗设备有限公司',
            materialLicenseNum: '粤药管械生产许可证',
            materialStock: '20',
          },
          {
            materialName: '瓷粉',
            materialCode: '7894521025632',
            materialSpecModel: '自凝牙托粉II型1类',
            materialType: '牙托粉',
            materialUnit: '瓶',
            materialRegNum: '国食药监械(准)字2009第qqqq',
            materialManufactor: '广州市科阳医疗设备有限公司',
            materialLicenseNum: '粤药管械生产许可证',
            materialStock: '20',
          },
          {
            materialName: '瓷粉',
            materialCode: '7894521025632',
            materialSpecModel: '自凝牙托粉II型1类',
            materialType: '牙托粉',
            materialUnit: '瓶',
            materialRegNum: '国食药监械(准)字2009第qqqq',
            materialManufactor: '广州市科阳医疗设备有限公司',
            materialLicenseNum: '粤药管械生产许可证',
            materialStock: '20',
          },
          {
            materialName: '瓷粉',
            materialCode: '7894521025632',
            materialSpecModel: '自凝牙托粉II型1类',
            materialType: '牙托粉',
            materialUnit: '瓶',
            materialRegNum: '国食药监械(准)字2009第qqqq',
            materialManufactor: '广州市科阳医疗设备有限公司',
            materialLicenseNum: '粤药管械生产许可证',
            materialStock: '20',
          },
          {
            materialName: '瓷粉',
            materialCode: '7894521025632',
            materialSpecModel: '自凝牙托粉II型1类',
            materialType: '牙托粉',
            materialUnit: '瓶',
            materialRegNum: '国食药监械(准)字2009第qqqq',
            materialManufactor: '广州市科阳医疗设备有限公司',
            materialLicenseNum: '粤药管械生产许可证',
            materialStock: '20',
          },
      ],
      selectionResult:[],/*选择的物料,用于删除 */
      showMaterialDetailDialog:false,
      DeleteMaterialDialog:false,
      showAddMaterialTypeDialog:false,/*添加物料类别弹框*/
      goodsName: "",
      showAddDialog: false,
      root: [
          {
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
        }
      ],
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
      addDialogVisible: false,/*新建物料类别 */
      editDialogVisible: false,
      addId: "",
      editId: "",
      delId: "",
      delName: "",
      arrId: [],
      rules1: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      rules2: {
        edit: [{ validator: validateRename, trigger: "blur" }]
      },
      earlyWarning:'true',/*只显示预警物料开关 */
      checked:false,
      // 禁用启用
      submitBtnDisabled: true,
      selectProductId: ''
    };
  },
  computed: {
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
    }
  },
  mounted() {
    this.getWorkProList({
      currentPage: 1,
      goodsName: this.goodsName
    });
    this.getProClassList();
  },
  methods: {
    // 点击子类查询物料信息列表
    getCurrentKey(keys) {
      this.arrId = [];
      let id = this.traverseTree(keys);
      this.getWorkProList({
        currentPage: 1,
        itemCategoryIdArray: id
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
      this.$api.post("/product/selectProduct/page", data, res => {
        // this.result = res.data;
      });
    },
    // 点击分页
    pageChange(page) {
      this.getWorkProList({
        currentPage: page,
        goodsName: this.goodsName
      });
    },
    // 解析类别--递归遍历类别
    anysisDeptUsers(data) {
      // 解析树结构为 XX-XX-XX
      if (data.resType == null) {
        return;
      }
      let _data = { resType: data.resType };
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
          const { name: childName } = obj[key] || {};
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
    /*仅显示预警物料开关 */
    earlyWarningClick(){
        this.checked=!this.checked;
        this.$refs.earlyWarning.checked=this.checked;
    },
    /*打开新建物料类别对话框 */
    openAddMaterialTypeDialog(){
        this.addDialogVisible=true;
    },
    // 打开新建订单弹窗
    openAddDialog(id) {
        this.selectProductId = typeof(id) === 'string' || typeof(id) === 'number' ? id : '';
        this.showAddDialog = true;
    },
    /* 打开删除物料弹窗*/
    openDeleteDialog(val) {
        console.log(val)
        if(val==1){
this.DeleteMaterialDialog = this.selectionResult.length > 0 ? true : false;
        }else if(val==2){
this.DeleteMaterialDialog = true
        }
        
    },
    /*选择物料 */
    selectionMaterial(val){
        this.selectionResult=val;
    },
    //查询物料类别
    getProClassList() {
      this.$api.get("/product/category/tree", "", res => {
        if (res.data.length) {
        //   this.root = res.data;
        }
      });
    },

    addSelect(name) {
      this.addDialogVisible = false;
      let canSubmit = this.canSubmit;
      if (canSubmit) {
        this.submitBtnDisabled = false;
        this.$api.post(
          "/product/category/save",
          { categoryName: name, id: this.addId },
          res => {
            this.$message({
              message: "新建成功",
              type: "success",
              onClose: () => {
                this.getProClassList();
              }
            });
          },
          res => {
            this.$message({ message: res.msg });
          }
        );
      }
    },
    // 移除节点
    del(id, name) {
      this.delId = id;
      this.delName = name;
      this.delDialogVisible = true;
    },
    delSelect() {
      this.delDialogVisible = false;
      this.$api.post(
        "/product/category/delete",
        { categoryName: this.delName, id: this.delId },
        res => {
          this.$message({
            message: "删除成功",
            type: "success",
            onClose: () => {
              this.getProClassList();
            }
          });
        },
        res => {
          this.$message({ message: res.msg });
        }
      );
    },

    // 编辑节点名称
    edit(id) {
      this.editDialogVisible = true;
      this.editId = id;
    },
    editSelect(rename) {
      this.editDialogVisible = false;
      let canSubmit = this.canSubmit;
      if (canSubmit) {
        this.$api.post(
          "/product/category/rename",
          { categoryName: rename, id: this.editId },
          res => {
            this.$message({
              message: "重命名成功",
              type: "success",
              onClose: () => {
                this.getProClassList();
              }
            });
          },
          res => {
            this.$message({ message: res.msg });
          }
        );
      }
    },
     /*新建或物料 */
    changeDialogStatus(status, dialogStatusName, type) {
        this[dialogStatusName] = status;
       
        if(!status) {
            this.getWorkProList({
                "currentPage": 1,
                "goodsName": this.goodsName
            });
        }
    },
    // 显示物料详情
    showDetail() {
        this.changeDialogStatus(true, 'showMaterialDetailDialog')
    },
  }
};
</script>

<style lang="less">
@import url("./List.less");
</style>
