<template>
    <div class="LoginContainer">
      <div class="top">
        <span class="logo"><img src="../../../../static/images/login/logo.png"/></span>
        <span class="name">微笑牙医</span>
      </div>
    	<div class="LoginContent">

	        <div class="content bot">
	        	<transition name="router-fade" mode="out-in">
                    <router-view></router-view>
            </transition>
	        </div>
    	</div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {

            }
        },
    }
</script>

<style scoped lang="less">
	@import './Container.less';
</style>
