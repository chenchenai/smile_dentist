<template>
  	<el-container class="product">
        <el-row class="nav-left">
            <el-col >
                <h5>产品管理</h5>
                <el-menu default-active="1" class="el-menu-vertical-demo">
                    <el-menu-item index="1">
                        <router-link to="/factory/product/product-info" slot="title">产品信息</router-link>
                    </el-menu-item>
                    <el-menu-item index="2" >
                        <span>报价方案</span>
                        <!-- <router-link to="/factory/production/technology" slot="title">报价方案</router-link> -->
                    </el-menu-item>
                    <el-menu-item index="3">
                        <span>质保卡</span>
                        <!-- <router-link to="/factory/production/procedure" slot="title">质保卡</router-link> -->
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

  			}
		},
        methods: {
        }
  	}
</script>

<style  lang="less">
	 @import url('./Container.less');
</style>
