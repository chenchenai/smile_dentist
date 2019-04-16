<template>
  <div class="production">
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
      <el-table-column align="center" label="产品条码" width="180" class="productCode" >
        <template slot-scope="scope">
          <barcode :value="scope.row.order_product_code" :options="barcode" tag="svg" ></barcode>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" align="center" label="产品名称" width="180"></el-table-column>
      <el-table-column prop="pos" align="center" label="牙位">
        <template slot-scope="scope">
          <span v-html="anysisProduceTooth(scope.row.pos)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="colorimetric" align="center" label="比色"></el-table-column>
      <el-table-column prop="num" align="center" label="数量"></el-table-column>
    </el-table>
    <h2 class="title">成品质检报告</h2>
    <div class="tab-top1">
      <el-row>
        <el-col :span="6">质检人员：<span>{{qualityUserName}}</span></el-col>
        <el-col :span="6">使用设备：<span></span></el-col>
        <el-col :span="6">质检结果：<span>{{showRework == false ? '合格':'不合格' }}</span></el-col>
        <el-col :span="6">质检时间：<span>{{qualityTime}}</span></el-col>
      </el-row>
    </div>
    <el-table class="table2" :data="goodProcessArr" style="width: 100%" height="350px">
      <el-table-column prop="sortNo" align="center" label="编号" width="120"></el-table-column>
      <el-table-column prop="qcItem" align="center" label="检验项目" width="120"></el-table-column>
      <el-table-column prop="qcStandard" align="center" label="标准" ></el-table-column>
      <el-table-column align="center" label="结果" >
        <template slot-scope="scope" >
          <el-radio v-model="scope.row.result" label="0">合格</el-radio>
          <el-radio v-model="scope.row.result" label="1">不合格</el-radio>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-sub">
      <div class="left-input">
        <el-form :model="ruleForm" ref="ruleForm" class="form">
          <el-form-item label="质检人员" class="isRequired">
            <el-input
              placeholder="请输入员工编号"
              ref="qualityUser"
              @blur="validateQualityUser(ruleForm.qualityUser)"
              @keyup.enter.native="enterInput('qualityUser')"
              v-model="ruleForm.qualityUser"
            ></el-input>
            <p class="errorNotice" v-if="qualityUserValid.status">{{ qualityUserValid.text }}</p>
          </el-form-item>
          <el-form-item label="订单条码" class="isRequired">
            <el-input
              placeholder="请输入订单编号"
              :maxlength="10"
              ref="code"
              :disabled="disabledCode"
              @blur="validateCode(ruleForm.code)"
              @keyup.enter.native="enterInput('code')"
              v-model="ruleForm.code">
            </el-input>
            <p class="errorNotice" v-if="codeValid.status">{{ codeValid.text }}</p>
          </el-form-item>
          <el-form-item label="加工产品" class="isRequired product miniSelect">
            <el-select
              v-model="ruleForm.product"
              placeholder="请选择加工产品"
              :disabled="disabledProduct"
              @change="selectProduct"
            >
              <el-option :key="index" v-for="(item,index) in orderDetaliList.orderProduct" :label="item.goods_name" :value="item.order_product_code"></el-option>
            </el-select>
            <p class="errorNotice" v-if="productValid.status">{{ productValid.text }}</p>
          </el-form-item>
          <el-form-item label="返工工序" class="isRequired miniSelect" v-if="showRework">
            <el-select
              v-model="ruleForm.returnProcId"
              placeholder="请选择返工工序"
              @focus="getReturnWorkData"
            >
              <el-option :key="item.id" v-for="item in returnWorkData" :label="item.procedure_name" :value="item.id"></el-option>
            </el-select>
            <p class="errorNotice" v-if="reworkValid.status">{{ reworkValid.text }}</p>
          </el-form-item>
          <el-form-item label="使用设备">
            <el-autocomplete
              class="inline-input"
              ref="facility"
              placeholder="请输入使用设备"
              @focus="foucsFacility"
              @select="selectFacility"
              :fetch-suggestions="querySearchFacility"
              v-model="ruleForm.facility"
              :trigger-on-focus="false"
            ></el-autocomplete>
            <p class="errorNotice" v-if="facilityValid.status">{{ facilityValid.text }}</p>
          </el-form-item>
          <el-form-item label="备注" class="remark" >
            <el-input type="textarea" :maxlength="500" placeholder="请输入备注" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-btn">
        <el-button class="submit" :disabled="submitBtnDisabled" type="primary" @click.native="submit">
          <barcode value="submit" :options="barcode_option" tag="svg" ></barcode>
        </el-button>
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
        orderDetaliList:{    //订单详情数据
          number: '',//订单编号
          box_no: '', //盒号
          clinic_name: '',//客户名称
          doctor_name: '',//医生姓名
          patient: '',//患者姓名
          require_type: '',//试戴  0-试冠 1-试瓷 2-蜡牙 3-试架 4-试额
          orderProduct: []
        },
        ruleForm: {
          qualityUser: '', //质检人员
          code: '', //订单条码
          product: '', //加工产品
          returnProcId:'',//返工工序
          facility:'', //使用设备
          remark: '',
        },
        returnWorkData: [],
        devUseInfo: [],
        facilityData: [],
        qualityUserName: '',
        qualityUser: '',
        disabledCode: true,
        disabledProduct: true,
        showRework: false,
        goodProcessArr:[],
        // 校验
        qualityUserValid: statusObj,
        codeValid: statusObj,
        productValid: statusObj,
        reworkValid: statusObj,
        facilityValid: statusObj,
        submitBtnDisabled: true,
        qualityTime:''//质检时间
      }
    },
    computed: {
      countTotal: function () {
        let total = 0;
        this.goodProcessArr.forEach(function (item) {
          total += Number(item.result);
        });
        return total
      },
      canSubmit() {
        let flag = false;
        let qualityUser = this.ruleForm.qualityUser && !this.qualityUserValid.status;
        let code = this.ruleForm.code && !this.codeValid.status;
        let product = this.ruleForm.product && !this.productValid.status;
        let rework = true;
        if(this.showRework == true){
          if(this.ruleForm.returnProcId && !this.reworkValid.status){
            rework = true;
          }else{
            rework = false;
          }
        }else{
          rework = true;
        }
        if(qualityUser && code && product  && rework) {
          flag = true;
        }else {
          flag = false;
        };
        return flag;
      }
    },
    watch: {
      countTotal(cur, old) {
        this.showRework = cur > (this.goodProcessArr.length);
      },
      canSubmit(curVal,oldVal) {
        if(curVal) {
          this.submitBtnDisabled = false;
        }else {
          this.submitBtnDisabled = true;
        }
      }
    },
    created() {
      this.$nextTick(() => {
        // console.log(this.$refs.demo);
      })
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
      getIdByList(value, list) {
        let id = null;
        list.map((item, index) => {
          if(value == item.procedure_name){
            id = item.id;
          }
        });
        return id;
      },
      // -----校验-----------------------------------------
      // 校验订单条码
      validateCode(value) {
        if(value) {
          this.productValid = {
            status: false,
            text: ''
          };
          this.$api.post('/factory/order/find', { number: this.ruleForm.code }, res => {
            this.codeValid = {
              status: false,
              text: ''
            };
            this.orderDetaliList = res.data;
            this.ruleForm.product = this.orderDetaliList.orderProduct[0].goods_name;
            this.productCode = this.orderDetaliList.orderProduct[0].order_product_code;
            this.disabledProduct = false;
            // 生成质检报告
            this.$api.post('/qc/template/selectByGoodsId', { orderProductCode: this.orderDetaliList.orderProduct[0].order_product_code }, res => {
              this.goodProcessArr = [];
              res.data.qcTemplateItems.map((item, index) => {
                this.goodProcessArr.push({
                  sortNo: item.sortNo,
                  qcItem: item.qcItem,
                  qcStandard: item.qcStandard,
                  result: '0',
                  id: item.id
                });
              });
            });
            //请求返工数据
            this.$api.post('/proceduce/selectAllProceduceByCode', {orderProductCode: this.productCode}, res => {
              this.returnWorkData = res.data;
              this.ruleForm.returnProcId = res.data[0].procedure_name;
              this.ruleForm.returnProcId = this.getIdByList(this.ruleForm.returnProcId,res.data)

            });
          }, res => {
            this.codeValid = {
              status: true,
              text: '订单条码不存在'
            }
          });
        }else {
          this.codeValid = {
            status: true,
            text: '订单条码不能为空'
          }
        }
      },
      // 校验质检人员
      validateQualityUser(value) {
        if(value) {
          this.$api.post('/factory/user/selectProduceMan', { userNo: this.ruleForm.qualityUser }, res => {
            if(res.data.length > 0) {
              this.qualityUserValid = {
                status: false,
                text: ''
              };
              this.ruleForm.qualityUser = res.data[0].name;
              this.qualityUserName = res.data[0].name;
              this.qualityUser = res.data[0].userNo;
              this.disabledCode = false;
            }else {
              this.qualityUserValid = {
                status: true,
                text: '员工不存在'
              };
              this.qualityUserName = '';
            }
          });
        }else {
          this.qualityUserValid = {
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
      // -----模糊查询--------------------------------------
      // 获取使用设备数据
      foucsFacility() {
        this.facilityData = this.$tool.getDevIdData();
      },
      // 查询消毒设备
      querySearchFacility(queryString, cb) {
        let facilityData = this.facilityData;
        let results = queryString ? facilityData.filter(this.createFilter(queryString)) : facilityData;
        if(results.length > 0) {
          this.facilityValid = {
            status: false,
            text: ''
          }
        }else {
          this.facilityValid = {
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
      selectFacility(value) {
        this.devUseInfo = [];
        this.devUseInfo.push({
          devId: value.id,
          devName: value.value
        });
      },
      // 解析产品牙位
      anysisProduceTooth(produceMsg) {
        return this.$tool.anysisProduceTooth(produceMsg);
      },
      // 获取返工工序
      getReturnWorkData() {
        this.$api.post('/proceduce/selectAllProceduceByCode', {orderProductCode: this.productCode}, res => {
          this.returnWorkData = res.data;
        });
      },
      // 选择加工产品
      selectProduct(value) {
        // 生成质检报告
        this.$api.post('/qc/template/selectByGoodsId', { orderProductCode: value }, res => {
          this.goodProcessArr = [];
          res.data.qcTemplateItems.map((item, index) => {
            this.goodProcessArr.push({
              sortNo: item.sortNo,
              qcItem: item.qcItem,
              qcStandard: item.qcStandard,
              result: '1'
            });
          });
        });
      },
      //扫码匹配产品名称
      selectProducts(code){
        this.$api.post('/factory/order/find', { number: this.ruleForm.code }, res => {
          if(res.data!='' ||  res.data!=null){
            this.productValid = {
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
                  // 生成质检报告
                  this.$api.post('/qc/template/selectByGoodsId', { orderProductCode: id }, res => {
                    this.goodProcessArr = [];
                    res.data.qcTemplateItems.map((item, index) => {
                      this.goodProcessArr.push({
                        sortNo: item.sortNo,
                        qcItem: item.qcItem,
                        qcStandard: item.qcStandard,
                        result: '1'
                      });
                    });
                  });
                }
              });
            }
          }
        },res =>{
          this.productValid = {
            status: true,
            text: '产品不存在'
          };
          this.ruleForm.product = '';
        });
      },
      getNowFormatDate(){  //获取当前年月日时分秒
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
      submit() {
        let itemsData = [];
        let returnProcId='';
        this.goodProcessArr.map((item, index) => {
          itemsData.push({
            id: item.id,
            isAllowed:item.result,
            isAllowedName: item.result == '0' ? '合格' : '不合格',
            standard: item.qcStandard,
            name: item.qcItem
          });
        });
        if(this.showRework == false){
          returnProcId ='';
        }else{
          returnProcId = this.ruleForm.returnProcId
        }
        this.$api.post('/product/test/submit', {
          "devUseInfo": JSON.stringify(this.devUseInfo),
          "isqualified": this.showRework ? 0 : 1,
          "orderNumber": this.ruleForm.code,
          "orderProductCode": this.productCode,
          "remark": this.ruleForm.remark,
          "returnProcId": returnProcId,
          "userNo": this.qualityUser,
          "checkInfo": JSON.stringify(itemsData)
        }, res => {
          this.qualityTime=this.getNowFormatDate();
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000
          });
          this.ruleForm={
            code: '',
            product: '',
            returnProcId:'',
            facility:'',
            remark: '',
          }

        }, res => {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          });
        });
      },
    }
  }
</script>

<style type="text/css" lang="less">
  @import url('./Production.less');
</style>
