<template>
	<div class="mapping-rule-wrapper">
		<div class="mapping-rule__header">
			<div class="mr-btn-group">
				<el-button type="text" @click="tapEditBtn"><i class="el-icon-edit"></i> 编辑</el-button>
				<el-button type="text" @click="tapImportBtn"><i class="el-icon-upload2"></i> 导入</el-button>
				<el-button type="text" @click="tapExportBtn"><i class="el-icon-download"></i> 导出</el-button>
				<el-button type="text" @click="tapEmptyBtn" class="mr-btn--delete"><i class="el-icon-delete"></i> 清空</el-button>
			</div>
		</div>
		<div class="mapping-rule__body">
			<el-table :data="rulesData" style="width: 100%">
				<el-table-column>
					<template slot="header">
						<span>映射规则内容</span> | <span>匹配结果</span>
					</template>
					<template slot-scope="scope">
						<i :class="scope.row.icon"></i>
						<span class="mr-rule-name">{{scope.row.ruleName}}</span>
						<span class="mr-rule-result">{{scope.row.ruleResult}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160">
					<template slot-scope="scope">
						<el-button type="text" class="mrb-btn--disabled" @click="tapDisabledBtn(scope.row)">停用</el-button>
						<el-button type="text" class="mrb-btn--delete" @click="tapDeleteBtn(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="mapping-rule-editor-box" :class="{'visible': editorVisible}">
			<h4>编辑映射规则</h4>
			<el-input type="textarea" :rows="18" placeholder="请输入规则" v-model="rulesText"></el-input>
			<div class="mr-rb-btns-box">
				<el-button type="text" class="mr-rb-cancel-btn" @click="tapCancelBtn">取消</el-button>
				<el-button type="primary" class="mr-rb-save-btn" @click="tapSaveBtn" size="small" round>保存</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "MappingRules",
	data() {
		return {
			rulesData: [
				{ icon: 'el-icon-price-tag', ruleName: '添加标签', ruleResult: '（匹配结果：1）' },
				{ icon: 'el-icon-top', ruleName: '上线', ruleResult: '（匹配结果：1）' },
				{ icon: 'el-icon-set-up', ruleName: '替换', ruleResult: '（匹配结果：1）' },
				{ icon: 'el-icon-plus', ruleName: '添加', ruleResult: '（匹配结果：1）' },
				{ icon: 'el-icon-bottom', ruleName: '下线', ruleResult: '（匹配结果：1）' },
			],
			rulesText: `+ new_presentation_name_1 => #:bucket1/mock1 tag=[tag1,tag2,tag3]
* $:user_name_1/release_name_1 => #:bucket2/mock2 scope = [existing_presentation_2, existing_presentation_3 -> $:user_name_2/release_name_2]
- existing_presentation_1
[SET] new_presentation_name_1 tag=[tag1,tag2,ta3]`,
			editorVisible: false,
		}
	},
	computed: {
		nodeId() {
			return this.$route.params.nodeId
		}
	},
	methods: {
		fetchRulesText() {
			
		},
		tapEditBtn() {
			this.editorVisible = true
		},
		tapImportBtn() {},
		tapExportBtn() {},
		tapEmptyBtn() {},
		tapDisabledBtn(row) {},
		tapDeleteBtn(row) {},
		tapCancelBtn() {
			this.editorVisible = false
		},
		tapSaveBtn() {

		}
	},
};
</script>

<style lang="less" type="text/less" scoped>
.mapping-rule-wrapper {
	position: relative;
	padding-top: 40px; 
	.mapping-rule__header {
		margin-bottom: 60px; font-size: 14px; 
		.el-button--text {
			margin-right: 20px; font-weight: 400; color: #333;
			&.mr-btn--delete { color: #EE4040; }
			i {
				margin-right: 3px; font-weight: 600;
			}
		}
	}
	.mapping-rule__body {
		.mr-rule-name {  }
		.mr-rule-result { color: #9b9b9b; }
			
		i {
			margin-right: 10px; font-size: 14px; font-weight: 600;
			&.el-icon-price-tag {
				transform: rotate(-90deg);
			}
		}
		.mrb-btn--disabled { font-weight: 400; color: #000; margin-right: 10px; }
		.mrb-btn--delete { color: #EE4040; }
	}
	.mapping-rule-editor-box {
		position: absolute; top: 0; left: -15px; z-index: 10;
		width: 100%; height: 100%; padding: 40px 15px;
		background-color: #fff;

		transition: all .36s ease-out;
		-webkit-transform: translateX(100%); transform: translateX(100%); opacity: 0;

		&.visible {
			opacity: 1;
			-webkit-transform: translateX(0); transform: translateX(0);
		}

		h4 {
			margin-bottom: 10px; 
			font-size: 14px; color: #666;
		}
		.mr-rb-btns-box {
			margin-top: 15px; text-align: right; 
			.mr-rb-cancel-btn {
			 	margin-right: 10px; color: #999;
			}
			.mr-rb-save-btn {

			}
		}
	}
}
</style>

<style lang="less" type="text/less">
.mapping-rule-wrapper {
	.mapping-rule__body {
		.cell {
			font-size: 14px; font-weight: 400; color: #000;
		}
	}
	.mapping-rule-editor-box {
		.el-textarea__inner {
			padding: 20px; line-height: 2;
		}
	}
}
</style>
