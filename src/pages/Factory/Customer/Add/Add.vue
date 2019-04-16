<template>
	<div>
		<Dialog className="addSelfCustomer" :title=customerTitle @closeDialog="closeDialog">
      <div class="slotDiv">
        <el-form :model="addFormData" label-position="left" label-width="90px" ref="addForm">
          <div class="baseInfo">
            <el-form-item label="客户名称" class="fromItem isRequired" prop="name">
              <el-input @blur="validName(addFormData.name)" :maxlength="16" placeholder="请输入客户名称" v-model="addFormData.name"></el-input>
              <p class="errorNotice" v-if="nameValid.status">{{ nameValid.text }}</p>
            </el-form-item>
            <el-form-item label="客户简称" class="fromItem" prop="mononyme">
              <el-input  :maxlength="10" placeholder="请输入客户简称" v-model="addFormData.mononyme" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" class="fromItem" prop="telphone">
              <el-input @blur="validTelphone(addFormData.telphone)"  placeholder="请输入手机号" v-model="addFormData.telphone" auto-complete="off"></el-input>
              <p class="errorNotice" v-if="telphoneValid.status">{{ telphoneValid.text }}</p>
            </el-form-item>
            <el-form-item
              label="业务员"
              class="fromItem isRequired"
              ref="salesman"
              prop="salesman">
              <el-autocomplete
                class="inline-input"
                ref="salesman"
                :maxlength="16"
                @select="selectSalesMan"
                @focus="getAllSalesmanData"
                @blur="validSalesman(addFormData.salesman)"
                placeholder="请选择业务员"
                v-model="addFormData.salesman"
                :fetch-suggestions="querySearchSalesMan"
                :trigger-on-focus="false"
              ></el-autocomplete>
              <p class="errorNotice" v-if="salesmanValid.status">{{ salesmanValid.text }}</p>
            </el-form-item>

            <el-form-item label="联系人" class="fromItem" prop="linkman">
              <el-input @blur="validLinkman(addFormData.linkman)" :maxlength="16" placeholder="请输入联系人姓名" v-model="addFormData.linkman"></el-input>
              <p class="errorNotice" v-if="linkmanValid.status">{{ linkmanValid.text }}</p>
            </el-form-item>
            <el-form-item label="电话" class="fromItem" prop="phone">
              <el-input @blur="validPhone(addFormData.phone)"  placeholder="请输入联系电话" v-model="addFormData.phone"></el-input>
              <p class="errorNotice" v-if="phoneValid.status">{{ phoneValid.text }}</p>
            </el-form-item>
            <el-form-item label="邮箱" class="fromItem" prop="email">
              <el-input @blur="validEmail(addFormData.email)"  placeholder="请输入邮箱" v-model="addFormData.email"></el-input>
              <p class="errorNotice" v-if="emailValid.status">{{ emailValid.text }}</p>
            </el-form-item>
            <el-form-item label="报价方案" class="fromItem" prop="project">
              <el-select @focus="geAllPriceScheme"  v-model="addFormData.project" placeholder="请选择报价方案">
                <el-option
                  v-for="(item,index) in priceSchemeList"
                  :key="item.index"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="el-item addressItem">
              <p class="el-label">地址</p>
              <div class="el-content">
                <p class="input">
                  <el-select v-model="prov" placeholder="省">
                    <el-option
                      v-for="(option, index) in citysDataArr"
                      :key="option.index"
                      :label="option.name"
                      :value="option.name">
                    </el-option>
                  </el-select>
                  <el-select v-model="city" placeholder="市">
                    <el-option
                      v-for="(option, index) in cityArr"
                      :key="option.index"
                      :label="option.name"
                      :value="option.name">
                    </el-option>
                  </el-select>
                  <el-select  v-model="district" placeholder="区">
                    <el-option
                      v-for="(option, index) in districtArr"
                      :key="option.index"
                      :label="option.name"
                      :value="option.name">
                    </el-option>
                  </el-select>
                  <el-input style="float: left; width: 700px;" maxlength="35" placeholder="请输入详细地址" v-model="addFormData.addr"></el-input>
                </p>
              </div>
            </div>
            <!--<el-form-item class="fromItem"></el-form-item>-->
            <el-form-item label="营业执照" class="fromItem isRequired" prop="license">
              <el-input @blur="validLicense(addFormData.license)"  placeholder="请输入营业执照注册证号" v-model="addFormData.license"></el-input>
              <p class="errorNotice" v-if="licenseValid.status">{{ licenseValid.text }}</p>
            </el-form-item>
            <el-form-item label="营业许可证" class="fromItem" prop="exequatur">
              <el-input @blur="validExequatur(addFormData.exequatur)"  placeholder="请输入医疗机构营业许可证号" v-model="addFormData.exequatur"></el-input>
              <p class="errorNotice" v-if="exequaturValid.status">{{ exequaturValid.text }}</p>
            </el-form-item>
            <el-form-item label="上传图片"  class="fromItem uploadImg" prop="fileList">
              <el-upload
                class="upload"
                :multiple="true"
                :limit="9"
                ref="upload"
                :on-success="uploadSuccess"
                :on-remove="removeImage"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.BMP"
                action="http://10.10.20.117:9090/file/upload"
                :file-list="fileList"
                list-type="picture"

              >
                <p></p>
                <el-button style="padding: 0" :disabled="uploadBtnDisabled">
                  <i class="" ><img  src="../../../../../static/images/icon/update.png"> </i>
                </el-button>
              </el-upload>
              <p class="errorNotice" v-if="exequaturValid.status">{{ exequaturValid.text }}</p>
            </el-form-item>
            <el-form-item class="fromItem"></el-form-item>
            <el-form-item label="备注" class="fromItem remarks" prop="remarks">
              <el-input :maxlength="80" type="textarea" :rows="3" resize="none" v-model="addFormData.remarks" auto-complete="off"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit">确 定</el-button>
          <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
        </div>
      </div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
  import citysData from '../../../../../static/json/citysData';
	import Dialog from '../../../../components/Dialog/Dialog';
	export default {
		props: [ 'changeDialogStatus', 'selectCustomerId', 'selectCustomerGreateType','selectlineCustomerData' ],
		components: { Dialog },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
        dialogImageUrl: '',
        dialogVisible: false,//添加图片
        citysDataArr: [],
        prov: '四川',
        city: '',
        district: '',
        cityArr: [],
        districtArr: [],
        fileList: [],
        addFormData: {
          "name": "",
          "mononyme":'',
          "telphone": "",
          "salesman": "",
          "linkman": "",
          "phone": "",
          "email":'',
          "project":'',
          "addr":'',
          "license":'',
          "exequatur":'',
          "path":'',
          "remarks": "",
        },
        salesmanList: [],
        allSalesManData:[],
        nameValid: statusObj,
        telphoneValid: statusObj,
        salesmanValid: statusObj,
        linkmanValid: statusObj,
        phoneValid: statusObj,
        emailValid: statusObj,
        licenseValid: statusObj,
        exequaturValid: statusObj,
        submitBtnDisabled: true,
        uploadBtnDisabled: false,//上传图片限制3张内
        customerTitle:'',//线上客户或自有客户名称
        priceSchemeList:[], //报价方案数据
        allSelectPriceScheme:[],
        lineData:{
          "id":'',
          "unitId":'',
          "factoryId":''
        }
			}
		},
    computed: {
      canSubmit() {
        let flag = false;
        let name = this.addFormData.name && !this.nameValid.status;
        let telphone = !this.telphoneValid.status;
        let salesman = this.addFormData.salesman && !this.salesmanValid.status;
        let linkman = !this.linkmanValid.status;
        let phone = !this.phoneValid.status;
        let email = !this.emailValid.status;
        let license = this.addFormData.license && !this.licenseValid.status;
        let exequatur = !this.exequaturValid.status;
        if(name && telphone && salesman && linkman && phone &&  email && license && exequatur) {
          flag = true;
        }else {
          flag = false;
        };
        return flag;
      }
    },
    beforeMount: function () {
      this.getCitysData();
      this.updateCity();
      this.updateDistrict();
      this.GetCustomerType();
    },
    watch: {
      canSubmit(curVal,oldVal) {
        if(curVal) {
          this.submitBtnDisabled = false;
        }else {
          this.submitBtnDisabled = true;
        }
      },
      prov: function () {
        this.updateCity();
        this.updateDistrict();
      },
      city: function () {
        this.updateDistrict();
      }
    },
    created() {
        //从客户详情拿到id，可用作编辑获取详情用
        // console.log(this.selectCustomerId)
    },
    methods: {
      getIdByList(value, list) {
        let id = null;
        list.map((item, index) => {
          if(value == item.value){
            id = item.id;
          }
        });
        return id;
      },
      closeDialog() {
        this.$emit('changeDialogStatus', false);
      },

      // 校验客户名称输入
      validName(value) {
        if(value) {
          if(value.length < 2) {
            this.nameValid = {
              status: true,
              text: '至少输入2个字符'
            }
          }else {
            this.nameValid = {
              status: false,
              text: ''
            }
          }
        }else {
          this.nameValid = {
            status: true,
            text: '客户名称不能为空'
          }
        }
      },
      // 手机号输入
      validTelphone(value) {
        if(value) {
          var regTel=/^1[3456789]\d{9}$/;
          if(!regTel.test(value)){
            this.telphoneValid = {
              status: true,
              text: '手机号格式错误'
            }
          }else{
            this.telphoneValid = {
              status: false,
              text: ''
            }
          }
        }
      },
      //校验业务员
      validSalesman(value) {
        if(value) {
          if(this.allSalesManData.length > 0) {
            for(let i = 0; i < this.allSalesManData.length; i++) {
              if(value != this.allSalesManData[i].name) {
                this.salesmanValid = {
                  status: true,
                  text: '该业务员不存在'
                }
              }else {
                this.salesmanValid = {
                  status: false,
                  text: ''
                }
                return;
              }
            }
          }else {
            this.salesmanValid = {
              status: true,
              text: '该业务员不存在'
            }
          }

        }else{
          this.salesmanValid = {
            status: true,
            text: '请选择业务员'
          }
        }
      },
      // 校验联系人
      validLinkman(value) {
        if(value) {
          if(value.length < 2) {
            this.linkmanValid = {
              status: true,
              text: '至少输入两个字符'
            }
          }else {
            this.linkmanValid = {
              status: false,
              text: ''
            }
          }
        }
      },
      //校验电话
      validPhone(value){
        if(value) {
          var regTel=/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{10,12}$/;
          if(!regTel.test(value)){
            this.phoneValid = {
              status: true,
              text: '联系电话格式错误'
            }
          }else{
            this.phoneValid = {
              status: false,
              text: ''
            }
          }
        }
      },
      // 校验邮箱
        validEmail(value) {
        if(value) {
          var regEmail=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if(!regEmail.test(value)){
            this.emailValid = {
              status: true,
              text: '邮箱格式错误'
            }
          }else{
            this.emailValid = {
              status: false,
              text: ''
            }
          }
        }
      },
      // 校验营业执照
      validLicense(value) {
        if(value) {
          if(value.length <10){
            this.licenseValid = {
              status: true,
              text: '营业执照注册证号格式错误'
            }
          }else if(value.length > 20){
            this.licenseValid = {
              status: true,
              text: '营业执照注册证号格式错误'
            }
          }else{
            this.licenseValid = {
              status: false,
              text: ''
            }
          }
        }else{
          this.licenseValid = {
            status: true,
            text: '营业执照不能为空'
          }
        }
      },
      // 校验营业许可证
      validExequatur(value) {
        if(value) {
          if(value.length >10){
            this.exequaturValid = {
              status: true,
              text: '营业许可证号格式错误'
            }
          }else{
            this.exequaturValid = {
              status: false,
              text: ''
            }
          }
        }
      },
      //获取报价方案
      geAllPriceScheme(){
        this.$api.post('/priceScheme/selectPriceScheme', {"clinicId":'',"unitId":'66f7827b49104991b54e8bfc30877ffb'}, res => {
          let arr = [];
          res.data.map((item, index) => {
            if(item!=null){
              arr.push({
                value: item.name,
                id: item.id
              })
            }
          });
          this.priceSchemeList = arr;
          console.log(this.priceSchemeList);
          this.allSelectPriceScheme = res.data;
        }, res => {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000,
          });
        });
      },
      // 聚焦业务员，获取业务员数据
      getAllSalesmanData() {
        this.$api.post('/factory/user/selectSalesmans', null, res => {
          let arr = [];
          res.data.map((item, index) => {
            arr.push({
              value: item.name,
              id: item.id
            })
          });
          this.salesmanList = arr;
          this.allSalesManData = res.data;
        }, res => {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          });
        });
      },
      // 选择业务员
      selectSalesMan(data) {
        if(data) {
          this.salesmanValid = {
            status: false,
            text: ''
          }
        }
      },
      // ---------------------模糊查询------------------
      // 模糊查询封装
      querySearch(list, queryString, cb, noResultsCb) {
        let arr = this[list];
        let results = queryString ? arr.filter(this.createFilter(queryString)) : arr;
        noResultsCb && noResultsCb(results);
        cb(results);
      },
      createFilter(queryString) {
        return (res) => {
          return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      // 业务员模糊查询
      querySearchSalesMan(queryString, cb) {
        this.querySearch('salesmanList', queryString, cb);
      },

      // 图片上传成功
      uploadSuccess(response, file, fileList) {
        if(fileList.length<4){
          if(fileList.length==3){
            this.uploadBtnDisabled = true
          }
          if(response.status == 200) {
            this.getImgUrl(fileList);
          }
        }
      },
      // 移除图片
      removeImage(file, fileList) {
        this.$api.post('/file/delete', {id: file.response.data[0].id}, res => {
          this.getImgUrl(fileList);
        }, res => {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000,
          });
        });
      },
      // 解析图片url arr
      getImgUrl(list) {
        let arr = [];
        list.map((item, index) => {
          if(item.response && item.response.data.length > 0) {
            arr.push(item.response.data[0].path);
          }
        });
          this.addFormData.path = JSON.stringify(arr);
      },
      // 导入城市数据
      getCitysData() {
        this.citysDataArr = citysData.data;
      },
      updateCity: function () {
        for (var i in this.citysDataArr) {
          var obj = this.citysDataArr[i];
          if (obj.name == this.prov) {
            this.cityArr = obj.sub;
            break;
          }
        }
        this.city = this.cityArr.length > 0 ? this.cityArr[1].name : '';
      },
      updateDistrict: function () {
        for (var i in this.cityArr) {
          var obj = this.cityArr[i];
          if (obj.name == this.city) {
            this.districtArr = obj.sub;
            break;
          }
        }
        if(this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
          this.district = this.districtArr[1].name;
        } else {
          this.district = '';
        }
      },
      //判断是否是线上和自有客户
      GetCustomerType(){
        if(this.selectCustomerGreateType == 0){
          this.customerTitle = '添加线上客户';
          if(JSON.stringify(this.selectlineCustomerData) !== "{}"){
             this.addFormData.mononyme=this.selectlineCustomerData.abb,
             this.addFormData.addr=this.selectlineCustomerData.addr,
             this.city=this.selectlineCustomerData.city,
             this.addFormData.linkman=this.selectlineCustomerData.contacts,
             this.addFormData.email=this.selectlineCustomerData.email,
             this.addFormData.license=this.selectlineCustomerData.licenseRegnum,
             this.addFormData.exequatur=this.selectlineCustomerData.licenseCode,
             this.addFormData.telphone=this.selectlineCustomerData.mobile,
             this.addFormData.name=this.selectlineCustomerData.name,
             this.prov=this.selectlineCustomerData.province,
             this.addFormData.project=this.getIdByList(this.selectlineCustomerData.quoteType,this.priceSchemeList),
             this.district=this.selectlineCustomerData.region,
             this.addFormData.remarks=this.selectlineCustomerData.remark,
             this.addFormData.salesMan=this.getIdByList(this.selectlineCustomerData.salesMan,this.salesmanList),
             this.addFormData.phone=this.selectlineCustomerData.tel,
             this.addFormData.path=this.selectlineCustomerData.url
          }
        }
        else if(this.selectCustomerGreateType == 1){
          this.customerTitle = '添加自有客户'
        }
      },

      //提交添加自有客户
      submit() {
        let canSubmit = this.canSubmit;
        if(JSON.stringify(this.selectlineCustomerData) !== "{}"){
          this.lineData= {
            "id":this.selectlineCustomerData.id,
            "unitId":this.selectlineCustomerData.unitId,
            "factoryId":this.selectlineCustomerData.factoryId
          }
        }else{
          this.lineData= {
            "id":'',
            "unitId":'66f7827b49104991b54e8bfc30877ffb',
            "factoryId":''
          }
        }
        let customerForemData ={
            "abb": this.addFormData.mononyme,
            "addr": this.addFormData.addr,
            "city": this.city,
            "contacts": this.addFormData.linkman,
            "createType": this.selectCustomerGreateType,
            "email": this.addFormData.email,
            "factoryId": this.lineData.factoryId,
            "id": this.lineData.id,
            "licenseCode": this.addFormData.exequatur,
            "licenseRegnum": this.addFormData.license,
            "mobile": this.addFormData.telphone,
            "name": this.addFormData.name,
            "province": this.prov,
            "quoteType":this.addFormData.project,
            "region": this.district,
            "remark": this.addFormData.remarks,
            "salesMan":this.getIdByList(this.addFormData.salesman,this.salesmanList),
            "tel": this.addFormData.phone,
            "unitId": this.lineData.unitId,
            "url":this.addFormData.path
        };
        if(canSubmit){
          this.$api.post('/order/user/addClient', customerForemData, res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.$emit('changeDialogStatus', false);

              }
            })
          }, res => {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1000,
            });
          });

        }
      }
    }
	}
</script>

<style lang="less">
	@import url(./Add.less);
</style>
