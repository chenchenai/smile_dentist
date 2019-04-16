<template>
  <div class="technology">
    <el-row class="top-btns">
      <el-button plain @click.native="openAddTechnology"><img src="../../../../../static/images/order/xinjiandingdan.png">新建工艺路线</el-button>
      <el-button plain><img src="../../../../../static/images/technology/fuzhigongyiluxian.png">复制工艺路线</el-button>
      <el-button plain><img src="../../../../../static/images/technology/shanchu.png">删除</el-button>
      <div class="search" style="margin-top: 15px;">
        <el-input placeholder="工艺路线名称"  class="input-with-select">
          <el-button slot="append" >搜索</el-button>
        </el-input>
      </div>
    </el-row>

    <div class="Table" >
      <el-table :data="result.records" style="width: 100%">
        <el-table-column type="selection" align="center" width="74"></el-table-column>
        <el-table-column label='工艺路线名称' prop="name" align="center" width="150"></el-table-column>
        <el-table-column label='修复类型' prop="routeTypeDes" align="center" width="150"></el-table-column>
        <el-table-column label='工序流程' prop="route" align="center" ></el-table-column>
      </el-table>
    </div>

    <div class="page">
      <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
    </div>

    <template>
      <!-- 新建工艺 -->
      <el-dialog class="addTechnology" title="新建工艺路线" :visible.sync="addTechnologyVisible" >
        <el-row>
          <span class="rowLabel isRequired">工艺路线名称</span>
          <div class="rowContent">
            <el-input @blur="volidProcedureName(addTechnologyData.technologyName)" maxlength="16" minlength="2" v-model="addTechnologyData.technologyName" placeholder="请输入工艺路线名称"></el-input>
            <p class="errorText" v-if="technologyNameValid.status">{{ technologyNameValid.text }}</p>
          </div>
        </el-row>
        <el-row class="checkTemplate" >
          <span class="rowLabel isRequired">修复类型</span>
          <div class="rowContent">
            <el-select v-model="addTechnologyData.checkTemplate" placeholder="请选择修复类型" @blur="volidTemplate" @change="volidTemplate">
              <el-option
                v-for="item in checkTemplateList"
                :key="item.id"
                :label="item.templateName"
                :value="item.id">
              </el-option>
            </el-select>
            <p class="errorText" v-if="checkTemplateValid.status">{{ checkTemplateValid.text }}</p>
          </div>
        </el-row>
        <!--
        穿梭框
        -->
        <div class="row transfer">
          <span class="rowLabel isRequired">工序</span>
          <div class="col-md-5">
            <change-box-area :title="sourceTitle" :data="sourceList"></change-box-area>
          </div>
          <div class="col-md-2 text-center">
            <p><el-button :disabled="sourceList.length === 0 || sourceRefNum === 0"  class="btn btn-primary" @click="toTarget()"></el-button></p>
            <p><el-button :disabled="targetList.length === 0 || targetRefNum === 0" class="btn btn-primary" @click="toSource()"></el-button></p>
          </div>
          <div class="col-md-5">
            <change-box-area :title="targetTitle" :data="targetList"></change-box-area>
          </div>
        </div>

        <div class="dialog-footer" align="right">
          <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
          <el-button class="submit" type="primary" @click.native="submitAddTechnology"  :disabled="!canSubmit">确 定</el-button>

        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script type="text/javascript">
  import Page from '../../../../components/Page/Page';
  import ChangeBoxArea from '../../../../components/ChangeBoxArea/ChangeBoxArea';
  export default {
    components: { Page,ChangeBoxArea },
    data(){
      return {

        result: {},//工艺列表数据
        addTechnologyVisible: false,//弹框是否显示
        addTechnologyData: {
          technologyName:'',
          checkTemplate:'',
          productDepId:'',
          checkDepId:''
        },
        technologyNameValid: { //工艺名称校验错误提示
          status: false,
          text: ''
        },
        checkTemplateList: [ //修复类型数据
          {id:1,templateName:'固定修复'},
          {id:2,templateName:'活动修复'}
        ],
        checkTemplateValid: { //修复类型校验错误提示
          status: false,
          text: '',
        },
        // data3: generateData3(), //添加工序数据
        value5: [],
        sourceTitle: "未选工序",
        targetTitle: "已选择",
        sourceList: [],//未选工序栏
        targetList: [], //已选工序栏
        proceduceArr: [], //已选工序数据
      }
    },
    mounted() {
      this.getTechList(1);
      // this.getProductData();
    },
    computed: {
      productDepId() {
        return this.addTechnologyData.productDepId;
      },
      checkDepId() {
        return this.addTechnologyData.checkDepId;
      },
      // 源数据中选中的数量
      sourceRefNum() {
        return this.sourceList.filter(item => item.isSelected).length;
      },
      // 目标数据中选中的数量
      targetRefNum() {
        return this.targetList.filter(item => item.isSelected).length;
      },
      //校验新建弹框确定按钮禁用
      canSubmit() {
        let flag = false;
        let technologyNameValid = (this.addTechnologyData.technologyName != '') && !this.technologyNameValid.status;
        let checkTemplateValid = (this.addTechnologyData.checkTemplate != '') && !this.checkTemplateValid.status;
        let targetListLength = this.targetList.length > 0;
        if(technologyNameValid && checkTemplateValid && targetListLength){
          flag = true;
        }else{
          flag = false;
        }
        return flag;
      }
    },
    methods: {
      // 查询工艺列表
      getTechList(current) {
        this.$api.post('/process/route',
          { currentPage: Number(current),name:"" },
          res => {
            this.result = res.data;
          }
        );
      },
      // 点击分页
      pageChange(page) {
        this.getTechList(page);
      },
      // 打开新建工艺
      openAddTechnology() {
        this.addTechnologyVisible = true;
        this.sourceList=[];
        this.getProductData();
      },
      // 关闭新建工艺弹窗
      closeDialog() {
        this.addTechnologyVisible = false;
        this.targetList= [];
        this.addTechnologyData.technologyName='';
        this.addTechnologyData.checkTemplate=''
      },
      // 校验工艺名称输入
      volidProcedureName(value) {
        if(!value){
          this.technologyNameValid = {
            status: true,
            text: '工艺路线名称不能为空'
          }
        }else{
          if(value.length < 2){
            this.technologyNameValid = {
              status: true,
              text: '输入应为2-16字符'
            }
          }else{
            this.technologyNameValid = {
              status: false,
              text: ''
            }
          }
        }
      },
      // 校验修复类型
      volidTemplate(value) {
        if(this.addTechnologyData.checkTemplate){
          this.checkTemplateValid = {
            status: false,
            text: ''
          }
        }else{
          this.checkTemplateValid = {
            status: true,
            text: '修复类型不能为空'
          }
        }
      },
      //实现左右穿梭功能
      exchange(fd, td) {
        let selectedItem = fd.filter(item => item.isSelected).map(item => {
          return {
            ...item,
            isSelected: false
          };
        });
        td.push(...selectedItem);
        return fd.filter(item => !item.isSelected);
      },

      // 把选择数据转移到目标（右框）
      toTarget() {
        this.sourceList = this.exchange(this.sourceList, this.targetList);
      },
      // 把选择数据转回到源（左框）
      toSource() {
        this.targetList = this.exchange(this.targetList, this.sourceList);
      },
      // 获取工序数据
      getProductData() {
        this.$api.get('/proceduce/factory', '',
          res => {
            if(res.data.length>0){
              res.data.map((item, index) => {
                this.sourceList.push({
                  procedureName:item.procedureName,
                  isSelected:false,
                  id:item.id
                })
              });
            }else{
              this.sourceList=[];
            }
          }
        );
      },
      //确定新建工艺
      submitAddTechnology(){
        this.targetList.map((item, index) => {
          this.proceduceArr.push({
            name:item.procedureName,
            id:item.id
          })
        });
        this.$api.post('/process/insert', {
            name: this.addTechnologyData.technologyName,
            proceduceIdArray: this.proceduceArr,
            routeType: Number(this.addTechnologyData.checkTemplate-1)
          },
          res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.closeDialog();
                this.getTechList(1);
                this.targetList= [];
                this.addTechnologyData.technologyName='';
                this.addTechnologyData.checkTemplate=''

              }
            });
          }
          , res => {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          }
        );
      }

    },
  }
</script>

<style lang="less">
  @import url('./Technology.less');
</style>
