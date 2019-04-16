<template>
    <div id="PrintOrdedrNum">
        <Dialog className="PrintOrdedrNum" title="打印出库单" @closeDialog="closeDialog">
            <div class="slotDiv">
                <div class="scrollBox">
                    <happy-scroll color="#ffffff" size="4" resize>
                        <div class="PrintBox">
                            <div class="PrintBoxCon" v-for="(item,index) in tableData" :key="index">
                                <h1>{{factory}}工厂出库单</h1>
                                <p class="entryDate">出库时间:{{item.createDate}}</p>
                                <table class="tableCon">
                                    <tr>
                                        <th v-for="(thItem,index) in tableTh" :key="index">{{thItem}}</th>
                                    </tr>
                                    <tr v-for="(tdItem,tdIndex) in item.inMaterialDetailed" :key="tdIndex">
                                        <td>{{tdItem.name}}</td>
                                        <td>{{tdItem.tracebackCode}}</td>
                                        <td>{{tdItem.materialNo}}</td>
                                        <td>{{tdItem.spec}}</td>
                                        <td>{{tdItem.clasName}}</td>
                                        <td>{{tdItem.unitName}}</td>
                                        <td>{{tdItem.batchNo}}</td>
                                        <td>{{tdItem.inNum}}</td>
                                    </tr>
                                </table>
                                <div class="tableBtm">
                                    <p>领用类型:{{item.outcomingType===0?'部门领用':'个人领用'}}</p>
                                    <p>领料人:{{item.userName}}</p>
                                    <p>经办人:{{item.handleUser}}</p>
                                </div>
                            </div>
                        </div>
                    </happy-scroll>
                    
                </div>
                <!-- 打印容器-->
                <div class="codeContainer" id='codeContainer'></div>

                <div class="dialog-footer" align="right">
                    <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
                    <el-button  type="primary" class="submit" @click.native="submit">确 定</el-button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
<script>
    import $ from 'jquery'
    import JsBarcode from 'jsbarcode'
    import Dialog from "../../../../../../components/Dialog/Dialog";
    export default {
        name: 'PrintOrdedrNum',
        props: ["changeDialogStatus",'selectIdResult'],
        components: {
            Dialog
        },
        data() {
            return {
                tableTh:[
                    '物料名称',
                    '追溯码',
                    '物料编码',
                    '规格型号',
                    '类别',
                    '单位',
                    '批次号',
                    '出库数量'
                ],
                tableData: [],
                factory:'',
            }
        },
        created(){
            this.getEntryNumInfo();
            this.getFactory();
        },
        methods: {
            /*获取登录人员所在的工厂信息 */
            getFactory(){
                this.$api.post('/warehouse/getFactoryMessage',{},res=>{
                    if(res.data){
                        this.factory=res.data;
                    }
                },res=>{
                    this.$message({
                        message: "请登录",
                        type: 'error'
                    })
                })
            },
            /*获取入库单详情 */
            getEntryNumInfo(){
                if(this.selectIdResult.length>0){
                    this.selectIdResult.forEach(item=>{
                        this.$api.post('/warehouse/materialOutDetailed',{id:item},res=>{
                            let itemResult={};
                            if(res.data){
                                itemResult=res.data;
                                this.tableData.push(itemResult)
                            }
                        },
                        res=>{

                        })
                    })
                }
            },
            closeDialog() {
                this.$emit("changeDialogStatus", false, "showPrintOrdedrNumDialog");
            },
            /*打印 */
            submit() {
                let _self=this;
                let html = '';
                this.tableData.forEach((item,index)=>{
                    let tdList='';
                    item.inMaterialDetailed.forEach((tdItem,tdIndex)=>{
                       tdList += `<tr>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.name}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.tracebackCode}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.materialNo}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.spec}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.clasName}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.unitName}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.batchNo}</td>
                                    <td style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">${tdItem.stockNum}</td>
                                </tr>`
                    })
                    
                    html += `<div class="PrintBox" style="max-width:1120px;margin:0 auto;page-break-after: always">
                            <div class="PrintBoxCon" style="margin-bottom: 30px;">
                                <h1 style="text-align: center;font-weight: 600;font-size: 18px;">${this.factory}工厂出库单</h1>
                                <p class="entryDate" style="text-align: right;margin: 0 0 15px;">出库时间:${item.createDate}</p>
                                <table class="tableCon" style="width:100%;">
                                    <tr>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">物料名称</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">追溯码</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">物料编码</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">规格型号</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">类别</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">单位</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">批次号</th>
                                        <th style="border: 1px solid #cccccc;text-align: center;min-height: 40px;">出库数量</th>
                                    </tr>
                                    ${tdList}
                                </table>
                                <div class="tableBtm" style="width: 100%;display: flex;justify-content: space-between;align-items: center;margin-top: 20px;">
                                    <p>领用类型:${item.outcomingType===0?'部门领用':'个人领用'}</p>
                                    <p>领料人:${item.userName}</p>
                                    <p>经办人:${item.handleUser}</p>
                                </div>
                            </div>
                        </div>`;
                })
                $('.codeContainer').html(html);
                $('body').html($('.codeContainer').html())
                window.print();
                window.location.reload();
                $('.codeContainer').html("");
            }
        }
    }
</script>
<style lang="less">
    @import url(./PrintOrdedrNum.less);
</style>
