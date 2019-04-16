<template>
	<el-container class="SetUp">
		<el-aside width="110px">
			<h5>设置</h5>
            <el-menu default-active="3">
            	<el-menu-item :key="index" :index="String(index + 1)" v-for="(item, index) in menu">
                    <router-link :to="item.url" slot="title">{{ item.title }}</router-link>
                </el-menu-item>
            </el-menu>
		</el-aside>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<script type="text/javascript">
	import menu from './Menu'
	export default {
		data() {
			return {
				menu: [],
			}
		},
		created() {
			this.getMenuList();
		},
		methods: {
			// 获取menu数据
			getMenuList() {
				this.menu = menu(this);
			},
			// 匹配url和菜单栏isActice样式
			setIsActive() {
				// let router = location.hash.split('#')[1];
				// this.menu.map((item, index) => {
				// 	if(item.url === router) {
				// 		// item.
				// 	}
				// });
			}
		}
	}
</script>

<style type="text/css" lang="less">
	@import url('./Container.less');
</style>