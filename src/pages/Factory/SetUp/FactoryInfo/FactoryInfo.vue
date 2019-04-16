<template>
	<div class="FactoryInfo">
		<h4>基本信息</h4>
		<div class="el-item">
			<p class="el-label">工厂名称</p>
			<div class="el-content">
				<p class="input">
					<el-input ref="name" maxlength="20" placeholder="请输入工厂名称" v-model="factoryInfo.name"></el-input>
				</p>
			</div>
		</div>
		<div class="el-item">
			<p class="el-label">联系人</p>
			<div class="el-content">
				<p class="input">
					<el-input maxlength="20" placeholder="请输入联系人" v-model="factoryInfo.linkman"></el-input>
				</p>
			</div>
		</div>
		<div class="el-item">
			<p class="el-label">联系电话</p>
			<div class="el-content">
				<p class="input">
					<el-input maxlength="20" placeholder="请输入联系电话" v-model="factoryInfo.contactNumber"></el-input>
				</p>
			</div>
		</div>
		<div class="el-item addressItem">
			<p class="el-label">地址</p>
			<div class="el-content">
				<p class="input">
					<el-select v-model="prov" placeholder="省">
						<el-option
							v-for="(option, index) in citysDataArr"
							:key="option.index"
							:label="option.name"
							:value="option.name">
						</el-option>
					</el-select>
					<el-select v-model="city" placeholder="市">
						<el-option
							v-for="(option, index) in cityArr"
							:key="option.index"
							:label="option.name"
							:value="option.name">
						</el-option>
					</el-select>
					<el-select v-model="district" placeholder="区">
						<el-option
							v-for="(option, index) in districtArr"
							:key="option.index"
							:label="option.name"
							:value="option.name">
						</el-option>
					</el-select>
					<el-input style="float: left; width: 450px;" maxlength="100" placeholder="请输入详细地址" v-model="factoryInfo.fullAddress"></el-input>
				</p>
			</div>
		</div>
		<p class="border"></p>
		<h4>认证信息</h4>
		<div class="el-item uploadItem">
			<p class="el-label">上传证书</p>
			<div class="el-content">
				<p class="input">
					<el-upload
						class="upload"
						:multiple="true"
						:limit="3"
						ref="upload"
						:on-success="uploadSuccess"
						:on-remove="removeImage"
						accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG,.BMP"
						:action="uploadUrl"
						:file-list="fileList"
						list-type="picture">
						<el-button size="small" type="primary"></el-button>
					</el-upload>
				</p>
			</div>
		</div>
		<div class="el-item longItem">
			<p class="el-label">医疗器械生产许可证</p>
			<div class="el-content">
				<p class="input">
					<el-input maxlength="20" placeholder="请输入医疗器械生产许可证" v-model="factoryInfo.licenceNo"></el-input>
				</p>
			</div>
		</div>
		<div class="el-item longItem">
			<p class="el-label">定制式固定义齿注册证</p>
			<div class="el-content">
				<p class="input">
					<el-input maxlength="20" placeholder="请输入定制式固定义齿注册证" v-model="factoryInfo.fixedRegistrationNo"></el-input>
				</p>
			</div>
		</div>
		<div class="el-item longItem noMarginItem">
			<p class="el-label">定制式可摘局部义齿注册证</p>
			<div class="el-content">
				<p class="input">
					<el-input maxlength="20" placeholder="请输入定制式可摘局部义齿注册证" v-model="factoryInfo.localRegistrationNo"></el-input>
				</p>
			</div>
		</div>
		<div class="el-item btns" v-if="canSubmit">
			<p class="el-label"></p>
			<div class="el-content">
				<el-button class="submit" type="primary" @click="submit">确 定</el-button>
				<el-button class="cancel" @click="cancel">取 消</el-button>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import citysData from '../../../../../static/json/citysData';
	export default {
		data() {
			return {
				factoryInfo: {},
				fileList: [],
				citysDataArr: [],
				prov: '',
				city: '',
				district: '',
				cityArr: [],
				districtArr: [],
				canSubmit: true,
				uploadUrl: ''
			}
		},
		created() {
			this.uploadUrl = this.$api.exportNewSysBaseUrl() + '/file/uploadTo/folder';
			this.getFactorySetInfo();
		},
		beforeMount: function () {
			this.getCitysData();
			this.updateCity();
			this.updateDistrict();
		},
		watch: {
			prov: function () {
				this.updateCity();
				this.updateDistrict();
			},
			city: function () {
				this.updateDistrict();
			}
		},
		methods: {
			// 导入城市数据
			getCitysData() {
				this.citysDataArr = citysData.data;
			},
			// 查询工厂信息
			getFactorySetInfo() {
				let imgArr = [];
				let imgArrStr = [];
				this.$api.get('/sys/factory/info/select', null, res => {
					this.factoryInfo = res.data;
					// 省市区解析
					this.prov = res.data.province;
					this.city = res.data.city;
					this.district = res.data.region;
					// 图片解析
					res.data.filePath.split(',').map((item, index) => {
						imgArr.push({
							name: item,
							url: this.$api.exportNewSysBaseUrl() + res.data.visitPrefix + item
						});
						imgArrStr.push(item);
					});
					this.factoryInfo.file = imgArrStr.join(',');
					this.fileList = imgArr;
				});
			},
			submit() {
				this.factoryInfo.province = this.prov;
				this.factoryInfo.city = this.city;
				this.factoryInfo.region = this.district;
				this.$api.post('/sys/factory/info/save', this.factoryInfo, res => {
					this.$message({
	            	 	message: '操作成功',
	            	 	duration: 1000,
	                    type: 'success'
	                })
				});
			},
			cancel() {

			},
			updateCity: function () {
				for (var i in this.citysDataArr) {
					var obj = this.citysDataArr[i];
					if (obj.name == this.prov) {
						this.cityArr = obj.sub;
						break;
					}
				}
				this.city = this.cityArr.length > 0 ? this.cityArr[1].name : '';
			},
			updateDistrict: function () {
				for (var i in this.cityArr) {
					var obj = this.cityArr[i];
					if (obj.name == this.city) {
						this.districtArr = obj.sub;
						break;
					}
				}
				if(this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
					this.district = this.districtArr[1].name;
				} else {
					this.district = '';
				}
			},
			// 图片上传成功
			uploadSuccess(response, file, fileList) {
				if(response.status == 200) {
					this.getImgUrl(fileList);
				}
			},
			// 移除图片
			removeImage(file, fileList) {
				this.getImgUrl(fileList);
			},
			// 解析图片url arr
			getImgUrl(list) {
				let arr = [];
				list.map((item, index) => {
					arr.push(item.name);
				});
				this.factoryInfo.file = arr.join(',');
			},
		}
	}
</script>

<style type="text/css" lang="less">
	@import url('./FactoryInfo.less');
</style>
