<template>
    <div class="addMaterial">
        <Dialog className="addMaterial" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="addFormData" :rules="formRules" label-position="left" label-width="100px" ref="addForm">
                    <el-form-item label="物料名称" class="fromItem isRequired materieNameBox" prop="materieName">
                        <el-select class="el-input" filterable remote value-key='id' v-model="addFormData.materieName" placeholder="请输入物料名称" :remote-method="remoteMethod" @change="selectMaterialName" @focus="selectSearchType(0)">
                            <el-option v-for="item in materialResult" :key="item.id" :label="item.materieName" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料编码" class="fromItem " prop="materieCode">
                        <el-select class="el-input" v-model="addFormData.materieCode" filterable remote value-key='materieCode' :remote-method="remoteMethod" placeholder="请输入物料编码" @change="selectMaterialName" @focus="selectSearchType(1)">
                            <el-option v-for="item in materialResult" :key="item.materieCode" :label="item.materieCode" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规格型号" class="fromItem marginRightNone" prop="spec">
                        <el-input placeholder="请输入规格型号" v-model="addFormData.spec"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" class="fromItem" prop="unitName">
                        <el-input placeholder="请输入单位" v-model="addFormData.unitName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期" class="fromItem marginRight validityPeriod" prop="validityterm">
                        <el-input type="text" placeholder="请输入有效期" v-model="addFormData.validityterm" auto-complete="off" class="inputDate"></el-input>
                        <el-select class="selectDate" v-model="addFormData.validitytermType" :placeholder="dateTypeList[0].typeName">
                            <el-option v-for="item in dateTypeList" :key="item.typeCode" :label="item.typeName" :value="item.typeCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册证编号" class="fromItem " prop="registration">
                        <el-input placeholder="请输入注册证编号" v-model="addFormData.registration"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期至" class="fromItem marginRight fromDate" prop="registrationValiddate">
                        <el-date-picker class="fromDateInput" type="date" placeholder="选择日期" :clearable='false' v-model="addFormData.registrationValiddate" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="生产厂家" class="fromItem" prop="manufacturer">
                        <el-input placeholder="请输入生产厂家名称" v-model="addFormData.manufacturer"></el-input>
                    </el-form-item>
                    <el-form-item label="生产许可证编号" class="fromItem marginRight maxLabelWidth" prop="licenceCode">
                        <el-input placeholder="请输入生产许可证编号" v-model="addFormData.licenceCode" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item class="fromItem isRequired" label="类别" prop="typeName">
                        <el-select v-model="addFormData.typeName" value-key="id" placeholder="请选择物料类别" @focus="getCategoryData" @change="getType">
                            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fromItem isRequired fromItemMin" label="预警数量" prop="waringNum">
                        <el-input type="text" v-enterNumber v-model="addFormData.waringNum" auto-complete="off" ></el-input><span> 个</span>
                    </el-form-item>
                    <el-form-item class="fromItem fromItemMin " label="初期数量" prop="primeNum">
                        <el-input v-enterNumber type="text" class="startNum" v-model="addFormData.primeNum" @keyup.native="setNone($event)" auto-complete="off"></el-input><span> 个</span>
                    </el-form-item>
                    <el-form-item label="备注" class="fromItem remarks" prop="remark">
                        <el-input  maxlength="100" type="textarea" :rows="3" resize="none" v-model="addFormData.remark" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer" align="right">
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                    <el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit">确 定</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import Dialog from '../../../../../../components/Dialog/Dialog';
    export default {
        props: ['changeDialogStatus', 'addDialogTitle'],
        components: {
            Dialog
        },
        data() {
            const validMaterieCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入编码'));
                } else {
                    this.$api.post('/warehouse/materiel/public/code', {
                        code: value
                    }, res => {
                        if(res.data){
                            if (res.data.length > 0) {
                                callback(new Error('物料库中已存在相同编码的物料'));
                            } else {
                                callback();
                            }
                        }else{
                             callback();
                        }
                        
                    }, res => {})
                }
            };
            const betweenInt = (min, max) => (rule, value, callback) => {
                const isBetween = value >= min && value <= max;
                const isInt = /^[0-9]+$/.test(value);
                if (isBetween && isInt) return callback()
                return callback(new Error(`数量在${min}到${max}之间`));
            }
            return {
                titleType: '新建物料',
                materialResult:[],
                searchType:0,/*搜索类型 */
                hasMaterieName:false,
                hasMaterieCode:false,
                cardList:[],/*物料类别 */
                typeInfo:{},/*选择类别的类别信息 */
                addFormData: {
                    id:'',
                    materieName: "",
                    /*物料名称 */
                    materieCode: "",
                    /* 物料编码*/
                    spec: "",
                    /*规格型号 */
                    typeName: "",
                    /*物料类别名称 */
                    type: "",
                    /*物料类别id */
                    unitName: '',
                    /*物料单位 */
                    registration: '',
                    /* 注册证编号*/
                    manufacturer: "",
                    /* 生产厂家*/
                    licenceCode: '',
                    /*生产许可证编号 */
                    stock: "",
                    /*库存 */
                    waringNum: '',
                    /*预警数量 */
                    validityterm: '',
                    /*有效期 */
                    validitytermType: 0,
                    /* 有效期类型 0-年 1-月*/
                    registrationValiddate: "",
                    /* 有效期至*/
                    supplier: "",
                    /* 供应商*/
                    remark: "",
                    /* 备注*/
                    primeNum: "",
                    /* 初期数量*/
                },
                /*验证 */
                formRules: {
                    materieName: [{required: true,message: '请输入物料名称', trigger: 'change'},
                        {min: 0,max: 8,message: '长度在 0 到 8 个字符',trigger: 'change'}
                    ],
                    materieCode: [{validator: validMaterieCode,trigger: 'blur'}],
                    spec:[{max:16,message: '长度在 0 到 16 个字符',trigger: 'change'}],
                    unitName: [{min: 0,max: 5,message: '长度在 0 到 5 个字符',trigger: 'change'}],
                    validityterm:[{validator: betweenInt(0, 99999),trigger: 'change'}],
                    manufacturer: [{min: 2,max: 16,message: '长度在 2 到 16 个字符',trigger: 'change'}],
                    typeName: [{required: true,message: '请选择物料类别',trigger: 'change'}],
                    waringNum: [{validator: betweenInt(0, 99999999),required: true,trigger: 'change'}],
                    primeNum: [{validator: betweenInt(0, 99999999),trigger: 'change'}],
                    remark:[{ min: 0,max: 200,message: '长度在 0 到 200 个字符',trigger: 'change' }],
                },
                categoryList:[],/*类别 */
                searchMaterieData: [],
                /*输入搜索物料名称返回数据 */
                searchMaterieDataTrue: false,
                /*搜索结果返回框 */
                dateTypeList: [{
                        typeName: '年',
                        typeCode: 0,
                    },
                    {
                        typeName: '月',
                        typeCode: 1,
                    }
                ],
                submitBtnDisabled: true,
                inputCountingType: ''
            }
        },
        computed: {
            validFrom(){
                if(this.addFormData.materieName.length>8|| this.addFormData.spec.length>16|| this.addFormData.unitName.length>5||Number(this.addFormData.validityterm)>99999||this.addFormData.manufacturer.length==1||this.addFormData.manufacturer.length>16|| this.addFormData.typeName==''||Number(this.addFormData.waringNum)>99999999 || Number(this.addFormData.waringNum)==0|| Number(this.addFormData.primeNum)>99999999|| this.addFormData.remark.length>200){
                    return true;
                }else{
                    return false;
                }
            }
        },
        watch: {
            addFormData: {
                handler(val, oldVal) {
                    this.submitBtnDisabled=this.validFrom
                },
                deep: true
            },
        },
         directives: {
            /*只能输入正整数,首位不能是0*/
            enterNumber: {
                inserted:el => {
                    el.addEventListener("keypress", e => {
                        e = e || window.event;
                        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
                        let re = /\d/;
                        if ((!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) || (el.children[0].value.length===0 && charcode===48)) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                        }
                    });
                }
            }
        },
        created() {
        },
        methods: {
            getType(val){
                this.addFormData.typeName=val.name
                this.addFormData.type=val.id
            },
            setNone(event){
                const thisEl = event.target || event.srcElement;
                let errTip=thisEl.parentNode.parentNode.children[2];
                if(!this.addFormData.primeNum && errTip){
                    errTip.style.display='none'
                }
            },
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'showAddMaterialDialog');
            },
            /*选择搜索类型 */
            selectSearchType(searchType) {
                this.searchType = searchType;
                this.remoteMethod(this.addFormData.materieCode);
            },
            /*搜索请求 */
            remoteMethod(val) {
                let searchParams = {};
                if (val) {
                    if (this.searchType === 0) {
                        searchParams = {
                            name: val
                        }
                        this.getMaterieList('/warehouse/materiel/public/name', searchParams, val);
                    } else if (this.searchType === 1) {
                        searchParams = {
                            code: val
                        }
                        this.getMaterieList('/warehouse/materiel/public/code', searchParams, val)
                    }
                } else {
                    this.materialResult = [];
                }
                if (this.searchType === 0) {
                    this.addFormData.materieName = val;
                } else if (this.searchType === 1) {
                    this.addFormData.materieCode = val;
                }
            },
            /*搜索方法 */
            getMaterieList(url, searchParams, val) {
                this.$api.post(url, searchParams, res => {
                        if (res.data) {
                            if (res.data.length === 0) {
                                this.materialResult = [];
                            } else {
                                this.materialResult = [];
                                if (Array.isArray(res.data)) { /*搜索名称返回的是数组 */
                                    this.materialResult = res.data.map(item => {
                                        return {
                                            value: item.id,
                                            label: item.instrumentName,
                                            id: item.id,
                                            materieCode: item.instrumentCode,
                                            materieName: item.instrumentName,
                                            licenceCode: item.licenceCode,
                                            manufacturer: item.manufacturer,
                                            registration: item.registrationNum,
                                            registrationValiddate: item.registrationValiddate,
                                            spec: item.spec,
                                            unitName: item.unit,
                                            typeName: item.typeName,
                                            type: item.type,
                                            validityterm: item.validityterm,
                                            validitytermType: item.validitytermType
                                        }
                                    });
                                    /*检测名称是否重复*/
                                if (res.data.length !== 0) {
                                    res.data.forEach(item => {
                                        if (this.addFormData.materieName == item.instrumentName) {
                                            this.hasMaterieName = true;
                                            this.addFormData.id = item.id;
                                        } else {
                                            this.hasMaterieName = false;
                                        }
                                    })
                                }
                                } else { /*搜索编码返回的是对象*/
                                    let resultObj = {};
                                    resultObj.value = res.data.id;
                                    resultObj.label = res.data.instrumentName;
                                    resultObj.id = res.data.id;
                                    resultObj.materieCode = res.data.instrumentCode;
                                    resultObj.materieName = res.data.instrumentName;
                                    resultObj.licenceCode = res.data.licenceCode;
                                    resultObj.manufacturer = res.data.manufacturer;
                                    resultObj.registration = res.data.registrationNum;
                                    resultObj.registrationValiddate = res.data.registrationValiddate;
                                    resultObj.spec = res.data.spec;
                                    resultObj.unitName = res.data.unit;
                                    resultObj.typeName = res.data.typeName;
                                    resultObj.type = res.data.type;
                                    resultObj.validityterm = res.data.validityterm;
                                    resultObj.validitytermType = res.data.validitytermType;
                                    this.materialResult.push(resultObj);
                                    /*检测物料编码是否有重复*/
                                    if(!!res.data){
                                        if (this.addFormData.materieCode == res.data.instrumentCode) {
                                            this.hasMaterieCode = true;
                                        } else {
                                            this.hasMaterieCode = false;
                                        }
                                    }
                                }
                            }
                        } else {
                            this.materialResult = [];
                        }
                    },
                    res => {
                        this.materialResult = [];
                    })
            },
            /*选择搜索出来的item */
            selectMaterialName(val) {
                this.addFormData.id = val.id;
                this.addFormData.materieName = val.materieName;
                this.addFormData.materieCode = val.materieCode;
                this.addFormData.licenceCode = val.licenceCode;
                this.addFormData.manufacturer = val.manufacturer;
                this.addFormData.registration = val.registration;
                this.addFormData.registrationValiddate = val.registrationValiddate;
                this.addFormData.spec = val.spec;
                this.addFormData.unitName = val.unitName;
                this.addFormData.typeName = val.typeName;
                this.addFormData.type = val.type;
                this.addFormData.validityterm = val.validityterm;
                this.addFormData.validitytermType = val.validitytermType;
                // this.addFormData.inoutcomingWay = val.inoutcomingWay;
                this.addFormData.spec = val.spec;
                this.specStart = val.spec;
                this.manufacturerStart = val.manufacturer;
                this.materialResult = [];
                this.hasMaterie=true;
            },
            /*选择物料 */
            getSearchMaterie(val) {
                this.addFormData= val;

            },
            /*提交按钮*/
            submit() {
                this.$store.commit('setData', this.addFormData)
                this.closeDialog();
            },
            /* 聚焦物料类别，获取物料类别下拉数据*/
			getCategoryData() {
                this.$api.get('/materiel/category/tree', null, res => {
                    const getLastChild = (arr, tree, parentName) => {
                        tree.map(ch => {
                            const {name,id, children,parentId} = ch;
                            const _name = parentId ? `${parentName}-${name}` : name;
                            if (!children.length) {
                                arr.push({
                                    name: _name,
                                    id,
                                });
                            }
                            if (children.length) getLastChild(arr, children, _name);
                        });
                        return arr;
                    }
                    this.categoryList = getLastChild([], res.data, '');
                });
            },
            /*选择类别*/
            selectClass(val){
                this.addFormData.typeName=val.typeName;
                this.addFormData.typeId=val.typeId;
            },
        }
    }
</script>

<style lang="less">
    @import url(./addMaterial.less);
</style>
		