<template>
	<div class="mapping-rule-wrapper">
		<div class="mapping-rule__header">
			<div class="mr-btn-group">
				<el-button class="mr-edit-btn" type="text" @click="tapEditBtn" v-if="rulesText !== ''">
					<i class="el-icon-edit"></i>进入编辑模式
				</el-button>
				<el-upload class="mr-import" accept="text/plain" :show-file-list="false" :auto-upload="false"  :on-change="rulesImportHandler">
					<el-button type="text"><i class="el-icon-download"></i> 导入</el-button>
				</el-upload>
				<el-button type="text" @click="tapExportBtn">
					<i class="el-icon-upload2"></i>
					{{selectedRules.length > 0 ? "批量" : "全部" }}导出
				</el-button>
				<a v-show="false" ref="rulesDownload" :href="rulesTextDownloadUrl" :download="rulesTextDownloadName"></a>
				<template v-if="selectedRules.length > 0">
					<el-button type="text" @click="tapBatchDeleteBtn" class="mr-btn--delete"><i class="el-icon-delete"></i> 批量删除</el-button>
				</template>
			</div>
		</div>
		<div class="mapping-rule__body">
			<el-table ref="mrTable" :data="targetRulesTableData" style="width: 100%" @selection-change="rulesSelectionHandler">
				<el-table-column type="selection" width="45"></el-table-column>
				<el-table-column width="146">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="mr-operations-select" @command="handleSelectType">
              <span class="el-dropdown-link">
                操作类型: {{rulesMap[selectedRuleType].operationText}} <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
									v-for="item in rulesOperationConfig" 
									:class="['mr-operation-item', 'mr-operation-' + item.operation, { 'active': item.operation == selectedRuleType }]"
									:key="item.operation" 
									:command="item.operation"
								>{{item.desc}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div>
							<i :class="scope.row.icon"></i><span>{{rulesMap[scope.row.operation].operationText}}</span>
						</div>
          </template>
        </el-table-column>
				<el-table-column>
					<template slot="header">
						<span>映射规则内容</span> | <span>匹配结果</span>
					</template>
					<template slot-scope="scope">
						<span class="mr-rule-name">{{scope.row.content}}</span>
						<span class="mr-rule-result">（匹配结果：{{scope.row.matchCount}}）</span>
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
			<h4>
				编辑映射规则
				<el-button class="mr-back-btn" type="text" @click="tapBackBtn">
					<i class="el-icon-back"></i> 退出编辑模式
				</el-button>
			</h4>
			<div class="mapping-rule-input-box">
				<el-input type="textarea" :rows="rulesInputRowsCount" placeholder="请输入规则" v-model="rulesText"></el-input>
				<div class="mr-rb-btns-box">
					<el-button type="primary" class="mr-rb-save-btn" @click="tapSaveBtn" size="small" round>校验并保存</el-button>
				</div>
			</div>
			<div class="mapping-rule-errors-box">
				<template v-if="syntaxErrorsText !== ''">
					<h4>SyntaxErrors:</h4>	
					<ul v-html="syntaxErrorsText"></ul>
				</template>
				<template v-if="matchErrorsText !== ''">
					<h4>MatchErrors:</h4>	
					<ul v-html="matchErrorsText"></ul>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { compile } from '@freelog/nmr_translator'
export default {
	name: "MappingRules",
	data() {
		return {
			rulesTableData: [],
			testRulesData: [],
			editorVisible: false,
			lastRulesText: '',
			rulesText: '',
			syntaxErrorsText: '',
			matchErrorsText: '',
			rulesTextDownloadUrl: '',
			rulesTextDownloadName: '',
			selectedRules: [],
			selectedRuleType: 'all',
			rulesInputRowsCount: 18
		}
	},
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
		rulesMap() {
			const map = {}
			this.rulesOperationConfig.forEach(item => {
				const { operation, icon, desc } = item
				map[operation] = { operation, icon, operationText: desc }
			})
			return map
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
		this.loadMappingRulesTable()
	},
	methods: {
		createFetcher(service){
			return service.then(res => res.data)
				.then(res => {
					if(res.errcode !== 0) {
						return Promise.reject(res.msg)
					}else {
						return Promise.resolve(res.data)
					}
				})
				.catch(e => this.$error.showErrorMessage(e))
		},
		fetchMappingRules() {
			return this.createFetcher(this.$services.TestNodesService.get(this.nodeId))
		},
		loadMappingRulesTable() {
			return this.fetchMappingRules()
				.then(data => {
					if(data != null) {
						const { testRules } = data
						this.testRulesData = testRules
						this.resolveTestRules(testRules)
					}
				})
		},
		resolveTestRules(testRules) {
			const rulesTableData = [] 
			const rulesTextArr = []
			for(let i = 0; i < testRules.length; i++) {
				const { effectiveMatchCount, matchErrors, ruleInfo, text, id } = testRules[i]
				const { icon, operationText, operation } = this.rulesMap[ruleInfo.operation || 'set']
				const tmpRow = {
					text, id, operation,
					icon, matchCount: effectiveMatchCount
				}
				switch(operation) {
					case 'set': {
						const { presentation, tags } = ruleInfo
						tmpRow.content = `【${presentation}】${operationText}【${tags.join('，')}】`
						break
					}
					case 'online': {
						const { presentableName } = ruleInfo
						tmpRow.content = `${operationText}【${presentableName}】`
						break
					}
					case 'replace': {
						const { replaced, replacer } = ruleInfo
						tmpRow.content = `【${replacer.name}】${operationText}【${replaced.name}】`
						break
					}
					case 'add': {
						const { presentation, candidate: { name, type } } = ruleInfo
						if(type === 'mock') {
							tmpRow.content = `${operationText}【Mock资源 ${name}】到测试节点`
						}else {
							tmpRow.content = `${operationText}【${name}】到测试节点`
						}
						
						break
					}
					case 'offline': {
						const { presentableName } = ruleInfo
						tmpRow.content = `${operationText}【${presentableName}】`
						break
					}
					default: {}
				} 
				rulesTextArr.push(text)
				rulesTableData.push(tmpRow)
			}
			this.rulesText = rulesTextArr.join('\n')
			this.lastRulesText = this.rulesText
			this.rulesTableData = rulesTableData
		},
		// 刷新 映射规则列表
		refreshMappingRules() {
			this.loadMappingRulesTable()
				.then(() => {
					this.$refs.mrTable.clearSelection()
				})
		},
		// 更新映射规则
		updateMappingRules(rulesText) {
			try {
				rulesText = rulesText === '' ? rulesText : Buffer.from(rulesText).toString('base64')
				return this.createFetcher(this.$services.TestNodesService.post({
					nodeId: this.nodeId,
					testRuleText: rulesText
				}))
				.catch(e => this.$message.error(e))
			} catch(e) {
				this.$message.error(e)
			}
		},
		rulesSelectionHandler(selection) {
			this.selectedRules = selection
		},
		tapEditBtn() {
			this.editorVisible = true
		},
		tapExportBtn() {
			var confirmText = ''
			if(this.selectedRules.length > 0) {
				confirmText = `是否导出所选的规则?`
				const [ url, name ] = this.getRulesDownloadUrl(this.selectedRules)
				this.rulesTextDownloadUrl = url
				this.rulesTextDownloadName = name
			}else {
				confirmText = `是否导出全部的规则?`
				const [ url, name ] = this.getRulesDownloadUrl(this.rulesTableData)
				this.rulesTextDownloadUrl = url
				this.rulesTextDownloadName = name
			}

			this.$confirm(confirmText, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
				.then(() => {
					this.$refs['rulesDownload'].click()
				})
				.catch(() => {})
		},
		// 批量删除规则
		tapBatchDeleteBtn() {
			const text = this.selectedRules.map(r => r.content).join(', ')
			this.$confirm(`此操作将删除规则“${text}”, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMappingRules(this.selectedRules)
        }).catch(() => {})
		},
		// 删除规则
		tapDeleteBtn(row) {
			this.$confirm(`此操作将删除规则“${row.content}”, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMappingRules([row])
        }).catch(() => {})
		},
		deleteMappingRules(deletedRules) {
			const idsSet = new Set(deletedRules.map(r => r.id))
			var tmpArr = this.rulesTableData.filter(r => !idsSet.has(r.id))
			const rulesText = tmpArr.map(r => r.text).join('\n')
			
			this.updateMappingRules(rulesText)
				.then(() => {
					this.$message({ type: 'success', message: '映射规则删除成功!' })
					this.refreshMappingRules()
				})
		},
		// 停用规则
		tapDisabledBtn(row) {
			this.$confirm(`此操作将停用规则“${row.content}”, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					const rulesText = this.rulesTableData.map(r => {
						if(r.id === row.id) {
							return '!' + r.text
						}else {
							return r.text
						}
					}).join('\n')
					console.log('rulesText --', rulesText)
					return this.updateMappingRules(rulesText)
        })
				.then(() => {
					this.$message({ type: 'success', message: '映射规则停用成功!' })
					this.refreshMappingRules()
				})
				.catch((e) => {
					console.warn(e)
				})
		},
		// 解析：规则文件下载地址
		getRulesDownloadUrl(rules) {
			const rulesText = rules.map(r => r.text).join('\n')
			const fileName = `测试节点.映射规则.${this.nodeId}.txt`
			const file = new File([rulesText], fileName, { type: 'text/plain' })
			const url = window.URL.createObjectURL(file)
			return [ url, fileName ]
		},
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
			}catch(e) {
				console.error(e)
			}
			
			if(result == null) {
				this.syntaxErrorsText = '<li class="mr-syntax-error">映射规则编译失败：存在语法错误！</li>'
				return 
			} 

			if(result.errors != null) {
				this.syntaxErrorsText = result.errors.map(error => {
					return `<li class="mr-syntax-error">${error}</li>`
				}).join('')
				return 
			}else {
				this.syntaxErrorsText = ''
			}

			this.updateMappingRules(this.rulesText)
				.then(data => {
					const { testRules, text } = data
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
						this.matchErrorsText = matchErrors.map(item => {
							return `<li class="mr-match-error">
												<p>line: ${item.text}</p>
												<p>error: ${item.error}</p>	
											</li>`
						}).join('')
					}else {
						this.$message.success('映射规则保存成功！')
						this.refreshMappingRules()
					}
				})
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
						message: "映射规则内容存在语法错误：<br/>" + result.errors.join('<br/>')
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
	},
};
</script>

<style lang="less" type="text/less" scoped>
.mapping-rule-wrapper {
	position: relative;
	padding-top: 40px; 
	.mapping-rule__header {
		margin-bottom: 60px; font-size: 14px; 
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
		.mr-rule-name {  }
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
		.mrb-btn--disabled { font-weight: 400; color: #000; margin-right: 10px; }
		.mrb-btn--delete { color: #EE4040; }
	}
	.mapping-rule-editor-box {
		position: absolute; top: 0; left: -15px; z-index: 5;
		width: 100%; height: 100%; padding: 40px 15px;
		background-color: #fff;

		// transition: all .36s ease-out;
		-webkit-transform: translateX(100%); transform: translateX(100%); opacity: 0;

		&.visible {
			opacity: 1;
			-webkit-transform: translateX(0); transform: translateX(0);
		}

		h4 {
		 	line-height: 40px; font-size: 14px; color: #666;
		}
		.mapping-rule-input-box { 
			position: relative; 
		}
		.mr-rb-btns-box {
			position: absolute; bottom: 10px; right: 10px;
			text-align: right; 
		}
		.mr-rb-cancel-btn { margin-right: 10px; color: #999; }
		.mr-rb-save-btn { }
		.mr-back-btn { 
			float: right; color: #909399; 
			&:hover { color: #C0C4CC; }
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
	.mr-syntax-error, .mr-match-error {
		margin-left: 15px; list-style-type: disc;
		line-height: 2; color: #F56C6C;
	}
}
</style>
