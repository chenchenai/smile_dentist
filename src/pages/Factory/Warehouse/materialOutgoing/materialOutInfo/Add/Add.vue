<template>
    <div>
        <Dialog className="addOut" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="addFormData" :rules="formRules" label-position="left" label-width="90px" ref="addForm">
                    <div class="baseInfo">
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="出库类型" class="fromItem isRequired selectType" prop="outType">
                                    <div class="type_con">
                                        <p class="type_list" :class="{active_type_list:addFormData.outType===0 }" @click="selectDepartment">部门领用</p>
                                        <p class="type_list" :class="{active_type_list:addFormData.outType===1 }" @click="selectPersonal">个人领用</p>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanOne">
                                <el-form-item label="领料人" class="fromItem isRequired marginLeft" prop="userName">
                                    <el-select class="el-input" filterable remote value-key='value' v-model="addFormData.userName" placeholder="请输入领料人" :remote-method="remoteMethod" @change="selectUserName">
                                        <el-option v-for="(item,index) in searchUserList" :key="item.value+index" :label="item.label" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanOne">
                                <el-form-item label="经办人" class="fromItem isRequired marginLeft" prop="agentId">
                                    <el-select v-model="addFormData.agentId" placeholder="请选择经办人" @focus="getSalesmans()">
                                        <el-option v-for="(item,index) in operatorList" :key="index" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanOne">
                                <el-form-item label="出库时间" class="fromItem fromDate isRequired" prop="registrationValiddate">
                                    <p class="el-pinput">{{addFormData.registrationValiddate}}</p>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <p class="tips">可支持扫描物料编码和追溯码进行出库</p>
                        <div class="material_tab">
                            <ul class="material_tab_th">
                                <li class="addMaterialItem el-input" @click="addMaterialItem">+</li>
                                <li class='el-input' v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                            </ul>
                            <div class="happyScroll_box" style="height:120px;">
                                <happy-scroll color="#ffffff" size="4" resize>
                                    <ul class="material_tab_td">
                                        <li v-for="(item,index) in addFormData.materialResult" :key="index" ref="materialInfoLi">
                                            <p class="el-input" @click="deleteThisItem(index)"><img :src="delImgUerl" alt=""></p>
                                            <el-select class="el-input" filterable remote value-key='materieName' v-model="item.materieName" placeholder="请输入物料名称" :disabled='item.materieNameDisabled' :remote-method="remoteMethodMaterie" @change="selectMaterialName" @focus="setLocation($event,index,0)">
                                                <el-option v-for="(sItem,sIndex) in materialResult" :key="sIndex" :label="sItem.materieName" :value="sItem">
                                                </el-option>
                                            </el-select>
                                            <input class="el-input" :value="item.tracebackCode" disabled="true" @keypress="sweepCode($event,'tracebackCode')" />
                                            <el-select class="el-input" :disabled='item.materieCodeDisabled' v-model="item.materieCode" filterable remote value-key='materieCode' :remote-method="remoteMethodMaterie" placeholder="请输入物料编码" @change="selectMaterialName" @focus="setLocation($event,index,1)"
                                                @keypress.native="sweepCode($event,'materieCode')">
                                                <el-option v-for="(sItem,sIndex) in materialResult" :key="sIndex" :label="sItem.materieCode" :value="sItem">
                                                </el-option>
                                            </el-select>
                                            <p class="el-input">{{item.spec}}</p>
                                            <p class="el-input">{{item.typeName}}</p>
                                            <p class="el-input">{{item.unitName}}</p>
                                            <input class="el-input stockInput" :value="item.stock" disabled='true'>
                                            <el-select class="el-input" value-key='tracebackCode' v-model="item.batchNo" placeholder="请选择批次号" no-data-text='该物料没有批次号' ref="batchNo" @change="selectBatchNo" @focus="setLocation($event,index,2,item.id)">
                                                <el-option v-for="(sItem,sIndex) in batchNoResult" :key="sItem.tracebackCode" :label="sItem.batchNo" :value="sItem">
                                                </el-option>
                                            </el-select>
                                            <input class="el-input" type="text" v-enterNumber v-model="item.num" placeholder='请输入出库数量' @blur="validEntryNum(item.num,$event)" @focus="validEntryNumFous($event)" :disabled='noStock' @keyup="calcSum()">
                                            <p class="el-input">{{item.registration}}</p>
                                            <p class="el-input">{{item.manufacturer}}</p>
                                            <p class="el-input">{{item.licenceCode}}</p>
                                        </li>
                                    </ul>
                                </happy-scroll>
                            </div>
                            <ul class="total">
                                <li class="el-input">合计:</li>
                                <li class="el-input totalMoney">&yen;:{{sumData.sumPrice | totalMoney}}</li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                            </ul>
                        </div>
                        <el-row :gutter="gutter" class="remakesRow">
                            <el-col :span='spanTwo'>
                                <el-form-item label="备注" class="fromItem remakes" prop="remark">
                                    <el-input type="textarea" :rows="2" placeholder="请输入备注" auto-complete="off" v-model="addFormData.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer" align="right">
                    <el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit('addForm')">确 定</el-button>
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                    <el-button :disabled="submitBtnDisabled" class="cancel" @click.native="submitPrint('addForm')">确定并打印追溯码</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import Dialog from "../../../../../../components/Dialog/Dialog";
    export default {
        props: ["changeDialogStatus", "titleType"],
        components: {
            Dialog
        },
        data() {
            return {
                delImgUerl: require('../../../../../../../static/images/icon/del.png'),
                searchKey: '',
                /*搜索的关键字 */
                materialResult: [],
                /*搜索出来的数组 */
                batchNoResult: [],
                /*搜索批次号结果 */
                noStock: false,
                isSearchBoxList: false,
                gutter: 20,
                /*行内item间距 */
                spanOne: 6,
                spanTwo: 24,
                /*经办人 */
                operatorList: [],
                /*经办人列表 */
                batchList: [{
                    label: '',
                    value: '',
                }],
                /*批次号列表 */
                userList: [] /*领料人搜索集合 */ ,
                searchUserList: [],
                /*搜索出来的领料人 */
                addFormData: {
                    outType: 0,
                    /*出库类型 */
                    userId: '' /*领料人 */ ,
                    agentId: '',
                    /*经办人 */
                    registrationValiddate: '',
                    /*出库日期,用于前台显示(格式不一样) */
                    createDate: '',
                    /*出库日期用于后台传值(格式不一样) */
                    materialResult: [{
                        "batchNo": "",
                        /*批次号 */
                        "id": "",
                        /*物料id -----*/
                        "typeName": '' /*类别 */ ,
                        "materialId": "",
                        /*物料id*/
                        "num": '',
                        /*出库数量 */
                        "price": 0,
                        /*单价 */
                        "inoutcomingWay": 0,
                        "materialDocId": "",
                        "tracebackCode": "" /*追溯码 */ ,
                        "stock": '',
                        /*当前库存 */
                        'registration': '',
                        /*注册证编号 */
                        'manufacturer': '',
                        /*生产厂家 */
                        'licenceCode': '',
                        /*生产许可证编号 */
                        materieNameDisabled: false,
                        materieCodeDisabled: false,
                    }],
                    remark: ''
                },
                materialTabTh: [
                    '物料名称',
                    '追溯码',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '当前库存',
                    '批次号',
                    '出库数量*',
                    '注册证编号',
                    '生产厂家',
                    '生产许可证编号',
                ],
                formRules: {
                    userName: [{
                        required: true,
                        message: '请选择领料人',
                        trigger: 'change'
                    }],
                    agentId: [{
                        required: true,
                        message: '请选择经办人',
                        trigger: 'change'
                    }],
                    remark: [{
                        max: 60,
                        message: '长度为 60 个字符以内',
                        trigger: 'change'
                    }]
                },
                submitBtnDisabled: false,
                /*确定按钮是否可点击 */
                thisEl: '',
                /*聚焦的当前元素 */
                thisElIndex: 0,
                sumData: { /*合计 */
                    sumNum: '',
                    sumPrice: '',
                },
                /****下面是扫码枪参数** 8*/
                keycode: '',
                lastTime: null,
                lastCode: null,
                nextTime: '',
                nextCode: '',
            };
        },
        computed: {
            validFromData(){
                if(this.addFormData.userId===''||this.addFormData.agentId===''){
                    return true;
                }else{
                    return false;
                }
            },
        },
        watch: {
            addFormData:{
                handler(newVal,oldVal){
                    this.submitBtnDisabled=this.validFromData;
                },
                deep:true
            }
        },
        filters:{
            totalMoney(val){
                if(!val){
                    let startNum=0;
                    return startNum.toFixed(2);
                }else{
                    return val.toFixed(2);
                }
            }
        },
        directives: {
            /*只能输入正整数,首位不能是0*/
            enterNumber: {
                inserted: el => {
                    el.addEventListener("keypress", e => {
                        e = e || window.event;
                        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
                        let re = /\d/;
                        if ((!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) || (el.value.length === 0 && charcode === 48)) {
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
        
        created() {
            this.getAllUser();
            this.getDate();
        },
        methods: {
            /*选择出库类型 */
            selectDepartment() {
                if (this.addFormData.outType !== 0) {
                    this.addFormData.outType = 0;
                }
            },
            /*选择经销商 */
            selectPersonal() {
                if (this.addFormData.outType !== 1) {
                    this.addFormData.outType = 1;
                }
            },
            /*搜索框定位 */
            setLocation(event, index, type) {
                this.batchNoResult=[];
                this.thisEl = event.target || event.srcElement;
                this.thisElIndex = index;
                this.searchType = type;
                if(type===2 &&　this.batchNoResult.length==0){/*选择批次号*/
                if(this.addFormData.materialResult[index].materialId){
                    this.getBatchNo(this.addFormData.materialResult[index].materialId);
                }
                }
            },
            /*选择批次号 */
            selectBatchNo(val) {
                this.addFormData.materialResult[this.thisElIndex].stock = val.stockNum;
                this.addFormData.materialResult[this.thisElIndex].tracebackCode = val.tracebackCode;
                this.addFormData.materialResult[this.thisElIndex].batchNo = val.batchNo;
                this.addFormData.materialResult[this.thisElIndex].supplierName = val.supplierName;
                this.addFormData.materialResult[this.thisElIndex].supplierid = val.supplierid;
                this.addFormData.materialResult[this.thisElIndex].price = val.price;
                let materialInfoLi = this.$refs.materialInfoLi;
                let stockInput = materialInfoLi[this.thisElIndex].children[9];
                if (!val.stockNum) {
                    stockInput.disabled = true;
                    stockInput.placeholder = '该物料没有库存';
                    if (stockInput.className.match(/wangingTip/ig)) {
                        stockInput.classList.remove("wangingTip");
                    }
                }
                this.calcSum();
                this.thisElIndex=0;
            },
            noSearchBoxList() {
                this.isSearchBoxList = false;
            },
            /*扫码枪扫码*/
            sweepCode(e, type) {
                console.log(e.which)
                let _self = this;
                if (window.event) { // IE
                    this.nextCode = e.keyCode
                } else if (e.which) { // Netscape/Firefox/Opera
                    this.nextCode = e.which
                }
                if ((this.nextCode >= 48 && this.nextCode <= 57) || (this.nextCode >= 96 && this.nextCode <= 105)) {
                    let codes = {
                        '48': 48,
                        '49': 49,
                        '50': 50,
                        '51': 51,
                        '52': 52,
                        '53': 53,
                        '54': 54,
                        '55': 55,
                        '56': 56,
                        '57': 57,
                        '96': 48,
                        '97': 49,
                        '98': 50,
                        '99': 51,
                        '100': 52,
                        '101': 53,
                        '102': 54,
                        '103': 55,
                        '104': 56,
                        '105': 57
                    };
                    this.nextCode = codes[this.nextCode];
                    this.nextTime = new Date().getTime();
                    if (this.lastCode == null && this.lastTime == null) {
                        this.keycode = String.fromCharCode(_self.nextCode);
                    } else if (this.lastCode != null && this.lastTime != null && this.nextTime - this.lastTime <= 30) {
                        this.keycode += String.fromCharCode(_self.nextCode);
                        if (type === 'tracebackCode') {
                            this.sweepCodeHttp({
                                tracebackCode: this.keycode
                            }, '/warehouse/outDetailsByCode')
                        } else if (type === 'materieCode') {
                            this.sweepCodeHttp({
                                code: this.keycode
                            }, '/warehouse/materiel/page/query')
                        }
                    } else {
                        this.keycode = "";
                        this.lastCode = null;
                        this.lastTime = null;
                    }
                    this.lastCode = this.nextCode;
                    this.lastTime = this.nextTime;
                }
            },
            /*扫码请求 */
            sweepCodeHttp(typeParams, url) {
                this.$api.post(url, typeParams, res => {
                        if (res.data.records[0]) {
                            this.addFormData.materialResult[this.thisElIndex].materialId = res.data.records[0].materialId;
                            this.addFormData.materialResult[this.thisElIndex].inoutcomingWay = res.data.records[0].inoutcomingWay;
                            this.addFormData.materialResult[this.thisElIndex].materieName = res.data.records[0].materieName;
                            this.addFormData.materialResult[this.thisElIndex].materialNo = res.data.records[0].materialNo;
                            this.addFormData.materialResult[this.thisElIndex].spec = res.data.records[0].spec;
                            this.addFormData.materialResult[this.thisElIndex].typeName = res.data.records[0].typeName;
                            this.addFormData.materialResult[this.thisElIndex].unitName = res.data.records[0].unitName;
                            this.addFormData.materialResult[this.thisElIndex].manufactureDate = res.data.records[0].manufactureDate;
                            this.addFormData.materialResult[this.thisElIndex].registrationNum = res.data.records[0].registrationNum;
                            this.addFormData.materialResult[this.thisElIndex].licenceCode = res.data.records[0].licenceCode;
                            this.addFormData.materialResult[this.thisElIndex].materieNameDisabled = true;
                            this.addFormData.materialResult[this.thisElIndex].materieCodeDisabled = false;
                        } else {
                            this.$message({
                                message: '未找到该条编码',
                                type: 'error'
                            });
                        }
                    },
                    res => {
                        this.materialResult = [];
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    })
            },
            /*搜索物料*/
            remoteMethodMaterie(val) {
                if (val) {
                    let searchParams = {}
                    if (this.searchType === 0) {
                        searchParams = {
                            name: val
                        }
                        this.materielPost('/warehouse/materiel/query/condition',searchParams)
                    } else if (this.searchType === 1) {
                        searchParams = {
                            code: val
                        }
                        this.materielPost('/warehouse/materiel/query/condition',searchParams)
                    }
                }
            },
            /*搜索物料请求 */
            materielPost(url,postParams){
                this.$api.post(url,postParams,res=>{
                    this.materialResult = res.data.map(item => {
                                return {
                                    value: item.id,
                                    label: item.materieName,
                                    id: item.id,
                                    licenceCode: item.licenceCode,
                                    materieCode: item.materieCode,
                                    materieName: item.materieName,
                                    registration: item.registration,
                                    spec: item.spec,
                                    typeName: item.typeName,
                                    unitName: item.unitName,
                                    manufacturer: item.manufacturer,
                                    stock: item.stock && item.stock !== '' ? item.stock : 0,
                                    tracebackCode: item.tracebackCode,
                                    materieNameDisabled: false,
                                    materieCodeDisabled: false,
                                }
                            });
                },res=>{
                    this.materialResult = [];
                })
            },

            getAllUser() {
                this.$api.post('/factory/user/selectGetUser', {}, res => {
                        if (res.data.length > 0) {
                            this.userList = res.data.map(item => {
                                if (!!item) {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                        userId: item.id,
                                        userName: item.name
                                    }
                                }
                            })
                        }
                    },
                    res => {
                        this.userList = [];
                    })
            },
            remoteMethod(val) {
                let remoteParams = {
                    name: val
                }
                if (val) {
                    this.searchUserList = this.userList.filter(item => {
                        if (!!item) {
                            return Object.keys(item).some(key => {
                                return String(item['userName']).toLowerCase().indexOf(val) > -1;
                            })
                        }
                    })
                } else {
                    this.searchUserList = [];
                }
            },
            selectUserName(val) {
                this.addFormData.userId = val.userId;
            },
            /*获取经办人 */
            getSalesmans() {
                this.$api.post('/factory/user/selectSalesmans', {}, res => {
                    this.operatorList = res.data;
                }, res => {})
            },
            /*或去当前时间*/
            getDate() {
                const time = new Date();
                const year = time.getFullYear();
                const month = time.getMonth() + 1;
                const date = time.getDate();
                const hours = time.getHours();
                const minutes = time.getMinutes();
                const seconds = time.getSeconds();
                this.addFormData.registrationValiddate = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes;
                this.addFormData.createDate = time.toISOString();
            },
            /*选择搜索出来物料的list */
            selectMaterialName(val) {
                this.addFormData.materialResult[this.thisElIndex].materialId = val.id;
                this.addFormData.materialResult[this.thisElIndex].inoutcomingWay = val.inoutcomingWay;
                this.addFormData.materialResult[this.thisElIndex].materieName = val.materieName;
                this.addFormData.materialResult[this.thisElIndex].materieCode = val.materieCode;
                this.addFormData.materialResult[this.thisElIndex].spec = val.spec;
                this.addFormData.materialResult[this.thisElIndex].typeName = val.typeName;
                this.addFormData.materialResult[this.thisElIndex].unitName = val.unitName;
                this.addFormData.materialResult[this.thisElIndex].date = val.date;
                this.addFormData.materialResult[this.thisElIndex].stock = val.stock;
                this.addFormData.materialResult[this.thisElIndex].registration = val.registration;
                this.addFormData.materialResult[this.thisElIndex].manufacturer = val.manufacturer;
                this.addFormData.materialResult[this.thisElIndex].licenceCode = val.licenceCode;
                this.addFormData.materialResult[this.thisElIndex].num ='',
                // this.addFormData.materialResult[this.thisElIndex].batchNo = val.batchNo;
                this.addFormData.materialResult[this.thisElIndex].licenceCode = val.licenceCode;
                this.addFormData.materialResult[this.thisElIndex].materieNameDisabled = val.materieNameDisabled;
                this.addFormData.materialResult[this.thisElIndex].materieCodeDisabled = val.materieCodeDisabled;
                if (this.searchType === 0) { /*搜索物料名称 */
                    this.addFormData.materialResult[this.thisElIndex].materieCodeDisabled = true;
                } else if (this.searchType === 1) { /*搜索物料编码 */
                    this.addFormData.materialResult[this.thisElIndex].materieNameDisabled = true;
                }
                this.materialResult = [];
                this.thisElIndex = 0;
                // this.getBatchNo(val.id)
            },
            /*根据物料id查询批次号 */
            getBatchNo(id) {
                this.$api.post('/warehouse/batchNumbers', {
                    materialId: id
                }, res => {
                    if (res.data && res.data.length>0) {
                        this.batchNoResult = res.data
                    }else{
                        this.addFormData.materialResult[this.thisElIndex].batchNo='';
                        this.addFormData.materialResult[this.thisElIndex].num='';
                    }
                }, res => {})
            },
            /*计算入库总数量与总价*/
            calcSum() {
                this.sumData.sumPrice = 0;
                this.sumData.sumNum = 0;
                this.addFormData.materialResult.forEach(item => {
                    if (Number(item.num) > Number(item.stock)) { /*出库时量不能大于当前库存 */
                        item.num = item.stock;
                    }
                    this.sumData.sumNum += Number(item.num);
                    this.sumData.sumPrice += Number(Number(item.num) * Number(item.price));
                })
            },
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showAddEntryDialog");
            },
            /*确定并打印追溯码 */
            async submitPrint(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // try {
                            let addIndex = 0;
                            this.addFormData.materialResult.forEach((item, index) => {
                                addIndex++;
                                // if (item.materieName !== '' && !item.batchNo) {
                                    // this.$message({
                                    //     message: `请检查第${index+1}行批次号,批次号不能为空`,
                                    //     type: 'error'
                                    // });
                                    // throw 'jumpout';
                                // } else {
                                    if (addIndex === this.addFormData.materialResult.length) {
                                        delete item.date;
                                        delete item.materieName;
                                        delete item.licenceCode;
                                        delete item.materialDocId;
                                        delete item.materieCode;
                                        delete item.materieName;
                                        delete item.registration;
                                        delete item.spec;
                                        delete item.typeName;
                                        delete item.unitName;
                                        delete item.stock;
                                        delete item.id;
                                        delete item.manufacturer;
                                        delete item.materieCodeDisabled;
                                        delete item.materieNameDisabled;
                                        let postParams = {
                                            agentId: this.addFormData.agentId /*供应商 */ ,
                                            createDate: this.addFormData.createDate /*this.addFormData.registrationValiddate*/ ,
                                            sum: this.sumData.sumPrice.toString(),
                                            remark: this.addFormData.remark,
                                            outcomingType: this.addFormData.outType,
                                            purpose: this.addFormData.outType === 0 ? '部门' : '个人',
                                            userId: this.addFormData.userId,
                                            bsMaterialInoutcomingItemsList: this.addFormData.materialResult,
                                        }
                                        this.$api.post('/warehouse/outComing', postParams, res => {
                                            this.$message({
                                                message: "添加出库单成功",
                                                type: "success",
                                                onClose: () => {
                                                    this.$emit("changeDialogStatus", false, "showAddEntryDialog");
                                                    this.$emit("changeDialogStatus", true, "showPrintTraCodeDialog");
                                                }
                                            });
                                        }, res => {
                                            this.$message({
                                                message: res.msg,
                                                type: "error"
                                            });
                                        })
                                    }
                                // }
                            })
                        // } catch (e) {
                        // }
                    } else {
                        return false;
                    }
                })
            },
            openAddMaterialDialog() {
                this.$emit("changeDialogStatus", true, "showAddMaterialDialog");
            },
            /* 确定出库提交按钮 */
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                            let addIndex = 0;
                            this.addFormData.materialResult.forEach((item, index) => {
                                addIndex++;
                                delete item.date;
                                delete item.materieName;
                                delete item.licenceCode;
                                delete item.materialDocId;
                                delete item.materieCode;
                                delete item.materieName;
                                delete item.registration;
                                delete item.spec;
                                delete item.typeName;
                                delete item.unitName;
                                delete item.stock;
                                delete item.id;
                                delete item.manufacturer;
                                delete item.materieCodeDisabled;
                                delete item.materieNameDisabled;
                                delete item.label;
                                delete item.value;
                                delete item.price;
                                    if (addIndex === this.addFormData.materialResult.length) {
                                        let postParams = {
                                            agentId: this.addFormData.agentId /*供应商 */ ,
                                            createDate: this.addFormData.createDate /*this.addFormData.registrationValiddate*/ ,
                                            sum: this.sumData.sumPrice.toString(),
                                            remark: this.addFormData.remark,
                                            outcomingType: this.addFormData.outType,
                                            purpose: this.addFormData.outType === 0 ? '部门' : '个人',
                                            userId: this.addFormData.userId,
                                            bsMaterialInoutcomingItemsList: this.addFormData.materialResult,
                                        }
                                        this.$api.post('/warehouse/outComing', postParams, res => {
                                            this.$message({
                                                message: "添加出库单成功",
                                                type: "success",
                                                onClose: () => {
                                                    this.$emit("changeDialogStatus", false, "showAddEntryDialog");
                                                }
                                            });
                                        }, res => {
                                            this.$message({
                                                message: res.msg,
                                                type: "error"
                                            });
                                        })
                                    }
                            })
                    } else {
                        return false;
                    }
                })
            },
            /*校验出库数量输入 */
            validEntryNum(value, event) {
                const thisEl = event.target || event.srcElement;
                if (!value) {
                    thisEl.placeholder = '出库数量不能为空'
                    thisEl.className += ' wangingTip';
                } else {
                    if (thisEl.className.match(/wangingTip/ig)) {
                        thisEl.classList.remove("wangingTip");
                    }
                }
            },
            /*校验出库数量输入 */
            validEntryNumFous(event) {
                const thisEl = event.target || event.srcElement;
                thisEl.placeholder = '请输入出库数量';
                if (thisEl.className.match(/wangingTip/ig)) {
                    thisEl.classList.remove("wangingTip");
                }
            },
            /* 添加一行物料*/
            addMaterialItem() {
                this.addFormData.materialResult.push({
                    value: '',
                    label: '',
                    id: '',
                    licenceCode: '',
                    materieCode: '',
                    materieName: '',
                    registration: '',
                    spec: '',
                    typeName: '',
                    unitName: '',
                    manufacturer: '',
                    stock: '',
                    tracebackCode: '',
                    materieNameDisabled: false,
                    materieCodeDisabled: false,
                });
            },
            /*删除该行物料 */
            deleteThisItem(val) {
                this.addFormData.materialResult.splice(val, 1);
            }
        }
    };
</script>

<style lang="less">
    @import url(./Add.less);
</style>
		