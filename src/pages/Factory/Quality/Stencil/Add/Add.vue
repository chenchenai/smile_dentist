<template>
	<div>
		<Dialog className="addStencil" title="新建模板" @closeDialog="closeDialog">
			<div class="slotDiv">
        <div class="addCont">
          <el-form :model="addFormData"  label-position="left" label-width="80px" ref="addFormData">
            <div class="baseInfon">
              <el-form-item label="模板名称" class="fromItem isRequired" prop="name">
                  <el-input  maxlength="32" placeholder="请输入产品名称" v-model="addFormData.name" @blur="validName(addFormData.name)"></el-input>
                  <p class="errorNotice" v-if="nameValid.status">{{ nameValid.text }}</p>
              </el-form-item>
            </div>
            <div class="baseChose">
              <div class="isRequired" >
                <label class="el-form-item__label">模板类型</label>
                <template>
                  <el-radio-group v-model="addFormData.result" @change="selectQc">
                    <el-radio :label="0">过程质检</el-radio>
                    <el-radio :label="1">成品质检</el-radio>
                  </el-radio-group>
                </template>
              </div>

            </div>
          </el-form>
          <!--表格-->
          <div class="tableDate">
            <div class="table">
              <el-table
                :data="tableData"
                ref="table"
                tooltip-effect="dark"
                border
                stripe
                style="width: 95%"
                @header-click="addRow"
                height="280px">
                <el-table-column label="+"   width="45" align="center" >
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, tableData)"
                      type="text"
                      size="small">
                      <img src="../../../../../../static/images/icon/del.png"/>
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="编号" align="center" width="150">
                  <template slot-scope="scope">
                    <el-input maxlength="15" v-model="scope.row.rowNum" placeholder="请输入编号"></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="质检项目" align="center"  width="250">
                  <template slot-scope="scope">
                    <el-input maxlength="15" v-model="scope.row.qcitem" placeholder="请输入质检项目"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="标准" align="center">
                  <template slot-scope="scope">
                    <el-input maxlength="500" v-model="scope.row.standard" placeholder="请输入标准"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
				<div slot="footer" class="dialog-footer" align="center">
					<el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit">确 定</el-button>
					<el-button class="cancel" @click.native="closeDialog">取 消</el-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../../components/Dialog/Dialog';
	export default {
		props: [ 'changeDialogStatus' ],
		components: { Dialog },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('模板名称不能为空'));
        }else if(value !== ''){
          if(value.length<2){
            callback(new Error('输入应为2-32字符'));
          }
        }else{
          callback();
        }
      };
			return {
				addFormData: {
					name: "",
          result:0
				},
				nameList: [],
        nameValid: statusObj,
        submitBtnDisabled: true,
        tableData: [{
          rowNum: '',
          qcitem: '',
          standard: '',
        }],
        selectlistRow: [],
        stencilData: [],
        selectQcId:'',

			}
		},
		computed: {
			canSubmit() {
				let flag = false;
				let name = this.addFormData.name && !this.nameValid.status;
				if(name) {
					flag = true;
				}else {
					flag = false;
				};
				return flag;
			}
		},
		watch: {
			canSubmit(curVal) {
				if(curVal) {
					this.submitBtnDisabled = false;
				}else {
					this.submitBtnDisabled = true;
				}
            }
        },
		methods: {
      //校验模板名称
      validName(value) {
        if(value) {
          if(value.length < 2){
            this.nameValid = {
              status: true,
              text: '输入应为2-32字符'
            };
          }
          else{
            this.nameValid = {
              status: false,
              text: ''
            };
          }
        }else {
          this.nameValid = {
            status: true,
            text: '模板名称不能为空'
          };
        }

      },
      // 删除行
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      // 增加行
      addRow () {
        var list = {
          rowNum: this.rowNum,
          qcitem: this.qcitem,
          standard: this.standard,
        };
        this.tableData.push(list)
      },
      //选择模板类型
      selectQc(value){
        this.addFormData.result = value;
      },

      submit(){
        this.stencilData = [];
        this.tableData.map((item,index) =>{
          this.stencilData.push({
            flag:0,
            id:'',
            isAllowUnqualified:0,
            sortNo:item.rowNum,
            qcItem:item.qcitem,
            qcStandard:item.standard,
            templateId:''
          })
        });
        let postData={
          id:'',
          items:this.stencilData,
          name:this.addFormData.name,
          type:this.addFormData.result,
        };
        let canSubmit = this.canSubmit;
        if(canSubmit){
          this.$api.post('/qc/template/save/real', postData, res => {
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
              duration: 1000
            });
          });
        }

      },

			closeDialog() {
				this.$emit('changeDialogStatus', false);
			},

			// 聚焦产品类别，获取产品类别下拉数据
			getNameData() {
				this.$api.get('/product/category/tree', null, res => {
					// 解析树结构为 XX-XX-XX
					const getLastChild = (arr, tree, parentName) => {
						tree.map(ch => {
							const { name, id, resTypeTree, parentId } = ch;
							const _name = parentId ? `${parentName}-${name}` : name;
							if(!resTypeTree.length) {
								arr.push({
									name: _name,
									id,
								});
							}
							if (resTypeTree.length) getLastChild(arr, resTypeTree, _name);
						});
						return arr;
					};
					this.nameList = getLastChild([], res.data, '');
                });
			},
		}
	}
</script>

<style lang="less">
	@import url(./Add.less);
</style>
