<template>
	<el-container class="factory">
		<el-header>
			<Header />
		</el-header>
		<el-main>
			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<script type="text/javascript">
	import Header from '../../../components/Header/Header'
	export default {
		components: { Header },
		data(){
			return {
			  Token:''

			}
		},
        created() {
    		// this.isRouterTurn();
        },
        methods: {
            //通过判断是否存在token值，页面跳转
            isRouterTurn(){
                this.Token = sessionStorage.getItem("token");
                if(!this.Token){
                    this.$message({
                        message: "请登录",
                        type: 'warning',
            			      duration: 1000,
                        onClose: () => {
                            this.$router.push('/login');
                        }
                    });
                }
            }
        }
	}
</script>

<style lang="less">
	@import url('./Container.less');
</style>
