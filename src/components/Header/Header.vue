<template>
	<div class="header">
		<!-- sprint2任务 -->
		<div class="logo" @click="logoClick"></div>
		<div class="nav">
			<ul>
				<li class="navItem" v-for="item in navList" @click="navClick(item.url)">{{ item.name }}</li>
			</ul>
		</div>
		<div class="user">
			<div class="traceBackTo" @click="traceBackTo">
				<i></i>
				<p>产品追溯</p>
			</div>
			<div class="userMsg" @click="userMsg">
				<el-popover
					placement="bottom"
					width="400"
					popper-class="msgPopper"
					trigger="click">
					<el-tabs type="border-card">
						<el-tab-pane label="订单">

						</el-tab-pane>
						<el-tab-pane label="库存"></el-tab-pane>
						<el-tab-pane label="收款"></el-tab-pane>
					</el-tabs>
					<el-badge is-dot class="item" slot="reference">
	        			<i></i>
						<p>消息</p>
					</el-badge>
				</el-popover>
        	</div>
			<div class="userName">
				<el-dropdown trigger="click">
	        		<span class="el-dropdown-link">
			        	AdminMan<i class="el-icon-caret-bottom el-icon--right"></i>
			      	</span>
			      	<el-dropdown-menu slot="dropdown">
				        <el-dropdown-item @click.native="editPwd">修改密码</el-dropdown-item>
				        <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
			      	</el-dropdown-menu>
		    	</el-dropdown>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return {
				navList: [
					{ name: '首页', url: '/factory/index' },
					{ name: '订单', url: '/factory/order' },
					{ name: '产品', url: '/factory/product' },
					{ name: '客户', url: '/factory/customer' },
					{ name: '生产', url: '/factory/production' },
					{ name: '质检', url: '/factory/quality' },
					{ name: '仓库', url: '/factory/warehouse' },
					{ name: '结算', url: '/factory/settlement' },
					{ name: '统计', url: '/factory/statistics' },
					{ name: '设置', url: '/factory/setup' }
				]
			}
		},
		methods: {
			navClick(url){
				this.$router.push(url);
			},
			logoClick(){
				this.$router.push('index');
			},
			traceBackTo(){
				alert('产品追溯')
			},
			userMsg(){
				// alert('消息')
			},
			editPwd(){
				alert('修改密码')
			},
			loginOut(){
				alert('退出登录')
			}
		}
	}
</script>

<style lang="less" scoped>
	@import url('./Header.less');
</style>
