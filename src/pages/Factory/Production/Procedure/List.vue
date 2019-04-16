<template>
    <div class="proceduce">
        <el-row class="top-btns">
            <el-button @click.native="openAddProceduce">
                <img src="../../../../../static/images/icon/gongxu.png">新建工序
            </el-button>
            <el-button>
                <img src="../../../../../static/images/technology/shanchu.png">删除
            </el-button>
            <div class="search" style="margin-top: 15px;">
                <el-input placeholder="工序名称"  class="input-with-select">
                    <el-button slot="append" >搜索</el-button>
                </el-input>
            </div>
        </el-row>
        <div class="Table" >
            <el-table :data="result.records" style="width: 100%">
                <el-table-column type="selection" align="center" width="74"></el-table-column>
                <el-table-column label='工序名称' align="center">
                    <template slot-scope="scope">
                        <p>
                            <span>{{ scope.row.procedureName }}</span>
                            <span v-if="scope.row.procedureType == 0" style="margin-left:6px"></span>
                            <span v-if="scope.row.procedureType == 1" style="margin-left:6px">※</span>
                            <span v-if="scope.row.procedureType == 2" style="margin-left:6px">△</span>
                            <span v-if="scope.row.procedureType == 3" style="margin-left:6px">※ △</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label='生产部门' prop="productDeptName.name" align="center" width="150"></el-table-column>
                <el-table-column label='生产人员' align="center">
                    <template slot-scope="scope">{{ anysisDeptUsers(scope.row.productDeptUsers) }}</template>
                </el-table-column>
                <el-table-column label='检验部门' prop="productCheckName.name" align="center" width="150"></el-table-column>
                <el-table-column label='检验人员' align="center">
                    <template slot-scope="scope">{{ anysisDeptUsers(scope.row.productCheckUsers) }}</template>
                </el-table-column>
                <el-table-column label='检验模板' prop="bsQcTemplate.templateName" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="page">
            <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
        </div>
        <template>
            <!-- 新建工序 -->
            <el-dialog class="addProceduce" title="新建工序" :visible.sync="addProceduceVisible" ref="dialog">
                <el-row>
                    <span class="rowLabel isRequired">工序名称</span>
                    <div class="rowContent">
                        <el-input @blur="volidProcedureName(addProcedureData.procedureName)" maxlength="16" minlength="2" v-model="addProcedureData.procedureName" placeholder="请输入工序名称"></el-input>
                        <p class="errorText" v-if="procedureNameValid.status">{{ procedureNameValid.text }}</p>
                    </div>
                </el-row>
                <el-row>
                    <span class="rowLabel">工序类型</span>
                    <div class="rowContent">
                        <el-checkbox v-model="cruxProce" @change="changeCruxProce">关键工序</el-checkbox>
                        <el-checkbox v-model="specialProcess">特殊过程</el-checkbox>
                    </div>
                </el-row>
                <el-row class="productDept">
                    <span class="rowLabel isRequired">生产部门</span>
                    <div class="rowContent">
                        <el-input
                            class="disabledInput"
                            v-model="addProcedureData.productDepId"
                            placeholder="请选择生产部门"
                            @click.native="clickDept(1)"
                            maxlength="0"
                            suffix-icon="el-icon-arrow-down"
                            @blur="volidPproductDept"
                            slot="reference"
                        ></el-input>
                        <div class="popoverProDep" v-show="showPopoverProDep">
                            <el-tree :data="deptList" :props="defaultProps" @node-click="proDeptNodeClick"></el-tree>
                        </div>
                    </div>
                    <div class="users productDepUsers">
                        <el-checkbox
                            class="header"
                            v-model="checkAllProUsers"
                            @change="handleCheckAllChange1">
                            生产人员
                        </el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="selectedProductUsers" @change="handleCheckedUsersChange1">
                            <el-checkbox v-for="user in allProductUsers" :label="user.id" :key="user.id">{{ user.name }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-row>
                <el-row class="checkTemplate" v-if="cruxProce">
                    <span class="rowLabel isRequired">检验模板</span>
                    <div class="rowContent">
                        <el-select v-model="addProcedureData.checkTemplate" placeholder="请选择检验模板" @blur="volidTemplate" @change="volidTemplate">
                            <el-option
                                v-for="item in checkTemplateList"
                                :key="item.id"
                                :label="item.templateName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <p class="errorText" v-if="checkTemplateValid.status">{{ checkTemplateValid.text }}</p>
                    </div>
                </el-row>
                <el-row class="checkDept" v-if="cruxProce">
                    <span class="rowLabel isRequired">检验部门</span>
                    <div class="rowContent">
                        <el-input
                            class="disabledInput"
                            v-model="addProcedureData.checkDepId"
                            placeholder="请选择检验部门"
                            @click.native="clickDept(2)"
                            maxlength="0"
                            suffix-icon="el-icon-arrow-down"
                            @blur="volidCheckDept"
                            slot="reference"
                        ></el-input>
                        <div class="popoverProDep" v-show="showPopoverCheckDep">
                            <el-tree :data="deptList" :props="defaultProps" @node-click="checkDeptNodeClick"></el-tree>
                        </div>
                    </div>
                    <div class="users productDepUsers">
                        <el-checkbox
                            class="header"
                            v-model="checkAllCheckUsers"
                            @change="handleCheckAllChange2">
                            检验人员
                        </el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="selectedCheckUsers" @change="handleCheckedUsersChange2">
                            <el-checkbox v-for="user in allCheckUsers" :label="user.id" :key="user.id">{{ user.name }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-row>
                <div class="dialog-footer" align="right">
                    <el-button class="submit" type="primary" @click.native="submitAddProceduce" :disabled="!canSubmit">确 定</el-button>
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                </div>
            </el-dialog>
        </template>
    </div>
</template>

<script type="text/javascript">
    import Page from '../../../../components/Page/Page';
  	export default {
        components: { Page },
		data(){
  			return {
                result: {},
                addProceduceVisible: false,
                cruxProce: false,
                specialProcess: false,
                addProcedureData: {
                    checkDepId: "",
                    checkTemplate: "",
                    checkUserIds: [],
                    procedureName: "",
                    procedureType: '',
                    productDepId: "",
                    unitid: "",
                    productUserIds: []
                },
                showPopoverProDep: false,
                showPopoverCheckDep: false,
                deptList: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedProductUsers: '',
                allProductUsers: [],
                checkAllProUsers: false,
                selectedCheckUsers: '',
                allCheckUsers: [],
                checkAllCheckUsers: false,
                checkTemplateList: [],
                procedureNameValid: {
                    status: false,
                    text: ''
                },
                productDepValid: {
                    status: false,
                    text: ''
                },
                checkTemplateValid: {
                    status: false,
                    text: ''
                },
                checkDeptValid: {
                    status: false,
                    text: ''
                },
                submitBtnDisabled: true,
                selCheckDepId: '',
                selProductDepId: '',
                hasSelProductUsersId: [],
                hasSelCheckUsersId: [],
  			}
		},
        mounted() {
            this.getWorkProList(1);
            this.getCheckTemplateList();
            document.body.addEventListener('click', this.closePopHover);
        },
        computed: {
            productDepId() {
                return this.addProcedureData.productDepId;
            },
            checkDepId() {
                return this.addProcedureData.checkDepId;
            },
            canSubmit() {
                let flag = false;
                let cruxProceValid = this.cruxProce;
                let procedureNameValid = (this.addProcedureData.procedureName != '') && !this.procedureNameValid.status;
                let productDepValid =  (this.addProcedureData.productDepId != '') && !this.productDepValid.status;
                let checkTemplateValid = (this.addProcedureData.checkTemplate != '') && !this.checkTemplateValid.status;
                let checkDeptValid = (this.addProcedureData.checkDepId != '') && !this.checkDeptValid.status;
                if(procedureNameValid && productDepValid){
                    if(!cruxProceValid){
                        flag = true;
                    }else{
                        if(checkTemplateValid && checkDeptValid){
                            flag = true;
                        }
                    }
                }
                return flag;
            }
        },
        watch: {
            canSubmit(curVal,oldVal) {
                this.submitBtnDisabled = !curVal;
            }
        },
        methods: {
            closeDialog() {
                let objStatus = {
                    status: false,
                    text: ''
                };
                this.addProcedureData = {
                    checkDepId: "",
                    checkTemplate: "",
                    checkUserIds: [],
                    procedureName: "",
                    procedureType: '',
                    productDepId: "",
                    unitid: "",
                    productUserIds: []
                };
                this.cruxProce = false;
                this.specialProcess = false;
                this.procedureNameValid = objStatus;
                this.productDepValid = objStatus;
                this.checkTemplateValid = objStatus;
                this.checkDeptValid = objStatus;
                this.allProductUsers = [];
                this.allCheckUsers = [];
                this.checkAllProUsers = false;
                this.checkAllCheckUsers = false;
                this.addProceduceVisible = false;
            },
            // 点击空白处关闭pophover
            closePopHover() {
                if(this.showPopoverProDep) {
                    this.showPopoverProDep = false;
                }
                if(this.showPopoverCheckDep) {
                    this.showPopoverCheckDep = false;
                }
            },
            submitAddProceduce() {
                // 解析提交参数
                let procedureType = null;
                // 工序类型
                if(!this.cruxProce && !this.specialProcess){
                    procedureType = 0;
                }
                if(this.cruxProce && !this.specialProcess) {
                    procedureType = 1;
                }
                if(!this.cruxProce && this.specialProcess) {
                    procedureType = 2;
                }
                if(this.cruxProce && this.specialProcess) {
                    procedureType = 3;
                }
                let data = {
                    checkDepId: this.selCheckDepId,
                    checkTemplate: this.addProcedureData.checkTemplate,
                    checkUserIds: this.hasSelCheckUsersId,
                    procedureName: this.addProcedureData.procedureName,
                    procedureType: procedureType,
                    productDepId: this.selProductDepId,
                    unitid: "66f7827b49104991b54e8bfc30877ffb",
                    productUserIds: this.hasSelProductUsersId
                };
                this.$api.post('/proceduce/newBuildBsProceduce', data,
                    res => {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.closeDialog();
                                this.getWorkProList(1);
                            }
                        });
                    }, res => {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000,
                        });
                    }
                );
            },
            // 关键工序
            changeCruxProce(value) {
                if(!value){
                    this.allCheckUsers = [];
                    this.hasSelCheckUsersId = [];
                    this.checkAllCheckUsers = false;
                }
            },
            // 查询工序列表
            getWorkProList(current) {
                this.$api.post('/proceduce/selectAllTable',
                    {
                        "current": Number(current),
                        "rowSize": 15,
                        "unitId": "66f7827b49104991b54e8bfc30877ffb"
                    },
                    res => {
                        if(!!res.data) {
                            this.result = res.data;
                        }
                    },
                    res => {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                            duration: 1000,
                        });
                    }
                );
            },
            // 点击分页
            pageChange(page) {
                this.getWorkProList(page);
            },
            // 解析表格部门人员
            anysisDeptUsers(list) {
                let str = '';
                let reg = /、$/gi;
                if(list && list.length > 0){
                    list.map((item, index) => {
                        str += item.name + '、';
                    });
                }
                return str.replace(reg, "");
            },
            // 打开新建工序
            openAddProceduce() {
                this.addProceduceVisible = true;
            },
            // 获取部门数据
            clickDept(type) {
                this.$api.post('/selectRelationDept', { unitId: '66f7827b49104991b54e8bfc30877ffb' }, res => {
                    this.deptList = res.data;
                    if(type == 1) {
                        this.showPopoverProDep = true;
                    }else {
                        this.showPopoverCheckDep = true;
                    }
                });
            },
            // 获取生产部门人员数据
            proDeptNodeClick(data) {
                if(data.children == null){
                    this.addProcedureData.productDepId = data.name;
                    this.selProductDepId = data.id;
                    this.hasSelProductUsersId = [];
                    this.productDepValid = {
                        status: false,
                        text: ''
                    };
                    this.showPopoverProDep = false;
                    this.$api.post('/factory/user/selectDeptUsers', { deptId: data.id, unitId: '66f7827b49104991b54e8bfc30877ffb' }, res => {
                        if(res.data.length > 0){
                            let arr = [];
                            res.data.map((item, index) => {
                                arr.push(item.id);
                            });
                            this.allProductUsers = res.data;
                            this.allProductUsers.map((item, index) => {
                                this.hasSelProductUsersId.push(item.id);
                            });
                            this.selectedProductUsers = arr;
                            this.checkAllProUsers = true;
                        }else{
                            this.allProductUsers = res.data;
                            this.selectedProductUsers = [];
                            this.allProductUsers.map((item, index) => {
                                this.hasSelProductUsersId.push(item.id);
                            });
                            this.checkAllProUsers = false;
                        }
                    });
                }
            },
            // 获取检验部门人员数据
            checkDeptNodeClick(data) {
                if(data.children == null){
                    this.addProcedureData.checkDepId = data.name;
                    this.selCheckDepId = data.id;
                    this.hasSelCheckUsersId = [];
                    this.checkDeptValid = {
                        status: false,
                        text: ''
                    };
                    this.showPopoverCheckDep = false;
                    this.$api.post('/factory/user/selectDeptUsers', { deptId: data.id, unitId: '66f7827b49104991b54e8bfc30877ffb' }, res => {
                        if(res.data.length > 0){
                            let arr = [];
                            res.data.map((item, index) => {
                                arr.push(item.id);
                            });
                            this.allCheckUsers = res.data;
                            this.allCheckUsers.map((item, index) => {
                                this.hasSelCheckUsersId.push(item.id);
                            });
                            this.selectedCheckUsers = arr;
                            this.checkAllCheckUsers = true;
                        }else{
                            this.allCheckUsers = res.data;
                            this.allCheckUsers.map((item, index) => {
                                this.hasSelCheckUsersId.push(item.id);
                            });
                            this.selectedCheckUsers = [];
                            this.checkAllCheckUsers = false;
                        }
                    });
                }
            },
            // 生产部门
            handleCheckAllChange1(val) {
                let arr = [];
                this.allProductUsers.map((item, index) => {
                    arr.push(item.id);
                });
                if(val){
                    this.selectedProductUsers = arr;
                    this.hasSelProductUsersId = arr;
                }else{
                    this.selectedProductUsers = [];
                    this.hasSelProductUsersId = [];
                }
            },
            handleCheckedUsersChange1(value) {
                let checkedCount = value.length;
                this.hasSelProductUsersId = value;
                this.checkAllProUsers = checkedCount === this.allProductUsers.length;
            },
            // 检验部门
            handleCheckAllChange2(val) {
                let arr = [];
                this.allCheckUsers.map((item, index) => {
                    arr.push(item.id);
                });
                if(val){
                    this.selectedCheckUsers = arr;
                    this.hasSelCheckUsersId = arr;
                }else{
                    this.selectedCheckUsers = [];
                    this.hasSelCheckUsersId = [];
                }
            },
            handleCheckedUsersChange2(value) {
                let checkedCount = value.length;
                this.hasSelCheckUsersId = value;
                this.checkAllCheckUsers = checkedCount === this.allCheckUsers.length;
            },
            // 查询新建工序-检验模板
            getCheckTemplateList() {
                this.$api.post('/qc/template/selectByProcess', null, res => {
                    this.checkTemplateList = res.data;
                });
            },
            // 校验工序名称输入
            volidProcedureName(value) {
                if(!value){
                    this.procedureNameValid = {
                        status: true,
                        text: '工序名称不能为空'
                    }
                }else{
                    if(value.length < 2){
                        this.procedureNameValid = {
                            status: true,
                            text: '输入应为2-16字符'
                        }
                    }else{
                        // 请求接口，验证名字是否已存在
                        // TODO 待云川提供接口
                        // 请求成功之后里面做判断
                        // if(1){
                        //     this.procedureNameValid = {
                        //         status: true,
                        //         text: '工序名称已存在'
                        //     }
                        // }else{
                        //     this.procedureNameValid = {
                        //         status: false,
                        //         text: ''
                        //     }
                        // }
                        this.procedureNameValid = {
                            status: false,
                            text: ''
                        }
                    }
                }
            },
            // 校验生产部门选择
            volidPproductDept(event) {
                // let e = event || window.event;
                if(!this.addProcedureData.productDepValid){
                    this.productDepValid = {
                        status: true,
                        text: '生产部门不能为空'
                    }
                }else{
                    this.productDepValid = {
                        status: false,
                        text: ''
                    }
                }
            },
            // 校验检验模板
            volidTemplate(value) {
                if(this.addProcedureData.checkTemplate){
                    this.checkTemplateValid = {
                        status: false,
                        text: ''
                    }
                }else{
                    this.checkTemplateValid = {
                        status: true,
                        text: '检验模板不能为空'
                    }
                }
            },
            // 校验检验部门
            volidCheckDept(event) {
                // let e = event || window.event;
                if(!this.addProcedureData.checkDepId){
                    this.checkDeptValid = {
                        status: true,
                        text: '检验部门不能为空'
                    }
                }else{
                    this.checkDeptValid = {
                        status: false,
                        text: ''
                    }
                }
            }
        }
    }
</script>

<style lang="less">
    @import url('./List.less');
</style>
