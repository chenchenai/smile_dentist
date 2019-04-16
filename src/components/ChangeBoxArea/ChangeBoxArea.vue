<template>
  <div class="panel panel-default">
    <div class="panel-heading clearfix">
      <div class="pull-left" style="float: left">
        <div class="checkbox">
          <label>
            <input :disabled="data.length === 0" type="checkbox" checked="checked" @click="toggleAll()" :checked="selectedAllStatus"><span>{{title}}</span>
          </label>
        </div>
      </div>
      <span class="pull-right" style="float: right;margin-top: 5px">{{data.length}}</span>
    </div>
    <div class="panel-body">
      <ul>
        <li v-for="(item,index ) in data" :key="item.id">
          <div class="checkbox">
            <label>
              <input type="checkbox" checked="checked"  v-model="item.isSelected"> {{item.procedureName}}
              <el-button class="down_btn" @click="down_btn(item,index)">下移</el-button>
              <el-button class="top_btn" @click="top_btn(item,index)">上移</el-button>
            </label>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  var swapItems = function(arr, index1, index2){ //移动数组获取数据
    arr[index1] = arr.splice(index2,1,arr[index1])[0];
    return arr
  };
  export default {
    name: "ChangeBox",
    props: ["title", "data"],
    data() {
      return{
        newArr:[],//上下移动后新数组
        beforeArr: this.data //移动前数组
      }

    },
    computed: {
      // 选择的数量
      selectItemNumber() {
        return this.data.filter(item => item.isSelected).length;
      },
      // 全选状态
      selectedAllStatus() {
        if (
          this.selectItemNumber === this.data.length &&
          this.selectItemNumber !== 0
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      // 全选及反选
      toggleAll() {
        let len = this.data.length;
        let slen = this.data.filter(item => item.isSelected).length;
        if (len !== slen) {
          this.data.map(item => (item.isSelected = true));
        } else {
          this.data.map(item => (item.isSelected = false));
        }
      },
      //下移
      down_btn(item,index){
        if (this.data.length > 1 && index !== (this.data.length - 1)) {
          this.newArr = swapItems(this.beforeArr, index, index + 1)
        }
      },
      // 上移
      top_btn (item,index) {
        if (this.data.length > 1 && index !== 0) {
          this.newArr = swapItems(this.beforeArr, index, index - 1)
        }
      }
    }
  };
</script>

<style lang="less" >
	@import url('./ChangeBoxArea.less');
</style>
