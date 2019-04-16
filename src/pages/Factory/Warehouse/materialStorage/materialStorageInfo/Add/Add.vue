<template>
    <div>
        <Dialog className="addEntry" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="addFormData" :rules="formRules" label-position="left" label-width="90px" ref="addForm">
                    <div class="baseInfo">
                        <el-row :gutter="gutter">
                            <el-col :span="spanOne">
                                <el-form-item label="供应商" class="fromItem isRequired marginLeft" prop="supplierName">
                                    <el-select v-model="addFormData.supplierName" value-key="name" placeholder="请选择供应商" @focus='getSupplierList' @change="getSupplierid">
                                        <el-option v-for="(item,index) in supplierList" :key="index" :label="item.name" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanOne">
                                <el-form-item label="经办人" class="fromItem isRequired marginLeft" prop="agentName">
                                    <el-select v-model="addFormData.agentName" value-key="name" placeholder="请选择经办人" @focus="getSalesmans()" @change="getAgent">
                                        <el-option v-for="item in operatorList" :key="item.name" :label="item.name" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanOne">
                                <el-form-item label="采购单号" class="fromItem" prop="purchaseCode">
                                    <el-input placeholder="请输入采购单号" auto-complete="off" v-model="addFormData.purchaseCode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="spanOne">
                                <el-form-item label="入库时间" class="fromItem fromDate isRequired" prop="date">
                                    <el-date-picker class="fromDateInput" type="date" placeholder="请选择入库时间" :clearable='false' v-model="addFormData.date" style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <p class="tips">可扫描物料编码进行入库</p>
                        <div class="material_tab">
                            <ul class="material_tab_th">
                                <li class="addMaterialItem el-input" @click="addMaterialItem">+</li>
                                <li class='el-input' v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                            </ul>
                            <div class="happyScroll_box" style="height:120px;">
                                <happy-scroll color="#ffffff" size="4" resize>
                                    <ul class="material_tab_td">
                                        <li v-for="(item,index) in addFormData.materialResult" :key="index">
                                            <p class="el-input" @click="deleteThisItem(index)"><img :src="delImgUerl" alt=""></p>
                                            <el-select class="el-input" filterable remote value-key='materieName' :disabled='item.materieNameDisabled' v-model="item.materieName" placeholder="请输入物料名称" :remote-method="remoteMethod" @change="selectMaterialName" @focus="setLocation($event,index,0)">
                                                <el-option v-for="sItem in materialResult" :key="sItem.index" :label="sItem.materieName" :value="sItem">
                                                </el-option>
                                            </el-select>
                                            <el-select class="el-input" :disabled='item.materieCodeDisabled' v-model="item.materialNo" filterable remote value-key='materialNo' :remote-method="remoteMethod" @keypress.native="sweepCode($event)" placeholder="请输入物料编码" @change="selectMaterialName" @focus="setLocation($event,index,1)">
                                                <el-option v-for="sItem in materialResult" :key="sItem.index" :label="sItem.materialNo" :value="sItem">
                                                </el-option>
                                            </el-select>
                                            <p class="el-input">{{item.spec}}</p>
                                            <p class="el-input">{{item.typeName}}</p>
                                            <p class="el-input">{{item.unitName}}</p>
                                            <el-input v-model="item.batchNo" placeholder="请输入批次号" maxlength="16"></el-input>

                                            <el-date-picker type="date" placeholder="请选择日期" :clearable='false'  v-model="item.manufactureDate" style="width: 100%;"  ref="datePicker"></el-date-picker>

                                            <input class="el-input" type="text" v-enterNumber v-model="item.num" placeholder="请输入数量" @blur="validEntryNum(item.num,$event)" @input="calcSum()">
                                            <input class="el-input" type="text" v-model="item.price" placeholder="请输入单价" @blur="validUnitPrice(item.price,$event)" @input="calcSum()" @keyup="inputIntFloat($event)">
                                            <p class="el-input">{{item.registrationNum}}</p>
                                            <p class="el-input">{{item.licenceCode}}</p>
                                        </li>
                                    </ul>
                                </happy-scroll>
                            </div>
                            <ul class="total">
                                <li class="el-input">合计:</li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                                <li class="el-input">{{sumData.sumNum}}</li>
                                <li class="el-input">{{sumData.sumPrice | fixFloat2}}</li>
                                <li class="el-input"></li>
                                <li class="el-input"></li>
                            </ul>
                        </div>
                        <el-row :gutter="gutter" class="remakesRow">
                            <el-col :span='24'>
                                <el-form-item label="备注" class="fromItem remakes" prop="remark">
                                    <el-input type="textarea" :rows="2" placeholder="请输入备注" auto-complete="off" v-model="addFormData.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
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
    import Dialog from "../../../../../../components/Dialog/Dialog";
    export default {
        props: ["changeDialogStatus", "titleType", 'selectProductId'],
        components: {
            Dialog
        },
        data() {
            let statusObj = {
                status: false,
                text: ""
            };
            return {
                delImgUerl: require('../../../../../../../static/images/icon/del.png'),
                searchKey: '',
                /*搜索的关键字 */
                materialResult: [],
                /*搜索的物料数组 */
                searchType: 0,
                /*搜索类型0为名称,1为编码 */
                /*搜索出来的数组 */
                gutter: 20,
                /*行内item间距 */
                spanOne: 6,
                /*经办人 */
                supplierList: [],
                /*供应商列表 */
                operatorList: [],
                /*经办人列表 */
                addFormData: {
                    supplierid: '',
                    /*供应商id */
                    agentId: '',
                    /*新加**** */
                    agentName: '',
                    date: '',
                    supplierName: '',
                    remark: '',
                    status: '',
                    operator: '',
                    purchaseCode: '',
                    /*采购单号 */
                    /*经办人id */
                    materialResult: [{
                        "batchNo": "",
                        /*批次号 */
                        "id": "",
                        /*物料id -----*/
                        "type": '' /*类别 */ ,
                        "materialId": "",
                        /*物料编码*/
                        "num": '',
                        /*入库数量 */
                        "price": '',
                        /*单价 */
                        "inoutcomingWay": 0,
                        "materialDocId": "",
                        "tracebackCode": "",
                        materieName: '',
                        materieNameDisabled: false,
                        materieCodeDisabled: false,
                    }, ],
                },
                materialTabTh: [
                    '物料名称',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '批次号',
                    '生产日期',
                    '入库数量*',
                    '入库单价(元)',
                    '注册证号',
                    '生产许可证号',
                ],
                formRules: {
                    supplierName: [{
                        required: true,
                        message: '请选择供应商',
                        trigger: 'change'
                    }],
                    agentName: [{
                        required: true,
                        message: '请选择经办人',
                        trigger: 'change'
                    }],
                    purchaseCode: [{
                        max: 16,
                        message: '长度为 16 个字符以内',
                        trigger: 'change'
                    }],
                    date: [{
                        type: 'date',
                        required: true,
                        message: '请选择入库时间',
                        trigger: 'change'
                    }],
                    remark: [{
                        max: 150,
                        message: '长度为 150 个字符以内',
                        trigger: 'change'
                    }]
                },
                materialNameValid: statusObj,
                /*校验物料名称输入 */
                BatchNumValid: statusObj,
                /*校验批次号输入 */
                produceDateValid: statusObj,
                /*校验生产日期输入 */
                entryNumValid: statusObj,
                /*校验入库数量输入 */
                submitBtnDisabled: false,
                /*确定按钮是否可点击 */
                thisEl: '',
                /*聚焦的当前元素 */
                thisElIndex: 0,
                sumData: { /*合计 */
                    sumNum: '',
                    sumPrice: '',
                },
                sum: '',
                /*合计总价 */
                /****下面是扫码枪参数** 8*/
                keycode :'',
                lastTime:null,
                lastCode:null,
                nextTime:'',
                nextCode:'',
            };
        },
        filters: {
            fixFloat2(value) {
                let value_new = Number(value);
                if (isNaN(value_new)) {
                    return value;
                } else {
                    return value_new.toFixed(2);
                }
            },
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
            
        },
        methods: {
            /*获取供应商id */
            getSupplierid(val) {
                this.addFormData.supplierid = val.id;
                this.addFormData.supplierName = val.name;
            },
            getAgent(val) {
                this.addFormData.agentId = val.id;
                this.addFormData.agentName = val.name;
            },
            /*返回当前时间 */
            timeFormat() {
                // const time = new Date();
                // const year = time.getFullYear();
                // const month = time.getMonth()+1;
                // const date = time.getDate();
                // const hours = time.getHours()<10?'0'+time.getHours():time.getHours();
                // const minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
                // const seconds = time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds();
                // return `${year}-${month}-${date}`;
                return new Date().toISOString();
            },
            /*扫码枪录入*/
            sweepCode(e) {
                let _self=this;
                if (window.event) {// IE
                    this.nextCode = e.keyCode
                } else if (e.which) {// Netscape/Firefox/Opera
                    this.nextCode = e.which
                }
                //字母上方 数字键0-9 对应键码值 48-57
                //数字键盘 数字键0-9 对应键码值 96-105
                if ((this.nextCode >= 48 && this.nextCode <= 57) || (this.nextCode >= 96 && this.nextCode <= 105)) {
                    //数字键盘的键码值对应的字符有问题，所以手动调整键码值
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
                        this.$api.post('/warehouse/materiel/page/query', {code:this.keycode}, res => {
                            if(res.data.records[0]){
                                this.addFormData.materialResult[this.thisElIndex].materialId = res.data.records[0].materialId;
                                this.addFormData.materialResult[this.thisElIndex].inoutcomingWay = res.data.records[0].inoutcomingWay;
                                this.addFormData.materialResult[this.thisElIndex].materieName = res.data.records[0].materieName;
                                this.addFormData.materialResult[this.thisElIndex].materialNo = res.data.records[0].materialNo;
                                this.addFormData.materialResult[this.thisElIndex].spec = res.data.records[0].spec;
                                this.addFormData.materialResult[this.thisElIndex].typeName = res.data.records[0].typeName;
                                this.addFormData.materialResult[this.thisElIndex].unitName = res.data.records[0].unitName;
                                // this.addFormData.materialResult[this.thisElIndex].manufactureDate = this.timeFormat();
                                this.addFormData.materialResult[this.thisElIndex].num = res.data.records[0].stock;
                                this.addFormData.materialResult[this.thisElIndex].price = 0;
                                // this.addFormData.materialResult[this.thisElIndex].manufactureDate =new Date(res.data.records[0].manufactureDate);
                                this.addFormData.materialResult[this.thisElIndex].registrationNum = res.data.records[0].registrationNum;
                                this.addFormData.materialResult[this.thisElIndex].licenceCode = res.data.records[0].licenceCode;
                                this.addFormData.materialResult[this.thisElIndex].materieNameDisabled = true;
                                this.addFormData.materialResult[this.thisElIndex].materieCodeDisabled = false;
                            }else{
                                this.$message({
                                    message: '未找到该条编码',
                                    type:'error'
                                });
                            }
                        },
                        res => {
                            this.materialResult = [];
                            this.$message({
                                    message: res.msg,
                                    type:'error'
                                });
                        })
                    } else {
                        this.keycode = "";
                        this.lastCode = null;
                        this.lastTime = null;
                    }
                    this.lastCode = this.nextCode;
                    this.lastTime = this.nextTime;
                }
            },
            /* 添加一行*/
            addMaterialItem() {
                this.addFormData.materialResult.push({
                    batchNo: '',
                    typeName: '',
                    spec: '',
                    materialId: '',
                    num: 0,
                    price: 0,
                    unitName: 0,
                    materialDocId: '',
                    tracebackCode: '',
                    materieName: '',
                    materialNo: '',
                    registrationNum: '',
                    licenceCode: '',
                    manufactureDate: '',
                    materieNameDisabled: false,
                    materieCodeDisabled: false,
                });
            },
            /*删除该行*/
            deleteThisItem(val) {
                this.addFormData.materialResult.splice(val, 1);
                this.calcSum();
            },
            /*输入单价校验 */
            inputIntFloat(event) {
                event = event.target || event.srcElement;
                if ('' != event.value.replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
                    event.value = event.value.match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : event.value.match(/\d{1,}\.{0,1}\d{0,}/);
                }
            },
            /*索引定位 */
            setLocation(event, index, type) {
                this.thisEl = event.target || event.srcElement;
                this.thisElIndex = index;
                this.searchType = type;
            },
            /*  清除索引定位 */
            clearLocation() {
                this.thisElIndex = 0;
            },
            /*输入搜索物料名称或编码 */
            remoteMethod(val) {
                let searchParams = {}
                if (this.searchType === 0) {
                    searchParams = {
                        name: val
                    }
                } else if (this.searchType === 1) {
                    searchParams = {
                        code: val
                    }
                }
                if (val) {
                    this.$api.post('/warehouse/materiel/page/query', searchParams, res => {
                            this.materialResult = res.data.records.map(item => {
                                return {
                                    value: item.id,
                                    label: item.materieName,
                                    id: item.id,
                                    licenceCode: item.licenceCode,
                                    materialId: item.id,
                                    materieName: item.materieName,
                                    materialNo: item.materieCode,
                                    registrationNum: item.registration,
                                    spec: item.spec,
                                    // manufactureDate : this.timeFormat(),
                                    num: item.stock,
                                    price : 0,
                                    typeName: item.typeName,
                                    unitName: item.unitName,
                                    materieNameDisabled: false,
                                    materieCodeDisabled: false,
                                }
                            });
                        },
                        res => {
                            this.materialResult = [];
                        })
                } else {
                    this.materialResult = [];
                }
            },
            /*选择搜索出来物料的list*/
            selectMaterialName(val) {
                // this.addFormData.materialResult[this.thisElIndex].id = val.id;
                this.addFormData.materialResult[this.thisElIndex].materialId = val.materialId;
                this.addFormData.materialResult[this.thisElIndex].inoutcomingWay = val.inoutcomingWay;
                this.addFormData.materialResult[this.thisElIndex].materieName = val.materieName;
                this.addFormData.materialResult[this.thisElIndex].materialNo = val.materialNo;
                this.addFormData.materialResult[this.thisElIndex].spec = val.spec;
                this.addFormData.materialResult[this.thisElIndex].typeName = val.typeName;
                this.addFormData.materialResult[this.thisElIndex].unitName = val.unitName;
                // this.addFormData.materialResult[this.thisElIndex].manufactureDate = val.manufactureDate;
                this.addFormData.materialResult[this.thisElIndex].num = val.num;
                this.addFormData.materialResult[this.thisElIndex].price = val.price;
                // this.addFormData.materialResult[this.thisElIndex].manufactureDate = new Date(val.manufactureDate);
                this.addFormData.materialResult[this.thisElIndex].registrationNum = val.registrationNum;
                this.addFormData.materialResult[this.thisElIndex].licenceCode = val.licenceCode;
                this.addFormData.materialResult[this.thisElIndex].materieNameDisabled = val.materieNameDisabled;
                this.addFormData.materialResult[this.thisElIndex].materieCodeDisabled = val.materieCodeDisabled;
                this.materialResult = [];
                if (this.searchType === 0) { /*搜索物料名称 */
                    this.addFormData.materialResult[this.thisElIndex].materieCodeDisabled = true;
                } else if (this.searchType === 1) { /*搜索物料编码 */
                    this.addFormData.materialResult[this.thisElIndex].materieNameDisabled = true;
                }
                this.thisElIndex = 0;
                this.calcSum();
            },
            /*获取经办人 */
            getSalesmans() {
                this.$api.post('/factory/user/selectSalesmans', {}, res => {
                    this.operatorList = res.data;
                }, res => {})
            },
            /*供应商列表 */
            getSupplierList() {
                this.$api.post('/supplier/listSupplier', {
                    current: 1,
                    rowSize: 15
                }, res => {
                    this.supplierList = res.data.records;
                })
            },
            /*计算入库总数量与总价 */
            calcSum() {
                this.sumData.sumPrice = 0;
                this.sumData.sumNum = 0;
                this.addFormData.materialResult.forEach(item => {
                    this.sumData.sumNum += Number(item.num);
                    this.sumData.sumPrice += Number(Number(item.num) * Number(item.price));
                })
            },
            /*确定入库 */
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                            try{
                                let totalIndex=0;
                                this.addFormData.materialResult.forEach((item,index)=>{
                                    totalIndex++;
                                    if(item.materieName!==''){
                                        if(item.batchNo===''){
                                            this.$message({
                                                message: `请检查第${index+1}行批次号,批次号不能为空`,
                                                type:'error'
                                            });
                                            throw 'jumpout';
                                        }
                                        if(!item.manufactureDate){
                                            item.manufactureDate=this.timeFormat();
                                        }
                                        if (totalIndex === this.addFormData.materialResult.length) {
                                            delete item.materieCodeDisabled;
                                            delete item.materieNameDisabled;
                                            delete item.licenceCode;
                                            delete item.materieName;
                                            delete item.registrationNum;
                                            delete item.spec;
                                            delete item.typeName;
                                            delete item.unitName;
                                            delete item.id;
                                            let postParams = {
                                                agentId: this.addFormData.agentId,
                                                /*供应商 */
                                                sum: this.sumData.sumPrice,
                                                /*总价 */
                                                supplierName: this.addFormData.supplierName,
                                                supplierid: this.addFormData.supplierid,
                                                purchaseCode: this.addFormData.purchaseCode /*采购单号 */ ,
                                                remark: this.addFormData.remark,
                                                bsMaterialInoutcomingItemsList: this.addFormData.materialResult.filter(item => {
                                                    if (item.materialId) {
                                                        return item
                                                    } else {
                                                        return ''
                                                    }
                                                }),
                                            }
                                            if (this.selectProductId) {
                                                postParams['id'] = this.selectProductId
                                            }
                                            this.$api.post('/warehouse/putInStorage', postParams, res => {
                                                    this.$emit("changeDialogStatus", false, "showAddEntryDialog");
                                                    this.sumData.sumPrice = 0;
                                                    this.sumData.sumNum = 0;
                                                },
                                                res => {
                                                    this.$message({
                                                        message: res.msg,
                                                        type:'error'
                                                    });
                                                })
                                        }
                                    }
                                });
                            }catch(e){
                                
                            }
                        
                    } else {
                        return false;
                    }
                });
            },
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showAddEntryDialog");
            },
            openAddMaterialDialog() {
                this.$emit("changeDialogStatus", true, "showAddMaterialDialog");
            },
            
            /**************以下为表单校验********** */

            /*校验批次号输入 */
            // validBatchNum(value, event) {
            //     const thisEl = event.target || event.srcElement;
            //     if (!value) {
            //         thisEl.placeholder = '批次号不能为空'
            //         thisEl.className += ' wangingTip';
            //     } else {
            //         if (value > 16) {
            //             thisEl.placeholder = '批次号不能超过16个字符';
            //             thisEl.className += 'wangingTip';
            //         } else {
            //             if (thisEl.className.match(/wangingTip/ig)) {
            //                 thisEl.classList.remove("wangingTip");
            //             }
            //         }
            //     }
            // },
            /*校验批次号输入聚焦 */
            // batchNumFous(event) {
            //     const thisEl = event.target || event.srcElement;
            //     thisEl.placeholder = '请输入批次号';
            //     if (thisEl.className.match(/wangingTip/ig)) {
            //         thisEl.classList.remove("wangingTip");
            //     }
            // },
            /*校验生产日期 */
            // validProduceDate(value, index) {
            //     let datePicker = this.$refs.datePicker;
            //     let thisDatePicker = datePicker[index].$children[0].$el.children[0];
            //     if (!value) {
            //         thisDatePicker.placeholder = '生产日期不能为空'
            //         thisDatePicker.className += ' wangingTip';
            //     } else {
            //         if (thisDatePicker.className.match(/wangingTip/ig)) {
            //             thisDatePicker.classList.remove("wangingTip");
            //         }
            //     }
            // },
            /*校验生产日期聚焦 */
            // produceDateFous(index) {
            //     let datePicker = this.$refs.datePicker;
            //     let thisDatePicker = datePicker[index].$children[0].$el.children[0];
            //     thisDatePicker.placeholder = '请选择生产日期';
            //     if (thisDatePicker.className.match(/wangingTip/ig)) {
            //         thisDatePicker.classList.remove("wangingTip");
            //     }
            // },
            /*校验入库数量输入 */
            validEntryNum(value, event) {
                const thisEl = event.target || event.srcElement;
               if(!!this.addFormData.materialResult[this.thisElIndex].materieName || !!this.addFormData.materialResult[this.thisElIndex].materialNo){
                    if (!value) {
                        this.addFormData.materialResult[this.thisElIndex].num = 0;
                    } 
                }
            },

            /*校验入库单价 */
            validUnitPrice(value, event) {
                const thisEl = event.target || event.srcElement;
                if(!!this.addFormData.materialResult[this.thisElIndex].materieName || !!this.addFormData.materialResult[this.thisElIndex].materialNo){
                    if (!value) {
                        this.addFormData.materialResult[this.thisElIndex].price = 0;
                    } 
                }
            },
        }
    };
</script>

<style lang="less">
    @import url(./Add.less);
</style>
		