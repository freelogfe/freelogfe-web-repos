<i18n src="../test-manager/MappingRules/mappingRules.i18n.json"></i18n>
<template >
  <div>
    <span 
      class="node-mapping-rule-text" 
      :class="{ 'disabled': matchErrors.length }"
      v-html="content"></span>
    <el-tooltip placement="top">
      <div class="node-mapping-rt-tip" slot="content" v-html="matchErrorsText"></div>
      <i class="el-icon-warning" v-if="matchErrors.length"></i>
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
        'release': `<span class="t-rule-tag-release">${this.$i18n.t('release')}</span>`
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
      var content = ''
      switch(operation) {
        case 'add': {
          content += this.resolveAddRule()
          if(replaces && replaces.length > 0) {
            content += '，' + this.resolveReplaceRule()
          }
          content += this.resolveSetVersionRule()
          content += this.resolveSetTagRule()
          break
        }
        case 'alter': {
          content += this.resolveReplaceRule()
          content += this.resolveSetTagRule()
          break
        }
        case 'activate_theme': {
          content = this.resolveActivateTheme()
          break
        }
        default: {}
      } 

      content += this.resolveOnlineRule()
      this.content = content
    },
    resolveAddRule() {
      const { presentableName, candidate: { name, type } } = this.ruleInfo
			const operationsTexts = this.$i18n.t('operations')
      return `${operationsTexts[0]} ${this.tagsMap[type]}<strong>${name}</strong> ${operationsTexts[1]} <strong>${presentableName}</strong>`
    },
    resolveSetVersionRule() {
      const { candidate: { versionRange = '' } } = this.ruleInfo
			const operationsTexts = this.$i18n.t('operations')
      if(versionRange !== '' && versionRange !== 'latest') {
        return `${operationsTexts[2]} ${versionRange}`
      } else {
        return ''
      }
    },
    resolveReplaceRule() {
      const { replaces } = this.ruleInfo
      if(replaces.length > 0) {
			  const operationsTexts = this.$i18n.t('operations')
        return replaces.map(item => {
          const { name: n1, type: t1 } = item['replacer']
          const { name: n2, type: t2 } = item['replaced']
          return `<strong>${this.tagsMap[t1]}${n1}</strong> ${operationsTexts[6]} <strong>${this.tagsMap[t2]}${n2}</strong>`
        }).join('，')
      } else {
        return ''
      }
    },
    resolveSetTagRule() {
      const { tags } = this.ruleInfo
      if(tags != null && tags.length > 0) {
        const operationsTexts = this.$i18n.t('operations')
        return `${operationsTexts[3]}` + tags.map(tag => `<strong>${tag}</strong>`).join(' ')
      }else {
        return ''
      }
    },
    resolveOnlineRule() {
      const { online, presentableName } = this.ruleInfo
      const operationsTexts = this.$i18n.t('operations')
      if (online === true) {
        return `，${operationsTexts[4]} <strong>${presentableName}</strong>`
      } else if (online === false){
        return `，${operationsTexts[5]} <strong>${presentableName}</strong>`
      } else {
        return ''
      }
    },
    resolveActivateTheme() {
      const { themeName } = this.ruleInfo
      const operationsTexts = this.$i18n.t('operations')
      return `${operationsTexts[7]}<strong>${themeName}</strong>`
    }
  },
}
</script>

<style lang="less" scoped>
  .node-mapping-rule-text {
    &.disabled {
      opacity: 0.7; color: #999;
    }
  }
  .el-icon-warning { font-size: 14px; cursor: pointer; color: #F5A623; }
</style>
<style lang="less" type="text/less">
.node-mapping-rule-text {
  .t-rule-tag-release { background-color: #72BB1F; }
  .t-rule-tag-mock { background-color: #F5A623; }
}
  .node-mapping-rt-tip { line-height: 1.5; }
</style>