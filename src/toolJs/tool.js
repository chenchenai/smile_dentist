let ToolJs = {
	getAddDate: (oldDate, days) => {
		// 计算添加XX天之后的标准时间，oldDate为初始标准时间，day为添加天数
		if(days == undefined || days == '') {
			days = 1;
		}
		let date = oldDate;
		date.setDate(date.getDate() + days);
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let mm = "'" + month + "'";
		let dd = "'" + day + "'";
		//单位数前面加0
		if(mm.length == 3) {
		 	month = "0" + month;
		}
		if(dd.length == 3) {
			day = "0" + day;
		}
		return date;
	},
	// 简单格式化时间，去除时间后面的时分秒
	formatDate(date) {
        if(date) {
            return date.substr(0,10);
        }else {
            return '';
        }
    },
    // 解析产品名称/数量/牙位/比色
    anysisProduceMsg(produceMsg) {
        let html = '';
        if(produceMsg[0] != null){
            produceMsg.map((item, index) => {
                let pos = '';
                if(item.pos){
                    let posList = item.pos.split(',');
                    let posA = posList[0];
                    let posB = posList[1];
                    let posC = posList[2];
                    let posD = posList[3];
                    let posAStr = '';
                    let posBStr = '';
                    let posCStr = '';
                    let posDStr = '';
                    if(posA && posA != ''){
                        posA.split('').map((item, index) => {
                            posAStr += item + ',';
                        });
                        posAStr = 'A' + posAStr;
                    }
                    if(posB && posB != ''){
                        posB.split('').map((item, index) => {
                            posBStr += item + ',';
                        });
                        posBStr = 'B' + posBStr;
                    }
                    if(posC && posC != ''){
                        posC.split('').map((item, index) => {
                            posCStr += item + ',';
                        });
                        posCStr = 'C' + posCStr;
                    }
                    if(posD && posD != ''){
                        posD.split('').map((item, index) => {
                            if(index == posD.split('').length - 1){
                                posDStr += item;
                            }else{
                                posDStr += item + ',';
                            }
                            posDStr = 'D' + posDStr;
                        });
                    }
                    pos = posAStr + posBStr + posCStr + posDStr;
                    let reg = /,$/gi;
                    pos = pos.replace(reg,"");
                }else{
                    pos = '';
                }
                  html += (item.goods_name || '') + '/' + (item.num || '') + '/' + pos + '/' + (item.colorimetric || '') + '<br/>';
            });
        }
        return html;
    },
    // 解析产品牙位
    anysisProduceTooth(produceMsg) {
        let html = '';
        let pos = '';
        if(produceMsg){
          let posList = produceMsg.split(',');
          let posA = posList[0];
          let posB = posList[1];
          let posC = posList[2];
          let posD = posList[3];
          let posAStr = '';
          let posBStr = '';
          let posCStr = '';
          let posDStr = '';
          if(posA && posA != ''){
            posA.split('').map((item, index) => {
              posAStr += 'A' + item + ',';
            });
          }
          if(posB && posB != ''){
            posB.split('').map((item, index) => {
              posBStr += 'B' + item + ',';
            });
          }
          if(posC && posC != ''){
            posC.split('').map((item, index) => {
              posCStr += 'C' + item + ',';
            });
          }
          if(posD && posD != ''){
            posD.split('').map((item, index) => {
              if(index == posD.split('').length - 1){
                posDStr += 'D' + item;
              }else{
                posDStr += 'D' + item + ',';
              }
            });
          }
          pos = posAStr + posBStr + posCStr + posDStr;
          let reg = /,$/gi;
          pos = pos.replace(reg,"");
        }else{
          pos = '';
        }
          html += pos+ '<br/>';
        return html;
    },
    // 测试设备数据
    getDevIdData() {
        return [
            { value: '臭氧消毒柜', id: '1' },
            { value: '比色卡', id: '2' },
            { value: '烤瓷炉', id: '3' },
        ]
    },
    getColorImetricData() {
        return [
            {value: 'OM1', id: 'OM1'},
            {value: 'OM2', id: 'OM2'},
            {value: 'OM3', id: 'OM3'},
            {value: '1M1', id: '1M1'},
            {value: '1M2', id: '1M2'},
            {value: '2M1', id: '2M1'},
            {value: '2M2', id: '2M2'},
            {value: '2M3', id: '2M3'},
            {value: '2L1.5', id: '2L1.5'},
            {value: '2L2.5', id: '2L2.5'},
            {value: '2R1.5', id: '2R1.5'},
            {value: '2R2.5', id: '2R2.5'},
            {value: '3M1', id: '3M1'},
            {value: '3M2', id: '3M2'},
            {value: '3M3', id: '3M3'},
            {value: '3L1.5', id: '3L1.5'},
            {value: '3L2.5', id: '3L2.5'},
            {value: '3R1.5', id: '3R1.5'},
            {value: '3R2.5', id: '3R2.5'},
            {value: '4M1', id: '4M1'},
            {value: '4M2', id: '4M2'},
            {value: '4M3', id: '4M3'},
            {value: '4L1.5', id: '4L1.5'},
            {value: '4L2.5', id: '4L2.5'},
            {value: '4R1.5', id: '4R1.5'},
            {value: '4R2.5', id: '4R2.5'},
            {value: '5M1', id: '5M1'},
            {value: '5M2', id: '5M2'},
            {value: '5M3', id: '5M3'}
        ];
    },
    // 复选框组，将names转换成ids
    getCheckboxIdsByNames(allArr, nameArr) {
        let arr = [];
        allArr.map((item, index) => {
            nameArr.map((item2, index2) => {
                if(item.name == item2) {
                    arr.push(item.id);
                }
            });
        });
        return arr;
    },
    // 在数组中通过name获取value
    getNameByValue(status, list) {
        if(status != undefined) {
            let name = '';
            list.map((item, index) => {
                if(status == item.id){
                    name = item.value;
                }
            });
            return name;
        }else {
            return '';
        }
    },
    getIdByList(value, list) {
        let id = null;
        list && list.map((item, index) => {
            if(value == item.value || item.name){
                id = item.id;
            }
        });
        return id;
    },
    // 去除数组中空元素
    filterArray(array) {
        return array.filter(item => item);
    },
    getIndexByList(value, list) {
        let i = null;
        list.map((item, index) => {
            if(value == item){
                i = index;
            }
        });
        return i;
    },
    getValueByIndex(value, list) {
        let name = null;
        list.map((item, index) => {
            if(value == index) {
                name = item;
            }
        });
        return name;
    }
}
export default ToolJs
