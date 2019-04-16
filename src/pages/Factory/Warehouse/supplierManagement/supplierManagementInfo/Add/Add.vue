<template>
    <div>
        <Dialog className="addSupplier" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="addFormData" :rules="formDataRules" label-position="left" label-width="100px" ref="addForm">
                    <div class="baseInfo">
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="供应商名称" class="fromItem isRequired" prop="name">
                                    <el-input  maxlength="20" placeholder="请输入供应商名称" v-model="addFormData.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="类型" class="fromItem isRequired supper_type" prop="supplierType">
                                    <div class="type_con">
                                        <p class="type_list" :class="{active_type_list:addFormData.supplierType===0 }" @click="selectFactory">生产厂家</p>
                                        <p class="type_list" :class="{active_type_list:addFormData.supplierType===1 }" @click="selectSupper">经销商</p>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="联系人" class="fromItem" prop="contacts">
                                    <el-input  v-model="addFormData.contacts" maxlength="16" placeholder="请输入联系人" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="手机号" class="fromItem widthFullInput" prop="mobile">
                                    <el-input maxlength="11" v-model="addFormData.mobile" placeholder="请输入手机号" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanThree">
                                <el-form-item label="电话" class="fromItem miniInput" prop="tel">
                                    <el-input placeholder="请输入电话号码" v-model="addFormData.tel"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="所属区域" class="fromItem miniInput selectAddress">
                                    <el-select v-model="prov"  @change="selectPro" placeholder="省">
                                        <el-option v-for="(option,index) in citysDataArr" :key="option.index" :label="option.name" :value="option.name">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="city"  placeholder="市">
                                        <el-option v-for="(option, index) in cityArr" :key="option.index" :label="option.name" :value="option.name">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="district"  placeholder="区" @change='selectRegion'>
                                        <el-option v-for="(option, index) in districtArr" :key="option.index" :label="option.name" :value="option.name">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>
                            <el-col :span="spanFour">
                                <el-form-item label="详细地址" class="fromItem widthFull" prop="addr">
                                    <el-input placeholder="请输入详细地址" v-model="addFormData.addr" maxlength="35"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="许可证号" class="fromItem" prop="licenceNum">
                                    <el-input placeholder="请输入许可证号址" v-model="addFormData.licenceNum" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanTwo">
                                <el-form-item label="有效期至" class="fromItem marginRight fromDate" prop="expipyDate">
                                    <el-date-picker class="fromDateInput" type="date" placeholder="选择日期" :clearable='false' v-model="addFormData.expipyDate" style="width: 100%;"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="到期提醒" class="fromItem remindDayBox" prop="remindDays">
                                    <el-switch v-model="ExpRemSwitch" @change="conExpRemSwitch()"></el-switch>
                                    <div class="remindDay" v-if="ExpRemSwitch">
                                        <el-input type="text" v-model="addFormData.remindDays" placeholder="" v-enterNumber></el-input>
                                        <span>天</span>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="上传图片" class="uploadImg" prop="fileList">
                                <el-upload class="upload" :multiple="true" :limit="9" ref="upload" :on-success="uploadSuccess" :on-remove="removeImage" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.BMP" :action="uploadUrl" :file-list="fileList" list-type="picture">
                                    <p></p>
                                </el-upload>
                            </el-form-item>
                        </el-row>
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="供应物料" class="fromItem" prop="">
                                    <p class="add" @click="openAddMaterialDialog">新建物料</p>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="material_tab" v-if="materialResult.length>0">
                            <ul class="material_tab_th">
                                <li v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                            </ul>
                            <div class="happyScroll_box" style="height:155px;width:100%;">
                                <happy-scroll color="#ffffff" size="4" resize style="min-height: 146px">
                                    <ul class="material_tab_td">
                                        <li v-for="(item,index) in materialResult" :key="index">
                                            <p>{{item.materieName}}</p>
                                            <p>{{item.materieCode}}</p>
                                            <p>{{item.spec}}</p>
                                            <p >{{item.typeName}}</p>
                                            <p>{{item.unitName}}</p>
                                            <p>{{item.registration}}</p>
                                            <p>{{item.manufacturer}}</p>
                                            <p>{{item.licenceCode}}</p>
                                            <p @click="deleteItem(index)"><img :src="delImgUerl" alt=""></p> 
                                        </li>
                                    </ul>
                                </happy-scroll>
                            </div>
                        </div>
                        <div v-else class="material_tab_nodata">
                            <img :src="noDataImgUerl" alt="">
                            <p class="noDataTip">暂时无物料展示…</p>
                        </div>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer" align="right">
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                    <el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit('addForm')">确 定</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import {mapState} from 'vuex'
    import citysData from '../../../../../../../static/json/citysData';
    import Dialog from "../../../../../../components/Dialog/Dialog";
    export default {
        props: ["changeDialogStatus", "titleType", 'selectProductId'],
        components: {
            Dialog
        },
        data() {
            const betweenInt = (max) => (rule, value, callback) => {
                const isBetween = value <= max;
                const isInt = /^[0-9]+$/.test(value);
                if(value){
                    if (isBetween && isInt){
                        return callback();
                    }else{
                        return callback(new Error(`最多提前${max}天提醒`));
                    }
                }else{
                    return callback();
                }
                
            };
            const validRepeatName = (rule, value, callback) => {
                if (value.length>2 && this.allDevName.length>0 && !this.selectProductId) {
                    let nameResult=this.allDevName.filter(item=>{
                                return value==item;
                            });
                    if(nameResult.length>0){
                        this.submitBtnDisabled=true;
                        callback(new Error('设备名称已存在'));
                    }else{
                        this.submitBtnDisabled=false;
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const validMobile=(rule, value, callback)=>{
                if(value.length!==11){
                    callback(new Error('请输入11位手机号码'));
                }else{
                    if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){ 
                        callback(new Error('手机号格式错误,请重新输入'));
                    } else{
                        callback();
                    }
                }
            }
            const validTel=(rule, value, callback)=>{
                if(!(/^0\d{2,3}-?\d{7,8}$/.test(value))){ 
                    callback(new Error('座机号格式错误,请重新输入'));
                } else{
                    callback();
                }
            };
            return {
                delImgUerl: require('../../../../../../../static/images/icon/del.png'),
                noDataImgUerl: require('../../../../../../../static/images/warehouse/material_nodata.png'),
                gutter: 20,
                /*行内item间距 */
                spanOne: 9,
                spanTwo: 8,
                spanThree: 7,
                spanFour: 15,
                addFormData: {
                    name: "",
                    /*供应商名称 */
                    supplierType: 0,
                    /*供应商类型 */
                    contacts: "",
                    /*联系人*/
                    mobile: "",
                    /*手机号 */
                    tel: "",
                    /*电话 */
                    province: "",
                    /*省份 */
                    city: "",
                    /*城市 */
                    region: "",
                    /*区县 */
                    addr: "",
                    /*详细地址 */
                    licenceNum: "",
                    /*许可证号 */
                    expipyDate: "",
                    /*有效期至 */
                    isRemind: 0,
                    /*到期提醒开关 */
                    remindDays: 0,
                    /*到期提醒多少天 */
                    path:''/*上传图片的地址*/
                    /* "id": "", ,编辑用供应商id */
                    /*registrationNum: "",注册证编号*/
                    /*flag: 0, 不清楚是哪个字段 */
                    /*"remark": "string",备注 */
                    /* "unitId": "string" 单位id */
                },
                ExpRemSwitch: false,
                materialTabTh: [
                    '物料名称',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '注册证编号',
                    '生产厂家',
                    '生产许可证编号',
                    '操作'
                ],
                materialResult: [],
                materialResultSubmit:[],/*转化后的物料数组,用于提交 */
                formDataRules:{
                    name: [
                        { required: true, message: '请输入供应商名称', trigger: 'change' },
                        { min: 2, max: 16, message: '长度在2-16个字符', trigger: 'change' },
                        { validator: validRepeatName, trigger: 'change' }
                    ],
                    contacts:[
                        { min:2, max: 16, message: '长度在2-16个字符', trigger: 'change' }
                    ],
                    addr:[
                        {  max: 35, message: '长度在35个字符以内', trigger: 'change' }
                    ],
                    mobile:[{ validator: validMobile, trigger: 'change' }],
                    tel:[{ validator: validTel, trigger: 'blur'}],
                    licenceNum:[
                        {  max: 50, message: '长度在50个字符以内', trigger: 'change' }
                    ],
                    remindDays:[{validator: betweenInt(15),trigger: 'change'}]
                },
                citysDataArr: [],
                prov: '',
                city: '',
                cityArr: [],
                district: '',
                /*区 */
                districtArr: [],
                allDevName:[],/*用于匹配是否有重复得到名字 */
                submitBtnDisabled: true,
                materielTotalData: [],
                inputCountingType: "",
                /******** */
                activeType: 1 /*供应商类别class*/ ,
                uploadUrl: '',
                /*上传图片地址 */
                fileList: [],
                /*上传图片list */
            };
        },
        directives:{
             /*只能输入正整数,首位不能是0*/
            enterNumber: {
                inserted: el => {
                    el.addEventListener("keypress", e => {
                        e = e || window.event;
                        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
                        let re = /\d/;
                        if ((!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) || (el.children[0].value.length === 0 && charcode === 48)) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                        }
                    });
                }
            },
        },
        watch:{
            addFormData:{
                handler(newVal,oldVal){
                    this.submitBtnDisabled=this.validAddFrom;
                },
                deep: true
            },
            /*添加物料数据变化 */
            addMaterialInfo(oldVal, newVal) {
                if (this.addMaterialInfo !== {}) {
                    this.materialResult.push(this.addMaterialInfo)
                }
            },
            prov() {
                this.updateCity();
                this.updateDistrict();
                this.addFormData.province = this.prov;
            },
            city() {
                this.updateDistrict();
                this.addFormData.city = this.city;
            }
        },
        computed: {
            ...mapState(['addMaterialInfo']),

            validAddFrom(){
                if(this.addFormData.name.length<2||this.addFormData.name.length>16||this.addFormData.contacts.length==1||this.addFormData.contacts.length>16||this.addFormData.addr.length>35||this.addFormData.licenceNum.length>50||Number(this.addFormData.remindDays)>15){
                    return true;
                }else{
                    return false;
                }
            },
        },
        created() {
            this.isEditSupplier();
            this.uploadUrl = this.$api.exportNewSysBaseUrl() + '/file/upload';
            this.getAllName();
        },
        beforeMount() {
            this.getCitysData();
            this.updateCity();
            this.updateDistrict();
        },
        methods: {
            selectPro() {
                console.log(this.addFormData.province)
            },
            selectRegion() {
                this.addFormData.region = this.district;
            },
            /*获取所有供应商名字 */
            getAllName(){
                this.$api.get('/supplier/selectSupplierName',{},res=>{
                    if(res.data.length>0){
                        this.allDevName=res.data;
                    }else{
                        this.allDevName=[];
                    }
                },res=>{})
            },
            /*检测是否为编辑供应商 */
            isEditSupplier(){
                if(this.selectProductId){
                    this.$api.post('/supplier/getSupplierById',{id:this.selectProductId},res=>{
                        if(res.data){
                            this.addFormData.name=res.data.name;
                            this.addFormData.supplierType=res.data.suppliertype;
                            this.addFormData.contacts=res.data.contacts;
                            this.addFormData.mobile=res.data.mobile;
                            this.addFormData.tel=res.data.tel;
                            this.prov=res.data.province;
                            this.city=res.data.city;
                            this.district=res.data.region;
                            this.addFormData.addr=res.data.addr;
                            this.addFormData.licenceNum=res.data.licencenum;
                            this.addFormData.expipyDate=res.data.expipydate;
                            this.addFormData.remindDays=res.data.reminddays;
                            this.ExpRemSwitch=res.data.isremind===0?false:true;
                            if(res.data.materiels.length>0){
                                this.materialResult=res.data.materiels.map(item=>{
                                    return{
                                        category:item.type,
                                        materieCode:item.material_no,
                                        licenceCode:item.licence_code,
                                        manufacturer:item.manufacturer,
                                        materieName:item.name,
                                        registration:item.registration_num,
                                        spec:item.spec,
                                        unitName:item.unitName,
                                        typeName:item.typeName,
                                        id:item.id
                                    }
                                })
                            }
                        }
                    },res=>{

                    })
                }
            },
            /*到期提醒开关 */
            conExpRemSwitch() {
                if (this.ExpRemSwitch === false) {
                    let errorTip=document.querySelector('.remindDayBox').children[1].children[2];
                    this.addFormData.isRemind = 0
                    if(errorTip){
                        errorTip.style.display='none';
                    }  
                } else {
                    let errorTip=document.querySelector('.remindDayBox').children[1].children[1];
                    this.addFormData.isRemind = 1;
                    if(errorTip){
                        errorTip.style.display='block';
                    }  
                }
            },
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showAddSupplierDialog");
                this.$emit("clearSelectProductId");
            },
            openAddMaterialDialog() {
                this.$emit("changeDialogStatus", true, "showAddMaterialDialog");
            },
            /*删除物料 */
            deleteItem(index) {
                this.materialResult.splice(index, 1)
            },
            /*************/
            /*选择生产厂家 */
            selectFactory() {
                if (this.addFormData.supplierType !== 0) {
                    this.addFormData.supplierType = 0;
                }
            },
            /*选择经销商 */
            selectSupper() {
                if (this.addFormData.supplierType !== 1) {
                    this.addFormData.supplierType = 1;
                }
            },
            /*省市区 */
            getCitysData() {
                this.citysDataArr = citysData.data;
            },
            updateCity: function() {
                for (var i in this.citysDataArr) {
                    var obj = this.citysDataArr[i];
                    if (obj.name == this.prov) {
                        this.cityArr = obj.sub;
                        break;
                    }
                }
                this.city = this.cityArr.length > 0 ? this.cityArr[1].name : '';
            },
            updateDistrict: function() {
                for (var i in this.cityArr) {
                    var obj = this.cityArr[i];
                    if (obj.name == this.city) {
                        this.districtArr = obj.sub;
                        break;
                    }
                }
                if (this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
                    this.district = this.districtArr[1].name;
                    this.addFormData.region = this.districtArr[1].name;
                } else {
                    this.district = '';
                    this.addFormData.region='';
                }
            },
            /*日期格式化*/
            timeFormat(val) {
                const time = new Date(val);
                const year = time.getFullYear();
                const month = time.getMonth()+1<10?'0'+Number(time.getMonth()+1):time.getMonth()+1;
                const date = time.getDate();
                const hours = time.getHours()<10?'0'+time.getHours():time.getHours();
                const minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
                const seconds = time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds();
                return `${year}-${month}-${date}`;
            },
            /*确定按钮 */
            submit() {
                let _self = this;
                this.addFormData['remindDays']=Number(this.addFormData['remindDays'])
                let dataParams = this.addFormData;
                this.materialResultSubmit=this.materialResult.map(item=>{
                    return{
                        id:item.id?item.id:'',
                        category:item.typeId,
                        code:item.materieCode,
                        earlyWarningNumber:Number(item.earlyWarningNumber),
                        initialNumber:item.initialNumber,
                        license:item.licenceCode,
                        manufacturer:item.manufacturer,
                        name:item.materieName,
                        number:item.registration,
                        remarks:item.remarks,
                        spec:item.spec,
                        termOfValidity:Number(item.validityterm),
                        termOfValidityTo:this.timeFormat(item.registrationValiddate),
                        termOfValidityType:item.validitytermType,
                        unit:item.unitName
                    }
                })
                this.materialResultSubmit.forEach(item=>{
                    if(item.id===''){
                        delete item.id;
                    }
                })
                dataParams['bsMaterials'] = this.materialResultSubmit;
                this.$api.post("/supplier/addSupplier", dataParams,
                    res => {
                        this.$message({
                            message: "新建成功",
                            type: "success",
                        });
                        setTimeout(() => {
                            _self.closeDialog();
                        }, 500)
                    },
                    res => {
                        this.$message({
                            message: res.msg
                        });
                    }
                );
                this.$emit("clearSelectProductId");
            },
            // 图片上传成功
            uploadSuccess(response, file, fileList) {
                if (response.status == 200) {
                    this.getImgUrl(fileList);
                }
            },
            // 移除图片
            removeImage(file, fileList) {
                this.$api.post('/file/delete', {
                    id: file.response.data[0].id
                }, res => {
                    this.getImgUrl(fileList);
                }, res => {
                    this.$message.error(res.msg);
                });
            },
            // 解析图片url arr
            getImgUrl(list) {
                let arr = [];
                list.map((item, index) => {
                    if (item.response && item.response.data.length > 0) {
                        arr.push(item.response.data[0].path);
                    }
                });
                this.addFormData.path = JSON.stringify(arr);
            },
        }
    };
</script>

<style lang="less">
    @import url(./Add.less);
</style>
		