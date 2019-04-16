<template>
	<el-container class="quality">
    <el-row class="nav-left">
      <el-col >
        <h5>质量管理</h5>
        <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"  >
          <el-menu-item index="1">
            <router-link to="/factory/quality/process" slot="title">过程检验</router-link>
          </el-menu-item>
          <el-menu-item index="2" >
            <router-link to="/factory/quality/production" slot="title">成品检验</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/factory/quality/stencil" slot="title">模板设置</router-link>
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
