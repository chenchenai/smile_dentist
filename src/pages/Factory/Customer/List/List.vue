<template>
    <div class="customer">
      <el-row class="row-right">
        <el-row class="top-btns">
          <el-popover
            placement="bottom"
            width="50"
            trigger="click"
            popper-class="add-customer-popover"
          >
              <el-button @click.native="openAddDialog(1,'')">自有客户</el-button>
              <el-button @click.native="addCustomerDialogVisible = true">线上客户</el-button>
            <el-button slot="reference">
              <img src="../../../../../static/images/icon/product.png">添加客户
            </el-button>
          </el-popover>

          <el-button  >
            <img src="../../../../../static/images/technology/shanchu.png">删除
          </el-button>
          <div class="search-btn">
            <div class="choose" style="margin-top: 15px;">
              <el-form ref="formData" :model="formData" label-width="80px" size="mini">
                <el-form-item  prop="type">
                  <el-select v-model="formData.type" placeholder="客户类型" @change="selectType(formData.type)">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="search" style="margin-top: 15px;">
              <el-input placeholder="客户名称/简称/业务员"  v-model="formData.name"   class="input-with-select">
                <el-button slot="append"  @click="search()">搜索</el-button>
              </el-input>
            </div>
          </div>

        </el-row>
        <div class="Table" >
          <el-table :data="result.records" style="width: 100%" @row-click="showDetail">
            <el-table-column type="selection" align="center" width="74"></el-table-column>
            <el-table-column label='客户名称' prop="name" align="center"></el-table-column>
            <el-table-column label='客户简称' prop="abb" align="center"></el-table-column>
            <el-table-column label='类型'  align="center" width="100">
              <template slot-scope="scope">
                  {{scope.row.create_type == 0 ? '线上客户':(scope.row.create_type == 1 ? '自有客户':'')}}
              </template>
            </el-table-column>
            <el-table-column label='联系人' prop="contacts" align="center" width="200"></el-table-column>
            <el-table-column label='手机号' prop="mobile" align="center" width="200"></el-table-column>
            <el-table-column label='电话' prop="tel" align="center" width="200"></el-table-column>
            <el-table-column label='业务员' prop="salesManName" align="center" width="200"></el-table-column>
            <el-table-column label='所属地区'  align="center" width="200">
              <template slot-scope="scope">
                {{scope.row.province? scope.row.province+'省 ' :''}}
                {{scope.row.city ? scope.row.city+'市 ':''}}
                {{scope.row.region ? scope.row.region :''}}
                {{scope.row.addr ? scope.row.addr :''}}
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
        </div>
      </el-row>
      <template>
        <!-- 新建产品 -->
        <AddStencil  v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" :selectCustomerGreateType="selectCustomerGreateType" :selectlineCustomerData='selectlineCustomerData'/>
        <!-- 客户详情 -->
        <Detail v-if="showDetailDialog" @changeDialogStatus="changeDialogStatusWithDialog" :selectCustomerId="selectCustomerId" />
      </template>
      <!-- 添加线上客户 -->
      <el-dialog class="addlineCustomerDialog" title="添加线上客户"  :visible.sync="addCustomerDialogVisible" :close-on-click-modal="false" :before-close="closeDialog">
        <div class="slotDiv">
          <el-form :model="addFormData"  label-position="left" label-width="68px">
            <el-form-item label="客户邮箱" class="fromItem isRequired"  prop="customerEmail">
              <el-input @blur="validCustomerEmail(addFormData.customerEmail)"  placeholder="请输入已在微笑牙医注册的客户邮箱号" v-model="addFormData.customerEmail" ></el-input>
              <p class="errorNotice" v-if="customerEmailValid.status">{{ customerEmailValid.text }}</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button class="cancel" @click="closeDialog">取 消</el-button>
            <el-button :disabled="submitBtnDisabled" class="submit" type="primary" @click.native="selectOpenAddDialog(0,addFormData.customerEmail)" >下一步</el-button>
          </div>
        </div>
      </el-dialog>


	</div>
</template>

<script type="text/javascript">
    import Page from '../../../../components/Page/Page';
    import AddStencil from '../Add/Add';
    import Detail from '../Detail/Detail';
    export default {
        components: { Page,AddStencil, Detail },
    	data() {
                let statusObj = {
                  status: false,
                  text: ''
                };
			return {
                result: {},
                selectCustomerId: '',
                selectCustomerGreateType:'',
                goodsName: '',
                showAddDialog: false,
                showDetailDialog: false,
                customerEmailValid: statusObj,
                addCustomerDialogVisible: false,
                submitBtnDisabled:true,
                lineCustomerData:{},//线上客户数据
                addFormData:{
                  customerEmail:''
                },
                formData:{
                  type:'null',
                  name:''
                },
                // 模板类型
                options: [{
                  value: 'null',
                  label: '全部'
                }, {
                  value: '0',
                  label: '线上客户'
                }, {
                  value: '1',
                  label: '自有客户'
                }],
			}
		},
      mounted() {
        this.getCustomerList({
          row: 1,
          size:10,
          unitId:'66f7827b49104991b54e8bfc30877ffb',
          createType:this.formData.type,
          name:''
        });
        },
      computed: {
        canSubmit() {
          let flag = false;
          let name = this.addFormData.customerEmail && !this.customerEmailValid.status;
          if(name) {
            flag = true;
          }else {
            flag = false;
          };
          return flag;
        }
      },
      watch: {
        canSubmit(curVal,oldVal) {
          if(curVal) {
            this.submitBtnDisabled = false;
          }else {
            this.submitBtnDisabled = true;
          }
        }
      },
		 methods: {
          //请求线上客户数据，判断是否弹出线上客户弹框
       selectOpenAddDialog(type,email) {
         let lineData={
           "unitId":'14899c08d5ed45b8927a4551db9e4a44',
           "email":email
         };
         this.$api.post('/order/user/selectByEmail', 	lineData, res => {
           console.log(res.data);
           if(res.data == "" || res.data == null ){
             this.$message({
               message: res.msg,
               type: 'error',
               duration: 1000,
             });
           }else{
             this.lineCustomerData = res.data;
             this.addCustomerDialogVisible = false;
             this.openAddDialog(type,email);
           }
         }, res => {
           this.$message({
             message: res.msg,
             type: 'error',
             duration: 1000,
           });
         });
       },
      // 打开新建客户弹窗
      openAddDialog(type,email) {
        if(type == 0){
          this.selectCustomerGreateType = 0;  //新建线上客户
        }
        else if(type == 1){
          this.selectCustomerGreateType = 1; //新建自有客户
        }
        this.selectlineCustomerData =this.lineCustomerData;  //保存线上客户值
        // if(typeof type !== 'number') {
        //   this.selectCustomerId = '';
        // }
        this.showAddDialog = true;
      },
      changeDialogStatus(status) {
        if(!status){
          this.showAddDialog = false;
          this.getCustomerList({
            row: 1,
            size:10,
            unitId:'66f7827b49104991b54e8bfc30877ffb',
            createType:this.formData.type,
            name:''
          });
        }
      },
      //选择模板获取模板列表数据
      selectType(value){
        this.formData.type = value;
        this.getCustomerList({
          row: 1,
          size:10,
          unitId:'66f7827b49104991b54e8bfc30877ffb',
          createType:value,
          // createType:value == 0 ? '线上客户':(value == 1 ? '自有客户':''),
          name:'',
        });
      },
      //获取客户列表
      getCustomerList(data){
        this.$api.post('/order/user/selectAllTable', data, res => {
            this.result = res.data;
        });
      },
      // 点击分页
      pageChange(page) {
        this.getCustomerList({
          row: page,
          size:10,
          unitId:'66f7827b49104991b54e8bfc30877ffb',
          createType:this.formData.type,
          name:this.formData.name,
        });
      },
      //点击搜索获取客户列表
      search() {
        this.getCustomerList({
          row: 1,
          size:10,
          unitId:'66f7827b49104991b54e8bfc30877ffb',
          createType:this.formData.type,
          // createType:value == 0 ? '线上客户':(value == 1 ? '自有客户':''),
          name:this.formData.name,
        });
      },
        // 打开关闭弹窗--入参弹窗名字
        changeDialogStatusWithDialog(status, name) {
            this[name] = status;
        },
        // 显示客户详情
        showDetail(data) {
            this.changeDialogStatusWithDialog(true, 'showDetailDialog');
            this.selectCustomerId = data.clinic_id;
        },
        // 校验邮箱
      validCustomerEmail(value) {
          if(value) {
            var regEmail=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!regEmail.test(value)){
              this.customerEmailValid = {
                status: true,
                text: '邮箱格式错误'
              }
            }else{
              this.customerEmailValid = {
                status: false,
                text: ''
              }
            }
          }else{
            this.customerEmailValid = {
              status: true,
              text: '客户邮箱不能为空'
            }
          }
        },
       closeDialog(){
        this.addCustomerDialogVisible = false;
         this.customerEmailValid = {
           status: false,
           text: ''
         };
         this.addFormData.customerEmail=''
       }
		},
    }
</script>

<style type="text/css" lang="less">
	@import url('./List.less');
</style>
