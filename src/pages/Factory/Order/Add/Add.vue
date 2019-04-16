<template>
	<div class="">
		<Dialog className="addDialog" :title="dialogTitle" @closeDialog="closeDialog">
			<div class="slotDiv">
	            <el-form :model="addFormData" label-position="left" label-width="82px" ref="addForm">
					<div class="baseInfo">
						<p class="title">基础信息</p>
						<div class="baseInfoForm">
							<el-form-item label="订单类型" class="fromItem" prop="type">
								<el-radio-group v-model="addFormData.type" :disabled="orderInputIsDisabled">
									<el-radio-button label="普通"></el-radio-button>
									<el-radio-button label="返工"></el-radio-button>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="订单编号" class="fromItem isRequired" prop="number">
								<el-input
									v-model="addFormData.number"
									@keyup.enter.native="enterInput({
										validFn: 'validNumber',
										validFnParams: [addFormData.number, 1],
										jumpTo: addFormData.type == '普通' ? 'boxNo' : 'oldNumber'
									})"
									@keyup.right.native="turnLeftOrRight(addFormData.type == '普通' ? 'boxNo' : 'oldNumber')"
									:disabled="orderInputIsDisabled"
									@blur="validNumber(addFormData.number, 1)"
									placeholder="请输入订单编号"
									:autofocus="true"
									maxlength="10"
									ref="number"
								></el-input>
								<p class="errorNotice" v-if="numberValid.status">{{ numberValid.text }}</p>
							</el-form-item>
							<el-form-item
								label="原订单编号"
								class="fromItem isRequired"
								v-if="addFormData.type == '返工'"
								prop="oldNumber">
								<el-input 
									ref="oldNumber" 
									@keyup.enter.native="enterInput({
										validFn: 'validNumber',
										validFnParams: [addFormData.oldNumber, 2],
										jumpTo: 'boxNo'
									})"
									@keyup.left.native="turnLeftOrRight('number')" 
									@keyup.right.native="turnLeftOrRight('boxNo')" 
									:disabled="orderInputIsDisabled"
									@blur="validNumber(addFormData.oldNumber, 2)" 
									placeholder="请输入原订单编号" 
									maxlength="10" 
									v-model="addFormData.oldNumber"></el-input>
								<p class="errorNotice" v-if="oldNumberValid.status">{{ oldNumberValid.text }}</p>
							</el-form-item>
							<el-form-item label="盒号" class="fromItem" prop="boxNo">
								<el-input 
									ref="boxNo" 
									@keyup.enter.native="enterInput({
										jumpTo: 'unitClinicIdInput'
									})" 
									@keyup.left.native="turnLeftOrRight(addFormData.type == '普通' ? 'number' : 'oldNumber')" 
									@keyup.right.native="turnLeftOrRight('unitClinicIdInput')"
									placeholder="请输入盒号" 
									maxlength="4" 
									v-model="addFormData.boxNo" 
									:disabled="orderInputIsDisabled"
								></el-input>
								<!-- <p class="errorNotice" v-if="numberIsValid.status">{{ numberIsValid.text }}</p> -->
							</el-form-item>
							<el-form-item
								label="客户名称"
								class="fromItem
								isRequired"
								ref="unitClinicId"
								prop="unitClinicId">
								<el-autocomplete
									class="inline-input unitClinicIdInput"
									ref="unitClinicIdInput"
									:maxlength="16"
									:disabled="orderInputIsDisabled"
									@select="selectUnitClinicId"
									@focus="getAllUnitClinicIdData"
									@blur="validUnitClinicId(addFormData.unitClinicId)"
									@keyup.enter.native="enterInput({
										validFn: 'validUnitClinicId',
										validFnParams: [addFormData.unitClinicId],
										jumpTo: 'salesMan'
									})"
									@keyup.left.native="turnLeftOrRight('boxNo')" 
									@keyup.right.native="turnLeftOrRight('salesMan')"
									placeholder="请输入客户名称"
									v-model="addFormData.unitClinicId"
									:fetch-suggestions="querySearchUnitClinicIds"
									:trigger-on-focus="false"
								></el-autocomplete>
								<p class="errorNotice" v-if="unitIdValid.status">{{ unitIdValid.text }}</p>
							</el-form-item>
							<el-form-item label="业务员" class="fromItem isRequired" prop="salesMan">
								<el-autocomplete
									class="inline-input"
									:maxlength="8"
									ref="salesMan"
									@select="selectSalesMan"
									@focus="getAllSalesManData"
									@blur="validSalesMan(addFormData.salesMan)"
									@keyup.enter.native="enterInput({
										validFn: 'validSalesMan',
										validFnParams: [addFormData.salesMan],
										jumpTo: 'doctor'
									})"
									@keyup.left.native="turnLeftOrRight('unitClinicIdInput')" 
									@keyup.right.native="turnLeftOrRight('doctor')"
									placeholder="请输入业务员姓名"
									:disabled="unitIdNotVisable"
									v-model="addFormData.salesMan"
									:fetch-suggestions="querySearchSalesMan"
									:trigger-on-focus="false"
								></el-autocomplete>
								<p class="errorNotice" v-if="salesManValid.status">{{ salesManValid.text }}</p>
							</el-form-item>
							<el-form-item label="医生姓名" class="fromItem isRequired" prop="doctor">
								<el-autocomplete
									class="inline-input"
									:maxlength="8"
									ref="doctor"
									@blur="validDoctor(addFormData.doctor)"
									placeholder="请输入医生姓名"
									@select="selectDoctor"
									@keyup.enter.native="enterInput({
										validFn: 'validDoctor',
										validFnParams: [addFormData.doctor],
										jumpTo: 'patient'
									})"
									@keyup.left.native="turnLeftOrRight('salesMan')" 
									@keyup.right.native="turnLeftOrRight('patient')"
									:disabled="unitIdNotVisable"
									v-model="addFormData.doctor"
									:fetch-suggestions="querySearchDoctor"
									:trigger-on-focus="false"
								></el-autocomplete>
								<p class="errorNotice" v-if="doctorValid.status">{{ doctorValid.text }}</p>
							</el-form-item>
							<el-form-item label="患者姓名" class="fromItem isRequired" prop="patient">
								<el-input 
									ref="patient" 
									@keyup.enter.native="enterInput({
										validFn: 'validPatien',
										validFnParams: [addFormData.patient],
										jumpTo: 'requireType'
									})"
									@keyup.left.native="turnLeftOrRight('doctor')" 
									@keyup.right.native="turnLeftOrRight('requireType')"
									@blur="validPatien(addFormData.patient)" 
									placeholder="请输入患者姓名" 
									maxlength="8" 
									v-model="addFormData.patient"
								></el-input>
								<p class="errorNotice" v-if="patientValid.status">{{ patientValid.text }}</p>
							</el-form-item>
							<el-form-item label="试戴类型" class="fromItem" prop="requireType">
								<el-autocomplete
									class="inline-input"
									:maxlength="8"
									ref="requireType"
									@keyup.enter.native="enterInput({
										jumpTo: 'sex'
									})"
									@keyup.left.native="turnLeftOrRight('patient')" 
									@keyup.right.native="turnLeftOrRight('sex')"
									placeholder="请选择试戴类型"
									v-model="addFormData.requireType"
									:fetch-suggestions="querySearchRequireType"
									:trigger-on-focus="true"
								></el-autocomplete>
							</el-form-item>
							<el-form-item label="性别" class="fromItem" prop="sex">
								<el-autocomplete
									class="inline-input"
									v-model="addFormData.sex"
									:maxlength="0"
									ref="sex"
									@keyup.enter.native="enterInput({
										jumpTo: 'age'
									})"
									@keyup.left.native="turnLeftOrRight('requireType')" 
									@keyup.right.native="turnLeftOrRight('age')"
									placeholder="请选择患者性别"
									:fetch-suggestions="querySearchSex"
									:trigger-on-focus="true"
								></el-autocomplete>
							</el-form-item>
							<el-form-item label="年龄" class="fromItem" prop="age">
								<el-input
									ref="age"
									@keyup.enter.native="enterInput({
										validFn: 'validAge',
										validFnParams: [addFormData.age],
										jumpTo: 'feature'
									})"
									@keyup.left.native="turnLeftOrRight('sex')" 
									@keyup.right.native="turnLeftOrRight('feature')"
									@blur="validAge(addFormData.age)"
									maxlength="3"
									placeholder="请输入患者年龄"
									v-model="addFormData.age"></el-input>
								<p class="errorNotice" v-if="ageValid.status">{{ ageValid.text }}</p>
							</el-form-item>
							<el-form-item label="脸型" class="feature fromItem" prop="feature">
								<el-autocomplete
									class="inline-input"
									v-model="addFormData.feature"
									:maxlength="0"
									ref="feature"
									@keyup.enter.native="enterInput({
										jumpTo: '0-pos0'
									})"
									@keyup.left.native="turnLeftOrRight('age')" 
									@keyup.right.native="turnLeftOrRight('0-pos0')"
									placeholder="请选择患者脸型"
									:fetch-suggestions="querySearchFeature"
									:trigger-on-focus="true"
								></el-autocomplete>
							</el-form-item>
							<el-form-item label="是否加急" class="fromItem" prop="addEdService">
								<el-checkbox
									v-model="addFormData.addEdService"></el-checkbox>
							</el-form-item>
							<el-form-item label="戴牙日期" class="wearingTeethDate datePicker" prop="wearingTeethDate">
								<el-date-picker
									v-model="addFormData.wearingTeethDate"
									type="date"
									placeholder="请选择戴牙日期"
									:picker-options="pickerOptions"
									:clearable="false">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="进件日期" class="entryDate datePicker" prop="entryDate">
								<el-date-picker
									v-model="addFormData.entryDate"
									type="date"
									:readonly="true"
									:clearable="false">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="预出日期" class="expectedDate datePicker" prop="expectedDate">
								<el-date-picker
									v-model="addFormData.expectedDate"
									type="date"
									:clearable="false"
									:picker-options="pickerOptions"
									placeholder="请选择预出日期">
								</el-date-picker>
							</el-form-item>
						</div>
					</div>					
					<div class="processingProject">
						<div class="title">加工项目</div>
						<div class="content">
							<el-table
								:data="addFormData.toothData"
								stripe
								:show-header="false"
								class="projectTable validator"
								style="width: 100%">
								<el-table-column
									prop="pos"
									label="牙位"
									class="posTd"
									width="300">
									<template slot-scope="scope">
										<el-form-item label="牙位" prop="pos" class="requiredThis">
											<div class="posDiv">
												<div class="top">
													<div class="pos1 positem">
														<el-input
															:ref="scope.$index + '-pos0'"
															@keyup.enter.native="enterInput({
																jumpTo: scope.$index + '-pos1'
															})"
															@keyup.left.native="leftFirstInput(scope.$index - 1 + '-colorImetric')" 
															@keyup.right.native="turnLeftOrRight(scope.$index + '-pos1')"
															:disabled="orderInputIsDisabled"
															@blur="validPostion(scope.row.pos[0], scope)"
															maxlength="8"
															v-model="scope.row.pos[0]"
														></el-input>
													</div>
													<div class="pos2 positem">
														<el-input
															:ref="scope.$index + '-pos1'"
															@keyup.enter.native="enterInput({
																jumpTo: scope.$index + '-pos2'
															})"
															@keyup.left.native="turnLeftOrRight(scope.$index + '-pos0')" 
															@keyup.right.native="turnLeftOrRight(scope.$index + '-pos2')"
															:disabled="orderInputIsDisabled"
															@blur="validPostion(scope.row.pos[1], scope)"
															maxlength="8"
															v-model="scope.row.pos[1]"
														></el-input>
													</div>
												</div>
												<div class="bot">
													<div class="pos3 positem">
														<el-input
															:ref="scope.$index + '-pos2'"
															@keyup.enter.native="enterInput({
																jumpTo: scope.$index + '-pos3'
															})"
															@keyup.left.native="turnLeftOrRight(scope.$index + '-pos1')" 
															@keyup.right.native="turnLeftOrRight(scope.$index + '-pos3')"
															:disabled="orderInputIsDisabled"
															@blur="validPostion(scope.row.pos[2], scope)"
															maxlength="8"
															v-model="scope.row.pos[2]"
														></el-input>
													</div>
													<div class="pos4 positem">
														<el-input
															:ref="scope.$index + '-pos3'"
															@keyup.enter.native="enterInput({
																jumpTo: scope.$index + '-productCategoryId'
															})"
															@keyup.left.native="turnLeftOrRight(scope.$index + '-pos2')" 
															@keyup.right.native="turnLeftOrRight(scope.$index + '-productCategoryId')"
															:disabled="orderInputIsDisabled"
															@blur="validPostion(scope.row.pos[3], scope)"
															maxlength="8"
															v-model="scope.row.pos[3]"
														></el-input>
													</div>
												</div>
												<p class="errorNotice" v-if="scope.row.posValid.status">{{ scope.row.posValid.text }}</p>
											</div>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column
									prop="colorImetric"
									label="产品名称"
									class="colorImetricTd validator"
									width="330">
									<template slot-scope="scope">
										<el-form-item label="产品名称" prop="productCategoryId" class="requiredThis">
											<el-autocomplete
												class="inline-input"
												:ref="scope.$index + '-productCategoryId'"
												@keyup.enter.native="enterInput({
													jumpTo: scope.$index + '-colorImetric'
												})"
												@keyup.left.native="turnLeftOrRight(scope.$index + '-pos3')" 
												@keyup.right.native="turnLeftOrRight(scope.$index + '-colorImetric')"
												:disabled="orderInputIsDisabled"
												v-model="scope.row.productCategoryId"
												:maxlength="20"
												placeholder="请输入产品名称"
												@select="selectProductCategoryId"
												@focus="getAllProductData"
												@blur="validProduct(scope.row.productCategoryId, scope)"
												:fetch-suggestions="querySearchProductCategoryId"
												:trigger-on-focus="false"
											></el-autocomplete>
											<p class="errorNotice" v-if="scope.row.productValid.status">{{ scope.row.productValid.text }}</p>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column
									prop="colorImetric"
									width="300"
									class="colorImetricTd validator"
									label="比色">
									<template slot-scope="scope">
										<el-form-item label="比色" prop="colorImetric">
											<el-autocomplete
												placeholder="请输入色号"
												:ref="scope.$index + '-colorImetric'"
												@keyup.enter.native="enterLastInput(scope.$index + 1 + '-pos0')"
												@keyup.left.native="turnLeftOrRight(scope.$index + '-productCategoryId')"
												@keyup.right.native="enterLastInput(scope.$index + 1 + '-pos0')"
												:disabled="orderInputIsDisabled"
												class="inline-input"
												v-model="scope.row.colorImetric"
												:maxlength="15"
												:fetch-suggestions="querySearchColorImetric"
												:trigger-on-focus="false"
											></el-autocomplete>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column
									prop="num"
									width="160"
									class="numTd"
									label="数量">
									<template slot-scope="scope">
										<el-form-item label="数量" prop="num">
											<el-input v-model="scope.row.num" disabled></el-input>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column
									class="addTd"
									label="操作">
									<template slot-scope="scope">
										<el-button
											v-if="!scope.row.del"
											:disabled="orderInputIsDisabled"
											@click.native="addToothRow(scope, $event)"
											type="text">
											+添加牙位
										</el-button>
										<el-button
											v-else
											:disabled="orderInputIsDisabled"
											@click.native="delToothRow(scope)"
											type="text">
											删除
										</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<div class="charge">
						<el-form-item label="备注" prop="charge">
							<el-input
								placeholder="请填写备注信息"
								ref="charge"
								@keyup.enter.native="enterInput({
									submit: true
								})"
								@keyup.left.native="turnLeftOrRight('0-pos0')"
								maxlength="500"
								v-model="addFormData.charge"
							></el-input>
						</el-form-item>
					</div>
					<div class="specialRequirements">
						<div class="title" @click="showSpeReqClick">
							<p>特殊要求</p>
							<i class="el-icon-caret-bottom" v-if="!showSpeReq"></i>
							<i class="el-icon-caret-top" v-else></i>
						</div>
						<div class="content" v-show="showSpeReq">
							<el-row>
								<el-col class="col1 col">
									<el-form-item label="咬合" class="occlusion" prop="occlusion">
										<el-radio-group v-model="addFormData.occlusion" :disabled="orderInputIsDisabled">
											<el-radio-button v-for="(item,index) in occlusionList" :key="index" :label="item"></el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
								<el-col class="col2 col">
									<el-form-item label="邻接面" class="approximalSurface" prop="approximalSurface">
										<el-radio-group v-model="addFormData.approximalSurface" :disabled="orderInputIsDisabled">
											<el-radio-button v-for="(item,index) in approximalSurfaceList" :key="index" :label="item"></el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
								<el-col  class="col3 col">
									<el-form-item label="就位要求" class="inPlace" prop="inPlace">
										<el-radio-group v-model="addFormData.inPlace" :disabled="orderInputIsDisabled">
											<el-radio-button v-for="(item,index) in inPlaceList" :key="index" :label="item"></el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col class="col1 col">
									<el-form-item label="外展隙深度" class="embrasuresDeep" prop="embrasuresDeep">
										<el-radio-group v-model="addFormData.embrasuresDeep" :disabled="orderInputIsDisabled">
											<el-radio-button v-for="(item,index) in embrasuresDeepList" :key="index" :label="item"></el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
								<el-col class="col2 col">
									<el-form-item label="唇纹设计" class="lipDesing">
										<el-radio-group v-model="addFormData.lipDesing" :disabled="orderInputIsDisabled">
											<el-radio-button v-for="(item,index) in lipDesingList" :key="index" :label="item"></el-radio-button>
										</el-radio-group>
									</el-form-item>
									</el-form-item>
								</el-col>
								<el-col class="col3 col">
									<el-form-item label="桥体设计" class="bridgeType">
										<el-radio-group v-model="addFormData.bridgeType" :disabled="orderInputIsDisabled">
											<el-radio-button v-for="(item,index) in bridgeTypeList" :key="index" :label="item"></el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="瓷金设计" class="cermetsDesign" prop="cermetsDesign">
										<el-radio-group v-model="addFormData.cermetsDesign" :disabled="orderInputIsDisabled">
											<el-radio-button label="金属舌面"></el-radio-button>
											<el-radio-button label="常规设计"></el-radio-button>
											<el-radio-button label="全瓷边"></el-radio-button>
											<el-radio-button label="全金属脚边"></el-radio-button>
											<el-radio-button label="颌面金属"></el-radio-button>
										</el-radio-group>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-form-item label="附件" class="attachment" prop="attachment">
									<el-input placeholder="请选择附件" v-model="addFormData.attachment" maxlength="200"></el-input>
								</el-form-item>
							</el-row>
							<el-row>
								<el-form-item label="上传图片" class="uploadImg" prop="fileList">
									<el-upload
										class="upload"
										:multiple="true"
										:limit="9"
										ref="upload"
										:on-success="uploadSuccess"
										:on-remove="removeImage"
										accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.BMP"
										:action="uploadUrl"
										:file-list="fileList"
										list-type="picture">
										<p></p>
									</el-upload>
								</el-form-item>
							</el-row>
						</div>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer" align="center">
					<!-- <el-button class="submit" type="primary" @click.native="submit">确 定</el-button> -->
					<el-checkbox v-model="addFormData.disinfectionFlag">牙模已消毒</el-checkbox>
					<el-button :disabled="submitBtnDisabled" class="submit" type="primary" @click.native="submit">确 定</el-button>
					<el-button class="cancel" @click.native="closeDialog">取 消</el-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '../../../../components/Dialog/Dialog';
	export default {
		props: [ 'changeDialogStatus', 'number', 'type' ],
		components: { Dialog },
		data() {
			let statusObj = {
				status: false,
				text: ''
			};
			return {
				dialogTitle: '新建订单',
				orderInputIsDisabled: false,
				addFormData: {
					// 基础信息
					type: '普通',   // 0/1   TODO   数字转换为汉字
					oldNumber: '',
					number: '',
					boxNo: '',
					salesMan: '',
					unitClinicId: '',
					doctor: '',
					patient: '',
					addEdService: false, // 0
					sex: '', // 0
					age: '',
					feature: '', //0
					wearingTeethDate: '',
					entryDate: new Date(),
					expectedDate: this.$tool.getAddDate(new Date(), 7),
					requireType: '', // 0
					toothData: [
						{
							pos: ['', '', '', ''],
							colorImetric: '',
							productCategoryId: '',
							num: '',
							posValid: statusObj,
							productValid: statusObj
						}
					],
					charge: '',
					occlusion: '',
					approximalSurface: '',
					inPlace: '',
					embrasuresDeep: '',
					lipDesing: '',
					bridgeType: '',
					cermetsDesign: '',
					attachment: '',
					path: '',
					disinfectionFlag: false
				},
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				// 禁用启用
				unitIdNotVisable: true,
				submitBtnDisabled: true,
				// 模糊查询对应的list
				unitClinicIdList: [],
				allUnitClinicIdData: [],
				allProductCategoryIdData: [],
				allSalesManData: [],
				doctorList: [],
				salesManList: [],
				featureList: [],
				sexList: [],
				productCategoryIdList: [],
				colorImetricList: [],
				requireTypeList: [],
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
		        fileList: [],
				// 校验
				numberValid: statusObj,
				oldNumberValid: statusObj,
				salesManValid: statusObj,
				doctorValid: statusObj,
				patientValid: statusObj,
				unitIdValid: statusObj,
				ageValid: statusObj,
				// 特殊要求
				showSpeReq: false,
				occlusionList: ['正常', '无', '轻', '重'],
				approximalSurfaceList: ['面接触', '点接触'],
				inPlaceList: ['紧', '正常', '松'],
				embrasuresDeepList: ['浅', '深'],
				lipDesingList: ['深', '浅', '无'],
				bridgeTypeList: ['卫生型', '偏侧型', '小马鞍型', '大马鞍型'],
				cermetsDesignList: ['金属舌面', '常规设计', '全瓷边', '全金属脚边', '颌面金属'],
				findDetailInfo: {},
				uploadUrl: ''
			}
		},
		created() {
			if(!!this.number) {
				if(!this.type) {
					this.dialogTitle = '修改订单';
					this.getDetailInfo();
				}else {
					this.dialogTitle = '新建订单';
					this.reworkOrder();
				}
			}else {
				this.dialogTitle = '新建订单';
			}
			this.getColorImetricData();
			this.uploadUrl = this.$api.exportNewSysBaseUrl() + '/file/upload?type=0';
		},
		mounted() {
            let code = "";
            let lastTime = null;
            let nextTime = null;
            let lastCode = null;
            let nextCode = null;
            let _this = this;
            document.onkeypress = function(e) {
                nextCode = e.which;
                nextTime = new Date().getTime();
                if(lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
                    code += String.fromCharCode(lastCode);
                } else if(lastCode != null && lastTime != null && nextTime - lastTime > 100){
                    code = "";
                }
                lastCode = nextCode;
                lastTime = nextTime;
                if(e.which == 13){               	
                	const orderCode = code || _this.addFormData.number;
                	if(code.toUpperCase().indexOf('ON') !== -1){ // 判断扫描订单
                		_this.$api.post('/factory/order/checkOrderNumber', {orderNum: orderCode}, res => {
	                		if(res.status === 200) {
	                			_this.addFormData.number = orderCode;
	                			_this.validNumber(orderCode, 1);
	                			if(_this.addFormData.type == '普通') {
	                				_this.$refs.boxNo.focus();
	                			}else {
	                				_this.$refs.oldNumber.focus();
	                			}
	                		}
	                	}, res => {
	                		// if(res.msg === '该订单号不存在') {
	                		// 	_this.addFormData.number = orderCode;
	                		// 	_this.validNumber(orderCode, 1);
	                		// }else {
	                		// 	_this.addFormData.oldNumber = orderCode;
	                		// 	_this.validNumber(orderCode, 1);
	                		// 	if(_this.addFormData.type == '普通') {
	                		// 		_this.$refs.boxNo.focus();
	                		// 	}else {
	                		// 		_this.$refs.oldNumber.focus();
	                		// 	}
	                		// }
	                	});
                	}
                	
                    code = '';
                    return false;
                }
            }
        },
		computed: {
			canSubmit() {
				let flag = false;
				let number = this.addFormData.number && !this.numberValid.status;
				let oldNumber = true;
				if(this.addFormData.type == '返工') {
					if(this.addFormData.oldNumber && !this.oldNumberValid.status) {
						oldNumber = true;
					}else {
						oldNumber = false;
					}
				}else {
					oldNumber = true;
				}
				let unitClinicId = this.addFormData.unitClinicId && !this.unitIdValid.status;
				let salesMan = this.addFormData.salesMan && !this.salesManValid.status;;
				let doctor = this.addFormData.doctor && !this.doctorValid.status;
				let patient = this.addFormData.patient && !this.patientValid.status;
				let age = !this.ageValid.status;
				let pos = false;
				this.addFormData.toothData.map((item, index) => {
					if(!item.posValid.status && item.pos.filter(item => item).length > 0) {
						pos = true;
					}else {
						pos = false;
						return;
					}
				});
				let productCategoryId = false;
				this.addFormData.toothData.map((item, index) => {
					if(!item.productValid.status && item.productCategoryId) {
						productCategoryId = true;
					}else {
						productCategoryId = false;
						return;
					}
				});
				if(number && oldNumber && unitClinicId && salesMan && doctor && patient && age && pos && productCategoryId) {
					flag = true;
				}else {
					flag = false;
				};
				return flag;
			},
		},
		watch: {
			canSubmit(curVal,oldVal) {
				if(curVal) {
					this.submitBtnDisabled = false;
				}else {
					this.submitBtnDisabled = true;
				}
            }
        },
		methods: {
			// 查询订单详情---编辑订单
			getDetailInfo(status) {
				this.$api.post('/factory/order/find', {number: this.number}, res => {					
					let data = res.data;
					let toothData = [];
					let statusObj = {
						status: false,
						text: ''
					};
					let orderStatus = res.data.status;
					console.log(orderStatus);
					// 工厂自建订单，未开始生产前，所有内容均可修改，订单状态流转至“生产中-工序生产中”时，仅可修改基础信息（业务员、医生姓名、患者姓名、性别、年龄、脸型、盒号、戴牙日期、预出日期、附件、上传图片、备注；诊所下单，订单状态为“已下单-待寄出”时，仅可修改基础信息；无论工厂自建订单还是诊所下单，订单状态流转至“订单完成”时，均不可再修改；
					if(orderStatus === '0101' || orderStatus === '0201' || orderStatus === '0202' || orderStatus === '0301' || orderStatus === '0302') {
						console.log('未开始生产前，所有内容均可修改');

					}else {
						console.log('仅可修改基础信息');
						this.orderInputIsDisabled = true;
						this.unitIdNotVisable = false;
					}
					const getNameByIndex = ($index, arr) => {
						let name = '';
						arr.map((item, index) => {
							if($index == index) {
								name = item;
							}
						});
						return name;
					}
					const getNameById = (id, arr) => {
						let name = '';
						arr.map((item, index) => {
							if(id == item.id) {
								name = item.value;
							}
						});
						return name;
					};
					this.findDetailInfo = res.data;
					// 基础信息
					if(status) {
						this.addFormData.type = '返工';
						this.addFormData.number = '';
						this.addFormData.oldNumber = data.number.split('ON')[1];
						this.$refs.number.focus();
					}else {
						this.addFormData.type = data.type == 0 ? '普通' : '返工';
						this.addFormData.number = data.number.split('ON')[1];
						this.addFormData.oldNumber = data.old_number;
						this.addFormData.id = data.id;
					}
					this.addFormData.boxNo = data.box_no;
					this.addFormData.salesMan = data.salesman_name;
					this.addFormData.unitClinicId = data.clinic_name;
					this.addFormData.patient = data.patient;
					this.addFormData.doctor = data.doctor_name;
					this.addFormData.addEdService = data.added_service == 0 ? false : true;
					this.addFormData.sex = data.sex;
					this.addFormData.age = data.age;
					this.addFormData.feature = data.feature;
					this.addFormData.wearingTeethDate = data.wearingteeth_date;
					this.addFormData.entryDate = data.entry_date;
					this.addFormData.expectedDate = data.expected_date;
					this.addFormData.requireType = getNameById(data.require_type, this.requireTypeList);
					this.addFormData.charge = data.charge;
					// 加工产品
					data.orderProduct.map((item, index) => {
						toothData.push({
							pos: item.pos.split(','),
							colorImetric: item.colorimetric,
							productCategoryId: item.goods_name,
							num: item.num,
							posValid: statusObj,
							productValid: statusObj,
							del: index !== 0
						});
					});
					this.addFormData.toothData = toothData;
					// 特殊要求
					this.addFormData.occlusion = getNameByIndex(data.occlusion, this.occlusionList);
					this.addFormData.approximalSurface = getNameByIndex(data.approximal_surface, this.approximalSurfaceList);
					this.addFormData.inPlace = getNameByIndex(data.in_place, this.inPlaceList);
					this.addFormData.embrasuresDeep = getNameByIndex(data.embrasures_deep, this.embrasuresDeepList);
					this.addFormData.lipDesing = getNameByIndex(data.lip_design, this.lipDesingList);
					this.addFormData.bridgeType = getNameByIndex(data.bridge_type, this.bridgeTypeList);
					this.addFormData.cermetsDesign = getNameByIndex(data.cermets_design, this.cermetsDesignList);
					this.addFormData.attachment = data.attachment;
					this.addFormData.path = data.path;
					// 获取对应数据
					this.getAllUnitClinicIdData(res => {
						this.getAllSalesManData();
						this.getAllDoctorData();
					});
					this.getAllProductData();
                }, res => {
                	this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
                });
			},
			// 返工订单
			reworkOrder() {
				if(this.type) {
					this.addFormData.type = '返工';					
					this.getDetailInfo(true);					
				}
			},
			// 关闭新建订单
			closeDialog() {
				this.$emit('changeDialogStatus', false, 'showAddDialog');
			},
			// 点击确定按钮，先手动上传图片
			submitUpload() {
				this.$refs.upload.submit();
			},
			// 提交新建订单
			submit() {
				// console.log(this.addFormData.toothData);
				// return
				this.$api.post('/factory/order/add', this.getPostData(), res => {
					this.$message({
	            	 	message: '保存订单成功',
	            	 	duration: 1000,
	                    type: 'success',
	                    onClose: () => {
	                        this.submitSucessCb();
	                    }
	                })
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 组装新建订单postData
			getPostData() {
				let toothData = [];
				let postData = {};
				this.addFormData.toothData.map((item, index) => {
					toothData.push({
						pos: item.pos.join(',').replace(/\s+/g, ""),
						colorImetric: item.colorImetric,
						productId: this.getIdByListName(item.productCategoryId, this.allProductCategoryIdData),
						num: item.num
					});
				});
				if(!!this.number) { // 修改订单
					this.getAllDoctorData(this.getIdByList(this.addFormData.unitClinicId, this.unitClinicIdList));
					postData = {
						"addEdService": this.addFormData.addEdService ? 1 : 0,
						"age": this.addFormData.age,
						"approximalSurface": this.getIndexByList(this.addFormData.approximalSurface, this.approximalSurfaceList),
						"attachment": this.addFormData.attachment,
						"boxNo": this.addFormData.boxNo,
						"bridgeType": this.getIndexByList(this.addFormData.bridgeType, this.bridgeTypeList),
						"cermetsDesign": this.getIndexByList(this.addFormData.cermetsDesign, this.cermetsDesignList),
						"charge": this.addFormData.charge,
						"doctor": this.getIdByList(this.addFormData.doctor, this.doctorList),
						"embrasuresDeep": this.getIndexByList(this.addFormData.embrasuresDeep, this.embrasuresDeepList),
						"entryDate": new Date(this.addFormData.entryDate).getTime(),
						"expectedDate": new Date(this.addFormData.expectedDate).getTime(),
						"feature": this.addFormData.feature,
						"inPlace": this.getIndexByList(this.addFormData.inPlace, this.inPlaceList),
						"lipDesing": this.getIndexByList(this.addFormData.lipDesing, this.lipDesingList),
						"number": this.addFormData.number,
						"occlusion": this.getIndexByList(this.addFormData.occlusion, this.occlusionList),
						"oldNum": this.addFormData.oldNumber,
						"path": this.addFormData.path, // 图片路径
						"patient": this.addFormData.patient,
						"requireType": this.getIdByList(this.addFormData.requireType, this.requireTypeList),
						"salesMan": this.getIdByList(this.addFormData.salesMan, this.salesManList),
						"sex": this.addFormData.sex,
						"type": this.addFormData.type == '普通' ? 0 : 1,
						"unitClinicId": this.getIdByList(this.addFormData.unitClinicId, this.unitClinicIdList),
						"wearingTeethDate": this.addFormData.wearingTeethDate ? new Date(this.addFormData.wearingTeethDate).getTime() : '',
						"toothData": JSON.stringify(toothData),
						"id": this.addFormData.id
					};
				}else {		// 新建订单			
					postData = {
						"addEdService": this.addFormData.addEdService ? 1 : 0,
						"age": this.addFormData.age,
						"approximalSurface": this.getIndexByList(this.addFormData.approximalSurface, this.approximalSurfaceList),
						"attachment": this.addFormData.attachment,
						"boxNo": this.addFormData.boxNo,
						"bridgeType": this.getIndexByList(this.addFormData.bridgeType, this.bridgeTypeList),
						"cermetsDesign": this.getIndexByList(this.addFormData.cermetsDesign, this.cermetsDesignList),
						"charge": this.addFormData.charge,
						"doctor": this.getIdByList(this.addFormData.doctor, this.doctorList),
						"embrasuresDeep": this.getIndexByList(this.addFormData.embrasuresDeep, this.embrasuresDeepList),
						"entryDate": this.addFormData.entryDate.getTime(),
						"expectedDate": this.addFormData.expectedDate.getTime(),
						"feature": this.addFormData.feature,
						"inPlace": this.getIndexByList(this.addFormData.inPlace, this.inPlaceList),
						"lipDesing": this.getIndexByList(this.addFormData.lipDesing, this.lipDesingList),
						"number": this.addFormData.number,
						"occlusion": this.getIndexByList(this.addFormData.occlusion, this.occlusionList),
						"oldNum": this.addFormData.oldNumber,
						"path": this.addFormData.path, // 图片路径
						"patient": this.addFormData.patient,
						"requireType": this.getIdByList(this.addFormData.requireType, this.requireTypeList),
						"salesMan": this.getIdByList(this.addFormData.salesMan, this.salesManList),
						"sex": this.addFormData.sex,
						"type": this.addFormData.type == '普通' ? 0 : 1,
						"unitClinicId": this.getIdByList(this.addFormData.unitClinicId, this.unitClinicIdList),
						"wearingTeethDate": this.addFormData.wearingTeethDate ? this.addFormData.wearingTeethDate.getTime() : '',
						"toothData": JSON.stringify(toothData),
						"disinfectionFlag": this.addFormData.disinfectionFlag ? 1 : 0
					};
				}
				// 订单编号如果是扫码输入，则去除ON
				if(postData.number.indexOf('ON') === 0) {
					postData.number = postData.number.split('ON')[1];
				}
				return postData;
			},
			// 新建成功，清空输入，不关闭弹窗
			submitSucessCb() {
				this.addFormData = {
					// 基础信息
					type: '普通',   // 0/1
					oldNumber: '',
					number: '',
					boxNo: '',
					salesMan: '',
					unitClinicId: '',
					doctor: '',
					patient: '',
					addEdService: false, // 0
					sex: '', // 0
					age: '',
					feature: '', //0
					wearingTeethDate: '',
					entryDate: new Date(),
					expectedDate: this.$tool.getAddDate(new Date(), 7),
					requireType: '', // 0
					toothData: [
						{
							pos: ['', '', '', ''],
							colorImetric: '',
							productCategoryId: '',
							num: '',
							posValid: {
								status: false,
								text: ''
							},
							productValid: {
								status: false,
								text: ''
							}
						}
					],
					charge: '',
					occlusion: '',
					approximalSurface: '',
					inPlace: '',
					embrasuresDeep: '',
					lipDesing: '',
					bridgeType: '',
					cermetsDesign: '',
					attachment: '',
					path: ''
				};
				this.$refs.number.focus();
			},
			// ---------------------获取数据------------------
			// 聚焦客户名称，获取诊所和医生数据
			getAllUnitClinicIdData(cb) {
				this.$api.post('/clinic/user/selectAllClinicAndDoctor', { unitId: '61ebbd921e874032bfc267736126450d' }, res => {
					let arr = [];
					res.data.map((item, index) => {
						if(item.clinicName) {
							arr.push({
								value: item.clinicName,
								id: item.unitId
							})
						}
					});
					this.allUnitClinicIdData = res.data;
					this.unitClinicIdList = arr;
					if(typeof cb === "function" && cb) {
						cb();
					}
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 聚焦业务员，获取业务员数据
			getAllSalesManData() {
				this.$api.post('/factory/user/selectSalesmans', null, res => {
					let arr = [];
					res.data.map((item, index) => {
						arr.push({
							value: item.name,
							id: item.id
						})
					});
					this.salesManList = arr;
					this.allSalesManData = res.data;
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 客户名称改变，获取对应的医生数据
			getAllDoctorData(id) {
				let unitId = '';
				let allUnitClinicIdData = this.allUnitClinicIdData;
				let arr = [];
				if(id) {
					unitId = id;
				}else {
					unitId = this.getIdByList(this.addFormData.unitClinicId, this.unitClinicIdList);
				}
				allUnitClinicIdData.map((item, index) => {
					if(unitId == item.unitId){
						item.bsClinicUsers.length > 0 ? item.bsClinicUsers.map((item2, index2) => {
							arr.push({
								value: item2.name,
								id: item2.id
							});
						}) : '';
					}
				});
				this.doctorList = arr;
				// 如果选择的改诊所下只有一个医生，则自动填充医生到输入框
				if(arr.length === 1) {
					this.addFormData.doctor = arr[0].value;
				}
			},
			// 获取产品名称数据
			getAllProductData() {
				this.$api.get('/product/selectProductName', null, res => {
					let arr = [];
					res.data.map((item, index) => {
						arr.push({
							value: item.name,
							id: item.id
						})
					});
					this.productCategoryIdList = arr;
					this.allProductCategoryIdData = res.data;
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 获取比色数据
			getColorImetricData() {
				this.colorImetricList = this.$tool.getColorImetricData();
			},
			// 选择客户
			selectUnitClinicId(data) {
				this.getAllDoctorData();
				if(data) {
					this.unitIdValid = {
						status: false,
						text: ''
					}
				}
			},
			// 选择业务员
			selectSalesMan(data) {
				if(data) {
					this.salesManValid = {
						status: false,
						text: ''
					}
				}
			},
			// 选择医生
			selectDoctor(data) {
				if(data) {
					this.doctorValid = {
						status: false,
						text: ''
					}
				}
			},
			// 选择产品名称
			selectProductCategoryId(data) {
				let $index = 0;
				let countType = '';
				let num = 0;
				this.addFormData.toothData.map((item, index) => {
					if(data.value == item.productCategoryId) {
						$index = index;
					}
				});
				this.allProductCategoryIdData.map((item, index) => {
					if(data.value == item.name) {
						countType = item.countType;
					}
				});
				if(data) {
					this.addFormData.toothData[$index].productValid = {
						status: false,
						text: ''
					};
					// 产品的计数方式为'全口计数'时，toothData.num = 1
					// 产品的计数方式为'按牙位计数'时，toothData.num = 牙位的数量
					if(countType == '全口计数') {
						this.addFormData.toothData[$index].num = 1;
					}else{
						this.filter_array(this.addFormData.toothData[$index].pos).map((item, index) => {
							num += item.replace(/\s+/g, "").split('').length;
						});
						this.addFormData.toothData[$index].num = num;
					}
				}
			},
			// ---------------------模糊查询------------------
			// 模糊查询封装
			querySearch(list, queryString, cb, noResultsCb) {
				let arr = this[list];
				let results = queryString ? arr.filter(this.createFilter(queryString)) : arr;
				noResultsCb && noResultsCb(results);
				cb(results);
				if(results.length > 0) {
					this.fireKeyEvent(document.getElementsByClassName('unitClinicIdInput')[0], 'keydown', 40);
				}
			},
			// 客户名称模糊查询
			querySearchUnitClinicIds(queryString, cb) {
				// this.fireKeyEvent(this.$refs.unitClinicIdInput, 'keydown', 40);
				this.querySearch('unitClinicIdList', queryString, cb, res => {
					this.unitIdNotVisable = res.length > 0 ? false : true;
				});
			},
			// 医生姓名模糊查询
			querySearchDoctor(queryString, cb) {
				this.querySearch('doctorList', queryString, cb);
			},
			// 业务员模糊查询
			querySearchSalesMan(queryString, cb) {
				this.querySearch('salesManList', queryString, cb);
			},
			// 脸部特征模糊查询
			querySearchFeature(queryString, cb) {
				this.querySearch('featureList', queryString, cb);
			},
			// 性别模糊查询
			querySearchSex(queryString, cb) {
				this.querySearch('sexList', queryString, cb);
			},
			// 产品名称模糊查询
			querySearchProductCategoryId(queryString, cb) {
				this.querySearch('productCategoryIdList', queryString, cb);
			},
			// 比色模糊查询
			querySearchColorImetric(queryString, cb) {
				this.querySearch('colorImetricList', queryString, cb);
			},
			// 试戴类型模糊查询
			querySearchRequireType(queryString, cb) {
				this.querySearch('requireTypeList', queryString, cb);
			},
			createFilter(queryString) {
				return (res) => {
					return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
				};
			},
			// ---------------------校验------------------
			// 订单编号/原订单编号校验
			validNumber(value, type) {
				// debugger
				let valid = '';
				if(type == 2) {
					valid = 'oldNumberValid';
				}else {
					valid = 'numberValid';
				}
				if(value) {
					this.$api.post('/factory/order/checkOrderNumber', {orderNum: value}, res => {
						if(res.status === 200) {
							this[valid] = {
								status: false,
								text: ''
							}
						}
					}, res => {
						if(res.status === 0) {
							this[valid] = {
								status: true,
								text: res.msg
							}
						}else {
							this[valid] = {
								status: false,
								text: ''
							}
						}
					});
				}else {
					this[valid] = {
						status: true,
						text: '请输入订单编号'
					}
				}
			},
			// 现在订单编号只能数字
			limitNumber() {
				// console.log(this.addFormData.number + '----------' + this.addFormData.number.replace(/[^\d]/g,''));
				// this.addFormData.number = this.addFormData.number.replace(/[^\d]/g,'');
			},
			// 客户名称校验
			validUnitClinicId(value) {
				if(value) {
					for(let i = 0; i < this.allUnitClinicIdData.length; i++) {
						if(value != this.allUnitClinicIdData[i].clinicName) {
							this.unitIdValid = {
								status: true,
								text: '该客户与工厂未建立关系'
							}
						}else {
							this.unitIdValid = {
								status: false,
								text: ''
							}
							return
						}
					}
				}else {
					this.unitIdValid = {
						status: true,
						text: '请选择客户'
					}
				}
			},
			// 业务员校验
			validSalesMan(value) {
				if(value) {
					if(this.allSalesManData.length > 0) {
						for(let i = 0; i < this.allSalesManData.length; i++) {
							if(value != this.allSalesManData[i].name) {
								this.salesManValid = {
									status: true,
									text: '该业务员不存在'
								}
							}else {
								this.salesManValid = {
									status: false,
									text: ''
								}
								return;
							}
						}
					}else {
						this.salesManValid = {
							status: true,
							text: '该业务员不存在'
						}
					}
				}else {
					this.salesManValid = {
						status: true,
						text: '请选择业务员'
					}
				}
			},
			// 医生姓名校验
			validDoctor(value) {
				if(value) {
					for(let i = 0; i < this.doctorList.length; i++) {
						if(value == this.doctorList[i].value) {
							this.doctorValid = {
								status: false,
								text: ''
							}
							return
						}else {
							this.doctorValid = {
								status: true,
								text: '该医生与客户未建立关系'
							}
						}
					}
				}else {
					this.doctorValid = {
						status: true,
						text: '请选择医生姓名'
					}
				}
			},
			// 患者姓名校验
			validPatien(value) {
				if(value) {
					this.patientValid = {
						status: false,
						text: ''
					}
				}else {
					this.patientValid = {
						status: true,
						text: '请选择患者姓名'
					}
				}
			},
			// 校验患者年龄
			validAge(value) {
				if(value) {
					if(!value.match(/\d{1,3}$/)) {
						this.ageValid = {
							status: true,
							text: '请输入1至3位数字'
						}
					}else {
						this.ageValid = {
							status: false,
							text: ''
						}
					}
				}else {
					this.ageValid = {
						status: false,
						text: ''
					}
				}
			},
			// 校验牙位
			validPostion(value, scope) {
				let row = scope.row;
				let index = scope.$index;
				let countType = '';
				let num = 0;
				if(this.filter_array(row.pos).length > 0) {
					// 屏蔽牙位只能输入不同数字的校验
					// if(value && !this.validateDiffNumber(value)) {
					// 	this.addFormData.toothData[index].posValid = {
					// 		status: true,
					// 		text: '请输入1-8的不同数字'
					// 	};
					// 	this.addFormData.toothData[index].num = '';
					// }else {
						this.addFormData.toothData[index].posValid = {
							status: false,
							text: ''
						};
						this.allProductCategoryIdData.map((item2, index2) => {
							if(this.addFormData.toothData[index].productCategoryId
							 == item2.name) {
								countType = item2.countType;
							}
						});
						// 产品的计数方式为'全口计数'时，toothData.num = 1
						// 产品的计数方式为'按牙位计数'时，toothData.num = 牙位的数量
						if(countType == '全口计数') {
							this.addFormData.toothData[index].num = 1;
						}else {
							this.filter_array(this.addFormData.toothData[index].pos).map((item, index) => {
								num += item.replace(/\s+/g, "").split('').length;
							});
							this.addFormData.toothData[index].num = num;
						}
					// }
				}else {
					this.addFormData.toothData[index].posValid = {
						status: true,
						text: '牙位不能为空'
					};
				}
			},
			// 校验产品名称
			validProduct(value, scope) {
				if(value) {
					for(let i =0; i < this.allProductCategoryIdData.length; i++) {
						if(value != this.allProductCategoryIdData[i].name) {
							this.addFormData.toothData[scope.$index].productValid = {
								status: true,
								text: '该产品不存在'
							};
							this.addFormData.toothData[scope.$index].num = '';
						}else {
							const countType = this.allProductCategoryIdData[i].countType;
							let num = 0;
							if(countType == '全口计数') {
								this.addFormData.toothData[scope.$index].num = 1;
							}else {
								this.filter_array(this.addFormData.toothData[scope.$index].pos).map((item, index) => {
									num += item.replace(/\s+/g, "").split('').length;
								});
								this.addFormData.toothData[scope.$index].num = num;
							}
							this.addFormData.toothData[scope.$index].productValid = {
								status: false,
								text: ''
							};
							return;
						}
					}
				}else {
					this.addFormData.toothData[scope.$index].productValid = {
						status: true,
						text: '产品名称不能为空'
					};
					this.addFormData.toothData[scope.$index].num = '';
				}
			},
			// 添加一行牙位
			addToothRow(scope, e) {
				// 验证是否可以添加下一行
				this.addFormData.toothData.push(
					{
						pos: [],
						colorImetric: '',
						productCategoryId: '',
						num: 0,
						del: true,
						productValid: {
							status: false,
							text: ''
						},
						posValid: {
							status: false,
							text: ''
						}
					}
				);
			},
			// 删除一行牙位
			delToothRow(scope) {
				this.addFormData.toothData.splice(scope.$index, 1);
			},
			// ---------------------键盘事件------------------
			enterOrderNumber() {

			},
			enterInput(params) {
				let validFn = params.validFn;
				let validFnParams0 = params.validFnParams ? params.validFnParams[0] : null;
				let validFnParams1 = params.validFnParams ? params.validFnParams[1] || null : null;
				let jumpTo = params.jumpTo;
				let submit = params.submit ? params.submit : false;
				let canSubmit = this.canSubmit;
				!!validFn ? this[validFn](validFnParams0, validFnParams1) : '';
				!!jumpTo ? this.$refs[jumpTo].focus() : '';
				if(submit) {
					if(canSubmit) {
						this.submit()
					}else {
						this.$message({
	                        message: '请检查必填项输入',
	                        type: 'error',
	            			duration: 1000,
	                    });
					}
				}
			},
			// 比色的enter,检验是否有下一行的牙齿项目，有就聚焦下一行的第一个牙位，没有就聚焦备注输入框
			enterLastInput(name) {
				if(!!this.$refs[name]) {
					this.$refs[name].focus();
				}else {
					this.$refs.charge.focus();
				}
			},
			// 第一个牙位的键盘左事件，如果有上一行的牙齿项目，则聚焦上一行的比色，没有就聚焦脸型
			leftFirstInput(name) {
				if(!!this.$refs[name]) {
					this.$refs[name].focus();
				}else {
					this.$refs.feature.focus();
				}
			},
			// 方向键左右，实现字段输入框的切换
			turnLeftOrRight(name) {
				document.body.click();
				this.$refs[name].focus();
			},
			fireKeyEvent(el, evtType, keyCode){
				var doc = el.ownerDocument,
					win = doc.defaultView || doc.parentWindow,
					evtObj;
				if(doc.createEvent){
					if(win.KeyEvent) {
						evtObj = doc.createEvent('KeyEvents');
						evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
					}
					else {
						evtObj = doc.createEvent('UIEvents');
						Object.defineProperty(evtObj, 'keyCode', {
					        get : function() { return this.keyCodeVal; }
					    });     
					    Object.defineProperty(evtObj, 'which', {
					        get : function() { return this.keyCodeVal; }
					    });
						evtObj.initUIEvent( evtType, true, true, win, 1 );
						evtObj.keyCodeVal = keyCode;
						if (evtObj.keyCode !== keyCode) {
					        console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
					    }
					}
					el.dispatchEvent(evtObj);
				} 
				else if(doc.createEventObject){
					evtObj = doc.createEventObject();
					evtObj.keyCode = keyCode;
					el.fireEvent('on' + evtType, evtObj);
				}
			},
			// ---------------------特殊要求------------------
			// 点击展开闭合特殊要求
			showSpeReqClick() {
				this.showSpeReq = !this.showSpeReq;
			},
			// 图片上传成功
			uploadSuccess(response, file, fileList) {
				if(response.status == 200) {
					this.getImgUrl(fileList);
				}
			},
			// 移除图片
			removeImage(file, fileList) {
				this.$api.post('/file/delete', {id: file.response.data[0].id}, res => {
					this.getImgUrl(fileList);
				}, res => {
					this.$message({
                        message: res.msg,
                        type: 'error',
            			duration: 1000,
                    });
				});
			},
			// 解析图片url arr
			getImgUrl(list) {
				let arr = [];
				list.map((item, index) => {
					if(item.response && item.response.data.length > 0) {
						arr.push(item.response.data[0].path);
					}
				});
				this.addFormData.path = JSON.stringify(arr);
			},
			// ---------------------工具------------------
			getIndexByList(value, list) {
				let i = null;
				list.map((item, index) => {
					if(value == item){
						i = index;
					}
				});
				return i;
			},
			getIdByList(value, list) {
				let id = null;
				list && list.map((item, index) => {
					if(value == item.value){
						id = item.id;
					}
				});
				return id;
			},
			getIdByListName(value, list) {
				let id = null;
				list && list.map((item, index) => {
					if(value == item.name){
						id = item.id;
					}
				});
				return id;
			},
			// 去除数组中空元素
			filter_array(array) {
			  	return array.filter(item => item);
			},
			// 校验是否是1-8位不同数字
			validateDiffNumber(numString) {
				let arr = numString.replace(/\s+/g, "").split('');
				let nary = arr.sort();
				for(let i = 0; i < arr.length; i++){
					if(nary[i] > 8){
						return false;
					}
			        if (nary[i] == nary[i+1]){
			        	return false;
			        }
			    }
			    return true
			},
		}
	}
</script>

<style lang="less">
	@import url(./Add.less);
</style>
