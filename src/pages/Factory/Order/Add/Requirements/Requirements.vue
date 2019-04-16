<template>
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
						<el-radio-group v-model="requirementsInfo.occlusion">
							<el-radio-button v-for="(item,index) in occlusionList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col class="col2 col">
					<el-form-item label="邻接面" class="approximalSurface" prop="approximalSurface">
						<el-radio-group v-model="requirementsInfo.approximalSurface">
							<el-radio-button v-for="(item,index) in approximalSurfaceList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col  class="col3 col">
					<el-form-item label="就位要求" class="inPlace" prop="inPlace">
						<el-radio-group v-model="requirementsInfo.inPlace">
							<el-radio-button v-for="(item,index) in inPlaceList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="col1 col">
					<el-form-item label="外展隙深度" class="embrasuresDeep" prop="embrasuresDeep">
						<el-radio-group v-model="requirementsInfo.embrasuresDeep">
							<el-radio-button v-for="(item,index) in embrasuresDeepList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col class="col2 col">
					<el-form-item label="唇纹设计" class="lipDesing">
						<el-radio-group v-model="requirementsInfo.lipDesing">
							<el-radio-button v-for="(item,index) in lipDesingList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
					</el-form-item>
				</el-col>
				<el-col class="col3 col">
					<el-form-item label="桥体设计" class="bridgeType">
						<el-radio-group v-model="requirementsInfo.bridgeType">
							<el-radio-button v-for="(item,index) in bridgeTypeList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="瓷金设计" class="cermetsDesign" prop="cermetsDesign">
						<el-radio-group v-model="requirementsInfo.cermetsDesign">
							<el-radio-button v-for="(item,index) in cermetsDesignList" :key="index" :label="item"></el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label="附件" class="attachment" prop="attachment">
					<el-input placeholder="请选择附件" v-model="requirementsInfo.attachment" maxlength="200"></el-input>
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
						action="http://10.10.20.117:9090/file/upload"
						:file-list="fileList"
						list-type="picture">
						<p></p>
					</el-upload>
				</el-form-item>
			</el-row>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showSpeReq: false,
				fileList: [],
				occlusionList: ['正常', '无', '轻', '重'],
				approximalSurfaceList: ['面接触', '点接触'],
				inPlaceList: ['紧', '正常', '松'],
				embrasuresDeepList: ['浅', '深'],
				lipDesingList: ['深', '浅', '无'],
				bridgeTypeList: ['卫生型', '偏侧型', '小马鞍型', '大马鞍型'],
				cermetsDesignList: ['金属舌面', '常规设计', '全瓷边', '全金属脚边', '颌面金属'],
			}
		},
		props: ['data', 'getRequirementsInfo', 'delImgList', 'resetDelImgList'],
		computed: {
			requirementsInfo() {
				return this.data;
			}
		},
		watch: {
			requirementsInfo: {
				handler(newValue, oldValue) {
					let data = {...newValue};
					data.occlusion = this.getIndexByList(data.occlusion, this.occlusionList)
					data.approximalSurface = this.getIndexByList(data.approximalSurface, this.approximalSurfaceList)
					data.inPlace = this.getIndexByList(data.inPlace, this.inPlaceList)
					data.embrasuresDeep = this.getIndexByList(data.embrasuresDeep, this.embrasuresDeepList)
					data.lipDesing = this.getIndexByList(data.lipDesing, this.lipDesingList)
					data.bridgeType = this.getIndexByList(data.bridgeType, this.bridgeTypeList)
					data.cermetsDesign = this.getIndexByList(data.cermetsDesign, this.cermetsDesignList)
					this.$emit('getRequirementsInfo', data);
				},
				deep: true
			},
			delImgList(newValue, oldValue) {
				if(newValue) {
					this.fileList = [];
					this.showSpeReq = false;
					this.$emit('resetDelImgList');
				}
			}
		},
		methods: {
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
					this.$message.error(res.msg);
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
				this.requirementsInfo.path = JSON.stringify(arr);
			},
			getIndexByList(value, list) {
				return this.$tool.getIndexByList(value, list);
			}
		}
	}
</script>

<style lang="less">
	@import url('./Requirements.less');
</style>