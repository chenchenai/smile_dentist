<template>
    <div>
        <Dialog className="Modify" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="material_tab">
                    <ul class="material_tab_th">
                       <li class='el-input' v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                    </ul>
                    <div class="happyScroll_box" style="height:180px;">
                        <happy-scroll color="#ffffff" size="4" resize style="min-height: 146px">
                            <!-- <div class="material_tab_td"> -->
                            <ul class="material_tab_td" >
                                <li v-for="(item,index) in entryFormData" :key="index">
                                    <p class="el-input">{{item.traceCode}}</p>
                                    <p class="el-input">{{item.materialName}}</p>
                                    <p class="el-input">{{item.materialCode}}</p>
                                    <p class="el-input">{{item.spec}}</p>
                                    <p class="el-input">{{item.type}}</p>
                                    <p class="el-input">{{item.unit}}</p>
                                    <p class="el-input">{{item.supplier}}</p>
                                    <p class="el-input">{{item.entryNum}}</p>
                                    <p class="el-input">{{item.batchNum}}</p>
                                    <p class="el-input">{{item.currentStock}}</p>
                                    <input class="el-input" v-enterNumber v-model="item.inventory" placeholder="" maxlength="35" @blur="validVal($event)"/>
                                </li>
                            </ul>
                            <!-- </div> -->
                        </happy-scroll>
                    </div>
                </div>
                <div class="remaks">
                        <p class="remaksTip">备注</p>
                        <textarea name=""  cols="30" rows="3" v-model="remakes" maxlength="35"></textarea>
                    </div>
                <div slot="footer" class="dialog-footer" align="right">
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                    <el-button :disabled="submitBtnDisabled" type="primary" class="submit" @click.native="submit">确 定</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script type="text/javascript">
    import Dialog from "../../../../../../components/Dialog/Dialog";
    export default {
        props: ["changeDialogStatus", "titleType",'selectionResult'],
        components: {
            Dialog
        },
        data() {
            let statusObj = {
                status: false,
                text: ""
            };
            return {
                materialTabTh: [
                    '追溯码',
                    '物料名称',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '供应商',
                    '入库单号',
                    '批次号',
                    '当前库存',
                    '实际数量*',
                ],
                entryFormData: [],
                submitData:[],
                submitBtnDisabled: false,
                /*确定按钮是否可点击 */
                thisEl: '',
                /*聚焦的当前元素*/
                thisElIndex: 0,
                remakes:'',
            };
        },
        directives: {
            /*只能输入正整数,首位不能是0*/
            enterNumber: {
                inserted:el => {
                    el.addEventListener("keypress", e => {
                        e = e || window.event;
                        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
                        let re = /\d/;
                        if ((!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) || (el.value.length===0 && charcode===48)) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                        }
                    });
                }
            }
        },
        computed: {
        },
        watch: {},
        created(){
            this.initMaterialSocket();
        },
        mounted() {
            this.setScrollWidth();
        },
        methods: {
            /*设置滚动容器的宽度 */
            setScrollWidth() {
                this.$nextTick(() => {
                    let happyScrollContainer = document.querySelector('.happy-scroll-container');
                    let happyScrollContent = document.querySelector('.happy-scroll-content');
                    happyScrollContent.style.width = happyScrollContainer.offsetWidth - 20 + 'px'
                })
            },
            /*获取选择的物料库存信息*/
            initMaterialSocket(){
                if(this.selectionResult.length>0){
                   this.entryFormData=this.selectionResult.map(item=>{
                        return {
                            traceCode: item.traceCode,
                            materialName: item.materialName,
                            materialCode: item.materialNo,
                            spec: item.spec,
                            type: item.materialType,
                            unit: item.unitName,
                            supplier: item.supplier,
                            entryNum: item.orderNo,
                            batchNum: item.batchNo,
                            currentStock:item.stock,
                            inventory: '',
                            id:item.id,
                            remakes:this.remakes
                        }
                    })
                }
            },
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showModifyDialog");
            },
            submit() {
                let _self=this;
                this.submitData=this.entryFormData.map(item=>{
                    return {
                        id:item.id,
                        inventory:Number(item.inventory),
                        remakes:item.remakes
                    }
                })
                this.$api.post('/warehouse/inventory/modify',this.submitData,res=>{
                    this.$message({
                        message: '修改成功',
                        type: 'success',
            			duration: 1000,
                    });
                    setTimeout(()=>{
                        _self.closeDialog()
                    },3000)
                },
                res=>{
                    this.$message.success(res.msg);
                })
            },
            validVal(event){
               let  thisEl = event.target || event.srcElement;
               let re = /\d/;
               if(!re.test(Number(thisEl.value))){
                   thisEl.value='';
                   thisEl.placeholder='请输入正整数';
                   if(!thisEl.classList.contains('wangingTip')){
                       thisEl.classList.add('wangingTip')
                   }
               }else{
                   thisEl.placeholder='';
                   if(thisEl.classList.contains('wangingTip')){
                       thisEl.classList.remove('wangingTip')
                   }
               }
            }
        }
    };
</script>

<style lang="less">
    @import url(./Modify.less);
</style>
		