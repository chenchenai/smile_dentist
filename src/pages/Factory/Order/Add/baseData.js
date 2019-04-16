export default (vm) => ({
	requireTypeList: [
      	{ "value": "试冠", id: 0 },
      	{ "value": "试瓷", id: 1 },
      	{ "value": "腊牙", id: 2 },
      	{ "value": "试架", id: 3 },
      	{ "value": "试颌", id: 4 }
    ],
    sexList: [
    	{value: '男', id: '男'},
    	{value: '女', id: '女'}
    ],
    featureList: [
      	{ value: "方脸", id: "方脸" },
      	{ value: "尖脸", id: "尖脸" },
      	{ value: "卵圆脸", id: "卵圆脸" }
    ],
    occlusionList: ['正常', '无', '轻', '重'],
	approximalSurfaceList: ['面接触', '点接触'],
	inPlaceList: ['紧', '正常', '松'],
	embrasuresDeepList: ['浅', '深'],
	lipDesingList: ['深', '浅', '无'],
	bridgeTypeList: ['卫生型', '偏侧型', '小马鞍型', '大马鞍型'],
	cermetsDesignList: ['金属舌面', '常规设计', '全瓷边', '全金属脚边', '颌面金属'],
})