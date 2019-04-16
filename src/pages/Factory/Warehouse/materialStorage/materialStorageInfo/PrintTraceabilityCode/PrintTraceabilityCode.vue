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
                                <li v-for="(item,index) in TraceabilityData" :key="index">
                                    <!-- <p class="selectAllLi" >
                                                <input type="checkbox" class="checkInput checkLabelCheckInput" name="" :id="'selectAll'+index" ref="selectOne" @click="selectOneGoods(item.TCode,$event)">
                                                <label class="checkLabel" :for="'selectAll'+index"></label>
                                            </p> -->
                                    <p class="el-input">{{item.TCode}}</p>
                                    <p class="el-input">{{item.name}}</p>
                                    <p class="el-input">{{item.encoded}}</p>
                                    <p class="el-input">{{item.type}}</p>
                                    <p class="el-input">{{item.spec}}</p>
                                    <p class="el-input">{{item.unit}}</p>
                                    <p class="el-input">{{item.supplier}}</p>
                                    <p class="el-input">{{item.entryNum}}</p>
                                    <p class="el-input">{{item.batchNum}}</p>
                                    <p class="el-input">{{item.stock}}</p>
                                    <input class="el-input" type='text'  v-model="item.printingNum"  v-enterNumber maxlength="3" @blur="errTip($event)"  placeholder="请输入">
                                </li>
                            </ul>
                        </happy-scroll>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer" align="right">
                    <el-button type="primary" class="submit"  @click.native='submit()' :disabled='printBtn'>打 印</el-button>
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
        props: ["changeDialogStatus", "titleType",'selectIdResult'],
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
                printBtn:true,
                // materialResult: [],
                TraceabilityData: [
                    // {
                    //     TCode: '0000000001',
                    //     name: '氧化锆瓷块',
                    //     encoded: 'HKSERWF98234LASDASD',
                    //     type: '自凝牙托粉II型1类',
                    //     spec: '牙托粉',
                    //     unit: '瓶',
                    //     supplier: '日进齿科材料…',
                    //     entryNum: '0120152012001',
                    //     batchNum: '662013',
                    //     stock: 15,
                    //     printingNum: '',
                    // }
                ],
                multipleSelection: [],
                // selectList: [],
                /*选择的数组 */
            }
        },
        created() {
            this.getEntryInfo();
        },
        directives: {
            /*只能输入正整数 */
            enterNumber: {
                inserted:el => {
                    el.addEventListener("keypress", e => {
                        e = e || window.event;
                        let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
                        let re = /\d/;
                        if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
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
        watch:{
            TraceabilityData:{
                handler:function(newVal,oldVal){
                    newVal.forEach(item=>{
                        if(item.printingNum!==''){
                            this.printBtn=false;
                        }else{
                            this.printBtn=true;
                        }
                    })
                },
                deep: true,
            }
        },
        methods: {
            /*获取物料追溯码详情 */
            getEntryInfo(){
                if(this.selectIdResult){
                    let resultList=[]
                   this.selectIdResult.forEach(item=>{
                       this.$api.post('/warehouse/materialDetailed',{id:item},res=>{
                            if(res.data.inMaterialDetailed.length>0){
                                let itemList=[];
                                itemList=res.data.inMaterialDetailed.map(sItem=>{
                                    return{
                                        TCode: sItem.tracebackCode,
                                        name: sItem.name,
                                        encoded: sItem.materialNo,
                                        type: sItem.clasName,
                                        spec: sItem.spec,
                                        unit: sItem.unitName,
                                        batchNum: sItem.batchNo,
                                        stock: sItem.stockNum,
                                        supplier: res.data.supplierName,
                                        entryNum: res.data.orderNo,
                                        printingNum: sItem.stockNum,
                                    }
                                })
                                resultList.push(itemList);
                                this.TraceabilityData= [].concat.apply([],resultList);
                            }
                        },res=>{

                        })
                    })
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


            /*错误提示 */
            errTip(event){
                let thisEl = event.target || event.srcElement;
                if(thisEl.value==''){
                    if(! thisEl.classList.contains('errTipClass')){
                        thisEl.classList.add("errTipClass");
                        thisEl.placeholder = '请输入1-999'
                    }
                }else{
                    if(thisEl.classList.contains('errTipClass')){
                        thisEl.classList.remove("errTipClass");
                    }
                    thisEl.placeholder = '请输入'
                }
                // console.log(...thisEl.classList)
            },
            /*打印 */
            submit() {
                let _self = this;
                let html = '';
                this.TraceabilityData.forEach((item, index) => {
                    html += `<div style="display: inline-block;margin-right: 50px;width:200px;margin-top:30px;">
                                        <div style="display: flex;justify-content: space-between;align-items: center;">
                                            <p style="color:#333333;font-size:16px;">${item.name}<span style="font-size:14px;">/${item.unit}</span></p>
                                            <p style="color:#333333;">${item.spec}</p>
                                        </div>
                                        <p style="text-align:right;color:#333333;margin-top:15px;">批次号:${item.batchNum}</p>
                                        <svg class="codeItem${index}" preserveAspectRatio="xMinYMin meet" viewBox="0,0,300,300">${item.TCode}</svg>
                                    </div>`;
                })
                $('.codeContainer').html(html);
                $('.codeContainer').find('svg').map((index, item) => {
                    JsBarcode('.' + item.getAttribute('class'), _self.TraceabilityData[index].TCode, {
                        format: "CODE128", //选择要使用的条形码类型
                        text: _self.TraceabilityData[index].TCode,
                        displayValue: true, //是否在条形码下方显示文字
                        textPosition: "bottom", //设置文本的垂直位置
                        width: 1, //设置条之间的宽度
                        height: 70, //高度
                        fontSize: '15px', //字体大小,
                    })
                })
                $('body').html($('.codeContainer').html())
                window.print();
                // window.location.reload();
                // $('.codeContainer').html("");
            },
            
        }
    }
</script>
<style lang="less">
    @import url(./PrintTraceabilityCode.less);
</style>
