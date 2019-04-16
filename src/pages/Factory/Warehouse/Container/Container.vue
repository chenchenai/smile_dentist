<template>
  	<el-container class="warehouse">
        <el-row class="nav-left">
            <el-col >
                <h5>仓库管理</h5>
                <el-menu :default-active="defaultIndex" class="el-menu-vertical-demo">
                    <el-menu-item index="1">
                        <router-link to="/factory/warehouse/materialStorage/materialStorageInfo" slot="title">物料入库</router-link>
                    </el-menu-item>
                    <el-menu-item index="2" >
                        <router-link to="/factory/warehouse/materialOutgoing/materialOutInfo" slot="title">物料出库</router-link>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <router-link to="/factory/warehouse/inventory/inventoryInfo" slot="title">库存明细</router-link>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <router-link to="/factory/warehouse/materialManagement/materialInfo" slot="title">物料信息</router-link>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <router-link to="/factory/warehouse/equipment/equipmentInfo" slot="title">设备信息</router-link>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <router-link to="/factory/warehouse/supplierManagement/supplierManagementInfo" slot="title">供应商管理</router-link>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>



        <!--<el-row>-->
            <!--<div class="treeContent"></div>-->
        <!--</el-row>-->
		<el-main>
			<router-view></router-view>
		</el-main>
  	</el-container>
</template>

<script type="text/javascript">
  	export default {
		data(){
  			return {
                  defaultIndex:'1'
  			}
        },
        created(){
            let routerPath=[
                {
                    index:'1',
                    path:'/factory/warehouse/materialStorage/materialStorageInfo'
                },
                {
                    index:'2',
                    path:'/factory/warehouse/materialOutgoing/materialOutInfo'
                },
                {
                    index:'3',
                    path:'/factory/warehouse/inventory/inventoryInfo'
                },
                {
                    index:'4',
                    path:'/factory/warehouse/materialManagement/materialInfo'
                },
                {
                    index:'5',
                    path:'/factory/warehouse/equipment/equipmentInfo'
                },
                {
                    index:'6',
                    path:'/factory/warehouse/supplierManagement/supplierManagementInfo'
                },

            ];
           let thisPath= routerPath.filter(item=>{
               return this.$route.path==item.path
            })
           
            this.defaultIndex=thisPath[0].index;
            
        },
        
        mounted(){
        },
        methods: {
            
        }
  	}
</script>

<style  lang="less">
	 @import url('./Container.less');
</style>
