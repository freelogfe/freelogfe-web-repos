<!--<i18n src="./mappingRules.i18n.json"></i18n>-->
<template>
	<div class="mapping-rule-wrapper">
		<div class="mapping-rule__header">
			<div class="mr-btn-group">
				<el-button class="mr-edit-btn" type="text" @click="tapEditBtn" >
					<i class="el-icon-edit"></i>{{$t('node.enterBtnText')}}
				</el-button>
				<el-upload class="mr-import" accept="text/plain" :show-file-list="false" :auto-upload="false"  :on-change="rulesImportHandler">
					<el-button type="text"><i class="el-icon-download"></i> {{$t('node.imortBtnText')}}</el-button>
				</el-upload>
				<el-button type="text" @click="tapExportBtn">
					<i class="el-icon-upload2"></i>
					{{selectedRules.length > 0 ? $t('node.batchExportBtnText') : $t('node.exportAllBtnText') }}
				</el-button>
				<a v-show="false" ref="rulesDownload" :href="rulesTextDownloadUrl" :download="rulesTextDownloadName"></a>
				<template v-if="selectedRules.length > 0">
					<el-button type="text" @click="tapBatchDeleteBtn" class="mr-btn--delete"><i class="el-icon-delete"></i> {{$t('node.batchDeletionBtnText')}}</el-button>
				</template>
			</div>
		</div>
		<div class="mapping-rule__body" v-show="!editorVisible">
			<el-table ref="mrTable" :data="targetRulesTableData" style="width: 100%" @selection-change="rulesSelectionHandler">
				<el-table-column type="selection" width="45"></el-table-column>
				<el-table-column :label="$t('node.ruleType')" width="146">
          <template slot-scope="scope">
            <rules-bar class="mr-icons" :class="{ 'disabled': scope.row.matchErrors.length }" :rules="scope.row.iconArr"></rules-bar>
          </template>
        </el-table-column>
				<el-table-column>
					<template slot="header">
						<span>{{$t('node.mappingRuleContent')}}</span>
						<!-- | <span>{{$t('matchResult')}}</span> -->
					</template>
					<template slot-scope="scope">
						<rule-text :textRule="scope.row"></rule-text>
					</template>
				</el-table-column>
				<el-table-column :label="$t('node.operation')" width="120">
					<template slot-scope="scope">
						<el-button type="text" class="mrb-btn--delete" @click="tapDeleteBtn(scope.row)"><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="mapping-rule-editor-box" :class="{'visible': editorVisible}">
			<h4>
				{{$t('node.editMappingRules')}}
				<el-button class="mr-back-btn" type="text" @click="tapBackBtn">
					<i class="el-icon-back"></i> {{$t('node.exitBtnText')}}
				</el-button>
			</h4>
			<div class="mapping-rule-input-box">
				<codemirror :class="{ 'hasErrors': rulesInputRowsCount === 13 }" ref="codeMirror" :code="rulesText" :options="editorOptions" @input="onCodeChange"></codemirror>
				<div class="mr-rb-btns-box">
					<el-button type="primary" class="mr-rb-save-btn" @click="tapSaveBtn" size="small" round>{{$t('node.saveBtnText')}}</el-button>
				</div>
			</div>
			<div class="mapping-rule-errors-box">
				<template v-if="syntaxErrorsText !== ''">
					<h4 class="syntax-error__title">{{$t('node.errors[2]')}}</h4>
					<ul v-html="syntaxErrorsText"></ul>
				</template>
				<template v-if="matchErrorsText !== ''">
					<h4 class="match-error__title">{{$t('node.errors[3]')}}</h4>
					<ul v-html="matchErrorsText"></ul>
				</template>
			</div>
			<div class="mapping-rule-match-result" v-if="syntaxErrorsText === '' && matchResultsText !== ''">
				<h4 class="match-result__title">{{$t('node.matchResultsTexts[0]')}}</h4>
				<ul v-html="matchResultsText"></ul>
			</div>
		</div>
	</div>
</template>

<script>
import { compile, decompile } from '@freelog/nmr_translator'
import RulesBar from '../../components/RulesBar.vue'
import RuleText from '../../components/rule-text.vue'
import { codemirror, codeMirrorOptions } from '@/lib/codemirror'
import 'codemirror/mode/javascript/javascript'
require('codemirror/theme/idea.css')

var editorVisible = false
export default {
	name: "MappingRules",
	props: {
		routeUpdated: Boolean
	},
	data() {
		return {
			rulesTableData: [],
			testRulesData: [],
			editorVisible: false,
			lastRulesText: '',
			rulesText: '',
			themeId: '',
			syntaxErrorsText: '',
			matchErrorsText: '',
			matchResultsText: '',
			rulesTextDownloadUrl: '',
			rulesTextDownloadName: '',
			selectedRules: [],
			selectedRuleType: 'all',
			rulesInputRowsCount: 18,
			editorOptions: Object.assign({
				viewportMargin: 50,
				viewportMargin: Infinity,
				theme: 'idea', gutters: [] }, codeMirrorOptions),
		}
	},
	components: { RuleText, RulesBar, codemirror },
	computed: {
		rulesOperationConfig() {
			return [
				{ "operation": "set", "icon": "el-icon-price-tag", "desc": "添加标签" },
				{ "operation": "online", "icon": "el-icon-top", "desc": "上线" },
				{ "operation": "replace", "icon": "el-icon-set-up", "desc": "替换" },
				{ "operation": "add", "icon": "el-icon-plus", "desc": "添加" },
				{ "operation": "offline", "icon": "el-icon-bottom", "desc": "下线" },
				{ "operation": "all", "desc": "全部" }
			]
		},
		nodeId() {
			return this.$route.params.nodeId
		},
		targetRulesTableData() {
			if(this.selectedRuleType === 'all') {
				return this.rulesTableData
			}else {
				return this.rulesTableData.filter(r => r.operation === this.selectedRuleType)
			}
		},
	},
	watch: {
		syntaxErrorsText() {
			if(this.syntaxErrorsText === '') {
				this.rulesInputRowsCount = 18
			}else {
				this.rulesInputRowsCount = 13
			}
		},
		matchErrorsText() {
			if(this.matchErrorsText === '') {
				this.rulesInputRowsCount = 18
			}else {
				this.rulesInputRowsCount = 13
			}
		},
	},
	mounted() {
		if (this.routeUpdated) {
			editorVisible = false
			this.editorVisible = editorVisible
		} else {
			this.editorVisible = editorVisible
		}
		this.loadMappingRulesTable()
	},
	methods: {
		createFetcher(service){
			return service.then(res => res.data)
				.catch(e => this.$error.showErrorMessage(e))
				.then(res => {
					if(res.errcode !== 0) {
						return Promise.reject(res.msg)
					}else {
						return Promise.resolve(res.data)
					}
				})
		},
		fetchMappingRules() {
			return this.createFetcher(this.$services.TestNodesService.get(this.nodeId))
		},
		loadMappingRulesTable() {
			return this.fetchMappingRules()
				.then(data => {
					this.refreshMappingRules(data)
				})
		},
		resolveTestRules(testRules) {
			const rulesTableData = []
			const RULE_ICONS = [ "set_tags", "alter", "add", "show", "hide", "replace" ]

			const operationsTexts = this.$i18n.t('node.operationsTexts')
			for(let i = 0; i < testRules.length; i++) {
				const { matchErrors, ruleInfo, text, id } = testRules[i]
				const { operation, online, presentableName } = ruleInfo
				const tmpRow = {
					text, id, ruleInfo, matchErrors,
					iconArr: [], online,
				}
				var content
				switch(operation) {
					case 'add': {
						const { tags, replaces } = ruleInfo
						tmpRow.iconArr.push(RULE_ICONS[2])
						if(replaces.length > 0) {
							tmpRow.iconArr.push(RULE_ICONS[5])
						}
						if(tags != null && tags.length > 0) {
							tmpRow.iconArr.push(RULE_ICONS[0])
						}
						if (online === true) {
							tmpRow.iconArr.push(RULE_ICONS[3])
						}else if (online === false){
							tmpRow.iconArr.push(RULE_ICONS[4])
						}
						break
					}
					case 'alter': {
						const { presentableName, replaces, tags, online } = ruleInfo
						tmpRow.iconArr.push(RULE_ICONS[1])
						if(replaces.length > 0) {
							tmpRow.iconArr.push(RULE_ICONS[5])
						}

						if (online === true) {
							tmpRow.iconArr.push(RULE_ICONS[3])
						}else if (online === false){
							tmpRow.iconArr.push(RULE_ICONS[4])
						}
						break
					}
					case 'activate_theme': {
						break
					}
					default: {}
				}

				rulesTableData.push(tmpRow)
			}
			this.lastRulesText = this.rulesText
			this.rulesTableData = rulesTableData
		},
		// 刷新 映射规则列表
		refreshMappingRules(data) {
			if(data != null) {
				const { testRules, ruleText, themeId } = data
				this.testRulesData = testRules
				this.rulesText = ruleText
				this.themeId = themeId
				this.resolveTestRules(testRules)
			}
			this.$refs.mrTable.clearSelection()
		},
		// 更新映射规则
		updateMappingRules(rulesText, successMsg) {
			try {
				rulesText = rulesText === '' ? rulesText : Buffer.from(rulesText).toString('base64')
				return this.createFetcher(this.$services.TestNodesService.post({
					nodeId: this.nodeId,
					testRuleText: rulesText
				}))
				.then((data) => {
					if (successMsg && successMsg !== '') {
						this.$message({ type: 'success', message: successMsg })
					}
					return data
				})
			} catch(e) {
				this.$message.error(e)
			}
		},
		rulesSelectionHandler(selection) {
			this.selectedRules = selection
		},
		tapEditBtn() {
			this.editorVisible = true
			editorVisible = this.editorVisible
			// this.resolveMatchErrors(this.testRulesData)
		},
		// 导出规则
		tapExportBtn() {
			var confirmText = ''
			const $i18n = this.$i18n
			const confirmTexts = $i18n.t('node.confirmTexts')
			if(this.selectedRules.length > 0) {
				confirmText = confirmTexts[0]
				const [ url, name ] = this.getRulesDownloadUrl(this.selectedRules)
				this.rulesTextDownloadUrl = url
				this.rulesTextDownloadName = name
			}else {
				confirmText = confirmTexts[1]
				const [ url, name ] = this.getRulesDownloadUrl(this.rulesTableData)
				this.rulesTextDownloadUrl = url
				this.rulesTextDownloadName = name
			}

			this.$confirm(confirmText, confirmTexts[4], {
				confirmButtonText: $i18n.t('node.sureBtnText'),
				cancelButtonText: $i18n.t('node.cancalBtnText'),
				type: 'warning'
			})
				.then(() => {
					this.$refs['rulesDownload'].click()
				})
				.catch(() => {})
		},
		// 批量删除规则
		tapBatchDeleteBtn() {
			const $i18n = this.$i18n
			const confirmTexts = $i18n.t('node.confirmTexts')
			const text = this.selectedRules.map(r => r.content).join(', ')
			this.$confirm(`${confirmTexts[5]}${this.selectedRules.length}${confirmTexts[6]}, ${confirmTexts[3]}`, confirmTexts[4], {
					dangerouslyUseHTMLString: true,
          confirmButtonText: $i18n.t('node.sureBtnText'),
          cancelButtonText: $i18n.t('node.cancalBtnText'),
          type: 'warning'
        }).then(() => {
          this.deleteMappingRules(this.selectedRules)
        }).catch(() => {})
		},
		// 删除规则
		tapDeleteBtn(row) {
			const $i18n = this.$i18n
			const confirmTexts = $i18n.t('node.confirmTexts')
			this.$confirm(`${confirmTexts[2]} “${row.content}”，${confirmTexts[3]}`, confirmTexts[4], {
					dangerouslyUseHTMLString: true,
          confirmButtonText: $i18n.t('node.sureBtnText'),
          cancelButtonText: $i18n.t('node.cancalBtnText'),
          type: 'warning'
        }).then(() => {
          this.deleteMappingRules([row])
        }).catch(() => {})
		},
		deleteMappingRules(deletedRules) {
			const idsSet = new Set(deletedRules.map(r => r.id))
			var tmpArr = this.rulesTableData.filter(r => !idsSet.has(r.id))
			const rulesText = tmpArr.map(r => r.text).join('\n')

			this.updateMappingRules(rulesText, this.$i18n.t('node.messages[1]'))
				.then(data => {
					this.refreshMappingRules(data)
				})
		},
		// 上下线规则
		exchangeOnlineStatus(row, isOnline) {
			const $i18n = this.$i18n
			const confirmTexts = $i18n.t('node.confirmTexts')
			var operationText = isOnline ? confirmTexts[7] : confirmTexts[8]
			this.$confirm(`${operationText} “${row.content}”, ${confirmTexts[3]}`, confirmTexts[4], {
				dangerouslyUseHTMLString: true,
				confirmButtonText: $i18n.t('node.sureBtnText'),
				cancelButtonText: $i18n.t('node.cancalBtnText'),
				type: 'warning'
			}).then(() => {
				const rulesText = this.rulesTableData.map(r => {
					if(r.id === row.id) {
						r.ruleInfo.online = isOnline
						return decompile([r.ruleInfo])
					}else {
						return r.text
					}
				}).join('\n')
				return this.updateMappingRules(rulesText, `${operationText}${confirmTexts[9]}！`)
					.then(data => {
						this.refreshMappingRules(data)
					})
			})
			.catch(e => console.warn(e))
		},
		// 解析：规则文件下载地址
		getRulesDownloadUrl(rules) {
			const rulesText = rules.map(r => r.text).join('\n')
			const fileName = `测试节点.映射规则.${this.nodeId}.txt`
			const file = new File([rulesText], fileName, { type: 'text/plain' })
			const url = window.URL.createObjectURL(file)
			return [ url, fileName ]
		},
		// 退出编辑
		tapBackBtn() {
			this.editorVisible = false
			this.rulesText = this.lastRulesText
			this.syntaxErrorsText = ''
			this.matchErrorsText = ''
		},
		// 校验规则 并 保存
		tapSaveBtn() {

			try {
				var result = compile(this.rulesText)
				console.log(result)
			}catch(e) {
				console.error(e)
			}

			if(result == null) {
				this.syntaxErrorsText = `<li class="mr-syntax-error">${this.$i18n.t('node.errors[0]')}</li>`
				this.matchErrorsText = ''
				return
			}

			if(result.errors != null) {
				this.syntaxErrorsText = result.errorObjects.map(error => {
					const { lineText = '', line = -1, col = -1, msg = '' } = error
					return '<li class="mr-syntax-error">' +
					 	(line === -1 || col === -1 ? '' : `<p>${this.$i18n.t('node.errors[4]')}: line ${line}, col ${col} ${lineText}</p>`) +
						`<p>${this.$i18n.t('node.errors[5]')}: ${msg}</p>` +
					'</li>'
				}).join('')
				this.matchErrorsText = ''
				return
			}else {
				this.syntaxErrorsText = ''
			}

			this.updateMappingRules(this.rulesText)
				.then(data => {
					const { testRules } = data
					this.resolveMatchErrors(testRules)
					this.resolveMatchResults(testRules)
					if (this.matchErrorsText === '') {
						this.$message.success(this.$i18n.t('node.messages[0]'))
					}
					this.refreshMappingRules(data)
				})
		},
		resolveMatchErrors(testRules) {
			var matchErrorsText = ''
			var matchErrors = []
			testRules.forEach(item => {
				if(item.matchErrors.length > 0) {
					matchErrors = [...matchErrors, {
						text: item.text,
						error: item.matchErrors.join(', ')
					}]
				}
			})
			if(matchErrors.length > 0) {
				matchErrorsText = matchErrors.map(item => {
					return `<li class="mr-match-error">
										<p>${this.$i18n.t('node.errors[4]')}: ${item.text}</p>
										<p>${this.$i18n.t('node.errors[5]')}: ${item.error}</p>
									</li>`
				}).join('')
			}
			this.matchErrorsText = matchErrorsText
		},
		resolveMatchResults(testRules) {
			var matchResultsText = ''
			const symbolString = this.$i18n.locale === 'zh-CN' ? '，' : ', '
			const operationsTexts = this.$i18n.t('node.operationsTexts')
			const matchResultsTexts = this.$i18n.t('node.matchResultsTexts')
			for (let tRule of testRules) {
				const { ruleInfo: { replaces } } = tRule
				if (replaces && replaces.length > 0) {
					matchResultsText += replaces.map(item => {
						const { replaced, replacer, scopes = [], efficientCount = 0 } = item
						let scopeText = '', replacerName = '', replacedName = ''
						if (scopes.length > 0) {
							scopeText = `${symbolString}<span>${operationsTexts[9]}</span> ` + scopes.flat(Infinity).map(scope => `<strong>${scope.name}</strong>`).join('-')
						}
						replacerName = replacer.name + (replacer.versionRange === '*' ? '' : `@${replacer.versionRange}`)
						replacedName = replaced.name + (replaced.versionRange === '*' ? '' : `@${replaced.versionRange}`)
						return `<li class="mr-match-result">
										<p>${matchResultsTexts[1]}: ${replacerName} ${operationsTexts[6]} ${replacedName}${scopeText}</p>
										<p>${matchResultsTexts[2]}: ${efficientCount}</p>
									</li>`
					}).join('')
				}
			}
			this.matchResultsText = matchResultsText
		},
		handleSelectType(command) {
			this.selectedRuleType = command
		},
		rulesImportHandler(file) {
			const self = this
			const reader = new FileReader()
			reader.readAsText(file.raw)
			reader.onload = function(evt) {
				const exportText = evt.target.result
				const result = compile(exportText)
				if(result.errors != null) {
					self.$message.error({
						dangerouslyUseHTMLString: true,
						duration: 5000,
						message: self.$i18n.t('node.errors[1]') + "<br/>" + result.errors.join('<br/>')
					})
				}else {
					self.rulesText = self.rulesText + '\n' + exportText
					self.editorVisible = true
				}
			}
			reader.onerror = function(evt) {
				console.log('evt --', evt)
			}
		},
		onCodeChange(val) {
			this.rulesText = val
		}
	},
};
</script>

<style lang="less" type="text/less" scoped>
.mapping-rule-wrapper {
	position: relative;
	padding-top: 40px;
	.mapping-rule__header {
		margin-bottom: 36px; font-size: 14px;
		.mr-import { display: inline-block; }
		.el-button--text {
			margin-right: 20px; color: #333;
			a { font-weight: 400; color: #333; }
			&.mr-edit-btn { float: right; }
			&.mr-btn--delete { color: #EE4040; }
			i {
				margin-right: 3px; font-weight: 600;
			}
		}
	}
	.mapping-rule__body {
		.mr-rule-content {
			.t-rule-tag-mock, .t-rule-tag-release {
				margin-right: 2px; padding: 2px 8px;
				font-size: 12px; color: #fff;
			}
			.t-rule-tag-release { background-color: #72BB1F; }
			.t-rule-tag-mock { background-color: #F5A623; }
		}
		.mr-icons {
			&.disabled { color: #999; opacity: .7; }
		}
		.mr-rule-result { color: #9b9b9b; }
		.mr-operations-select {
			display: block; padding: 0;
			line-height: 24px; font-weight: 400; color: #333;
		}

		i {
			margin-right: 6px; font-size: 14px; font-weight: 600;
			&.el-icon-price-tag {
				transform: rotate(-90deg);
			}
		}
		.mrb-btn--offline, .mrb-btn--online { font-weight: 400; color: #000; margin-right: 10px; }
		.mrb-btn--delete { color: #EE4040; }
	}
	.mapping-rule-editor-box {
		position: absolute; top: 0; left: -15px; z-index: 5;
		width: 100%; height: 100%; padding: 40px 15px;
		background-color: #fff; opacity: 0; pointer-events: none;

		h4 { margin-bottom: 25px; font-size: 14px; }
		// transition: all .36s ease-out;
		// -webkit-transform: translateX(100%); transform: translateX(100%);

		&.visible {
			opacity: 1; pointer-events: inherit;
			// -webkit-transform: translateX(0); transform: translateX(0);
		}
		.syntax-error__title, .match-error__title, .match-result__title {
			margin-bottom: 15px;
			line-height:20px; font-size: 14px; font-weight: 600;
		}
		.syntax-error__title { color: #EE4040; }
		.match-error__title { color: #409EFF}
		.match-result__title { color: #000; }

		.mapping-rule-input-box {
			position: relative;
		}
		.mr-rb-btns-box {
			position: absolute; bottom: 20px; right: 30px; z-index: 100;
			text-align: right;
		}
		.mr-rb-cancel-btn { margin-right: 10px; color: #999; }
		.mr-rb-save-btn { }
		.mr-back-btn {
			position: relative; top: -10px;
			float: right; color: #909399;
			&:hover { color: #C0C4CC; }
		}

	}
}
</style>

<style lang="less" type="text/less">

.mapping-rule-wrapper {
	.mapping-rule__body {
		margin-bottom: 30px;
		.cell {
			font-size: 14px; font-weight: 400; color: #000;
		}
		.mr-rule-content {

		}
	}
	.mapping-rule-editor-box {
		.CodeMirror {
			height: 480px; padding-bottom: 45px; border-radius: 4px;
			pre { line-height: 1.8; }
			.CodeMirror-scroll { overflow: auto !important; margin-right: 0; padding-bottom: 45px; }
		}
		.el-textarea__inner {
			padding: 20px; line-height: 2;
		}
	}
}
.mr-operation-item {
	&.active { color:#409EFF; }

	&.mr-operation-set {
		i.el-icon-price-tag { transform: rotate(-90deg); }
	}
}
.mapping-rule-input-box {
	textarea { padding-bottom: 45px; }
}
.mapping-rule-errors-box {
	margin-top: 20px; margin-bottom: 30px;
	.mr-syntax-error, .mr-match-error, .mr-match-result {
		margin-left: 15px; list-style-type: disc;
		line-height: 2; color: #666;
	}
}
.mapping-rule-match-result {
	.mr-match-result {
		margin-left: 15px; list-style-type: disc;
		line-height: 2; color: #666;
	}
}
</style>
