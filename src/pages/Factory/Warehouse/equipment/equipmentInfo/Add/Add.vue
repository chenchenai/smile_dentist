<template>
    <div class="AddEquipment">
        <Dialog className="AddEquipment" :title="addDialogTitle" @closeDialog="closeDialog">
            <div class="slotDiv">
                <el-form :model="fromData" :rules="addFromRules" label-width="120px"  ref="elForm" >
                    <el-row :gutter="gutter">
                        <el-col :span="8" class="smallLeft required">
                            <el-form-item label="设备名称"  prop="devName">
                                <el-input name="equipmentName" v-model="fromData.devName"  maxlength="16"></el-input>
                                <!-- <span class="error-text" v-show="errorsBag.has('equipmentName')">{{ errorsBag.first('equipmentName') }}</span> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备条码" class="middleLabel" prop="devCode">
                                <el-input v-model="fromData.devCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="规格型号" prop="spec">
                                <el-input v-model="fromData.spec"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="生产日期" prop="productDate">
                                <el-date-picker v-model="fromData.productDate" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="注册证编号" class="middleLabel" prop="registrationNum">
                                <el-input v-model="fromData.registrationNum"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="有效期至" prop="expiryDate">
                                <el-date-picker v-model="fromData.expiryDate" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="生产厂家" prop="manufacturer">
                                <el-input v-model="fromData.manufacturer" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生产许可证编号" prop="licenceCode" class="middleLabel">
                                <el-input v-model="fromData.licenceCode" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="类别" prop="devType">
                                <el-select v-model="fromData.devType" placeholder="请选择设备类别" @focus="getCategoryData">
                                    <el-option v-for="(item,index) in typeNameList" :key="index" :label="item.name" :value="item.id" >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态" class="middleLabel" prop="state">
                                <el-select v-model="fromData.state" placeholder="请选择状态">
                                    <el-option v-for="(item,index) in statusList" :key="index" :label="item.lable" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="使用部门" prop="depId">
                                <el-select v-model="fromData.depId" placeholder="请选择部门"  @click.native="clickDept()">
                                    <el-option v-for="item in deptList" :key="item.value" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="8" class="smallLeft">
                            <el-form-item label="购买日期" prop="buyDate">
                                <el-date-picker v-model="fromData.buyDate" type="date" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="24" class="smallLeft">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="fromData.remark" maxlength="80"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="24" class="smallLeft">
                            <el-form-item label="上传图片" class="uploadImg" prop="fileList">
                                <el-upload class="upload" :multiple="true" :limit="9" ref="upload" :before-upload='beforeUpload' :on-success="uploadSuccess" :on-remove="removeImage" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.BMP" :action="uploadUrl" :file-list="fileList" list-type="picture">
                                    <img :src="uploadPic" alt="" srcset="" style="width:36px;height:34px;">
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="gutter">
                        <el-col :span="24" class="smallLeft alignRight">
                            <el-form-item>
                                <el-button @click="cancelAdd">取 消</el-button>
                                <el-button type="primary" :disabled="disabledBtn" @click="onSubmit('elForm')">确 定</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </Dialog>
    </div>
</template>
<script>
    import Dialog from '../../../../../../components/Dialog/Dialog';
    export default {
        name: 'AddEquipment',
        props: ['addDialogTitle','dialogType','devId'],
        components: {
            Dialog,
        },
        data() {
            const validRepeatName = (rule, value, callback) => {
                if (value.length>1 && this.allDevName.length>0 && this.dialogType!==1) {
                    let nameResult=this.allDevName.filter(item=>{
                                return value==item;
                            });
                    if(nameResult.length>0){
                        this.disabledBtn=true;
                        callback(new Error('设备名称已存在'));
                    }else{
                        this.disabledBtn=false;
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                gutter:40,
                position: 'left',
                deptList:[]/*部门数据 */,
                fromData: {
                    devName: '',/*设备名称 */
                    devCode: '',/*条码 */
                    spec: '',/*规格型号 */
                    productDate: '' /*生产日期 */ ,
                    registrationNum: '' /*注册证编号 */ ,
                    expiryDate: '' /*有效期至 */ ,
                    manufacturer: '' /*生产厂家 */ ,
                    licenceCode: '' /*生产许可证编号 */ ,
                    devType: '' /*类别 */ ,
                    state: '' /*状态 */ ,
                    depId: '' /*使用部门 */ ,
                    buyDate: '' /*购买日期 */ ,
                    remark: '' /*备注 */ ,
                    attachment:'',/*图片地址 */
                },
                
                uploadPic:require('../../../../../../../static/images/warehouse/upload_2.png'),
                uploadUrl: '',
                /*上传图片地址 */
                fileList: [],
                /*上传图片list */
                fileLenght:0,/*上传图片的个数 */
                typeNameList: []/*类别选择项 */,
                statusList: [ 
                    {
                        value: 0,
                        lable: '使用'
                    },
                    {
                        value: 1,
                        lable: '闲置'
                    },
                    {
                        value: 2,
                        lable: '维修'
                    },
                    {
                        value: 3,
                        lable: '损坏'
                    },
                    {
                        value: 4,
                        lable: '报废'
                    },
                ],/*状态选择项 */ 
                addFromRules:{
                    devName: [
                        { required: true, message: '设备名称不能为空', trigger: 'change' },
                        { min: 2, max: 16, message: '限制2-16个字符', trigger: 'change' },
                         { validator: validRepeatName, trigger: 'change' }
                    ],
                    manufacturer:[
                        {  max: 30, message: '长度在30个字符以内', trigger: 'change' }
                    ],
                    licenceCode:[
                        {  max: 50, message: '长度在50个字符以内', trigger: 'change' }
                    ],
                    remark:[
                        {  max: 80, message: '长度在80个字符以内', trigger: 'change' }
                    ]
                },
                disabledBtn:true,/*提交按钮禁用开关 */
                allDevName:[]/*所有设备名 */
            }
        },
        computed: {
        　　newValue() {
        　　　　return this.fromData.devName
        　　}
        },
        watch:{
            newValue(newVal,oldVal){
                if(newVal.length>1){
                    this.disabledBtn=false;
                }else{
                    this.disabledBtn=true;
                }
            }
        },
        
        created() {
            this.uploadUrl = this.$api.exportNewSysBaseUrl() + '/file/upload?type=3';
            this.getAllDevName();
            this.isEdit();
        },
        methods: {
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'showAddDialog')
            },
            /*日期格式化*/
            timeFormat(value) {
                if (!value) return ''
                const time = new Date(value);
                const year = time.getFullYear();
                const month = time.getMonth()+1<10?'0'+Number(time.getMonth()+1):time.getMonth()+1;
                const date = time.getDate();
                const hours = time.getHours()<10?'0'+time.getHours():time.getHours();
                const minutes = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
                const seconds = time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds();
                return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
            },
            /*是否从编辑设备进来 */
            isEdit(){
                if(this.dialogType===1){
                    this.$api.post('/device/getDeviceById',{deviceId: this.devId},res=>{
                        this.fromData = res.data;
                        let imeList=res.data.registrationPics.indexOf(',')?res.data.registrationPics.split(','):res.data.registrationPics.split();
                        // this.fileList=res.data.registrationPics.indexOf(',')?res.data.registrationPics.split(','):res.data.registrationPics.split();
                        this.fileList=imeList.map((item,index)=>{
                            return {
                                name:`${index}.jpeg`,
                                url:item,
                                id:item.split('/img/')[1].split('/')[0]
                            }
                        })
                    },res=>{})
                }
            },
            /*获取设备名字 */
            getAllDevName(){
                this.$api.get('/device/selectDeviceName',{},res=>{
                    if(res.data.length>0){
                        this.allDevName=res.data;
                    }else{
                        this.allDevName=[];
                    }
                },res=>{})
            },
            /*解析类别树结构*/
			getCategoryData() {
				this.$api.get('/device/category/tree', null, res => {
					const getLastChild = (arr, tree, parentName) => {
						tree.map(ch => {
							const { name, id, children, parentId } = ch;
							const _name = parentId ? `${parentName}-${name}` : name;
							if(!children.length) {
								arr.push({
									name: _name,
									id,
								});
							}
							if (children.length) getLastChild(arr, children, _name);
						});
						return arr;
					}
					this.typeNameList = getLastChild([], res.data, '');
                });
            },
            // 获取部门数据
            clickDept() {
                this.$api.post('/selectRelationDept', { unitId: '66f7827b49104991b54e8bfc30877ffb' }, res => {
                    this.deptList = res.data.map(item=>{
                        return {
                            id:item.id,
                            name:item.name
                        }
                    });
                });
            },
            /*取消添加按钮*/
            cancelAdd(){
                this.closeDialog();
            },
            /*确定提交*/
            onSubmit(formName) {
                this.fromData.buyDate=this.timeFormat(this.fromData.buyDate);
                this.fromData.expiryDate=this.timeFormat(this.fromData.expiryDate);
                this.fromData.productDate=this.timeFormat(this.fromData.productDate);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dialogType===0){/*新建 */
                            this.addOrEditDev('/device/addOrUpdateDevice',this.fromData);
                        }else if(this.dialogType===1){/*编辑*/
                            this.fromData['id']=this.devId;
                            this.addOrEditDev('/device/addOrUpdateDevice',this.fromData);
                        }
                    } else {
                        return false;
                    }
                });
            },
            /*新建或编辑设备 */
            addOrEditDev(url,params){
                this.$api.post(url,params,res=>{
                    this.$message({
                        message: "操作成功",
                        type: "success",
                        onClose: () => {
                            this.closeDialog();
                        }
                    });
                },res=>{
                    this.$message({
                            message: '操作失败',
                            type: "error",
                        });
                })
            },
            /*上传图片之前 */
            beforeUpload(file){
                if(this.fileLenght==4){
                    this.$message.error('最多上传4张图片')
                    return false;
                }
                if(file.size>1048576){
                    this.$message.error('图片大小不能超过1M')
                    return false;
                }
            },
            // 图片上传成功
            uploadSuccess(response, file, fileList) {
                if (response.status == 200) {
                    this.fileLenght=fileList.length;
                    this.getImgUrl(fileList);
                    
                }
                
            },
            // 移除图片
            removeImage(file, fileList) {
                if(file.response){
                    this.$api.post('/file/delete', {
                        id: file.response.data[0].id
                    }, res => {
                        this.getImgUrl(fileList);
                    }, res => {
                        this.$message.error(res.msg);
                    });
                }else{
                    this.$api.post('/file/delete', {
                        id: file.id
                    }, res => {
                        this.getImgUrl(fileList);
                    }, res => {
                        this.$message.error(res.msg);
                    });
                }
                
            },
            // 解析图片url arr
            getImgUrl(list) {
                let arr = [];
                list.map((item, index) => {
                    if (item.response && item.response.data.length > 0) {
                        arr.push(item.response.data[0].path);
                    }else{
                        arr.push(item.url);
                    }
                });
                this.fromData.attachment =arr.toString();
            },

        }
    }
</script>
<style lang="less">
    @import url(./Add.less);
</style>


