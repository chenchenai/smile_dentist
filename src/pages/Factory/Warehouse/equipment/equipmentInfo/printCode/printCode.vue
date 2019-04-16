<template>
    <div classs='printCode'>
        <Dialog className="printCode" :title="dialogTitle" @closeDialog="closeDialog">
            <div class="slotDiv">
                <!-- 打印条码-->
                <p class="tips">确定打印条码吗?</p>
                <div class="print-label" style="width: 200px;">
                    <div class="codeContainer" id='codeContainer' style="width: 200px;page-break-after: always"></div>
                </div>
                <el-row :gutter="20">
                    <el-col :span="24" class="smallLeft alignRight">
                        <el-button @click="closeDialog">取 消</el-button>
                        <el-button type="primary" @click="printSubmit">确 定</el-button>
                    </el-col>
                </el-row>
            </div>
        </Dialog>
    </div>
</template>
<script>
    import Dialog from '../../../../../../components/Dialog/Dialog';
    export default {
        name: 'printCode',
        props: ['dialogTitle', 'selectCodeResult'],
        components: {
            Dialog
        },
        data() {
            return {
            }
        },
        created(){
            console.log(this.selectCodeResult)
        },
        methods: {
            closeDialog() {
                this.$emit('changeDialogStatus', false, 'printCodeDialog')
            },
            /*
            打印插件
            */
            printCallback(ret) {
                if (!ret) {
                    this.$message({
                        message: '请联系管理员给本机安装打印服务并设置模板',
                        type: 'warning',
                        duration: 1000
                    });
                } else {
                    /*
                    打印服务启动
                     */
                    setTimeout(() => {
                        this.getTime();
                    }, 1000);
                }
            },
            getTime() {
                if (ZK_JSP.View.getTempls().length > 0) {
                    this.print(this.selectCodeResult);
                    this.closeDialog();
                } else {
                    this.$message({
                        message: '请联系管理员给本机设置模板',
                        type: 'warning',
                        duration: 1000
                    });
                }
            },
            print(repData) {
                let data = {
                    templ: "订单条码打印模版",
                    content: [],
                    repeat: repData,
                    header: [],
                    footer: []
                };
                ZK_JSP.View.print(data);
            },
            /*打印 */
            printSubmit() {
                ZK_JSP.View.init(this.printCallback);
                // let _self = this;
                // let html = '';
                // this.selectCodeResult.forEach((item, index) => {
                //     html += `<div style="display: inline-block;margin-right: 50px;width:200px;margin-top:30px;">
                //                     <div style="display: flex;justify-content: space-between;align-items: center;">
                //                         <p style="color:#333333;font-size:16px;">${item.name}</p>
                //                         <p style="color:#333333;">${item.spec}</p>
                //                     </div>
                //                     <p style="text-align:right;color:#333333;margin-top:15px;">有效期至:${item.expipyDate}</p>
                //                     <svg preserveAspectRatio="xMinYMin meet"  class="codeItem${index}">${item.barCode}</svg>
                //                 </div>`;
                // })
                // $('.codeContainer').html(html);
                // $('.codeContainer').find('svg').map((index, item) => {
                //     var viewBoxWidth = 200 + 'px';
                //     var viewBoxHeight = 100 + 'px';
                //     item.removeAttribute("width");
                //     item.removeAttribute("height");
                //     console.log(item)
                //     item.setAttribute("width", viewBoxWidth);
                //     item.setAttribute("height", viewBoxHeight);
                //     JsBarcode('.' + item.getAttribute('class'), _self.selectCodeResult[index].barCode, {
                //         format: "CODE128", //选择要使用的条形码类型
                //         text: _self.selectCodeResult[index].barCode,
                //         displayValue: true, //是否在条形码下方显示文字
                //         textPosition: "bottom", //设置文本的垂直位置
                //         width: 1.5, //设置条之间的宽度
                //         height: 70, //高度
                //         fontSize: '15px', //字体大小,
                //     })
                // })
                // $('body').html($('.codeContainer').html())
                // window.print();
                // window.location.reload();
                // $('.codeContainer').html("");
            },
        }
    }
</script>
<style lang="less">
    @import url(./printCode.less);
</style>


