<template>
    <div class="addMaterial">
        <Dialog className="addMaterial" :title="addDialogTitle" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="addFormData" :rules="formRules" label-position="left" label-width="100px" ref="addForm">
                    <el-form-item label="物料名称" class="fromItem isRequired" prop="materieName">
                        <el-select class="el-input" filterable remote clearable value-key='id' v-model="addFormData.materieName" placeholder="请输入物料名称" :remote-method="remoteMethodName" @change="selectMaterialName" >
                            <el-option v-for="item in materialResult" :key="item.id" :label="item.materieName" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料编码" class="fromItem " prop="materieCode">
                        <el-select class="el-input" v-model="addFormData.materieCode" clearable filterable remote value-key='materieCode' :remote-method="remoteMethodCode" placeholder="请输入物料编码" @change="selectMaterialName" >
                            <el-option v-for="item in materialResult" :key="item.materieCode" :label="item.materieCode" :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input placeholder="请输入物料编码" v-model="addFormData.materieCode"></el-input> -->
                    </el-form-item>
                    <el-form-item label="规格型号" class="fromItem marginRightNone" prop="spec">
                        <el-input placeholder="请输入规格型号" v-model="addFormData.spec" @input="judgeSpec(addFormData.spec)" ></el-input>
                    </el-form-item>
                    <el-form-item label="单位" class="fromItem" prop="unitName">
                        <el-input placeholder="请输入单位" v-model="addFormData.unitName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期"  class="fromItem marginRight validityPeriod" prop="validityterm">
                        <el-input type="text" v-enterNumber placeholder="请输入有效期" v-model="addFormData.validityterm" auto-complete="off" class="inputDate el-input" ></el-input>
                        <el-select class="selectDate" v-model="addFormData.validitytermType" :placeholder="dateTypeList[0].typeName">
                            <el-option v-for="item in dateTypeList" :key="item.typeCode" :label="item.typeName" :value="item.typeCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册证编号" class="fromItem " prop="registration">
                        <el-input placeholder="请输入注册证编号" v-model="addFormData.registration"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期至" class="fromItem marginRight fromDate" prop="registrationValiddate">
                        <el-date-picker  class="fromDateInput" type="date" placeholder="选择日期" :clearable='false' v-model="addFormData.registrationValiddate" style="width: 100%;" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="生产厂家" class="fromItem" prop="manufacturer">
                        <el-input  @input="judgeManufacturer(addFormData.manufacturer)" placeholder="请输入生产厂家名称" v-model="addFormData.manufacturer"></el-input>
                        <!-- <p class="errorNotice" v-if="manufacturerValid.status">{{ manufacturerValid.text }}</p> -->
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
                    <el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit('addForm')">确 定</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import Dialog from '../../../../../../components/Dialog/Dialog';
    export default {
        props: ['changeDialogStatus', 'addDialogTitle', 'selectMaterialId'],
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
            const betweenInt = (min, max) => (rule, v, cb) => {
                const isBetween = v >= min && v <= max;
                const isInt = /^[0-9]+$/.test(v);
                if (isBetween && isInt) return cb()
                return cb(new Error(`数量在${min}到${max}之间`));
            }
            return {
                searchType: 0,
                /*搜索类型0名称,1编码 */
                loading:false,
                materialResult: [],
                /*搜索出来的list */
                resultObj: {},
                addFormData: {
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
                    waringNum: [{validator: betweenInt(1, 99999999),required: true,trigger: 'change'}],
                    primeNum: [{validator: betweenInt(0, 99999999),trigger: 'change'}],
                    remark:[{ min: 0,max: 200,message: '长度在 0 到 200 个字符',trigger: 'change' }],
                },
                dateTypeList: [{
                        typeName: '年',
                        typeCode: 0,
                    },
                    {
                        typeName: '月',
                        typeCode: 1,
                    }
                ],
                selectDate: 0,
                categoryList: [],
                submitBtnDisabled: true,
                materielTotalData: [],
                inputCountingType: '',
                validMaterie: false,
                hasMaterieName: false,
                /*用于判断公共物料库中是否有该物料名称*/
                hasMaterieCode: false,
                /*用于判断公共物料库中是否有该物料编码*/
                isSpec: true,
                /*校验规格是否相同 */
                isManufacturer: true,
                /*校验生产厂家是否相同*/
                specStart: '' /*储存规格型号初始值,用于输入改变时比较是否相同 */ ,
                manufacturerStart: '' /*储存生产厂家初始值,用于输入改变时比较是否相同 */ ,
                hasMaterie:false,/*用于判断是否有相同的物料 */
            }
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
            if (this.addDialogTitle == '编辑物料') {
                this.editMaterial();
            }
        },
        watch: {
            addFormData: {
                handler(val, oldVal) {
                    if (this.addDialogTitle == '编辑物料') {
                        if (JSON.stringify(this.resultObj) === JSON.stringify(val)) {
                            this.submitBtnDisabled = true;
                        } else {
                            this.submitBtnDisabled = false;
                        }
                    } else { /*新建物料*/
                        this.submitBtnDisabled=this.validFrom
                    }
                },
                deep: true
            },
        },
        computed: {
            validFrom(){
                if(this.addFormData.materieName==''||this.addFormData.materieName.length>8|| this.addFormData.spec.length>16|| this.addFormData.unitName.length>5||Number(this.addFormData.validityterm)>99999||this.addFormData.manufacturer.length==1||this.addFormData.manufacturer.length>16|| this.addFormData.typeName==''||Number(this.addFormData.waringNum)>99999999|| Number(this.addFormData.primeNum)>99999999|| this.addFormData.remark.length>200){
                    return true;
                }else{
                    return false;
                }
            }
        },
        methods: {
            getType(val){
                this.addFormData.typeName=val.name
                this.addFormData.type=val.id
            },
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'showAddDialog');
            },
            /*选择搜索类型 */
            // selectSearchType(searchType) {
            //     // this.searchType = searchType;
            //     this.remoteMethod(this.addFormData.materieCode,searchType);
            // },
            setNone(event){
                const thisEl = event.target || event.srcElement;
                let errTip=thisEl.parentNode.parentNode.children[2];
                if(!this.addFormData.primeNum && errTip){
                    errTip.style.display='none'
                }
            },
            /*搜索物料名称*/
            remoteMethodName(val){
                this.materialResult = [];
                if(val){
                    this.loading = true;
                    this.$api.post('/warehouse/materiel/public/name', {name: val}, res => {
                        this.loading=false;
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
                    },res=>{})
                }
                
            },
            /*搜索物料编码*/
            remoteMethodCode(val){
                this.materialResult = [];
                if(val){
                    this.loading=true;
                    this.$api.post('/warehouse/materiel/public/code', {code: val}, res => {
                        this.loading=false;
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
                    },res=>{})
                }
            },
            // remoteMethod(val) {
            //     if (val) {
            //         if (searchType === 0) {
            //             this.getMaterieList('/warehouse/materiel/public/name', {name: val});
            //         } else if (searchType === 1) {
            //             this.getMaterieList('/warehouse/materiel/public/code', {code: val})
            //         }
            //     } else {
            //         this.materialResult = [];
            //     }
            //     if (searchType === 0) {
            //         this.addFormData.materieName = val;
            //     } else if (searchType === 1) {
            //         this.addFormData.materieCode = val;
            //     }
            // },
            /*搜索方法 */
            // getMaterieList(url, searchParams) {
            //     this.$api.post(url, searchParams, res => {
            //             if (res.data) {
            //                 if (res.data.length === 0) {
            //                     this.materialResult = [];
            //                 } else {
            //                     this.materialResult = [];
            //                     if (Array.isArray(res.data)) { /*搜索名称返回的是数组 */
            //                         this.materialResult = res.data.map(item => {
            //                             return {
            //                                 value: item.id,
            //                                 label: item.instrumentName,
            //                                 id: item.id,
            //                                 materieCode: item.instrumentCode,
            //                                 materieName: item.instrumentName,
            //                                 licenceCode: item.licenceCode,
            //                                 manufacturer: item.manufacturer,
            //                                 registration: item.registrationNum,
            //                                 registrationValiddate: item.registrationValiddate,
            //                                 spec: item.spec,
            //                                 unitName: item.unit,
            //                                 typeName: item.typeName,
            //                                 type: item.type,
            //                                 validityterm: item.validityterm,
            //                                 validitytermType: item.validitytermType
            //                             }
            //                         });
            //                         /*检测名称是否重复*/
            //                     if (res.data.length !== 0) {
            //                         res.data.forEach(item => {
            //                             if (this.addFormData.materieName == item.instrumentName) {
            //                                 this.hasMaterieName = true;
            //                                 this.addFormData.id = item.id;
            //                             } else {
            //                                 this.hasMaterieName = false;
            //                             }
            //                         })
            //                     }
            //                     } else { /*搜索编码返回的是对象*/
            //                         let resultObj = {};
            //                         resultObj.value = res.data.id;
            //                         resultObj.label = res.data.instrumentName;
            //                         resultObj.id = res.data.id;
            //                         resultObj.materieCode = res.data.instrumentCode;
            //                         resultObj.materieName = res.data.instrumentName;
            //                         resultObj.licenceCode = res.data.licenceCode;
            //                         resultObj.manufacturer = res.data.manufacturer;
            //                         resultObj.registration = res.data.registrationNum;
            //                         resultObj.registrationValiddate = res.data.registrationValiddate;
            //                         resultObj.spec = res.data.spec;
            //                         resultObj.unitName = res.data.unit;
            //                         resultObj.typeName = res.data.typeName;
            //                         resultObj.type = res.data.type;
            //                         resultObj.validityterm = res.data.validityterm;
            //                         resultObj.validitytermType = res.data.validitytermType;
            //                         this.materialResult.push(resultObj);
            //                         /*检测物料编码是否有重复*/
            //                         if(!!res.data){
            //                             if (this.addFormData.materieCode == res.data.instrumentCode) {
            //                                 this.hasMaterieCode = true;
            //                             } else {
            //                                 this.hasMaterieCode = false;
            //                             }
            //                         }
            //                     }
            //                 }
            //             } else {
            //                 this.materialResult = [];
            //             }
            //         },
            //         res => {
            //             this.materialResult = [];
            //         })
            // },
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
                this.addFormData.inoutcomingWay = val.inoutcomingWay;
                this.addFormData.spec = val.spec;
                this.specStart = val.spec;
                this.manufacturerStart = val.manufacturer;
                this.materialResult = [];
                this.hasMaterie=true;
            },
            /*输入规格的时候判断与初始值是否相同 */
            judgeSpec(val) {
                this.isSpec = val == this.specStart ? true : false;
            },
            /*输入厂家的时候判断与初始值是否相同 */
            judgeManufacturer(val) {
                this.isManufacturer = val == this.manufacturerStart ? true : false;
            },

            /*确定按钮 */
            submit(formName) {
                if(this.addFormData.waringNum===''){
                    this.addFormData.waringNum=0
                }
                if(this.addFormData.primeNum===''){
                    this.addFormData.primeNum=0
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let postData = {
                            category: this.addFormData.type,
                            code: this.addFormData.materieCode,
                            earlyWarningNumber: this.addFormData.waringNum,
                            initialNumber: this.addFormData.primeNum,
                            license: this.addFormData.licenceCode,
                            manufacturer: this.addFormData.manufacturer,
                            name: this.addFormData.materieName,
                            number: this.addFormData.registration,
                            remarks: this.addFormData.remark,
                            spec: this.addFormData.spec,
                            termOfValidityTo: this.addFormData.registrationValiddate?this.addFormData.registrationValiddate.split(' ')[0]:"",
                            termOfValidity: this.addFormData.validityterm,
                            termOfValidityType: this.addFormData.validitytermType,
                            unit: this.addFormData.unitName
                        };
                        if (this.selectMaterialId !== '' && this.selectMaterialId !== 'id') { /*编辑页面过来 */
                            postData['id'] = this.addFormData.id ? this.addFormData.id : this.selectMaterialId;
                            this.editSumbit(postData);
                        } else { /*新建物料页面 */
                            if(this.hasMaterie){
                                postData['id'] = this.addFormData.id;
                                    this.editSumbit(postData);
                            }else{
                                this.addSumbit(postData);
                            }
                            // if (this.addFormData.materieCode === '') { /*编码为空 */
                            //     if (this.hasMaterieName && this.isSpec && this.isManufacturer) { /*三者相同为编辑*/
                            //         postData['id'] = this.addFormData.id;
                            //         this.editSumbit(postData);
                            //     } else { /*三者不完全相同为新建 */
                            //         this.addSumbit(postData);
                            //     }
                            // } else { /*编码不为空*/
                            //     if (this.hasMaterieCode) { /*编码相同为编辑*/
                            //         postData['id'] = this.addFormData.id;
                            //         this.editSumbit(postData);
                            //     } else { /*编码不同为新建*/
                            //         this.addSumbit(postData);
                            //     }
                            // }
                        }
                    } else {
                        return false;
                    }
                });
            },
            /*新建提交请求 */
            addSumbit(postData) {
                this.$api.post('/warehouse/materiel/save', postData, res => {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        onClose: () => {
                            this.closeDialog();
                        }
                    })
                }, res => {
                    this.$message.error(res.msg);
                });
            },
            /*编辑提交请求*/
            editSumbit(postData) {
                this.$api.post('/warehouse/materiel/update', postData, res => {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        onClose: () => {
                            this.closeDialog();
                        }
                    })
                }, res => {
                    this.$message.error(res.msg);
                });
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
            // 遍历category tree
            getLastChild(arr, tree, parentName) {
                tree.map(ch => {
                    const {
                        name,
                        id,
                        resTypeTree,
                        parentId
                    } = ch;
                    const _name = parentId ? `${parentName}-${name}` : name;
                    if (!resTypeTree.length) {
                        arr.push({
                            name: _name,
                            id,
                        });
                    }
                    if (resTypeTree.length) this.getLastChild(arr, resTypeTree, _name);
                    return arr;
                })
            },
            /*编辑物料 */
            editMaterial() {
                if (this.selectMaterialId && this.selectMaterialId !== '') {
                    this.$api.post("/warehouse/materiel/detail", {
                            id: this.selectMaterialId
                        }, res => {
                            this.resultObj = res.data;
                            this.addFormData = Object.assign({}, res.data);
                        },
                        res => {
                            this.$message({
                                message: res.msg
                            });
                        }
                    );
                }
            },
            
        }
    }
</script>

<style lang="less">
    @import url(./Add.less);
</style>
		