<!--<i18n src="../test-manager/MappingRules/mappingRules.i18n.json"></i18n>-->
<template >
  <div>
    <div
      class="node-mapping-rule-text"
      :class="{ 'disabled': matchErrors.length }"
      v-html="content"></div>
    <el-tooltip placement="top">
      <div class="node-mapping-rt-tip" slot="content" v-html="matchErrorsText"></div>
      <i class="el-icon-warning" v-if="matchErrors.length"/>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'rule-text',
  props: {
    textRule: Object,
  },
  data() {
    return {
      content: '',
      tagsMap: {
        'mock': `<span class="t-rule-tag-mock">mock</span>`,
        'release': `<span class="t-rule-tag-release">${this.$i18n.t('node.release')}</span>`,
        'presentable': `<span class="t-rule-tag-presentable">${this.$i18n.t('node.presentable')}</span>`
      }
    }
  },
  computed: {
    matchErrors() {
      return this.textRule != null ? this.textRule.matchErrors : []
    },
    matchErrorsText() {
      return this.matchErrors.filter(err => err !== '')
        .map((err, index) => `${index+1}. ${err}`)
        .join('<br/>')
    },
    ruleInfo() {
      return this.textRule.ruleInfo
    }
  },
  watch: {
    textRule() {
      this.resolveTextRule()
    }
  },
  mounted() {
    this.resolveTextRule()
  },
  methods: {
    resolveTextRule() {
      const { operation, replaces } = this.ruleInfo
      const contentsArr = []
      var content = ''
      switch(operation) {
        case 'add': {
          contentsArr.push(this.resolveAddRule())
          if(replaces && replaces.length > 0) {
            contentsArr.push(this.resolveReplaceRule())
          }
          contentsArr.push(this.resolveSetTagRule())
          break
        }
        case 'alter': {
          contentsArr.push(this.resolveAlterRule())
          contentsArr.push(this.resolveReplaceRule())
          contentsArr.push(this.resolveSetTagRule())
          break
        }
        case 'activate_theme': {
          contentsArr.push(this.resolveActivateTheme())
          break
        }
        default: {}
      }
      contentsArr.push(this.resolveOnlineRule())
      const symbolString = this.$i18n.locale === 'zh-CN' ? '；' : '; '
      this.content = contentsArr.filter(cont => cont !== '').join(symbolString)
    },
    resolveAddRule() {
      const { presentableName, candidate: { name, type } } = this.ruleInfo
      const operationsTexts = this.$i18n.t('node.operationsTexts')
      const versionText = this.resolveSetVersionRule()
      return `${operationsTexts[0]}${this.tagsMap['presentable']}<strong>${presentableName}</strong>${operationsTexts[1]}${this.tagsMap[type]}<strong>${name}</strong>${versionText}`
    },
    resolveSetVersionRule() {
      const { candidate: { versionRange = '' } } = this.ruleInfo
			const operationsTexts = this.$i18n.t('node.operationsTexts')
      if(versionRange !== '' && versionRange !== 'latest') {
        return `${operationsTexts[2]} ${versionRange}`
      } else {
        return ''
      }
    },
    resolveAlterRule() {
			const operationsTexts = this.$i18n.t('node.operationsTexts')
      const { presentableName } = this.ruleInfo
      return `${operationsTexts[8]}${this.tagsMap['presentable']}<strong>${presentableName}</strong>`
    },
    resolveReplaceRule() {
      const { replaces } = this.ruleInfo
      if(replaces.length > 0) {
			  const operationsTexts = this.$i18n.t('node.operationsTexts')
        const symbolString = this.$i18n.locale === 'zh-CN' ? '，' : ', '
        return replaces.map(item => {
          const { name: n1, type: t1, versionRange: v1 } = item['replacer']
          const { name: n2, type: t2, versionRange: v2 } = item['replaced']
          const v1Text = v1 == null || v1 === '*' ? '' : `@${v1}`
          const v2Text = v2 == null || v2 === '*' ? '' : `@${v2}`
          var replaceText = `<strong>${this.tagsMap[t1]}${n1}${v1Text}</strong> ${operationsTexts[6]} <strong>${this.tagsMap[t2]}${n2}${v2Text}</strong>`
          if (item['scopes'].length > 0) {
            replaceText += `${symbolString}<span>${operationsTexts[9]}</span> ` + item['scopes'].flat(Infinity).map(item => {
              const { name, type } = item
              return `${this.tagsMap[type]}<strong>${name}</strong>`
            }).join('-')
          }
          return replaceText
        }).join(symbolString)
      } else {
        return ''
      }
    },
    resolveSetTagRule() {
      const { tags } = this.ruleInfo
      if(tags != null && tags.length > 0) {
        const operationsTexts = this.$i18n.t('node.operationsTexts')
        const symbolString = this.$i18n.locale === 'zh-CN' ? '，' : ', '
        return `${operationsTexts[3]}` + tags.map(tag => `<strong>${tag}</strong>`).join(symbolString)
      }else {
        return ''
      }
    },
    resolveOnlineRule() {
      const { online, presentableName } = this.ruleInfo
      const operationsTexts = this.$i18n.t('node.operationsTexts')
      if (online === true) {
        return operationsTexts[4]
      } else if (online === false){
        return operationsTexts[5]
      } else {
        return ''
      }
    },
    resolveActivateTheme() {
      const { themeName } = this.ruleInfo
      const operationsTexts = this.$i18n.t('node.operationsTexts')
      return `${operationsTexts[7]}${this.tagsMap['presentable']}<strong>${themeName}</strong>`
    }
  },
}
</script>

<style lang="less" scoped>
  .node-mapping-rule-text {
    word-break: break-word; line-height: 1.8;
    &.disabled {
      opacity: 0.7; color: #999;
    }
  }
  .el-icon-warning { font-size: 14px; cursor: pointer; color: #F5A623; }
</style>
<style lang="less" type="text/less">
  .node-mapping-rule-text {
    .t-rule-tag-mock, .t-rule-tag-release, .t-rule-tag-presentable {
      margin: 0 5px 0 8px; padding: 2px 8px; border-radius: 2px;
      font-size: 12px; color: #fff; word-break: keep-all;
    }
    .t-rule-tag-presentable { background-color: #AEC1D4; }
    .t-rule-tag-release { background-color: #72BB1F; }
    .t-rule-tag-mock { background-color: #F5A623; }
  }
  .node-mapping-rt-tip { line-height: 1.5; }
</style>
