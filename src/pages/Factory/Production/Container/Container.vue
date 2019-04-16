<template>
	<el-container class="production">
    <el-row class="nav-left">
      <el-col >
        <h5>生产管理</h5>
        <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"  >
          <el-menu-item index="1">
            <!--<span slot="title">车间扫描</span>-->
            <router-link to="/factory/production/scan" slot="title">车间扫描</router-link>
          </el-menu-item>
          <el-menu-item index="2" >
            <router-link to="/factory/production/technology" slot="title">工艺路线</router-link>
            <!-- <span slot="title">工艺路线</span> -->
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/factory/production/procedure" slot="title">工序设置</router-link>
            <!-- <span slot="title">工序设置</span> -->
          </el-menu-item>
        </el-menu>
      </el-col>
  </el-row>
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
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
	}
</script>

<style  lang="less">
	@import url('./Container.less');
</style>
