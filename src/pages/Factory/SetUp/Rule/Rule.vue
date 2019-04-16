<template>
	<div class="Rule">
		<h4>生产与质量</h4>
		<div class="el-item">
			<p class="el-label">过程检查</p>
			<div class="el-content">
				<p class="input"><el-checkbox v-model="checkProcess" @change="openCheckProcess">开启过程检查</el-checkbox></p>
				<p class="text">开启后，工艺流程中关键工序必须经过检查后才能进入下一道工序</p>
			</div>
		</div>
		<div class="el-item">
			<p class="el-label">物料追溯</p>
			<div class="el-content">
				<p class="input"><el-checkbox v-model="checkMaterialTracing" @change="openMaterialTracing">开启物料追溯</el-checkbox></p>
				<p class="text">开启后，系统将为每个入库批次的物料生成追溯码，且车间扫码物料时只能使用追溯码</p>
			</div>
		</div>
		<div class="el-item">
			<p class="el-label">车间扫描</p>
			<div class="el-content">
				<p class="input">
					<el-checkbox v-model="checkWorkshopScan" @change="openWorkshopScan">仅记录开工时间，即上一道工序的完工时间为下一道工序的开工时间</el-checkbox>
				</p>
			</div>
		</div>
		<div class="el-item setUpModelCheck">
			<p class="el-label">模型入检</p>
			<div class="el-content">
				<p class="input"><el-button @click="setUpModelCheck">标准内容设置</el-button></p>
			</div>
		</div>
		<div class="el-item setUpRelease">
			<p class="el-label">放行标准</p>
			<div class="el-content">
				<p class="input"><el-button @click="setUpRelease">标准内容设置</el-button></p>
			</div>
		</div>
		<div class="el-item btns" v-if="canSubmit">
			<p class="el-label"></p>
			<div class="el-content">
				<el-button class="submit" type="primary" @click="submit">确 定</el-button>
				<el-button class="cancel" @click="cancel">取 消</el-button>
			</div>
		</div>
		<template>
			<!-- 模型入检 -->
			<ModelCheck v-if="showModelCheckDialog" @changeDialogStatus="changeDialogStatus" />
			<!-- 放行标准 -->
			<Release v-if="showReleaseDialog" @changeDialogStatus="changeDialogStatus" />
		</template> 
	</div>
</template>

<script type="text/javascript">
	import ModelCheck from './ModelCheck/ModelCheck';
    import Release from './Release/Release';
	export default {
		components: { ModelCheck, Release },
		data() {
			return {
				checkProcess: false,
				checkMaterialTracing: false,
				checkWorkshopScan: false,
				canSubmit: true,
				setUpData: {},
				showModelCheckDialog: false,
				showReleaseDialog: false
			}
		},
		created() {
			this.getSetUpData();
		},
		methods: {
			submit() {
				this.$api.post('/sys/saveBsSystemSetup', this.setUpData, res => {
                    this.$message({
                        message: '操作成功',
                        duration: 1000,
                        type: 'success'
                    });
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
                });
			},
			cancel() {

			},
			// 开启过程质检
			openCheckProcess(value) {
				this.setUpData.isProcessCheck = value ? 1 : 0;
			},
			// 开启物料追溯
			openMaterialTracing(value) {
				this.setUpData.isMeterielReaceback = value ? 1 : 0;
			},
			// 开启车间扫描
			openWorkshopScan(value) {
				this.setUpData.scanbarType = value ? 0 : 1;
			},
			// 查询参数设置
			getSetUpData() {
				this.$api.post('/sys/select/BsSystemSetup', {}, res => {
					if(!!res.data) {
						this.setUpData = res.data;
						this.checkProcess = res.data.isProcessCheck != 0;
						this.checkMaterialTracing = res.data.isMeterielReaceback != 0;
						this.checkWorkshopScan = res.data.scanbarType == 0;
					}
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
                });
			},
			// 打开关闭弹窗
	        changeDialogStatus(status, name) {
	            this[name] = status;
	        },
			// 模型入检弹窗
			setUpModelCheck() {
				this.changeDialogStatus(true, 'showModelCheckDialog');
			},
			// 放行设置弹窗
			setUpRelease() {
				this.changeDialogStatus(true, 'showReleaseDialog');
			}
		}
	}
</script>

<style type="text/css" lang="less">
	@import url('./Rule.less');
</style>