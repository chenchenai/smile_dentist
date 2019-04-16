

<template>
  <div class="Code">
    <Dialog className="codeDialog" title="打印订单编码" @closeDialog="closeDialog">
      <div class="slotDiv">
        <el-form :model="orderCodeFormData" ref="orderCodeFormData" :rules="rules2" label-position="left"
                 label-width="68px">
          <el-form-item label="打印数量" class="fromItem" prop="printNumber">
            <el-input placeholder="1-99" v-model="orderCodeFormData.printNumber" auto-complete="off"></el-input>
          </el-form-item>
          <!--onkeypress="keyPress()" @onafterpaste="a(orderCodeFormData.printNumber)" @onkeyup="a(orderCodeFormData.printNumber)"-->
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button class="cancel" @click.native="closeDialog">取 消</el-button>
          <el-button class="submit" type="primary" @click.native="submit('orderCodeFormData')" >确 定</el-button>
        </div>
      </div>
      <!--&lt;!&ndash; 打印产品条形码&ndash;&gt;-->
      <!--<div   class="print-label" style="width: 200px;" >-->
        <!--<div class="codeContainer"   id='codeContainer' style="width: 200px;page-break-after: always"></div>-->
      <!--</div>-->
    </Dialog>

  </div>
</template>

<script type="text/javascript">
  // import $ from 'jquery'
  // import JsBarcode from 'jsbarcode'
  import Dialog from '../../../../components/Dialog/Dialog';
  export default {
    props: [ 'changeDialogStatus' ],
    components: { Dialog},
    data() {
      var validateOrderNumber = (rule, value, callback) => { //打印订单条码验证
        if (value === '') {
          callback(new Error('请输入需要打印的数量'));
        } else {
          if (value !== '') {
            var regNum = /^[1-9][0-9]?$/;
            if (!regNum.test(value)) {
              callback(new Error('请输入1-99之间的正整数'));
            }

          }
          callback();
        }
      };
      return {
        prints: [] , //打印条码
        orderCodeFormData: {
          printNumber: "",//打印数量
        },
        rules2: {
          printNumber: [
            {validator: validateOrderNumber, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {},
    mounted(){
    },
    methods: {
      /*
       打印插件
       */
      printCallback(ret){
        if(!ret) {
          this.$message({
            message: '请联系管理员给本机安装打印服务并设置模板',
            type: 'warning',
            duration: 1000
          });
        }
        else{
          /*
          打印服务启动
           */
          setTimeout(() => {
            this.getTime();
          }, 1000);
        }
      },
      getTime(){
        if(ZK_JSP.View.getTempls().length > 0){
          this.print(this.prints);
          this.closeDialog();
        }else{
          this.$message({
            message: '请联系管理员给本机设置模板',
            type: 'warning',
            duration: 1000
          });
        }
      },

      print(repData){
        let data = {templ:"订单条码打印模版", content:[],
          repeat:repData,
          header:[],
          footer:[]};
        ZK_JSP.View.print(data);
      },

      /*---------------新的验证方式方法-------------*/
      // 关闭打印订单
      closeDialog() {
        this.$emit('changeDialogStatus', false, 'showCodeDialog');
      },
      openDialog() {
        this.$emit('changeDialogStatus', true, 'showCodeDialog');
      },
      /*
      提交订单
       */
      submit(formName) {
        // $('.codeContainer').html("");
        this.prints=[];
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.post('/factory/order/print', {"count": this.orderCodeFormData.printNumber}, res => {
              if(res.data.length){
                res.data.map((item,index) =>{
                  this.prints.push({
                    Barcode:item,
                    BarcodeTxt:item,
                  })
                });
                ZK_JSP.View.init(this.printCallback);
              }
              // this.prints = res.data;
              // let html = '';
              // res.data.map((item, index) => {
              //   html += '<svg class="codeItem' + index + '"></svg></br>';
              // });
              // $('.codeContainer').html(html);
              // $('.codeContainer').find('svg').map((index, item) => {
              //   JsBarcode('.' + item.getAttribute('class'), res.data[index],{
              //     format: "CODE128",//选择要使用的条形码类型
              //     text: res.data[index],
              //     displayValue: true,//是否在条形码下方显示文字
              //     textPosition: "bottom",//设置文本的垂直位置
              //     width:1,//设置条之间的宽度
              //     height:50,//高度
              //     fontSize: '14px' //字体大小
              //   });
              // });
              // let subOutputRankPrint = document.getElementById('codeContainer');
              // let newContent =subOutputRankPrint.innerHTML;
              // let oldContent = document.body.innerHTML;
              // document.body.innerHTML = newContent;
              // window.print();
              // window.location.reload();
              // $('.codeContainer').html("");
            }, res => {
              alert(res.msg)
            });
          } else {
            return false;
          }
        })
        // debugger

      }
    }
  }
</script>

<style lang="less">
  @import url(./Code.less);
</style>
