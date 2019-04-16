<template>
    <div>
        <Dialog className="traceCode" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
            </div>
        </Dialog>
    </div>
</template>
<script>
import Dialog from "../../../../../../components/Dialog/Dialog";
export default {
    name:'traceCode',
    components:{
        Dialog
    },
    props:['titleType'],
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>
<style lang="less">
@import url(./traceCode.less);
</style>


