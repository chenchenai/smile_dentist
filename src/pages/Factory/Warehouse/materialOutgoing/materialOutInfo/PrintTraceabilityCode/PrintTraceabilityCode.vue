<template>
    <div id="PrintTraceabilityCode">
        <Dialog className="PrintTraceabilityCode" :title="titleType" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="postionBtns">
                    <el-button type="text" @click="setPrinting">打印设置</el-button>
                </div>
                <div class="tableBox">
                    <ul class="material_tab_th">
                        <!-- <li class="selectAllLi" @click="selectAll()">
                            <input type="checkbox" class="checkInput checkLabelCheckInput" name="" :id="'selectAll'" ref="selectAll">
                            <label class="checkLabel" :for="'selectAll'"></label>
                        </li> -->
                        <li v-for="(item,index) in materialTabTh" :key="index">{{item}}</li>
                    </ul>
                    <div class="happyScroll_box" style="height:200px;">
                        <happy-scroll color="#ffffff" size="5" resize style="min-height: 146px">
                            <ul class="material_tab_td">
                                <li v-for="(item,index) in dataResult" :key="index">
                                    <!-- <p class="selectAllLi" >
                                        <input type="checkbox" class="checkInput checkLabelCheckInput" name="" :id="'selectAll'+index" ref="selectOne" @click="selectOneGoods(item.tracebackCode,$event)">
                                        <label class="checkLabel" :for="'selectAll'+index"></label>
                                    </p> -->
                                    <p>{{item.tracebackCode}}</p>
                                    <p>{{item.name}}</p>
                                    <p>{{item.materialNo}}</p>
                                    <p>{{item.className}}</p>
                                    <p>{{item.spec}}</p>
                                    <p>{{item.unitName}}</p>
                                    <p>{{item.supplierName}}</p>
                                    <p>{{item.orderNo}}</p>
                                    <p>{{item.batchNo}}</p>
                                    <p>{{item.stockNum}}</p>
                                    <input placeholder="1-999" class="printInput" v-enterNumber v-model="item.printingNum" @keyup="validNum(index)"/>
                                    
                                </li>
                            </ul>
                        </happy-scroll>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" align="right">
                    <el-button type="primary" class="submit" @click.native='submit()'>打 印</el-button>
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                </div>
            </div>
            <!-- 打印产品条形码-->
            <div class="print-label" style="width: 200px;">
                <div class="codeContainer" id='codeContainer' style="width: 200px;page-break-after: always"></div>
            </div>
        </Dialog>
    </div>
</template>
<script>
  import $ from 'jquery'
    import JsBarcode from 'jsbarcode'
    import Dialog from "../../../../../../components/Dialog/Dialog";
    export default {
        props: ["changeDialogStatus", "titleType",'selectCodeResult'],
        components: {
            Dialog,
            JsBarcode
        },
        data() {
            return {
                materialTabTh: [
                    '追溯码',
                    '物料名称',
                    '物料编码',
                    '类别',
                    '规格型号',
                    '单位',
                    '供应商',
                    '出库单号',
                    '批次号',
                    '当前库存',
                    '打印数量'
                ],
                // materialResult: [],
                // TraceabilityData: [],
                multipleSelection: [],
                dataResult: [],/*保存后台返回的数组*/
               
            }
        },
        created() {
            this.getEntryInfo();
        },
        directives:{
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
            },
        },
        methods: {
            /*获取物料追溯码详情 */
            getEntryInfo(){
                if(this.selectCodeResult){
                    this.$api.post('/warehouse/getByOderNo',this.selectCodeResult,res=>{
                        if(res.data && res.data.length>0){
                            let startResult=res.data;
                            startResult.forEach((item,index)=>{
                                item.forEach(sItem=>{
                                    sItem['orderNo']=this.selectCodeResult[index];
                                    sItem['printingNum']=sItem.stockNum;
                                })
                            });
                            this.dataResult=startResult.reduce((a, b)=> {
                                return a.concat(b)
                            });
                        }
                    },res=>{
                        this.dataResult=[]
                    })
                }
            },
            validNum(index){
                if(Number(this.dataResult[index].printingNum)>999){
                    this.dataResult[index].printingNum=this.dataResult[index].printingNum.replace(this.dataResult[index].printingNum,this.dataResult[index].printingNum.substring(0,3))
                }
                
                
            },
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showPrintTraCodeDialog");
            },
            openAddMaterialDialog() {
                this.$emit("changeDialogStatus", true, "showPrintTraCodeDialog");
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            setPrinting() {
                this.closeDialog();
                this.$emit("openSetPrintDialog");
            },
            // /*选择所有 */
            // selectAll() {
            //     this.selectList = []; /*先清空(以防前面单选操作,重复添加),后添加 */
            //     let AllcheckInput = this.$refs.selectOne;
            //     let refInputAll = this.$refs.selectAll;
            //     if (refInputAll.checked == true) {
            //         AllcheckInput.forEach(item => {
            //             if (item.checked == false) {
            //                 this.selectList.push(item.value);
            //                 item.checked = true;
            //             }
            //         });
            //     } else {
            //         AllcheckInput.forEach(item => {
            //             this.selectList = [];
            //             item.checked = false;
            //         });
            //     }
            // },
            // /*单选 */
            // selectOneGoods(val, event) {
            //     let srcEl = event.target || event.srcElement;
            //     if (srcEl.checked == true) {
            //         this.selectList.push(val);
            //     } else {
            //         let checkedFalseIndex = this.selectList.indexOf(val);
            //         this.selectList.splice(checkedFalseIndex, 1);
            //     }
            //     /*当有一个没选,全选按钮false,当所有的都选了,全选按钮true*/
            //     let refInputAll = this.$refs.selectAll;
            //     let refInput = this.$refs.selectOne;
            //     if (this.selectList.length === refInput.length) {
            //         refInputAll.checked = true;
            //     } else {
            //         refInputAll.checked = false;
            //     }
                
            // },
            /*打印 */
            submit() {
                let _self=this;
                let html = '';
                try{
                    this.dataResult.forEach((item,index)=>{
                        if(item.printingNum=='' || item.printingNum==0){
                            this.$message({
                                type:'error',
                                message:`请检查第${index+1}物料的打印数量,打印数量为必填项,且大于0`
                            })
                            throw 'jupm';
                        }else{
                            html += `<div style="display: inline-block;margin-right: 50px;width:200px;margin-top:30px;">
                                <div style="display: flex;justify-content: space-between;align-items: center;">
                                    <p style="color:#333333;font-size:16px;">${item.name}<span style="font-size:14px;">/${item.unit}</span></p>
                                    <p style="color:#333333;">${item.spec}</p>
                                </div>
                                <p style="text-align:right;color:#333333;margin-top:15px;">批次号:${item.batchNo}</p>
                                <svg class="codeItem${index}">${item.tracebackCode}</svg>
                            </div>`;
                            $('.codeContainer').html(html);
                            $('.codeContainer').find('svg').map((index,item)=>{
                                JsBarcode('.' + item.getAttribute('class'),_self.dataResult[index].tracebackCode,{
                                    format: "CODE128", //选择要使用的条形码类型
                                    text: _self.dataResult[index].tracebackCode,
                                    displayValue: true, //是否在条形码下方显示文字
                                    textPosition: "bottom", //设置文本的垂直位置
                                    width: 1, //设置条之间的宽度
                                    height: 70, //高度
                                    fontSize: '15px', //字体大小,
                                })
                            })
                            $('body').html($('.codeContainer').html())
                            window.print();
                            window.location.reload();
                            $('.codeContainer').html("");
                        }
                    
                    })
                    
                }catch(e){}
                
            }
        }
    }
</script>
<style lang="less">
    @import url(./PrintTraceabilityCode.less);
</style>
