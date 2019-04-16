<template>
  <div class="process">
    <div class="tab-top">
      <el-row>
        <el-col :span="12">订单编号<span>{{orderDetaliList.number}}</span></el-col>
        <el-col :span="12">&nbsp&nbsp&nbsp&nbsp&nbsp 盒号<span>{{orderDetaliList.box_no}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">客户名称<span>{{orderDetaliList.clinic_name}}</span></el-col>
        <el-col :span="12">医生姓名<span>{{orderDetaliList.doctor_name}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">患者姓名<span>{{orderDetaliList.patient}}</span></el-col>
        <el-col :span="12">&nbsp&nbsp&nbsp&nbsp&nbsp 试戴<span >
          {{orderDetaliList.require_type == '0' ? '试冠': orderDetaliList.require_type  == '1' ? '试瓷': orderDetaliList.require_type  == '2' ? '蜡牙': orderDetaliList.require_type  == '3' ? '试架': orderDetaliList.require_type  == '4' ? '试额':' '}}
        </span></el-col>
      </el-row>
    </div>
    <el-table class="table2 table1" :data="orderDetaliList.orderProduct" style="width: 100%" height="147">
      <el-table-column  align="center" label="产品条码" width="180" class="productCode" >
        <template slot-scope="scope" >
          <div class="demo">
            <barcode :value="scope.row.order_product_code" :options="barcode" tag="svg" ></barcode>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" align="center" label="产品名称" width="180">
      </el-table-column>
      <el-table-column prop="pos" align="center" label="牙位">
        <template slot-scope="scope">
          <span v-html="anysisProduceTooth(scope.row.pos)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="colorimetric" align="center" label="比色">
      </el-table-column>
      <el-table-column prop="num" align="center" label="数量">
      </el-table-column>
    </el-table>
    <el-table class="table2" :data="productDetaliList" style="width: 100%"   height="142px">
      <el-table-column prop="procedureName" align="center" label="工序" width="80">
      </el-table-column>
      <el-table-column prop="userName" align="center" label="生产人员" width="80">
      </el-table-column>
      <el-table-column  align="center" label="状态" width="80">
        <template slot-scope="scope">
          {{scope.row.status == 0 ? '待开工':'已完工'}}
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" align="center" label="加工产品" width="120">
      </el-table-column>
      <el-table-column prop="startTime" align="center" label="开工时间" width="120">
      </el-table-column>
      <el-table-column prop="endTime" align="center" label="完成时间" width="120">
      </el-table-column>
      <el-table-column   align="center" label="使用物料">
        <template slot-scope="scope">
          {{materialListCont}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="使用设备" >
        <template slot-scope="scope">
          {{devListCont}}
        </template>
      </el-table-column>
    </el-table>
    <h2 class="title">过程检验记录</h2>
    <div class="tab-top1">
      <el-row>
        <el-col :span="6">质检人员：<span>{{qualityUserName}}</span></el-col>
        <el-col :span="6">使用设备：<span>{{ruleForm.facility}}</span></el-col>
        <el-col :span="6">质检结果：<span>{{showRework == false ? '合格':'不合格'}}</span></el-col>
        <el-col :span="6">质检时间：<span>{{qualityTime}}</span></el-col>
      </el-row>
    </div>
    <el-table class="table2" :data="productionRecordliList"  style="width: 100%"   height="210px">
      <el-table-column prop="sortNo" align="center" label="编号" width="120">
      </el-table-column>
      <el-table-column prop="itemName" align="center" label="检验项目" width="120">
      </el-table-column>
      <el-table-column prop="standard" align="center" label="标准" >

      </el-table-column>
      <el-table-column  align="center" label="结果">
        <template slot-scope="scope" >
          <el-radio v-model="scope.row.result" label="0">合格</el-radio>
          <el-radio v-model="scope.row.result" label="1">不合格</el-radio>
        </template>
      </el-table-column>
    </el-table>

    <!--底部表单-->
    <div class="bottom-sub">
      <div class="left-input">
        <el-form :model="ruleForm"   ref="ruleForm" class="form">
          <el-form-item  label="订单条码" class="isRequired">
            <el-input
              placeholder="请输入订单编号"
              ref="code"
              maxlength="10"
              @blur="validateCode(ruleForm.code)" @keyup.enter.native="enterInput('code')"
              v-model="ruleForm.code">
            </el-input>
            <p class="errorText" v-if="codeIsValid.status">{{ codeIsValid.text }}</p>
          </el-form-item>
          <el-form-item  label="加工产品" class="isRequired">
            <el-select
              :disabled="canInputProduct"
              v-model="ruleForm.product"
              placeholder="请选择加工产品"
              @change="selectProduct"
            >
              <el-option :key="index" v-for="(item,index) in orderDetaliList.orderProduct" :label="item.goods_name" :value="item.product_id"></el-option>
            </el-select>
            <p class="errorText" v-if="productIsValid.status">{{ productIsValid.text }}</p>
          </el-form-item>
          <el-form-item prop="process" label="检验工序" class="isRequired">
            <el-input
              placeholder="请输入检验工序"
              ref="process"
              @blur="validateProcess(ruleForm.process)" @keyup.enter.native="enterInput('process')"
              v-model="ruleForm.process"
              :disabled="canInputProcess"
            >
            </el-input>
            <p class="errorText" v-if="processIsValid.status">{{ processIsValid.text }}</p>
            <!--<el-select-->
            <!--v-model="ruleForm.process"-->
            <!--placeholder="请选择检验工序"-->
            <!--:disabled="canInputProcess"-->
            <!--@focus="getProcessData"-->
            <!--&gt;-->
            <!--<el-option :key="item.id" v-for="item in checkOutDate" :label="item.name" :value="item.id"></el-option>-->
            <!--</el-select>-->
            <!--<p class="errorText" v-if="processIsValid.status">{{ processIsValid.text }}</p>-->
          </el-form-item>
          <el-form-item  label="返工工序" class="isRequired" v-if="showRework">
            <el-select
              v-model="ruleForm.rework"
              placeholder="请选择返工工序"
              @focus="getReturnWorkData"
            >
              <el-option :key="item.id" v-for="item in allReworkIds" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <p class="errorText" v-if="reworkIsValid.status">{{ reworkIsValid.text }}</p>
          </el-form-item>
          <div>
            <el-form-item  label="质检人员" class="isRequired">
              <el-input  placeholder="请输入员工编号"
                         ref="qualityUser"
                         @blur="validateQualityUser(ruleForm.qualityUser)" @keyup.enter.native="enterInput('qualityUser')"
                         v-model="ruleForm.qualityUser"></el-input>
              <p class="errorText" v-if="qualityUserIsValid.status">{{ qualityUserIsValid.text }}</p>
            </el-form-item>
            <el-form-item prop="facility" label="使用设备" ref="facility">
              <el-autocomplete
                class="inline-input"
                ref="facility"
                @focus="foucsFacility"
                @select="selectFacility"
                placeholder="请输入使用设备"
                :disabled="canInputFacility"
                v-model="ruleForm.facility"
                :fetch-suggestions="querySearchFacility"
                :trigger-on-focus="false"
              ></el-autocomplete>
              <p class="errorText" v-if="facilityIsValid.status">{{ facilityIsValid.text }}</p>
            </el-form-item>
            <el-form-item prop="remark" label="备注" class="remark" >
              <el-input type="textarea" maxlength="500" placeholder="请输入备注" v-model="ruleForm.remark"></el-input>
            </el-form-item>
            <div class="right-btn">
              <div class="bar-code">
                <el-button class="submit" :disabled="submitBtnDisabled" type="primary" @click.native="submit">
                  <barcode value="submit" :options="barcode_option" tag="svg" ></barcode>
                </el-button>
              </div>

            </div>
          </div>

        </el-form>
      </div>
    </div>
  </div>

</template>

<script type="text/javascript">
  export default {
    data() {
      let statusObj = {
        status: false,
        text: ''
      };
      return {
        barcode:{
          format: "CODE128",//选择要使用的条形码类型
          displayValue: true,//是否在条形码下方显示文字
          textPosition: "bottom",//设置文本的垂直位置
          width:1,//设置条之间的宽度
          height:30,//高度
          fontSize: '14px' //字体大小
        },
        barcode_option:{
          format: "CODE128",//选择要使用的条形码类型
          text: '扫码或点击确认',
          displayValue: true,//是否在条形码下方显示文字
          textPosition: "bottom",//设置文本的垂直位置
          width:1,//设置条之间的宽度
          height:30,//高度
          background: '#fff', //条形码背景颜色
          fontSize: '14px' //字体大小
        },
        ruleForm: {
          qualityUser: '', //质检人员
          code: '', //订单条码
          product: '', //加工产品
          rework:'',//返工工序
          process:'',//检验工序
          facility:'' ,//使用设备,
          remark:'' //备注
        },
        // 校验
        qualityUserIsValid: statusObj,
        codeIsValid: statusObj,
        productIsValid: statusObj,
        processIsValid: statusObj,
        reworkIsValid: statusObj,
        facilityIsValid: statusObj,
        qualityUserName:'',
        canInputProduct: true, //是否禁用加工产品输入框
        canInputProcess: true, //是否禁用检验工序
        canInputFacility: true, //是否禁用使用设备
        allReworkIds: null, //所有返工工序
        reworkIdList: [],   //所有返工工序含有id和name
        allProcessIds: null, //所有检验工序
        processIdList: [],   //所有检验工序含有id和name
        allProductIds: null, //所有加工产品
        productIdList: [],   //所有加工产品含有id和name
        allFacilityIds: null, //所有设备
        facilityIdList: [],   //所有设备含有id和name
        orderDetaliList:{    //订单详情数据
          number:'',//订单编号
          box_no:'', //盒号
          clinic_name:'',//客户名称
          doctor_name:'',//医生姓名
          patient:'',//患者姓名
          require_type:'',//试戴  0-试冠 1-试瓷 2-蜡牙 3-试架 4-试额
          orderProduct:[]
        },
        productDetaliList: [],//工序列表详情数据
        qualityUserDetaliList:[],//质检人员数据
        qualityUserNameId:{
          name:'',
          id:''
        },//质检人员编号转成name和id
        goodProcessArr:[],//检验工序数据
        productionRecordliList:[],//过程检验记录数据
        processDataList:[],//检验工序模板
        materialList:[],//所有物料
        materialListCont:'',//所有物料
        devListCont:'',//所有设备
        checkOutDate:{
          id:''
        },//检验工序数据
        showRework: false,
        returnWorkData: [],
        processId:'',
        productionRecordItems:[],
        submitBtnDisabled:true,
        qualityTime:''//获取质检提交时间
      }
    },
    computed: {
      countTotal: function () {
        let total = 0;
        this.productionRecordliList.forEach(function (item) {
          total += Number(item.result);
        });
        return total
      },
      canSubmit() {
        let flag = false;
        let qualityUser = this.ruleForm.qualityUser && !this.qualityUserIsValid.status;
        let code = this.ruleForm.code && !this.codeIsValid.status;
        let product = this.ruleForm.product && !this.productIsValid.status;
        let process = this.ruleForm.process && !this.processIsValid.status;
        let rework = true;
        if(this.showRework == true){
          if(this.ruleForm.rework && !this.reworkIsValid.status){
            rework = true;
          }else{
            rework = false;
          }
        }else{
          rework = true;
        }
        if(qualityUser && code && product && process && rework) {
          flag = true;
        }else {
          flag = false;
        };
        return flag;
      }
    },
    watch: {
      countTotal(cur, old) {
        this.showRework = cur > 0;
      },
      canSubmit(curVal,oldVal) {
        if(curVal) {
          this.submitBtnDisabled = false;
        }else {
          this.submitBtnDisabled = true;
        }
      }
    },
    mounted() {
      //扫码输入
      let code = "";
      let lastTime = null;
      let nextTime = null;
      let lastCode = null;
      let nextCode = null;
      let _this = this;
      document.onkeypress = function(e) {
        nextCode = e.which;
        nextTime = new Date().getTime();
        if(lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
          code += String.fromCharCode(lastCode);
        } else if(lastCode != null && lastTime != null && nextTime - lastTime > 100){
          code = "";
        }
        lastCode = nextCode;
        lastTime = nextTime;
        if(e.which == 13){
          if(code.toUpperCase().indexOf('ON') !== -1){ //判断扫描订单
            _this.ruleForm.code = code;
            _this.validateCode(code);
            // _this.enterInput("code");
          }else if(code.toUpperCase().indexOf('ID') !== -1){ //判断扫描生产人员
            _this.ruleForm.qualityUser = code;
            _this.validateQualityUser(code);
            // _this.enterInput("qualityUser");
          }else if(code.toLowerCase().indexOf('pn') !== -1){ //判断扫描产品
            _this.selectProducts(code);
          }
          else if(code.toUpperCase().indexOf('SUBMIT') !== -1){  //判断提交按钮
            _this.submit();
          }
          return false;
        }
      };

    },
    methods: {
      selectFacility(value) {
        this.devUseInfo = [];
        this.devUseInfo.push({
          devId: value.id,
          devName: value.value
        });
      },
      getIdByList(value, list) {
        let id = null;
        list.map((item, index) => {
          if(value == item.goods_name){
            id = item.product_id;
          }
        });
        return id;
      },
      getOrderIdByList(value, list) {
        let name = null;
        list.map((item, index) => {
          if(value == item.product_id){
            name = item.goods_name;
          }
        });
        return name;
      },
      createFilter(queryString) {
        return (res) => {
          return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //获取检验工序数据
      checkoutData (orderId,productId,cb){
        let  checkoutId="";
        this.$api.post('/proceduce/keyByOrderIdAndGoodsId',
          {
            "orderId":orderId,
            "goodsId":productId
          }, res => {
            if(res.data == null || res.data == ""){
              this.$message({
                message: '暂无最新完成工序！',
                type: 'error',
                duration: 1000
              });
              return false
            }else{
              this.checkOutDate = res.data;
              checkoutId = res.data.id;
              this.processId= res.data.id;
              this.ruleForm.process = res.data.name;
            }
            cb && cb(checkoutId);
            return checkoutId;
          },res =>{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          });
      },
      //获取工序列表数据
      productionData (procedureId,orderId,productId){
        this.materialListCont='';
        this.devListCont='';
        this.$api.post('/record/process/complete',
          { "procedureId":procedureId,
            "orderId":orderId,
            "goodsId":productId
          }, res => {
          if(res.data.length > 0){
            this.productDetaliList = res.data;
            this.material=res.data[0].material;
            this.dev=res.data[0].dev;
            if(res.data[0].material){
              let jsonObj =  JSON.parse(res.data[0].material);
              let jsonArr = [];
              for(let i = 0 ;i < jsonObj.length;i++){
                jsonArr[i] = jsonObj[i];
              }
              this.materialList = jsonArr;
              for(let a = 0;a < this.materialList.length;a++){
                this.materialListCont += this.materialList[a].tracebackCode+'/'+this.materialList[a].materialName+' ';
              }
            }
            if(res.data[0].dev){
              let jsonObjs =  JSON.parse(res.data[0].dev);
              let jsonArrs = [];
              for(let i = 0 ;i < jsonObjs.length;i++){
                jsonArrs[i] = jsonObjs[i];
              }
              for(let a = 0;a < jsonArrs.length;a++){
                this.devListCont += jsonArrs[a].devName+' ';
              }
            }
          }else{
            this.productDetaliList=[];
          }
          },res =>{
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          });
      },
      //获取过程检验记录数据
      productionRecordData (proceduceIds){
        this.$api.post('/qc/template/selectProcessQualityInspection', {"proceduceId":proceduceIds}, res => {
          if(res.data.length >0){
            this.productionRecordliList = [];
            res.data.map((item, index) => {
              this.productionRecordliList.push({
                id:item.id,
                sortNo: item.sortNo,
                itemName: item.itemName,
                standard: item.standard,
                result: '0'
              });
            });
          }else{
            this.productionRecordliList = [];
          }

          },res =>{
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          });
          });
      },
      validateQualityUser(value){  //blur和enter时校验质检人员
        if (value) {
          // TODO  发请求，校验状态
          this.$api.post('/factory/user/selectProduceMan', { userNo: this.ruleForm.qualityUser }, res => {
            if(res.data.length >0){
              this.qualityUserDetaliList = res.data;
              this.qualityUserIsValid = {
                status: false,
                text: ''
              };
              this.qualityUserNameId.name = this.qualityUserDetaliList[0].name;
              this.qualityUserNameId.id = this.qualityUserDetaliList[0].id;
              this.ruleForm.qualityUser = this.qualityUserNameId.name;
              this.qualityUserName = this.qualityUserDetaliList[0].name;
            }else{
              this.qualityUserIsValid = {
                status: true,
                text: '员工不存在'
              };
              this.qualityUserName='';
            }

          }, res => {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          });
        }else{
          this.qualityUserIsValid = {
            status: true,
            text: '员工编号不能为空'
          };
          this.qualityUserName = '';

        }
      },
      // -----enter触发------------------------------------
      enterInput(name) {
        this.$refs[name].blur();
      },
      validateCode(value){  //blur和enter时校验订单编码
        if (value) {
          this.productIsValid = {
            status: false,
            text: ''
          };
          // 查询订单详情
          this.$api.post('/factory/order/find', { number: this.ruleForm.code }, res => {
            if(res.data != "" || res.data != null){
              this.orderDetaliList = res.data;
              this.orderDetaliList.orderProduct = res.data.orderProduct;
              if(res.data.orderProduct!=null){
                this.codeIsValid = {
                  status: false,
                  text: ''
                };
                this.checkoutData(this.orderDetaliList.id,this.orderDetaliList.orderProduct[0].product_id,checkoutId => {
                  if(checkoutId !=''){
                    this.productionData(checkoutId,this.orderDetaliList.id,this.orderDetaliList.orderProduct[0].product_id);
                    this.productionRecordData(checkoutId);
                  }
                });
                this.ruleForm.product=this.orderDetaliList.orderProduct[0].goods_name;
              }
              this.canInputProduct = false;
              this.canInputProcess = false;
            }else{
              this.codeIsValid = {
                status: true,
                text: '订单不存在'
              };
            }
          }, res => {
            this.codeIsValid = {
              status: true,
              text: '订单不存在'
            };

          });
        }else{
          this.codeIsValid = {
            status: true,
            text: '订单编号不能为空'
          };
        }
      },
      //校验检验工序
      validateProcess(value){
        if(value){
          this.processIsValid = {
            status: false,
            text: ''
          };
        }else{
          this.processIsValid = {
            status: true,
            text: '检验工序不能为空'
          };
        }
      },
      // 选择加工产品
      selectProduct(value) {
        this.ruleForm.product=this.getOrderIdByList(value, this.orderDetaliList.orderProduct);
        this.checkoutData(this.orderDetaliList.id,value,checkoutId => {
          if(checkoutId !=''){
            this.productionData(checkoutId,this.orderDetaliList.id,value);
            this.productionRecordData(checkoutId);
          }else{
            this.canInputProcess = true;
          }

        });
      },
      // 解析产品牙位
      anysisProduceTooth(produceMsg) {
        return this.$tool.anysisProduceTooth(produceMsg);
      },
      // //获取检验工序
      // getProcessData(value){  //blur和enter时校验检验工序
      //   if(value){
      //     let id=this.ruleForm.product;
      //     this.checkoutData(this.orderDetaliList.id,id,checkoutId => {
      //       if(checkoutId !=''){
      //         this.productionData(checkoutId,this.orderDetaliList.id,id);
      //         this.productionRecordData(checkoutId);
      //       }else{
      //         this.canInputProcess = true;
      //       }
      //
      //     });
      //   }else{
      //     this.canInputProcess = true;
      //   }
      //
      // },
      // 获取返工工序
      getReturnWorkData() {
        let arr = [];
        this.$api.post('/proceduce/byOrderIdAndGoodsId', { orderId: this.orderDetaliList.id,goodsId:this.ruleForm.product}, res => {
          if(res.data !=='' || res.data !==null){
            this.allReworkIds = res.data;
          }else{
            this.allReworkIds = '';
          }
        });
      },
      // -----模糊查询--------------------------------------
      // 获取使用设备数据
      foucsFacility() {
        this.facilityIds = [
          { value: '测试设备1', id: '1' },
          { value: '测试设备2', id: '2' }
        ];
      },
      // 查询消毒设备
      querySearchFacility(queryString, cb) {
        let facilityIds = this.facilityIds;
        let results = queryString ? facilityIds.filter(this.createFilter(queryString)) : facilityIds;
        if(results.length > 0) {
          this.facilityIsValid = {
            status: false,
            text: ''
          }
        }else {
          this.facilityIsValid = {
            status: true,
            text: '该设备不存在'
          }
        }
        cb(results);
      },
      createFilter(queryString) {
        return (res) => {
          return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      getProcessItems(){
        let arr = [];
        this.productionRecordliList.map((item, index) => {
          arr.push({
            "id":item.id,
            "isAllowed":item.result,
            "isAllowedName":item.result==0 ? '合格' :'不合格',
            "name": item.itemName,
            "standard": item.standard,
          });
        });
        return arr;
      },
      //扫码匹配产品名称
      selectProducts(code){
        this.$api.post('/factory/order/find', { number: this.ruleForm.code }, res => {
          if(res.data!='' ||  res.data!=null){
            this.productIsValid = {
              status: false,
              text: ''
            };
            this.orderDetaliList = res.data;
            let id = '';
            if(res.data.orderProduct.length > 0){
              res.data.orderProduct.map((item, index) => {
                if(code == item.order_product_code){
                  id = item.product_id;
                  this.ruleForm.product = item.goods_name;
                  this.checkoutData(this.orderDetaliList.id,id,checkoutId => {
                    if(checkoutId !=''){
                      this.productionData(checkoutId,this.orderDetaliList.id,id);
                      this.productionRecordData(checkoutId);
                    }else{
                      this.canInputProcess = true;
                    }

                  });
                }
              });
            }
          }
        },res =>{
          this.productIsValid = {
            status: true,
            text: '产品不存在'
          };
          this.ruleForm.product = '';
        });
      },
      //获取当前年月日时分秒
      getNowFormatDate(){
        let date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        let currentTime = this.year + "-" + this.month + "-" + this.date + "  " + this.hour + ":" + this.minute + ":" + this.second;
        return currentTime;
      },

      //提交
      submit() {
        console.log(this.ruleForm.product)
        console.log(this.orderDetaliList.orderProduct)
        let canSubmit = this.canSubmit;
        if(canSubmit) {
          this.$api.post('/process/quality/inspection', {
            "devJson": "",
            "item": this.getProcessItems(),
            "orderId": this.orderDetaliList.id,
            "processId": this.processId,
            "productId": this.getIdByList(this.ruleForm.product, this.orderDetaliList.orderProduct),
            "qualityInspectorId": this.qualityUserNameId.id,
            "remarks": this.ruleForm.remark,
            "reworkProcess": this.ruleForm.rework
          }, res => {
            this.qualityTime = this.getNowFormatDate();
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
            this.ruleForm = {
              product: '',
              code: '',
              process: '',
              rework: '',
              facility: '',
              remark: ''
            }
          }, res => {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000
            });
          });
        }
      },





    },
  }
</script>

<style lang="less">
  @import url('./Process.less');
</style>
