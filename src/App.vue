<template>
    <div id="app">
    	<transition name="router-fade" mode="out-in">
    		<router-view></router-view>
    	</transition>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    @import url('./reset.css');
    @import url('./App.css');
</style>
