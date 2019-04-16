<template>
    <div class="stencil">
      <el-row class="row-right">
        <el-row class="top-btns">
          <el-button @click.native="openAddDialog">
            <img src="../../../../../../static/images/icon/product.png">新建模板
          </el-button>
          <el-button  >
            <img src="../../../../../../static/images/technology/shanchu.png">复制模板
          </el-button>
          <el-button  >
            <img src="../../../../../../static/images/technology/shanchu.png">删除
          </el-button>
          <div class="search-btn">
            <div class="choose" style="margin-top: 15px;">
              <el-form ref="formData" :model="formData" label-width="80px" size="mini">
                <el-form-item  prop="type">
                  <el-select v-model="formData.type" placeholder="请选择活动区域" @change="selectType(formData.type)">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="search" style="margin-top: 15px;">
              <el-input placeholder="搜索产品名称"  class="input-with-select">
                <el-button slot="append" >搜索</el-button>
              </el-input>
            </div>
          </div>

        </el-row>
        <div class="Table" >
          <el-table :data="result.records" style="width: 100%">
            <el-table-column type="selection" align="center" width="74"></el-table-column>
            <el-table-column label='模板名称' prop="templateName" align="center"></el-table-column>
            <el-table-column label='模板类型' prop="templateType" align="center" width="100">
              <template slot-scope="scope">
                  {{scope.row.templateType == 0 ? '过程质检':(scope.row.templateType == 1 ? '成品质检':'')}}
              </template>
            </el-table-column>
            <el-table-column label='操作时间'  align="center" width="200">
              <template slot-scope="scope">
                {{scope.row.createDate.replace(/T/, " ").substring(0,scope.row.createDate.replace(/T/, " ").length-3)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <Page @pageChange="pageChange" :pageSize="result.size" :totalNum="result.total" :currentPage="result.current" />
        </div>
      </el-row>
      <template>
        <!-- 新建模板 -->
        <AddStencil v-if="showAddDialog" @changeDialogStatus="changeDialogStatus" />
      </template>

	</div>
</template>

<script type="text/javascript">
    import Page from '../../../../../components/Page/Page';
    import AddStencil from '../Add/Add';
    export default {
      components: { Page,AddStencil },
    	data() {
			return {
        result: {},
        goodsName: '',
        showAddDialog: false,
        formData:{
          type:'2'
        },
        // 模板类型
        options: [{
          value: '2',
          label: '全部'
        }, {
          value: '0',
          label: '过程质检'
        }, {
          value: '1',
          label: '成品质检'
        }],

			}
		},
      mounted() {
        this.getStencilList({
          currentPage: 1,
          name:this.formData.type == 0 ? '过程质检':(this.formData.type == 1 ? '成品质检':' '),
          type:this.formData.type
        });
      },
		methods: {
      // 打开新建模板弹窗
      openAddDialog() {
        this.showAddDialog = true;
      },
      changeDialogStatus(status) {
        if(!status){
          this.showAddDialog = false;
          this.getStencilList({
            currentPage: 1,
            name:this.formData.type == 0 ? '过程质检':(this.formData.type == 1 ? '成品质检':' '),
            type:this.formData.type
          });

        }
      },
      //选择模板获取模板列表数据
      selectType(value){
        this.formData.type = value;
        this.getStencilList({
          currentPage: 1,
          name:value == 0 ? '过程质检':(value == 1 ? '成品质检':''),
          type:value
        });
      },
      //获取模板列表
      getStencilList(data){
        this.$api.post('/qc/template/select', data, res => {
          this.result = res.data;
        });
      },
      // 点击分页
      pageChange(page) {
        this.getStencilList({
          "currentPage": page,
          "name":this.formData.type == 0 ? '过程质检':(this.formData.type == 1 ? '成品质检':' '),
          "type":this.formData.type
        });
      },
		}
    }
</script>

<style type="text/css" lang="less">
	@import url('./List.less');
</style>
